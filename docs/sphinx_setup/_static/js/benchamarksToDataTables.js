$(document).ready(function () {
  $('.ov-toolkit-benchmark-table').on('click', () => showModal("graph-data-ov.json"));
  $('.ovms-toolkit-benchmark-table').on('click', () => showModal("graph-data-ovms.json"));

  function hideModal() {
    $('#graphModal').fadeOut(200, function () {
      $(this).remove();
      $('body').css('overflow', 'auto');
    });
  }

  function showModal(fileName) {
    $('body').css('overflow', 'hidden');

    fetch('../_static/benchmarks_files/data/' + fileName)
      .then(response => response.json())
      .then(jsonData => {
        fetch('../_static/benchmarks_files/graph-config.json')
          .then(configResponse => configResponse.json())
          .then(appConfig => {
            renderModal(jsonData);
          });
      });
  }

  function renderModal(graph) {
    var modalPath = '../_static/html/modaltable.html';

    fetch(modalPath)
      .then(response => response.text())
      .then(html => {
        var modal = $('<div>').attr('id', 'graphModal').addClass('modal');
        var modalContent = $(html).attr('id', 'graphModalContent').addClass('modal-content');

        modal.append(modalContent);
        $('body').prepend(modal);

        populateModalData(graph);

        $('.modal-close').on('click', hideModal);
        modal.on('click', function (e) {
          if ($(e.target).is('#graphModal')) hideModal();
        });

        $(document).on('keydown', function (e) {
          if (e.key === "Escape") hideModal();
        });

        modal.fadeIn(200);
      });
  }

  function normalizeData(rawData, metricType) {
    let allPrecisionKeys = new Set();

    let normalizedData = rawData.map(item => {
      let metricData = item.Parameters[metricType]?.Precisions[0] || {};

      Object.keys(metricData).forEach(key => allPrecisionKeys.add(key));

      return {
        Platform: item.Platform,
        Model: item.Model,
        PlatformType: item.PlatformType || "-",
        metrics: metricData
      };
    });

    return { normalizedData, allPrecisionKeys: Array.from(allPrecisionKeys) };
  }

  function populateModalData(graph) {
    let metricType = 'throughput';

    $('.chart-placeholder').html('<table id="benchmarkTable" class="display"></table>');

    function renderTable() {
      let { normalizedData, allPrecisionKeys } = normalizeData(graph, metricType);
      columnDefs = [{ "visible": false, "targets": [2] }]
      let tableHTML = `
        <thead>
          <tr>
            <th style="width: 400px">Platform</th>
            <th style="width: 200px">Model</th>
            <th style="width: 200px">Platform Type</th>
            ${allPrecisionKeys.map(key => `<th>${key}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${normalizedData.map(row => `
            <tr>
              <td>${row.Platform}</td>
              <td>${row.Model}</td>
              <td>${row.PlatformType}</td>
              ${allPrecisionKeys.map(key => `<td>${row.metrics[key] || '-'}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      `;

      if ($.fn.DataTable.isDataTable('#benchmarkTable')) {
        $('#benchmarkTable').DataTable().destroy();
        $('#benchmarkTable').empty();
      }

      $('#benchmarkTable').html(tableHTML);

      $('#benchmarkTable').DataTable({
        responsive: true,
        "autoWidth": false,
        language: {
          buttons: {
            colvisRestore: "Restore default view"
          }
        },
        lengthMenu: [
          [10],
          ['10 rows']
        ],
        "columnDefs": columnDefs,
        layout: {
          topStart: {
            buttons: [
              {
                extend: 'collection',
                text: `Parameter: ${metricType}`,
                autoClose: true,
                buttons: [
                  {
                    text: 'Throughput',
                    action: function () {
                      metricType = 'throughput';
                      renderTable();
                    }
                  },
                  {
                    text: 'Latency',
                    action: function () {
                      metricType = 'latency';
                      renderTable();
                    }
                  }
                ]
              },
              {
                extend: 'colvis',
                postfixButtons: ['colvisRestore'],
              },
              'pageLength',
              {
                extend: 'print',
                text: 'Print PDF',
                exportOptions: {
                  columns: ':visible'
                }
              }
            ]
          }
        }
      });
    }
    renderTable();
  }
});

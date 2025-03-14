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
      .then((response) => response.json())
      .then((jsonData) => {
        fetch('../_static/benchmarks_files/graph-config.json')
          .then((configResponse) => configResponse.json())
          .then((appConfig) => {
            renderModal(jsonData, appConfig);
          });
      });
  }

  function renderModal(graph, appConfig) {
    var modalPath = '../_static/html/modaltable.html';

    fetch(modalPath)
      .then((response) => response.text())
      .then((html) => {
        var modal = $('<div>').attr('id', 'graphModal').addClass('modal');
        var modalContent = $(html).attr('id', 'graphModalContent').addClass('modal-content');

        modal.append(modalContent);
        $('body').prepend(modal);

        populateModalData(graph, appConfig);

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

  function normalizeData(rawData) {
    let allPrecisionKeys = new Set();

    let normalizedData = rawData.map(item => {
      let throughputData = item.Parameters.throughput?.Precisions[0] || {};
      let latencyData = item.Parameters.latency?.Precisions[0] || {};

      Object.keys(throughputData).forEach(key => allPrecisionKeys.add(key));
      Object.keys(latencyData).forEach(key => allPrecisionKeys.add(key));

      return {
        Platform: item.Platform,
        Model: item.Model,
        PlatformType: item.PlatformType, 
        throughput: throughputData,
        latency: latencyData
      };
    });

    return { normalizedData, allPrecisionKeys: Array.from(allPrecisionKeys) };
  }

  function populateModalData(graph, appConfig) {
    let { normalizedData, allPrecisionKeys } = normalizeData(graph);

    let tableHTML = `
        <table id="benchmarkTable" class="display">
            <thead>
                <tr>
                    <th style="width: 400px">Platform</th>
                    <th style="width: 200px">Model</th>
                    <th style="width: 200px">Platform Type</th>
                    ${allPrecisionKeys.map(key => `<th>${key}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    `;

    $('.chart-placeholder').html(tableHTML);
    let tableBody = $('#benchmarkTable tbody');
    normalizedData.forEach(row => {
      let tableRow = `
            <tr>
                <td>${row.Platform}</td>
                <td>${row.Model}</td>
                <td>${row.PlatformType}</td>
                ${allPrecisionKeys.map(key => `<td>${row.throughput[key] || row.latency[key] || '-'}</td>`).join('')}
            </tr>
        `;
      tableBody.append(tableRow);
    });

    var hidden = [2];
    columnDefs = [{ "visible": false, "targets": JSON.parse(hidden) }];

    $('#benchmarkTable').DataTable({
      responsive: true,
      "autoWidth": false,
      language: {
        buttons: {
          colvisRestore: "Restore default selection"
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
            'pageLength',
            {
              extend: 'colvis',
              postfixButtons: ['colvisRestore'],
            },
            {
              extend: 'print',
              text: 'Print pdf',
              exportOptions: {
                columns: ':visible'
              }
            }
          ]
        }
      }
    });
  }
});

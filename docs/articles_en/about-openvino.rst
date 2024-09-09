About OpenVINO h1
==============

About OpenVINO h2
###################

About OpenVINO h3
++++++++++++++++++++++++++

About OpenVINO h4
---------------------------

About OpenVINO h5
@@@@@@@@@@@@@@@@@@@@@@@@@@@


OpenVINO is a toolkit for simple and efficient deployment of various deep learning models.
In this section you will find information on the product itself, as well as the software
and hardware solutions it supports.

| OpenVINO is a toolkit for simple and efficient deployment of various deep learning models.
|      In this section you will find infaormation on 
       the product itself, as well as the software
| and hardware solutions it supports.


* OpenVINO is a toolkit for simple and efficient deployment of various deep learning models.
* In this section you will find information on the product itself, as well as the software

  * OpenVINO is a toolkit for simple and efficient deployment of various deep learning models.
  * In this section you will find information on the product itself, as well as the software

* and hardware solutions it supports.
* and hardware solutions it supports.

1. OpenVINO is a toolkit for simple and efficient deployment of various deep learning models.
2. In this section you will find information on the product itself, as well as the software

   * OpenVINO is a toolkit for simple and efficient deployment of various deep learning models.
   * In this section you will find information on the product itself, as well as the software
  
3. and hardware solutions it supports.

   3. nested and hardware solutions it supports.

      .. code-block:: python

         python3 -c "import openvino; print(openvino.__version__)"

      .. code-block:: cpp

         <?xml version="1.0" ?>
         <net name="model_file_name" version="10">
            <layers>

      .. code-block:: sh

         pip install openvino-dev

      .. code-block:: text

         <UNZIPPED_ARCHIVE_ROOT>/runtime/version.txt      

      .. code-block:: xml
        :force:

        <layer id="286" name="input" precision="FP32" type="Input">
            <output>
                <port id="0">
                    <dim>1</dim>
                    <dim>3</dim>

      .. code-block:: xml

        <layer id="286" name="input" precision="FP32" type="Input">
            <output>
                <port id="0">
                    <dim>1</dim>
                    <dim>3</dim>

   4. nested and hardware solutions it supports.

4. and hardware solutions it supports.


| **Neural Network Compression Framework**
| :bdg-link-dark:`Github <https://github.com/openvinotoolkit/nncf>`
  :bdg-link-success:`User Guide <https://docs.openvino.ai/2024/openvino-workflow/model-optimization.html>`
 
A suite of advanced algorithms for Neural Network inference optimization with minimal accuracy
drop. NNCF applies quantization, filter pruning, binarization, and sparsity algorithms to PyTorch
and TensorFlow models during training.
|hr|


.. |hr| raw:: html
 
   <hr style="margin-top:-12px!important;border-top:1px solid #383838;">







.. scrollbox::

   .. code-block:: cpp

      <?xml version="1.0" ?>
      <net name="model_file_name" version="10">
         <layers>
            <layer id="0" name="input" type="Parameter" version="opset1">
                  <data element_type="f32" shape="1,3,32,100"/> <!-- attributes of operation -->
                  <output>
                     <!-- description of output ports with type of element and tensor dimensions -->
                     <port id="0" precision="FP32">
                        <dim>1</dim>
                        <dim>3</dim>
                        <dim>32</dim>
                        <dim>100</dim>
                     </port>
                  </output>
            </layer>
            <layer id="1" name="conv1/weights" type="Const" version="opset1">
                  <!-- Const is only operation from opset1 that refers to the IR binary file by specifying offset and size in bytes relative to the beginning of the file. -->
                  <data element_type="f32" offset="0" shape="64,3,3,3" size="6912"/>
                  <output>
                     <port id="1" precision="FP32">
                        <dim>64</dim>
                        <dim>3</dim>
                        <dim>3</dim>
                        <dim>3</dim>
                     </port>
                  </output>
            </layer>
            <layer id="2" name="conv1" type="Convolution" version="opset1">
                  <data auto_pad="same_upper" dilations="1,1" output_padding="0,0" pads_begin="1,1" pads_end="1,1" strides="1,1"/>
                  <input>
                     <port id="0">
                        <dim>1</dim>
                        <dim>3</dim>
                        <dim>32</dim>
                        <dim>100</dim>
                     </port>
                     <port id="1">
                        <dim>64</dim>
                        <dim>3</dim>
                        <dim>3</dim>
                        <dim>3</dim>
                     </port>
                  </input>
                  <output>
                     <port id="2" precision="FP32">
                        <dim>1</dim>
                        <dim>64</dim>
                        <dim>32</dim>
                        <dim>100</dim>
                     </port>
                  </output>
            </layer>
            <layer id="3" name="conv1/activation" type="ReLU" version="opset1">
                  <input>
                     <port id="0">
                        <dim>1</dim>
                        <dim>64</dim>
                        <dim>32</dim>
                        <dim>100</dim>
                     </port>
                  </input>
                  <output>
                     <port id="1" precision="FP32">
                        <dim>1</dim>
                        <dim>64</dim>
                        <dim>32</dim>
                        <dim>100</dim>
                     </port>
                  </output>
            </layer>
            <layer id="4" name="output" type="Result" version="opset1">
                  <input>
                     <port id="0">
                        <dim>1</dim>
                        <dim>64</dim>
                        <dim>32</dim>
                        <dim>100</dim>
                     </port>
                  </input>
            </layer>
         </layers>
         <edges>
            <!-- Connections between layer nodes: based on ids for layers and ports used in the descriptions above -->
            <edge from-layer="0" from-port="0" to-layer="2" to-port="0"/>
            <edge from-layer="1" from-port="1" to-layer="2" to-port="1"/>
            <edge from-layer="2" from-port="2" to-layer="3" to-port="0"/>
            <edge from-layer="3" from-port="1" to-layer="4" to-port="0"/>
         </edges>


.. tab-set::

   .. tab-item:: Workflow for convenience

      This approach assumes you run your model directly.

   .. tab-item:: Workflow for convenience

      .. code-block:: cpp
   
         <?xml version="1.0" ?>
         <net name="model_file_name" version="10">
            <layers>
               <layer id="0" name="input" type="Parameter" version="opset1">
                     <data element_type="f32" shape="1,3,32,100"/> <!-- attributes of operation -->
                     <output>
                        <!-- description of output ports with type of element and tensor dimensions -->
                        <port id="0" precision="FP32">
                           <dim>1</dim>
                           <dim>3</dim>
                           <dim>32</dim>
                           <dim>100</dim>
                        </port>
                     </output>
               </layer>

   .. tab-item:: Workflow for convenience

      .. dropdown:: See more details about OVMS benchmark setup
      
         The benchmark setup for OVMS consists of four main parts:
      
      .. dropdown:: See more details about OVMS benchmark setup
      
         The benchmark setup for OVMS consists of four main parts:
      
      .. dropdown:: See more details about OVMS benchmark setup
      
         The benchmark setup for OVMS consists of four main parts:




.. dropdown:: See more details about OVMS benchmark setup

   The benchmark setup for OVMS consists of four main parts:

.. dropdown:: See more details about OVMS benchmark setup

   The benchmark setup for OVMS consists of four main parts:

.. dropdown:: See more details about OVMS benchmark setup

   The benchmark setup for OVMS consists of four main parts:

.. dropdown:: See more details about OVMS benchmark setup

   The benchmark setup for OVMS consists of four main parts:

.. toctree::
   :maxdepth: 1
   :hidden:

   about-openvino/performance-benchmarks
   about-openvino/compatibility-and-support
   about-openvino/contributing
   Release Notes <about-openvino/release-notes-openvino>




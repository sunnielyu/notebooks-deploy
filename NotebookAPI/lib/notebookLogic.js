'use strict';

const _ = require('lodash'),
fetch = require('node-fetch'),
PythonShell = require('python-shell'),
xmlhttprequest = require('xmlhttprequest'),
ws = require('ws'),
fs = require('fs'),
jupyter = require('jupyter-js-services');
global.XMLHttpRequest = xmlhttprequest.XMLHttpRequest;
global.WebSocket = ws;


class NotebookLogic {

  /**
   * @description Turns an Array into a full string reprsentation. Includes brackets
   *
   * Parameters:
   * {Array} info - Array
   * @returns string
   */
  stringifyArray(info){
    try {
      if ((typeof info) == 'string'){ // Array of int and other types may cause bugs
        return "[\"" + info + "\"]";
      }
      let str = "[";
      for (var item in info) {
        str +=  "\"" + info[item] + "\"" + ",";
      }
      var exampleLength = str.length;
      if (exampleLength > 2) { // Slice off hanging comma
        str = str.slice(0,exampleLength-1);
      }
      str += "]";
      return str;
    }
    catch (error){
      console.error(error);
    }
  }

  /**
   * @description Creates code to be used in showString.
   * Version only recgonizes a variable "stock" and runs
   * batch processes based on arg stock_names (array).
   *
   * Parameters:
   * {String} notebook - name of the notebook/ Path of notebook
   * {Array of Numbers|Strings} stock_names - Array of arguments passed
   *                            Each argument executes the notebook
   * @returns string
   */
  createCode(notebook, stock_names){
    try {
    let arrayCon = stringifyArray(stock_names);
    let code = "import sys\nimport nbformat\nfrom nbparameterise import extract_parameters, parameter_values, replace_definitions\n\n";
    code += "inital = \"" + notebook + "\"\nstock_names = " + arrayCon + " \n\n";
    code += "with open(inital) as f:\n    nb = nbformat.read(f, as_version=4)\n\norig_parameters = extract_parameters(nb)\n\nfor name in stock_names:\n    ";
    code += "print(\"Running for stock\", name)\n    params = parameter_values(orig_parameters, stock=name)\n    ";
    code += "new_nb = replace_definitions(nb, params)\n    with open(\"display %s.ipynb\" % name, \'w\') as f:\n        nbformat.write(new_nb, f)";
    return code;
  }
  catch (error) {
    console.error(error);
  }
  }

  function showString(req,res){
    let id = req.body;

    let gatewayUrl = process.env.BASE_GATEWAY_HTTP_URL || 'http://localhost:8888';
    let gatewayWsUrl = process.env.BASE_GATEWAY_WS_URL || 'ws://localhost:8888';
    let demoSrc1 = '%cd Documents/Python Scripts';
    let demoSrc2 = createCode('display.ipynb',id.number);
    console.log('Targeting server:', gatewayUrl);
    let ajaxSettings = {};

    if (process.env.BASE_GATEWAY_USERNAME) {
      ajaxSettings['user'] = process.env.BASE_GATEWAY_USERNAME
    }
    if (process.env.BASE_GATEWAY_PASSWORD) {
      ajaxSettings['password'] = process.env.BASE_GATEWAY_PASSWORD
    }
    console.log('ajaxSettings: ', ajaxSettings);
    // get info about the available kernels
    return new Promise(function(resolve, reject) {
      jupyter.Kernel.getSpecs({
        baseUrl: gatewayUrl,
        ajaxSettings: ajaxSettings
      }).then((kernelSpecs) => {
        console.log('Available kernelspecs:', kernelSpecs);

        // request a new kernel
        console.log('Starting kernel:')

        jupyter.Kernel.startNew({
          baseUrl: gatewayUrl,
          wsUrl: gatewayWsUrl, // passing this separately to demonstrate basic auth
          name: kernelSpecs.default,
          ajaxSettings: ajaxSettings
        }).then((kernel) => {
          // execute some code
          console.log('Executing sample code');
          var future = kernel.execute({code: demoSrc1});
          var future = kernel.execute({ code: demoSrc2 } );
          future.onDone = () => {
            // quit the demo when done, Delete kernel
            console.log('Finished');
            kernel.shutdown().then(() => {
              console.log('Kernel shut down');
            });
          };
          future.onIOPub = (msg) => {
            // print received messages
            console.log('Received message:', msg);
            resolve(msg);
          };
        }).catch(req => {
          console.log('Error starting new kernel:', req.xhr.statusText);
          reject(req.xhr.statusText);
        });
      }).catch((req) => {
        console.log('Error fetching kernel specs:', req.xhr.statusText);
        reject(req.xhr.statusText);
      });
    });
  }

}

module.exports = NotebookLogic;

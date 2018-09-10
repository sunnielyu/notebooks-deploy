'use strict';

const notebookLogicAPI = require('../lib/notebookLogic');


function notebookRun() {


  function runNotebook(req,res){

    let notebookLogic = new notebookLogicAPI();
    return notebookLogic.showString(req,res).then( (data) => {
      res.json({Data: data || []});
    }).catch((err) => {
      res.status(500).send(err);
    });
  }
  function Route(path, method, middleware) {
    this.path = path;
    this.httpMethod = method;
    this.middleware = middleware;
  }

  let routes = [
    new Route('/notebookRun', 'POST', runNotebook)
  ];

  return  {
    Routes: routes
  };

}

module.exports = runNotebook;

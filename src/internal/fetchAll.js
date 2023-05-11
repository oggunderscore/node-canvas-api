var request = require('request-promise');
let canvasAPI = require("node-canvas-api");

var linkparser = require('parse-link-header');

var Bottleneck = require('bottleneck');

require('dotenv').config();

const limiter = new Bottleneck({
  maxConcurrent: 20,
  minTime: 100
});

function getReqObj(url) {
  const processedVariable = canvasAPI.getProcessedVariable(); // Access the processed variable
  const requestObj = {
    'method': 'GET',
    'uri': url,
    'json': true,
    'resolveWithFullResponse': true,
    'headers': {
      'Authorization': 'Bearer ' + processedVariable.variable
    },
  }

  return requestObj;
}

const fetchAll = (url, result = []) => request(getReqObj(url)).then(response => {
  result = [...result, ...response.body];
  const links = linkparser(response.headers.link);
  return links.next ? fetchAll(links.next.url, result) : result;
});

const fetchAllRateLimited = limiter.wrap(fetchAll);

module.exports = fetchAllRateLimited;
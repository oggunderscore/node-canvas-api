var request = require('request-promise');
let canvasAPI = require("node-canvas-api");


var Bottleneck = require('bottleneck');

require('dotenv').config({ override: true });

const limiter = new Bottleneck({
  maxConcurrent: 20,
  minTime: 100
});

function getReqObj(url) {
  const processedVariable = canvasAPI.getProcessedVariable(); // Access the processed variable
  console.log("Created with Token: " + processedVariable.variable);
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


const fetch = url => request(getReqObj(url)).then(response => response.body);


const fetchRateLimited = limiter.wrap(fetch);



module.exports = fetchRateLimited;
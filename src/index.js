import axios from 'axios';
import process from 'process';
import outputDataTo from './outputDataTo.js';

export default (url, outputDir = process.cwd()) => {
  const parsingPromise = axios
    .get(url)
    .catch((errorRequest) => {
      const requestStatus = errorRequest.status ? ` (${errorRequest.status})` : '';
      throw new Error(`can not connect to '${errorRequest.config.url}'${requestStatus}`);
    })
    .then((response) => outputDataTo(response, outputDir))
    .then((filepath) => console.log(`Page was successfully downloaded into: '${filepath}'`));
  return parsingPromise;
};

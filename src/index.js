import axios from 'axios';
import outputDataTo from './outputDataTo.js';

export default (url, outputDir) => {
  const parsingPromise = axios
    .get(url)
    .catch((errorRequest) => {
      const requestStatus = errorRequest.status ? ` (${errorRequest.status})` : '';
      throw new Error(`can not connect to '${errorRequest.config.url}'${requestStatus}`);
    })
    .then((response) => outputDataTo(response, outputDir))
    .then((filepath) => console.log(filepath))
    .catch((e) => {
      console.error(`Error: ${e.message}`);
      process.exitCode = 1;
    })
    .then(() => process.exit());
  return parsingPromise;
};

import axios from 'axios';
import outputDataTo from './outputDataTo.js';

export default (url, outputDir) => {
  const parsingPromise = axios
    .get(url)
    .catch((errorRequest) => {
      const requestStatus = errorRequest.status ? ` (${errorRequest.status})` : '';
      console.error(`Error: can not connect to '${errorRequest.config.url}'${requestStatus}`);
      throw new Error();
    })
    .then((response) => outputDataTo(response, outputDir))
    .then((filepath) => console.log(filepath))
    .catch(() => {
      process.exitCode = 1;
    })
    .then(() => process.exit());
  return parsingPromise;
};

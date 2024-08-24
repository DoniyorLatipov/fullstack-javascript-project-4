import axios from 'axios';
import outputDataTo from './outputDataTo.js';

export default (url, outputDir) => {
  const parsingPromise = axios
    .get(url)
    .then((response) => outputDataTo(response, outputDir))
    .then((filepath) => console.log(filepath));
  return parsingPromise;
};

import outputDataTo from './output/outputDataTo.js';
import axios from 'axios';

export default (url, outputDir) => {
  return axios
    .get(url)
    .then((response) => outputDataTo(response, outputDir))
    .then((filepath) => console.log(filepath));
};

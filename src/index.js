import createPath from './output/createPath.js';
import fs from 'fs/promises';
import axios from 'axios';

export default (url, outputDir) => {
  axios
    .get(url)
    .then((response) => {
      const filepath = createPath(outputDir, url);
      fs.writeFile(filepath, response.data);
      return filepath;
    })
    .then((filepath) => console.log(filepath));
};

import createPath from './output/createPath.js';
import fs from 'fs/promises';

export default (url, outputDir) => {
  // const data

  const filepath = createPath(outputDir, url);
  fs.writeFile(filepath, 'data').then(() => console.log(filepath));
};

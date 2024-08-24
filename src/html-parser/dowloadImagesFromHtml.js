import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import createFilename from '../createFilename.js';
import splitByExtname from '../splitByExtname.js';

export default function dowloadImagesFromHtml(data, url, output) {
  let imagesSrc;
  return fs
    .stat(output)
    .then(() => {
      const $ = cheerio.load(data, { baseURI: url });
      imagesSrc = $('img')
        .map((_i, img) => $(img).prop('src'))
        .toArray();

      const downloadingPromises = imagesSrc.map((src) => {
        const downloadingPromise = axios
          .get(src, { responseType: 'arraybuffer' })
          .then(({ data: imgBuffer }) => imgBuffer)
          .catch(() => null);

        return downloadingPromise;
      });
      return Promise.all(downloadingPromises);
    })
    .then((imageBuffers) => {
      const writtingPromises = imageBuffers.filter(Boolean).map((buffer, i) => {
        const filename = createFilename(...splitByExtname(imagesSrc[i]));
        const filepath = path.join(output, filename);
        return fs.writeFile(filepath, buffer);
      });
      return Promise.all(writtingPromises);
    });
}

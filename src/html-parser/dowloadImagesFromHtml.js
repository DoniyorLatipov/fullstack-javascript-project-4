import createFilename from '../createFilename.js';

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import _ from 'lodash';
import path from 'path';

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
        const extname = path.extname(imagesSrc[i]);
        const noExtnameSrc = imagesSrc[i].slice(0, -extname.length);
        const filename = createFilename(noExtnameSrc, extname);

        const filepath = path.join(output, filename);
        return fs.writeFile(filepath, buffer);
      });

      return Promise.all(writtingPromises);
    });
}

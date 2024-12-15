import fs from 'fs/promises';
import path from 'path';
import createFilename from '../url/createFilename.js';
import splitByExtname from '../url/splitByExtname.js';

export default function writeAssetsToOutput(assets, output) {
  const writtingPromises = assets.map(([src, data]) => {
    let [noExtnameSrc, extname] = splitByExtname(src);

    if (!path.extname(new URL(src).pathname)) {
      noExtnameSrc = src;
      extname = '.html';
    }

    const filename = createFilename(noExtnameSrc, extname);
    return fs.writeFile(path.join(output, filename), data);
  });

  return Promise.all(writtingPromises);
}

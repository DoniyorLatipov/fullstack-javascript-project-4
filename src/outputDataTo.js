import fs from 'fs/promises';
import path from 'path';
import createFilename from './url/createFilename.js';
import makeLocalHtml from './html-parser/makeLocalHtml.js';
import downloadAssetsFromHtml from './asset-downloader/index.js';

export default function outputDataTo(response, outputDir) {
  const { data } = response;
  const { url } = response.config;

  const htmlFilename = createFilename(url, '.html');
  const htmlFilepath = path.join(outputDir, htmlFilename);

  const assetsDirname = createFilename(url, '_files');
  const assetsDirpath = path.join(outputDir, assetsDirname);

  return fs
    .access(outputDir, fs.constants.W_OK)
    .catch((e) => {
      switch (e.errno) {
        case -13:
          console.error(`Error: permission denied, writing to '${outputDir}' not allowed`);
          break;
        case -2:
          console.error(`Error: no such file or directory, open '${outputDir}'`);
          break;
        default:
          console.error(`Error: can not write in '${outputDir}' (${e.code})`);
      }

      throw new Error();
    })
    .then(() => makeLocalHtml(data, url, assetsDirname))
    .then((localedHtml) => fs.writeFile(htmlFilepath, localedHtml))
    .then(() => fs.mkdir(assetsDirpath))
    .then(() => downloadAssetsFromHtml(data, url, assetsDirpath))
    .then(() => htmlFilepath);
}

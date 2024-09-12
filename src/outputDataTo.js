import fs from 'fs/promises';
import path from 'path';
import createFilename from './url/createFilename.js';
import makeLocalHtml from './html-parser/makeLocalHtml.js';
import downloadAssetsFromHtml from './asset-downloader/index.js';

function checkDirectory(dirpath) {
  return fs
    .readdir(dirpath)
    .then(() => fs.access(dirpath, fs.constants.W_OK))
    .catch((e) => {
      switch (e.errno) {
        case -13:
          throw new Error(`permission denied, writing to '${dirpath}' not allowed`);
        case -2:
          throw new Error(`no such directory, open '${dirpath}'`);
        default:
          throw new Error(`can not write in '${dirpath}' (${e.code})`);
      }
    });
}

export default function outputDataTo(response, outputDir) {
  const { data } = response;
  const { url } = response.config;

  const htmlFilename = createFilename(url, '.html');
  const htmlFilepath = path.join(outputDir, htmlFilename);

  const assetsDirname = createFilename(url, '_files');
  const assetsDirpath = path.join(outputDir, assetsDirname);

  return checkDirectory(outputDir)
    .then(() => makeLocalHtml(data, url, assetsDirname))
    .then((localedHtml) => fs.writeFile(htmlFilepath, localedHtml))
    .then(() => fs.mkdir(assetsDirpath))
    .then(() => downloadAssetsFromHtml(data, url, assetsDirpath))
    .then(() => htmlFilepath);
}

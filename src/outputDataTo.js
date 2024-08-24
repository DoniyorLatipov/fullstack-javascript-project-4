import fs from 'fs/promises';
import path from 'path';
import createFilename from './createFilename.js';
import makeLocalHtml from './html-parser/makeLocalHtml.js';
import dowloadImagesFromHtml from './html-parser/dowloadImagesFromHtml.js';

export default function outputDataTo(response, outputDir) {
  const { data } = response;
  const { url } = response.config;

  const htmlFilename = createFilename(url, '.html');
  const htmlFilepath = path.join(outputDir, htmlFilename);

  const assetsDirname = createFilename(url, '_files');
  const assetsDirpath = path.join(outputDir, assetsDirname);

  return fs
    .stat(outputDir)
    .then(() => makeLocalHtml(data, url, assetsDirname))
    .then((localedHtml) => fs.writeFile(htmlFilepath, localedHtml))
    .then(() => fs.mkdir(assetsDirpath))
    .then(() => dowloadImagesFromHtml(data, url, assetsDirpath))
    .then(() => htmlFilepath);
}

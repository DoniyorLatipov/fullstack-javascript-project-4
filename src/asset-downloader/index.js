import fs from 'fs/promises';
import dowloadAllLocalAssets from './dowloadAllLocalAssets.js';
import writeAssetsToOutput from './writeAssetsToOutput.js';

export default function dowloadAssetsFromHtml(html, url, output) {
  return fs
    .stat(output)
    .then(() => dowloadAllLocalAssets(html, url))
    .then((localAssets) => writeAssetsToOutput(localAssets, output));
}

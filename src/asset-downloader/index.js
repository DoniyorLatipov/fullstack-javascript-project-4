import fs from 'fs/promises';
import downloadAssetsFromHtml from './downloadAllLocalAssets.js';
import writeAssetsToOutput from './writeAssetsToOutput.js';

export default function dowloadAssetsFromHtml(html, url, output) {
  return fs
    .stat(output)
    .then(() => downloadAssetsFromHtml(html, url))
    .then((localAssets) => writeAssetsToOutput(localAssets, output));
}

import * as cheerio from 'cheerio';
import downloadAssetsByTagAttribute from './downloadAssetsByTagAttribute.js';

export default function dowloadAllLocalAssets(data, url) {
  const $ = cheerio.load(data, { baseURI: url });

  let imageAssets;
  let linkAssets;
  let scriptAssets;
  return downloadAssetsByTagAttribute($, 'img', 'src', { responseType: 'arraybuffer' })
    .then((imageData) => {
      imageAssets = imageData;
      return downloadAssetsByTagAttribute($, 'link', 'href', { responseType: 'text' });
    })
    .then((styleData) => {
      linkAssets = styleData;
      return downloadAssetsByTagAttribute($, 'script', 'src', { responseType: 'text' });
    })
    .then((scriptData) => {
      scriptAssets = scriptData;
      return [...imageAssets, ...linkAssets, ...scriptAssets];
    });
}

import * as cheerio from 'cheerio';
import downloadAssetsByTagAttribute from './downloadAssetsByTagAttribute.js';

const arrayRequests = [
  ['img', 'src'],
  ['source', 'srcset'],
  ['link', 'href'],
  ['script', 'src'],
];

export default function dowloadAllLocalAssets(data, url) {
  const $ = cheerio.load(data, { baseURI: url });

  const promises = arrayRequests.map(([tag, attribute]) => {
    return downloadAssetsByTagAttribute($, url, tag, attribute);
  });

  const assetsDataPromise = Promise.all(promises).then((dataArray) => {
    return dataArray.reduce((acc, data) => [...acc, ...data], []);
  });

  return assetsDataPromise;
}

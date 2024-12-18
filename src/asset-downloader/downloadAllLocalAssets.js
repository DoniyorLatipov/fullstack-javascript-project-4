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
    const promise = downloadAssetsByTagAttribute($, url, tag, attribute);
    return promise;
  });

  const assetsDataPromise = Promise.all(promises).then((dataArray) => {
    const assetsDataArray = dataArray.reduce((acc, assetsArray) => [...acc, ...assetsArray], []);
    return assetsDataArray;
  });

  return assetsDataPromise;
}

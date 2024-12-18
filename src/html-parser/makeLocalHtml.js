import * as cheerio from 'cheerio';
import prettierHtml from './prettierHtml.js';
import makeLocalTagAttributes from './makeLocalTagAttributes.js';

const arrayRequests = [
  ['img', 'src'],
  ['source', 'srcset'],
  ['link', 'href'],
  ['script', 'src'],
];

export default function makeLocalHtml(data, url, assetsDirname) {
  const $ = cheerio.load(data, { baseURI: url });
  const localedCherioPromise = arrayRequests.reduce(
    (acc, [tag, attribute]) => acc.then((newCheerio) => makeLocalTagAttributes(
      { cheerio: newCheerio, baseURI: url },
      tag,
      attribute,
      assetsDirname,
    )),
    Promise.resolve($),
  );
  return localedCherioPromise.then((localedCherio) => prettierHtml(localedCherio.html()));
}

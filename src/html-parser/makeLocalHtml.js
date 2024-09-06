import * as cheerio from 'cheerio';
import prettierHtml from './prettierHtml.js';
import makeLocalTagAttributes from './makeLocalTagAttributes.js';

export default function makeLocalHtml(data, url, assetsDirname) {
  return Promise.resolve(cheerio.load(data, { baseURI: url }))
    .then(($) => makeLocalTagAttributes($, 'img', 'src', assetsDirname))
    .then(($LocaledImgs) => makeLocalTagAttributes($LocaledImgs, 'link', 'href', assetsDirname))
    .then(($LocaledLinks) => makeLocalTagAttributes($LocaledLinks, 'script', 'src', assetsDirname))
    .then(($AllLocaled) => prettierHtml($AllLocaled.html()));
}

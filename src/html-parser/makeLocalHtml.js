import * as cheerio from 'cheerio';
import prettierHtml from './prettierHtml.js';
import makeLocalTagAttributes from './makeLocalTagAttributes.js';

export default function makeLocalHtml(data, url, assetsDirname) {
  return Promise.resolve(cheerio.load(data, { baseURI: url }))
    .then(($) => makeLocalTagAttributes({ cheerio: $, baseURI: url }, 'img', 'src', assetsDirname))
    .then(($LocImgs) => makeLocalTagAttributes({ cheerio: $LocImgs, baseURI: url }, 'link', 'href', assetsDirname))
    .then(($LocLinks) => makeLocalTagAttributes({ cheerio: $LocLinks, baseURI: url }, 'script', 'src', assetsDirname))
    .then(($LocAll) => prettierHtml($LocAll.html()));
}

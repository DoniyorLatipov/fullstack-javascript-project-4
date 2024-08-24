import * as cheerio from 'cheerio';
import createFilename from '../createFilename.js';
import prettierHtml from './prettierHtml.js';
import path from 'path';

export default function makeLocalHtml(data, url, assetsDirname) {
  const $ = cheerio.load(data, { baseURI: url });
  $('img').each((_i, img) => {
    const globalSrc = $(img).prop('src');
    const extname = path.extname(globalSrc);
    const noExtnameSrc = globalSrc.slice(0, -extname.length);

    const imgFilename = createFilename(noExtnameSrc, extname);
    const localSrc = `/${assetsDirname}/${imgFilename}`;
    $(img).attr('src', localSrc);
  });

  return prettierHtml($.html());
}

import * as cheerio from 'cheerio';
import createFilename from '../createFilename.js';
import splitByExtname from '../splitByExtname.js';
import prettierHtml from './prettierHtml.js';

export default function makeLocalHtml(data, url, assetsDirname) {
  const $ = cheerio.load(data, { baseURI: url });
  $('img').each((_i, img) => {
    const globalSrc = $(img).prop('src');
    const [noExtnameSrc, extname] = splitByExtname(globalSrc);
    const imgFilename = createFilename(noExtnameSrc, extname);

    const localSrc = `/${assetsDirname}/${imgFilename}`;
    $(img).attr('src', localSrc);
  });

  return prettierHtml($.html());
}

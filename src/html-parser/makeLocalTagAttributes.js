import path from 'path';
import createFilename from '../url/createFilename.js';
import splitByExtname from '../url/splitByExtname.js';
import compareUrlsByHostname from '../url/compareUrlsByHostname.js';

export default function makeLocalTagAttributes(
  { cheerio, baseURI },
  tag,
  attribute,
  assetsDirname,
) {
  const $ = cheerio;

  $(`${tag}[${attribute}]`).each((_i, el) => {
    const globalSrc = $(el).prop(attribute);

    if (!compareUrlsByHostname(globalSrc, baseURI)) {
      return;
    }

    let [noExtnameSrc, extname] = splitByExtname(globalSrc);

    if (!path.extname(new URL(globalSrc).pathname)) {
      noExtnameSrc = globalSrc;
      extname = '.html';
    }

    const elFilename = createFilename(noExtnameSrc, extname);

    const localSrc = path.join(assetsDirname, elFilename);
    $(el).attr(attribute, localSrc);
  });

  return $;
}

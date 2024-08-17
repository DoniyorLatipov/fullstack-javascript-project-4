import path from 'path';

export default (dirpath, urlString) => {
  const parsedUrl = new URL(urlString).href
    .replace(/https?:\/\//, '')
    .replace(/[^\s\da-z-]/gi, '-')
    .replace(/^-|-$/g, '');
  return path.join(dirpath, `${parsedUrl}.html`);
};

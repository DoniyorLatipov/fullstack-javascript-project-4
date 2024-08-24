import prettier from 'prettier';

export default (html) => {
  const promiseFormatedHtml = prettier.format(html, {
    parser: 'html',
    htmlWhitespaceSensitivity: 'ignore',
  });
  return promiseFormatedHtml;
};

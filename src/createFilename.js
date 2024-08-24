export default (name, extname = '') => {
  const basename = name
    .replace(/https?:\/\//, '')
    .match(/[\da-z]+/gi)
    .join('-');
  return `${basename}${extname}`;
};

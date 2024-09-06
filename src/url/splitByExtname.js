import path from 'path';

export default (pathStr) => {
  const extname = path.extname(pathStr);
  const rest = pathStr.slice(0, -extname.length);

  return [rest, extname];
};

import createPath from '../src/output/createPath.js';

describe('createOutputPath', () => {
  const table = ['https://t.est/c_p=t', 'http://t.est/c_p=t'];
  const dirpath = '/result';
  const expected = `${dirpath}/t-est-c-p-t.html`;

  test.each(table)('%s', (url) => {
    expect(createPath(dirpath, url)).toBe(expected);
  });
});

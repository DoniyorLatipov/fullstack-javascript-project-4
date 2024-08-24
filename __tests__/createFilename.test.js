import createFilename from '../src/createFilename.js';

describe('createOutputPath', () => {
  const table = ['https://t.est/c_p=t', 'http://t.est/c_p=t', '/t.est/c_p=t', '   t.est/c_p=t   '];
  const expected = 't-est-c-p-t.html';

  test.each(table)('%s', (url) => {
    expect(createFilename(url, '.html')).toBe(expected);
  });
});

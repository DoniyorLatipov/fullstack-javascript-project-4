import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';
import prettierHtml from '../src/html-parser/prettierHtml.js';
import makeLocalHtml from '../src/html-parser/makeLocalHtml.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

let expected;

beforeAll(async () => {
  const htmlData = await fs.readFile(getFixturePath('after-ru-hexlet-io-courses.html'), 'utf-8');
  expected = await prettierHtml(htmlData);
});

const assetsDirname = 'ru-hexlet-io-courses_files';
const url = 'https://ru.hexlet.io/courses';
let data;

beforeEach(async () => {
  data = await fs.readFile(getFixturePath('before-ru-hexlet-io-courses.html'), 'utf-8');
});

test('makeLocalHtml', async () => {
  const localHtml = await makeLocalHtml(data, url, assetsDirname);
  expect(localHtml).toBe(expected);
});

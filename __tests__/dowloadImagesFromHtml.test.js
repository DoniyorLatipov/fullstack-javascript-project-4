import { fileURLToPath } from 'url';
import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';
import dowloadImagesFromHtml from '../src/html-parser/dowloadImagesFromHtml.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

nock.disableNetConnect();

let tempDir;

beforeAll(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-imgs-'));
});

const url = 'https://ru.hexlet.io/courses';
let data;
let imgData;

beforeEach(async () => {
  data = await fs.readFile(getFixturePath('before-ru-hexlet-io-courses.html'), 'utf-8');
  imgData = await fs.readFile(getFixturePath('assets_professions_node_js.png'));
  nock(/ru\.hexlet\.io/)
    .get('/assets_professions_node_js.png')
    .reply(200, imgData);
});

test('dowloadImagesFromHtml', async () => {
  await dowloadImagesFromHtml(data, url, tempDir);

  const expactedFilename = 'ru-hexlet-io-assets-professions-node-js.png';
  const dowloadedImage = await fs.readFile(path.join(tempDir, expactedFilename));

  expect(dowloadedImage).toEqual(imgData);
});

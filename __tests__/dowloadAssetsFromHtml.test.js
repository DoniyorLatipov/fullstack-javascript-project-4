import { fileURLToPath } from 'url';
import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';
import debug from 'debug';
import { jest } from '@jest/globals';
import dowloadAssetsFromHtml from '../src/asset-downloader/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const nockDebug = debug('page-loader:nock');
nock.emitter.on('no match', (req) => {
  nockDebug('no-match:', req.method, req.path);
});

nock.emitter.on('request', (req) => {
  nockDebug('request:', req.method, req.path);
});

nock.emitter.on('replied', (req) => {
  nockDebug('replied:', req.method, req.path);
});

nock.disableNetConnect();

let tempDir;
const url = 'https://ru.hexlet.io/courses';
let html;
let expectedImage;
let expectedStyle;
let expectedScript;
let expectedCanonical;

beforeAll(async () => {
  html = await fs.readFile(getFixturePath('before-ru-hexlet-io-courses.html'), 'utf-8');

  expectedImage = await fs.readFile(getFixturePath('nodejs.png'));
  expectedStyle = await fs.readFile(getFixturePath('application.css'), 'utf-8');
  expectedCanonical = await fs.readFile(
    getFixturePath('before-ru-hexlet-io-courses.html'),
    'utf-8',
  );
  expectedScript = await fs.readFile(getFixturePath('runtime.js'), 'utf-8');
});

beforeEach(async () => {
  jest.restoreAllMocks();
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-imgs-'));
});

test('dowload correct data', async () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(jest.fn());

  nock(/ru\.hexlet\.io/)
    .get(/nodejs.png$/)
    .reply(200, expectedImage);

  nock(/ru\.hexlet\.io/)
    .get(/application.css$/)
    .reply(200, expectedStyle);

  nock(/ru\.hexlet\.io/)
    .get('/courses')
    .reply(200, expectedCanonical);

  nock(/ru\.hexlet\.io/)
    .get(/runtime.js$/)
    .reply(200, expectedScript);

  await dowloadAssetsFromHtml(html, url, tempDir);

  const dowloadedImage = await fs.readFile(
    path.join(tempDir, 'ru-hexlet-io-assets-professions-nodejs.png'),
  );

  const dowloadedStyle = await fs.readFile(
    path.join(tempDir, 'ru-hexlet-io-assets-application.css'),
    'utf-8',
  );

  const dowloadeCanonical = await fs.readFile(
    path.join(tempDir, 'ru-hexlet-io-courses.html'),
    'utf-8',
  );

  const dowloadedScript = await fs.readFile(
    path.join(tempDir, 'ru-hexlet-io-packs-js-runtime.js'),
    'utf-8',
  );

  expect(dowloadedImage).toEqual(expectedImage);
  expect(dowloadedStyle).toEqual(expectedStyle);
  expect(dowloadeCanonical).toEqual(expectedCanonical);
  expect(dowloadedScript).toEqual(expectedScript);

  // logging
  const expectedAnswers = [
    '✔ https://ru.hexlet.io/assets/professions/nodejs.png',
    '✔ https://ru.hexlet.io/assets/application.css',
    '✔ https://ru.hexlet.io/courses',
    '✔ https://ru.hexlet.io/packs/js/runtime.js',
  ];
  expect(spyLog).toHaveBeenCalledTimes(expectedAnswers.length);
  expectedAnswers.forEach((answer) => {
    expect(spyLog).toHaveBeenCalledWith(answer);
  });
});

test('empty data on src', async () => {
  const spyError = jest.spyOn(console, 'error').mockImplementation(jest.fn());

  nock(/ru\.hexlet\.io/)
    .get(/nodejs.png$/)
    .reply(300);

  nock(/ru\.hexlet\.io/)
    .get(/application.css$/)
    .reply(400);

  nock(/ru\.hexlet\.io/)
    .get('/courses')
    .reply(404);

  nock(/ru\.hexlet\.io/)
    .get(/runtime.js$/)
    .reply(500);

  await dowloadAssetsFromHtml(html, url, tempDir);

  const dowloadedFile = await fs.readdir(tempDir, 'utf-8');
  expect(dowloadedFile).not.toContain('ru-hexlet-io-assets-application.css');
  expect(dowloadedFile).not.toContain('ru-hexlet-io-courses.html');
  expect(dowloadedFile).not.toContain('ru-hexlet-io-assets-professions-nodejs.png');
  expect(dowloadedFile).not.toContain('ru-hexlet-io-packs-js-runtime.js');

  // logging
  const expectedAnswers = [
    '✗ https://ru.hexlet.io/assets/professions/nodejs.png request error (300)',
    '✗ https://ru.hexlet.io/assets/application.css request error (400)',
    '✗ https://ru.hexlet.io/courses request error (404)',
    '✗ https://ru.hexlet.io/packs/js/runtime.js request error (500)',
  ];
  expect(spyError).toHaveBeenCalledTimes(expectedAnswers.length);
  expectedAnswers.forEach((answer) => {
    expect(spyError).toHaveBeenCalledWith(answer);
  });
});

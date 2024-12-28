import { fileURLToPath } from 'url';
import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';
import debug from 'debug';
import {
  jest, beforeAll, beforeEach, test, expect,
} from '@jest/globals';
import dowloadAssetsFromHtml from '../src/asset-downloader/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

nock.disableNetConnect();

const log = debug('page-loader');
const logNock = log.extend('nock');

nock.emitter.on('no match', (req) => {
  logNock('no-match:', req.method, req.path);
});

function nockScopeStatusLogger(scope) {
  const mark = scope.isDone() ? '✔ Done' : '✗ Unused';
  scope.interceptors.forEach((interceptor) => {
    const { method } = interceptor;
    const pathname = interceptor.path.toString().replace(/\$\//g, '');
    logNock(mark, method, pathname);
  });
}

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
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-assets-'));
});

test('dowload correct data', async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});

  const scope = nock(/ru\.hexlet\.io/)
    .get(/nodejs.png$/)
    .reply(200, expectedImage)
    .get(/application.css$/)
    .reply(200, expectedStyle)
    .get('/courses')
    .reply(200, expectedCanonical)
    .get(/runtime.js$/)
    .reply(200, expectedScript);

  await dowloadAssetsFromHtml(html, url, tempDir);
  nockScopeStatusLogger(scope);

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
});

test('empty data on src', async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});

  const scope = nock(/ru\.hexlet\.io/)
    .get(/nodejs.png$/)
    .reply(300)
    .get(/application.css$/)
    .reply(400)
    .get('/courses')
    .reply(404)
    .get(/runtime.js$/)
    .reply(500);

  await dowloadAssetsFromHtml(html, url, tempDir);
  nockScopeStatusLogger(scope);

  const dowloadedFile = await fs.readdir(tempDir, 'utf-8');
  expect(dowloadedFile).not.toContain('ru-hexlet-io-assets-application.css');
  expect(dowloadedFile).not.toContain('ru-hexlet-io-courses.html');
  expect(dowloadedFile).not.toContain('ru-hexlet-io-assets-professions-nodejs.png');
  expect(dowloadedFile).not.toContain('ru-hexlet-io-packs-js-runtime.js');
});

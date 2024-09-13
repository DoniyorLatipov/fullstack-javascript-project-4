import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';
import { beforeEach, jest, test } from '@jest/globals';
import debug from 'debug';
import loadPage from '../src/index.js';

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

beforeEach(async () => {
  jest.restoreAllMocks();
});

let spy;
let tempDir;

beforeEach(async () => {
  jest.restoreAllMocks();
  jest.spyOn(process, 'exit').mockImplementation(() => {});
  spy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-logging-'));
});

describe('http error', () => {
  test('rejected request (status)', async () => {
    const scope = nock(/ru\.hexlet\.io/)
      .get('/courses')
      .reply(500);

    await loadPage('https://ru.hexlet.io/courses', tempDir);
    nockScopeStatusLogger(scope);

    expect(spy).toHaveBeenCalledWith(
      "Error: can not connect to 'https://ru.hexlet.io/courses' (500)",
    );
  });

  test('request with error (no status)', async () => {
    const scope = nock(/ru\.hexlet\.io/)
      .get('/courses')
      .replyWithError('error');

    await loadPage('https://ru.hexlet.io/courses', tempDir);
    nockScopeStatusLogger(scope);

    expect(spy).toHaveBeenCalledWith("Error: can not connect to 'https://ru.hexlet.io/courses'");
  });
});

describe('log fs errors', () => {
  let scope;
  beforeEach(async () => {
    scope = nock(/ru\.hexlet\.io/)
      .get('/courses')
      .reply(200, 'test');
  });

  test('no permission', async () => {
    await fs.chmod(tempDir, 0o000);

    await loadPage('https://ru.hexlet.io/courses', tempDir);
    nockScopeStatusLogger(scope);

    expect(spy).toHaveBeenCalledWith(
      `Error: permission denied, writing to '${tempDir}' not allowed`,
    );
  });

  test('no direction', async () => {
    await fs.rm(tempDir, { recursive: true, force: true });

    await loadPage('https://ru.hexlet.io/courses', tempDir);
    nockScopeStatusLogger(scope);

    expect(spy).toHaveBeenCalledWith(`Error: no such directory, open '${tempDir}'`);
  });

  test('into file', async () => {
    const filepath = path.join(tempDir, 'test.txt');
    await fs.writeFile(filepath, 'hexlet');

    await loadPage('https://ru.hexlet.io/courses', filepath);
    nockScopeStatusLogger(scope);

    expect(spy).toHaveBeenCalledWith(`Error: can not write in '${filepath}' (ENOTDIR)`);
  });
});

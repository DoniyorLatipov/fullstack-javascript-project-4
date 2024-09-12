import debug from 'debug';
import { createRequire } from 'module';
import Listr from 'listr';
import compareUrlsByHostname from '../url/compareUrlsByHostname.js';

const require = createRequire(import.meta.url);
const axios = require('axios');
require('axios-debug-log').addLogger(axios, debug('page-loader').extend('axios'));

export default function downloadAssetsByTagAttribute(CheerioAPI, tag, attribute, requestOptions) {
  const $ = CheerioAPI;
  const { _options: options } = $;
  const { baseURI } = options;

  const localSources = $(`${tag}[${attribute}]`)
    .map((_i, el) => $(el).prop(attribute))
    .toArray()
    .filter((src) => compareUrlsByHostname(src, baseURI));

  const downloadingTasks = localSources.map((src) => ({
    title: src,
    task: (ctx) => axios
      .get(src, requestOptions)
      .then(({ data }) => {
        ctx[src] = data;
      })
      .catch(() => null),
  }));

  const listrTasks = new Listr(downloadingTasks, { concurrent: true });

  const parsedDataPromise = listrTasks.run().then((ctx) => {
    const parsedData = localSources.map((src) => [src, ctx[src]]).filter(([, data]) => data);

    return parsedData;
  });

  return parsedDataPromise;
}

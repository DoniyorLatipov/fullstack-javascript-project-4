import _ from 'lodash';
import debug from 'debug';
import { createRequire } from 'module';
import compareUrlsByHostname from '../url/compareUrlsByHostname.js';

const require = createRequire(import.meta.url);
const axios = require('axios');
require('axios-debug-log').addLogger(axios, debug('page-loader:axios'));

export default function downloadAssetsByTagAttribute(CheerioAPI, tag, attribute, requestOptions) {
  const $ = CheerioAPI;
  const { _options: options } = $;
  const { baseURI } = options;

  const localSources = $(`${tag}[${attribute}]`)
    .map((_i, el) => $(el).prop(attribute))
    .toArray()
    .filter((src) => compareUrlsByHostname(src, baseURI));

  const downloadingPromises = localSources.map((src) => axios
    .get(src, requestOptions)
    .then((response) => {
      console.log(`✔ ${response.config.url}`);
      return response.data;
    })
    .catch((response) => {
      console.error(`✗ ${response.config.url} request error (${response.status})`);
      return null;
    }));

  const parsedDataPromise = Promise.all(downloadingPromises).then((data) => {
    const parsedData = _.zip(localSources, data).filter(([, responseData]) => responseData);
    return parsedData;
  });

  return parsedDataPromise;
}

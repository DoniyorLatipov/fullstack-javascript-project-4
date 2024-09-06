import _ from 'lodash';
import axios from 'axios';
import path from 'path';
import compareUrlsByHostname from '../url/compareUrlsByHostname.js';

export default function downloadAssetsByTagAttribute(CheerioAPI, tag, attribute, requestOptions) {
  const $ = CheerioAPI;
  const { baseURI } = $._options;

  const localSources = $(`${tag}[${attribute}]`)
    .map((_i, el) => $(el).prop(attribute))
    .toArray()
    .filter((src) => compareUrlsByHostname(src, baseURI));

  const downloadingPromises = localSources.map((src) =>
    axios
      .get(src, requestOptions)
      .then(({ data }) => data)
      .catch(() => null),
  );

  return Promise.all(downloadingPromises).then((data) => _.zip(localSources, data));
}

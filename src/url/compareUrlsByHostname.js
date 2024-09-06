export default (url1, url2) => new URL(url1).hostname === new URL(url2).hostname;

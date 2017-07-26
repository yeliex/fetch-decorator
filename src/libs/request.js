const global = require('./global');

module.exports = (config) => ({ query = {}, params = {}, body = {}, headers = {}, fetch = config.fetch || global.fetch, mock } = {}) => {
  return fetch(config.path, {
    mock: mock === false ? mock : (mock || config.mock),
    query: Object.assign({}, config.query, query),
    params: Object.assign({}, config.params, params),
    body: Object.assign({}, config.body, body),
    headers: Object.assign({}, config.headers, headers)
  });
};

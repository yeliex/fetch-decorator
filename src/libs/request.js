const global = require('./global');

module.exports = (config) => ({ query = {}, params = {}, body = {}, headers = {}, fetch = config.fetch || global.fetch } = {}) => {
  return fetch(config.path, {
    query: Object.assign(config.query, query),
    params: Object.assign(config.params, params),
    body: Object.assign(config.body, body),
    headers: Object.assign(config.headers, headers)
  });
};

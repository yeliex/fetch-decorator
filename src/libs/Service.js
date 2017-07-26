const { join } = require('path');
const { ReservedName, AllowedMethods } = require('./enums');
const fetch = require('./request');

const _ = {
  camelCase: require('lodash.camelcase')
};

const combinePath = (...paths) => {
  return paths.map(p => p || '/').reverse().reduce((total, key) => {
    return key.match(/^\/\//) ? key : join(total, key).replace(/^\/{1,}/, total.match(/^\/\//) ? '//' : '/').replace(/^(http|https):(\/{1,})/, (_t, protocol) => {
      return `${protocol}://`;
    });
  }, '');
};

const combineObject = (...objs) => {
  objs = objs.map(o => o || {}).reverse();
  const functions = objs.some(o => typeof o === 'function');

  if (functions) {
    return () => {
      return objs.reduce((total, obj) => {
        return Object.assign(total, typeof obj === 'function' ? obj() : obj);
      }, {});
    };
  }

  return Object.assign({}, ...objs);
};

const onlyGet = (methods) => {
  return !AllowedMethods.some(method => methods[method] || methods[method.toLowerCase()]);
};

const decorateName = (methods, config) => {
  if (onlyGet(methods)) {
    methods = {
      get: Object.assign({}, methods)
    };
  }

  const { path, query, params, body, headers } = methods;

  return AllowedMethods.reduce((total, methodName) => {
    if (methods[methodName] && methods[methodName.toLowerCase()]) {
      console.warn(`[fetch-decorator] Duplicate method: ${config.key}: ${methodName}, only the lower-case one would be used`);
    }

    let method = methods[methodName.toLowerCase()] || methods[methodName];

    if (!method) {
      return total;
    }

    method = method === true ? {} : method;

    total[_.camelCase(`${methodName.toLowerCase()}_${config.key}`)] = fetch({
      method: methodName,
      path: combinePath(method.path, path, config.path),
      query: combineObject(method.query, query, config.query),
      params: combineObject(method.params, params, config.params),
      body: combineObject(method.body, body, config.body),
      headers: combineObject(method.headers, headers, config.headers),
      fetch: config.fetch
    });

    return total;
  }, {});
};

module.exports = function Service(config) {
  const keys = Object.keys(config).filter(k => !ReservedName.includes(k));

  const { path, method, query, params, body, headers, fetch } = config;

  return keys.reduce((total, key) => {
    return Object.assign({}, total, decorateName(config[key], {
      path, query, params, body, headers, fetch, key
    }));
  }, {});
};

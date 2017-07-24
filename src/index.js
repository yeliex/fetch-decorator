const Service = require('./libs/Service');
const global = require('./libs/global');

const _ = {
  cloneDeep: require('lodash.clonedeep')
};

const Stack = {};

const register = (config) => {
  const Config = _.cloneDeep(config);
  if (typeof config === 'function') {
    config.namespace = config.namespace || config.name;
  }

  if (Stack[config.namespace]) {
    throw new Error(`[fetch-decorator] Duplicate namespace: ${config.namespace}`);
  }

  Stack[config.namespace] = new Service(config);
};

const groupRegister = (configs) => {
  Object.keys(configs).forEach((name) => {
    const config = configs[name];
    config.namespace = config.namespace || name;

    register(config);
  });
};

const setGlobalFetch = (func) => {
  if (typeof func !== 'function') {
    throw new Error('global method must be function');
  }
  if (global.configured) {
    console.warn('[global-decorator] Re-define global method would overwrite global');
  }
  global.fetch = func;
  global.configured = true;
};

Object.defineProperties(Stack, {
  register: {
    configurable: false,
    enumerable: false,
    value: register
  },
  combine: {
    configurable: false,
    enumerable: false,
    value: groupRegister
  },
  globalFetch: {
    configurable: false,
    enumerable: false,
    value: setGlobalFetch
  }
});

module.exports = Stack;

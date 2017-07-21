const fetch = require('autofetch');
const Service = require('./libs/Service');

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
  }
});

module.exports = Stack;

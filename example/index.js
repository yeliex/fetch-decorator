const Services = require('../src');

const suggest = require('./mock/suggest');
const example = require('./mock/example');

const fetch = require('autofetch');

fetch.callback((response) => {
  return response.json();
});

//console.log(user.name);

Services.register(suggest);

Services.suggest.getSug({
  query: {
    q: 'test'
  }
}).then((a) => {
  console.log(a);
}).catch((e) => {
  console.log(e);
});

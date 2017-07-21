const Services = require('../src');

const user = require('./mock/user');

//console.log(user.name);

Services.register(user);

console.log(Services)

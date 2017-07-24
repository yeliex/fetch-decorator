const { fetch } = require('autofetch');

const parseResponse = (response) => {
  return response.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  });
};

const decoratedFetch = (...props) => {
  return fetch(...props).then((response) => {
    if (response && response.bodyUsed === false) {
      return parseResponse(response).then((body) => {
        return response.ok ? body : Promise.reject(body);
      });
    }
    return response;
  });
};

module.exports = {
  fetch: decoratedFetch
};

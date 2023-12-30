const axios = require("axios");
const http = require("http");
const https = require("https");

class HTTPClient {
  static create(config) {
    config.httpAgent = new http.Agent({ keepAlive: true });
    config.httpsAgent = new https.Agent({ keepAlive: true });
    config.headers = Object.assign(
      { "content-type": "application/json", Accept: "application/json" },
      config.headers
    );

    return axios.create(config);
  }
}

module.exports = { HTTPClient };

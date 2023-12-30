const { container } = require("tsyringe");

const { financialProvider } = require("../../../configs/env.config");
const { HTTPClient } = require("../../../utils/http.util");

const { apiKey, baseURL, secretKey } = financialProvider.monnify;

class MonnifyProvider {
  constructor() {
    const authHeader = `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString(
      "base64"
    )}`;
    this.monnifyClient = HTTPClient.create({
      baseURL,
      headers: {
        Authorization: authHeader,
      },
    });
  }

  async generateToken() {
    try {
      const response = await this.monnifyClient.post("/api/v1/auth/login");

      const responseData = response.data;

      return responseData;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MonnifyProvider;

const { container } = require("tsyringe");

const { financialProvider } = require("../../../configs/env.config");
const { HTTPClient } = require("../../../utils/http.util");
const {
  generateRandomAlphanumeric,
} = require("../../../helpers/airtimeRecharge");
const { logger } = require("../../../utils/logger.util");

const { apiKey, baseURL, secretKey, contractNumber } =
  financialProvider.monnify;

class MonnifyProvider {
  constructor() {
    this.token = null;
    this.logger = logger;
    this.monnifyClient = HTTPClient.create({
      baseURL,
    });
  }

  async generateToken() {
    try {
      const authHeader = `Basic ${Buffer.from(
        `${apiKey}:${secretKey}`
      ).toString("base64")}`;

      this.monnifyClient.defaults.headers.common["Authorization"] = authHeader;

      const response = await this.monnifyClient.post("/api/v1/auth/login");

      const responseData = response.data;

      this.token = responseData.responseBody.accessToken;

      return responseData;
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }

  async ensureToken() {
    if (!this.token) {
      await this.generateToken();
    }
  }

  async createInvoiceReservedAccount(name, email, accountName) {
    try {
      await this.ensureToken();

      const payload = {
        contractCode: contractNumber,
        accountName,
        currencyCode: "NGN",
        accountReference: generateRandomAlphanumeric(15),
        customerEmail: email,
        customerName: name,
        reservedAccountType: "INVOICE",
      };

      const response = await this.monnifyClient.post(
        "/api/v1/bank-transfer/reserved-accounts",
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      const responseData = response.data;

      return responseData;
    } catch (error) {
      this.logger.error({ error });

      throw error;
    }
  }
}

module.exports = MonnifyProvider;

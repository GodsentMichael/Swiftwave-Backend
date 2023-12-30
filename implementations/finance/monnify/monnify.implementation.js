const { container } = require("tsyringe");

const { financialProvider } = require("../../../configs/env.config");
const { HTTPClient } = require("../../../utils/http.util");
const {
  generateRandomAlphanumeric,
} = require("../../../helpers/airtimeRecharge");

const { apiKey, baseURL, secretKey, contractNumber } =
  financialProvider.monnify;

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

  async createInvoiceReservedAccount(name, email, accountName) {
    try {
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
        payload
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MonnifyProvider;

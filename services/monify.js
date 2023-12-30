const { injectable, container } = require("tsyringe");
const { isAxiosError } = require("axios");

const MonnifyProvider = require("../implementations/finance/monnify/monnify.implementation");
const { AppError } = require("../helpers/error");
const { findUserById } = require("./user");

class MonnifyService {
  constructor() {
    this.monnifyProvider = container.resolve(MonnifyProvider);
  }

  async generateToken() {
    try {
      const response = await this.monnifyProvider.generateToken();
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new AppError(
          Number(error.response?.status),
          error.response?.data.message
        );
      }
      throw new AppError(error.statusCode, error.response?.data?.message);
    }
  }

  async createInvoiceReservedAccount(id) {
    try {
      const user = await findUserById(id);

      const { userName, email } = user;
      const response = await this.monnifyProvider.createInvoiceReservedAccount(
        userName,
        email,
        userName
      );

      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new AppError(
          Number(error.response?.status),
          error.response?.data?.error_description
        );
      }
      throw new AppError(error.statusCode, error.response?.data?.message);
    }
  }
}

module.exports = { MonnifyService };

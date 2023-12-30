const { injectable, container } = require("tsyringe");

const { MonnifyService } = require("../services/monify");

class MonnifyController {
  constructor() {
    this.monnifyService = container.resolve(MonnifyService);
  }

  generateToken = async (req, res, next) => {
    try {
      const response = await this.monnifyService.generateToken();

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { MonnifyController };

const express = require("express");
const { container } = require("tsyringe");

const { MonnifyController } = require("../../controllers/monify");
const { isAuthenticated } = require("../../middlewares/auth");

const monifyController = container.resolve(MonnifyController);

const { Router } = express;

const router = Router();

router.post("/generate-token", monifyController.generateToken);
router.post(
  "/reserved-account",
  isAuthenticated,
  monifyController.createInvoiceReservedAccount
);

module.exports = router;

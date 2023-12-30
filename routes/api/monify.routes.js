const express = require("express");
const { container } = require("tsyringe");

const { MonnifyController } = require("../../controllers/monify");
const { isAuthenticated } = require("../../middlewares/auth");

const monifyController = container.resolve(MonnifyController);

const { generateToken, createInvoiceReservedAccount } = monifyController;

const { Router } = express;

const router = Router();

router.post("/generate-token", generateToken);
router.post("/reserved-account", isAuthenticated, createInvoiceReservedAccount);

module.exports = router;

const express = require("express");
const { container } = require("tsyringe");

const { MonnifyController } = require("../../controllers/monify");

const monifyController = container.resolve(MonnifyController);

const { Router } = express;

const router = Router();

router.post("/generate-token", monifyController.generateToken);

module.exports = router;

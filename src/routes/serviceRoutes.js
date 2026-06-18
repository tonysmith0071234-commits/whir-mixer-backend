const router = require("express").Router();
const serviceAuth = require("../middleware/serviceAuth");
const ctrl = require("../controllers/serviceController");

router.use(serviceAuth);
router.patch("/mixes/:id/status", ctrl.updateStatus);
router.patch("/mixes/:id/deposit-address", ctrl.setDepositAddress);

module.exports = router;

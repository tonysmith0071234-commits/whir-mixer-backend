const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/mixController");
const { BTC_ADDRESS_REGEX, MAX_ADDRESSES, DELAY_VALUES } = require("../config/constants");

router.post(
  "/",
  body("addresses")
    .isArray({ min: 1, max: MAX_ADDRESSES })
    .withMessage(`Provide between 1 and ${MAX_ADDRESSES} addresses`),
  body("addresses.*").matches(BTC_ADDRESS_REGEX).withMessage("Invalid Bitcoin address"),
  body("delay").isIn(DELAY_VALUES).withMessage("Invalid delay option"),
  validate,
  ctrl.createMix
);

router.get("/:id", ctrl.getMix);
router.get("/:id/status", ctrl.getMixStatus);

module.exports = router;

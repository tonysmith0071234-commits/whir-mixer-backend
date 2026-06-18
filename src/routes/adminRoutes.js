const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const ctrl = require("../controllers/adminController");

router.post(
  "/login",
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isString().notEmpty().withMessage("Password required"),
  validate,
  ctrl.login
);

router.use(auth);
router.get("/mixes", ctrl.listMixes);
router.get("/mixes/:id", ctrl.getMix);
router.patch("/mixes/:id", ctrl.updateMix);
router.get("/stats", ctrl.stats);

module.exports = router;

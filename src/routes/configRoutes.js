const router = require("express").Router();
const { getConfig } = require("../controllers/configController");

router.get("/", getConfig);

module.exports = router;

const router = require("express").Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

router.use("/config", require("./configRoutes"));
router.use("/mixes", require("./mixRoutes"));
router.use("/admin", require("./adminRoutes"));
router.use("/service", require("./serviceRoutes"));

module.exports = router;

var router = require("express").Router();
var clearCon = require("../../controllers/clear");

router.get("/", clearCon.clearDB);

module.exports = router;

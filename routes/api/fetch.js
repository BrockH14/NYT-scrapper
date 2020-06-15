var router = require("express").Router();
var fetchCon = require("../../controllers/fetch");

router.get("/", fetchCon.scrapeArticles);

module.exports = router;

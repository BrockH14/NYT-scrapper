var router = require("express").Router();
//conect to the clear coontroller
var fetchController = require("../../controllers/fetch");
//routes for the functions from the clear controller
router.get("/", fetchController.scrapeArticles);
module.exports = router;
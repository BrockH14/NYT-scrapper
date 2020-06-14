var router = require("express").Router();
//conect to the clear coontroller
var clearController = require("../../controllers/clear");
//routes for the functions from the clear controller
router.get("/", clearController.clearDB);
module.exports = router;
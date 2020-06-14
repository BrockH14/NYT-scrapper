var router = require("express").Router();
//conect to the article coontroller
var articleCon = require("../../controllers/article");
//routes for the functions from the article controller
router.get("/", articleCon.findAll);
router.delete("/:id", articleCon.delete);
router.put("/:id", articleCon.update);
module.exports = router;
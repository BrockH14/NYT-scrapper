var router = require("express").Router();
var articleCon = require("../../controllers/article");

router.get("/", articleCon.findAll);
router.delete("/:id", articleCon.delete);
router.put("/:id", articleCon.update);

module.exports = router;

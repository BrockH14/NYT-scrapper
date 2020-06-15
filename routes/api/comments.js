var router = require("express").Router();
var commentCon = require("../../controllers/comment");

router.get("/:id", commentCon.find);
router.post("/", commentCon.create);
router.delete("/:id", commentCon.delete);

module.exports = router;

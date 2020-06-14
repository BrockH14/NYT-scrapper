var router = require("express").Router();
//conect to the note coontroller
var noteController = require("../../controllers/note");
//routes for the functions from the note controller
router.get("/:id", noteController.find);
router.post("/", noteController.create);
router.delete("/:id", noteController.delete);

module.exports = router;
var router = require("express").Router();
//require the fetch.js file in the api folder
var fetchRoutes = require("./fetch");
//require the notes.js file in the api folder
var noteRoutes = require("./notes");
//require the article.js file in the api folder
var articleRoutes = require("./article");
//require the clear.js file in the api folder
var clearRoutes = require("./clear");

//routes for the functions from the fetch connection
router.use("/fetch", fetchRoutes);
//routes for the functions from the note connection
router.use("/notes", noteRoutes);
//routes for the functions from the article connection
router.use("/articles", articleRoutes);
//routes for the functions from the clear connection
router.use("/clear", clearRoutes);

module.exports = router;
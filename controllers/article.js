// Controller for our articles
// ============================
var db = require("../models");

module.exports = {
  // Find all articles, sort them by date, send them back to the user
  findAll: function(req, res) {
    db.Article
      .find(req.query)
      .sort({ date: -1 })
      .then(function(dbArticle) {
        res.json(dbArticle);
      });
  },
  // Delete the specified article
  delete: function(req, res) {
    db.Article.remove({ _id: req.params.id }).then(function(dbArticle) {
      res.json(dbArticle);
    });
  },
  // Update the specified article
  update: function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true }).then(function(dbArticle) {
      res.json(dbArticle);
    });
  }
};

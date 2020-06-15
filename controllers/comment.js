// Controller for our comments
// ========================
var db = require("../models");

module.exports = {
  // Find one comment
  find: function(req, res) {
    db.Comment.find({ _articleId: req.params.id }).then(function(dbComment) {
      res.json(dbComment);
    });
  },
  // Create a new comment
  create: function(req, res) {
    db.Comment.create(req.body).then(function(dbComment) {
      res.json(dbComment);
    });
  },
  // Delete a comment with a given id
  delete: function(req, res) {
    db.Comment.remove({ _id: req.params.id }).then(function(dbComment) {
      res.json(dbComment);
    });
  }
};

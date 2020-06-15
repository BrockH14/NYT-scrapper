// article model
// Require mongoose
var mongoose = require("mongoose");
// Create a schema class using mongoose's schema method
var Schema = mongoose.Schema;
// Create the articleSchema with our schema class
var articleSchema = new Schema({
  // article, a string, must be entered
  article: {
    type: String
  },
  // summary, a string, must be entered
  summary: {
    type: String
  },
  // url, a string, must be entered
  url:{
    type: String
  },
  // date is just a string
  date:{
    type: Date,
    default: Date.now
  },
  // saved, boolean default false
  saved:{
    type: Boolean,
    default: false
  },
});

// Create the Article model using the articleSchema
var Article = mongoose.model("Article", articleSchema);

// Export the Article model
module.exports = Article;

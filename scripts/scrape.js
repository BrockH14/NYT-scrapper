// scrape script
// Require axios and cheerio, making our scrapes possible
var axios = require("axios");
var cheerio = require("cheerio");

// This function will scrape the NYTimes website
var scrape = function() {
  // Scrape the NYTimes website
  return axios.get("https://www.nytimes.com/section/us").then(function(res) {
    var $ = cheerio.load(response.data);
    $("article").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .find("a")
        .text();
      result.link = $(this)
        .find("a")
        .attr("href");
      result.summary = $(this)
        .find("p")
        .text();
      result.image = $(this)
        .find("img")
        .attr("src");
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete");
  });
};

// Export the function, so other files in our backend can use it
module.exports = scrape;
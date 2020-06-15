/* global bootbox */
$(document).ready(function() {
  // Getting a reference to the article container div we will be rendering all articles inside of
  var articleContainer = $(".article-container");
  // Adding event listeners for dynamically generated buttons for deleting articles,
  // pulling up article comments, saving article comments, and deleting article comments
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.comments", handleArticleComments);
  $(document).on("click", ".btn.save", handleCommentSave);
  $(document).on("click", ".btn.comment-delete", handleCommentDelete);
  $(".clear").on("click", handleArticleClear);

  function initPage() {
    // Empty the article container, run an AJAX request for any saved articles
    $.get("/api/articles?saved=true").then(function(data) {
      articleContainer.empty();
      // If we have articles, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Otherwise render a message explaining we have no articles
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articleCards = [];
    // We pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    articleContainer.append(articleCards);
  }

  function createCard(art) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", art.url)
          .text(art.article),
        $("<a class='btn btn-danger delete'>Delete From Saved</a>"),
        $("<a class='btn btn-info comments'>Comments</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(art.summary);

    card.append(cardHeader, cardBody);

    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to remove or open comments for
    card.data("_id", art._id);
    // We return the constructed card jQuery element
    return card;
  }

  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>Would You Like to Browse Available Articles?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function renderCommentList(data) {
    // This function handles rendering comment list items to our comments modal
    // Setting up an array of comments to render after finished
    // Also setting up a currentComment variable to temporarily store each comment
    var commentsToRender = [];
    var currentComment;
    if (!data.comments.length) {
      // If we have no comments, just display a message explaining this
      currentComment = $("<li class='list-group-item'>No Comments for this article yet.</li>");
      commentsToRender.push(currentComment);
    } else {
      // If we do have comments, go through each one
      for (var i = 0; i < data.comments.length; i++) {
        // Constructs an li element to contain our commentText and a delete button
        currentComment = $("<li class='list-group-item comment'>")
          .text(data.comments[i].commentText)
          .append($("<button class='btn btn-danger comment-delete'>x</button>"));
        // Store the comment id on the delete button for easy access when trying to delete
        currentComment.children("button").data("_id", data.comments[i]._id);
        // Adding our currentComment to the commentsToRender array
        commentsToRender.push(currentComment);
        console.log(data.comments[i].commentText);
      }
    }
    // Now append the commentsToRender to the comment-container inside the comment modal
    $(".comment-container").append(commentsToRender);
  }

  function handleArticleDelete() {
    // This function handles deleting articles/headlines
    // We grab the id of the article to delete from the card element the delete button sits inside
    var articleToDelete = $(this)
      .parents(".card")
      .data();
    // Remove card from page
    $(this)
      .parents(".card")
      .remove();
    // Using a delete method here just to be semantic since we are deleting an article/headline
    $.ajax({
      method: "DELETE",
      url: "/api/articles/" + articleToDelete._id
    }).then(function(data) {
      // If this works out, run initPage again which will re-render our list of saved articles
      if (data.ok) {
        initPage();
      }
    });
  }
  function handleArticleComments(event) {
    // This function handles opening the comments modal and displaying our comments
    // We grab the id of the article to get comments for from the card element the delete button sits inside
    var currentArticle = $(this)
      .parents(".card")
      .data();
    // Grab any comments with this headline/article id
    $.get("/api/comments/" + currentArticle._id).then(function(data) {
      // Constructing our initial HTML to add to the comments modal
      var modalText = $("<div class='container-fluid text-center'>").append(
        $("<h4>").text("Comments For Article: " + currentArticle._id),
        $("<hr>"),
        $("<ul class='list-group comment-container'>"),
        $("<textarea placeholder='New Comment' rows='4' cols='60'>"),
        $("<button class='btn btn-success save'>Save Comment</button>")
      );
      // Adding the formatted HTML to the comment modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var commentData = {
        _id: currentArticle._id,
        comments: data || []
      };
      // Adding some information about the article and article comments to the save button for easy access
      // When trying to add a new comment
      $(".btn.save").data("article", commentData);
      // renderCommentsList will populate the actual comment HTML inside of the modal we just created/opened
      renderCommentList(commentData);
    });
  }

  function handleCommentSave() {
    // This function handles what happens when a user tries to save a new comment for an article
    // Setting a variable to hold some formatted data about our comment,
    // grabbing the comment typed into the input box
    var commentData;
    var newComment = $(".bootbox-body textarea")
      .val()
      .trim();
    // If we actually have data typed into the comment input field, format it
    // and post it to the "/api/comments" route and send the formatted commentData as well
    if (newComment) {
      commentData = { _articleId: $(this).data("article")._id, commentText: newComment };
      $.post("/api/comments", commentData).then(function() {
        // When complete, close the modal
        bootbox.hideAll();
      });
    }
  }

  function handleCommentDelete() {
    // This function handles the deletion of comments
    // First we grab the id of the comment we want to delete
    // We stored this data on the delete button when we created it
    var commentToDelete = $(this).data("_id");
    // Perform an DELETE request to "/api/comments/" with the id of the comment we're deleting as a parameter
    $.ajax({
      url: "/api/comments/" + commentToDelete,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }

  function handleArticleClear() {
    $.get("api/clear")
      .then(function() {
        articleContainer.empty();
        initPage();
      });
  }
});

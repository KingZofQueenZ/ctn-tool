const express = require("express");
const router = express.Router();
const VerifyToken = require("../../authentication/verifytoken");
const News = require("../../models/news");
const moment = require("moment");

// Events ------------------------
//   route: /api/news
// -------------------------------

// Create news
router.post("/", (request, response) => {
  var body = request.body;
  var news = new News({
    title: body.title,
    content: body.content,
    date: moment().format(),
  });

  News.create(news)
    .then((document) => {
      response.status(200).json(document);
    })
    .catch((err) => {
      response.status(500).send(err);
      return;
    });
});

// Get all news
router.get("/", (request, response) => {
  const page = request.query.page || 1;
  const amount = Number(request.query.amount) || 10;

  News.find()
    .sort("-date")
    .skip(amount * (page - 1))
    .limit(amount)
    .exec()
    .then((documents) => {
      response.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate",
      );
      response.header("Expires", "-1");
      response.header("Pragma", "no-cache");
      response.status(200).json(documents);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

// Get news by id
router.get("/:news_id", (request, response) => {
  News.findById(request.params.news_id)
    .exec()
    .then((document) => {
      if (document) {
        response.header(
          "Cache-Control",
          "private, no-cache, no-store, must-revalidate",
        );
        response.header("Expires", "-1");
        response.header("Pragma", "no-cache");
        response.status(200).json(document);
      } else {
        response
          .status(404)
          .send("News not found, id: " + request.params.event_id);
      }
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

// Update news
router.put("/:news_id", VerifyToken.verifyAdmin, (request, response) => {
  News.findById(request.params.news_id)
    .exec()
    .then((document) => {
      if (document) {
        var body = request.body;
        document.title = body.title || document.title;
        document.content = body.content || document.content;
        document.date = body.date || document.date;

        document
          .save()
          .then((document) => {
            response.status(200).json(document);
          })
          .catch((err) => {
            response.status(500).send(err);
            return;
          });
      } else {
        response
          .status(404)
          .send("News not found, id: " + request.params.event_id);
      }
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

// Delete news
router.delete("/:news_id", VerifyToken.verifyAdmin, (request, response) => {
  News.remove({ _id: request.params.news_id })
    .then(() => {
      response.status(200).send();
    })
    .catch((err) => {
      response.status(500).send(error);
      return;
    });
});

module.exports = router;

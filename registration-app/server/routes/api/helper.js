const express = require('express');
const router = express.Router();
const VerifyToken = require('../../authentication/verifytoken');
const Event = require('../../models/event');

// Events ------------------------
//   route: /api/helper
// -------------------------------

// Handle Helper -----------------------------
// ------------------------------------------

// Get all events-dates
router.get('/event-dates', (request, response) => {
  Event.aggregate([
    {$match: { "date": {"$gte": new Date()}}},
    {$sort: { "date": 1}},
    {$group: 
      {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" }},
        count: {$sum: 1}
      }
    }
  ]).exec()
  .then((documents) => {
    response.status(200).json(documents);
  })
  .catch((error) => {
    response.status(500).send(error);
  })
});

module.exports = router;
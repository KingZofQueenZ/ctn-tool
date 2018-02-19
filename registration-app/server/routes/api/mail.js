const express = require('express');
const router = express.Router();
const sendgrid = require('sendgrid')('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')

// Events ------------------------
//   route: /api/mail
// -------------------------------

// Get all events-dates
router.post('/register', (request, response) => {
  const email = new sendgrid.Email();
});

module.exports = router;
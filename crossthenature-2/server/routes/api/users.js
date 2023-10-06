const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const config = require("../../config/index");
const randomstring = require("randomstring");
const moment = require("moment");
const VerifyToken = require("../../authentication/verifytoken");
const User = require("../../models/user");
const Event = require("../../models/event");
const mailer = require("../../config/mailer");
const request = require("request");
const config = require("../config/index");

// Users ------------------------
//   route: /api/users
// ------------------------------

// Public Routes ----------------
// ------------------------------

// Authenticate user
router.post("/authenticate", (request, response) => {
  var body = request.body;

  User.findOne({ email: body.email })
    .then((user) => {
      if (!user) {
        response.status(404).send("User not found, email: " + body.email);
        return;
      }

      if (
        user &&
        user.activated &&
        bcrypt.compareSync(body.password, user.password)
      ) {
        var authenticatedUser = {
          _id: user._id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          token: jwt.sign(
            { sub: user._id, admin: user.admin },
            config.auth.secret,
            { expiresIn: "14d" },
          ),
          admin: user.admin,
        };

        response.status(200).send(authenticatedUser);
      } else {
        response
          .status(401)
          .send("User authentication failed, email: " + body.email);
      }
    })
    .catch((err) => {
      response.status(500).send(err);
      return;
    });
});

// Refresh Token
router.post("/refresh", VerifyToken.verify, (request, response) => {
  var body = request.body;
  User.findOne({ email: body.email })
    .then((user) => {
      if (!user) {
        response.status(404).send("User not found, email: " + body.email);
        return;
      }

      if (user && user.activated) {
        var authenticatedUser = {
          _id: user._id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          token: jwt.sign(
            { sub: user._id, admin: user.admin },
            config.auth.secret,
            { expiresIn: "14d" },
          ),
          admin: user.admin,
        };

        response.status(200).send(authenticatedUser);
      } else {
        response
          .status(401)
          .send("User authentication failed, email: " + body.email);
      }
    })
    .catch((err) => {
      response.status(500).send(err);
      return;
    });
});

// Create user
router.post("/", (req, response) => {
  var body = req.body;
  var newUser = new User({
    firstname: body.firstname,
    lastname: body.lastname,
    phone: body.phone,
    email: body.email,
    password: body.password,
    activated: false,
    activation_code: randomstring.generate(7),
  });

  const verificationURL =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    config.captcha.secretKey +
    "&response=" +
    body.captchaToken;

  // Verify Captcha with Google
  request(verificationURL, function (error, res, body) {
    body = JSON.parse(body);

    if (body.success !== undefined && !body.success) {
      return response.status(500).send("Failed captcha verification");
    }

    User.create(newUser)
      .then(() => {
        var locals = {
          email: newUser.email,
          subject: "Registrierung bestätigen",
          firstname: newUser.firstname,
          url:
            "http://www.crossthenature.ch/activate/" + newUser.activation_code,
        };
        //mailer.sendMail('registration', locals);

        response.status(200).send("User created successfully");
      })
      .catch((err) => {
        response.status(500).send(err);
        return;
      });
  });
});

router.put("/activate/:code", (request, response) => {
  User.findOne({ activation_code: request.params.code })
    .then((document) => {
      if (!document || document.activated) {
        response
          .status(404)
          .send("User not found, _id: " + request.params.user_id);
        return;
      }

      document.activated = true;
      document.activation_code = "";
      document
        .save()
        .then(() => {
          response.status(200).send({ activated: true });
        })
        .catch((err) => {
          response.send(error);
          return;
        });
    })
    .catch((err) => {
      response.status(500).send(err);
      return;
    });
});

router.put("/reset", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((document) => {
      if (!document) {
        response
          .status(404)
          .send("User not found, email: " + request.body.email);
        return;
      }

      const newPW = randomstring.generate(7);

      document.password = newPW;

      document
        .save()
        .then(() => {
          var locals = {
            email: request.body.email,
            subject: "Neues Passwort",
            password: newPW,
          };
          //mailer.sendMail('password', locals);

          response.status(200).send({ reset: true });
        })
        .catch((err) => {
          response.status(500).send(err);
          return;
        });
    })
    .catch((err) => {
      response.status(500).send(err);
      return;
    });
});

router.put("/changepassword", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((document) => {
      if (!document) {
        response
          .status(404)
          .send("User not found, email: " + request.body.email);
        return;
      }

      if (!bcrypt.compareSync(request.body.password, document.password)) {
        response.status(500).send("Old password is wrong");
        return;
      }

      const newPW = request.body.newpassword;

      document.password = newPW;

      document
        .save()
        .then(() => {
          response.status(200).send();
        })
        .catch((err) => {
          response.send(error);
          return;
        });
    })
    .catch((err) => {
      console.log(err);
      response.status(500).send(err);
      return;
    });
});

// Contact Form ----------------------
// -----------------------------------

// Send Contact Form
router.post("/contact", (request, response) => {
  var body = request.body;

  var locals = {
    email: body.email,
    name: body.name,
    message: body.message,
    emailTo: "cedrauber@hotmail.com",
    subject: "CTN - Kontaktformular ausgefüllt",
  };

  if (mailer.sendContactForm(locals)) {
    response.status(200).send("Mail sent");
  } else {
    response.status(500).send("Mail not sent");
  }
});

// Secured Routes --------------------
// -----------------------------------

// Get all users
router.get("/", VerifyToken.verifyAdmin, (request, response) => {
  User.find({})
    .select({ password: 0, __v: 0 })
    .sort({ lastname: 1, firstname: 1 })
    .exec((error, documents) => {
      if (error) {
        response.status(500).send(error);
        return;
      }

      response.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate",
      );
      response.header("Expires", "-1");
      response.header("Pragma", "no-cache");
      response.status(200).json(documents);
    });
});

// Get user by {user_id}
router.get("/:user_id", VerifyToken.verifyUser, (request, response) => {
  User.findById(request.params.user_id)
    .select({ _id: 0, password: 0, __v: 0 })
    .exec((error, document) => {
      if (error) {
        response.status(500).send(error);
        return;
      }

      if (!document) {
        response
          .status(404)
          .send("User not found, _id: " + request.params.user_id);
        return;
      }

      response.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate",
      );
      response.header("Expires", "-1");
      response.header("Pragma", "no-cache");
      response.status(200).json(document);
    });
});

// Update user
router.put("/:user_id", VerifyToken.verifyUser, (request, response) => {
  var body = request.body;

  User.findById(request.params.user_id)
    .then((document) => {
      if (!document) {
        response.status(404).send("User not found, _id: " + request.body._id);
        return;
      }

      document.firstname = body.firstname || document.firstname;
      document.lastname = body.lastname || document.lastname;
      document.phone = body.phone || document.phone;
      document.email = body.email || document.email;
      document.password = body.password || document.password;

      document
        .save()
        .then(() => {
          response.status(200).send("User updated sucessfully");
        })
        .catch((err) => {
          response.status(500).send(err);
          return;
        });
    })
    .catch((err) => {
      response.status(500).send(err);
      return;
    });
});

// Delete user
router.delete("/:user_id", VerifyToken.verifyAdmin, (request, response) => {
  User.remove({ _id: request.params.user_id }, (error, document) => {
    if (error) {
      response.status(500).send(error);
      return;
    }

    if (!document.n) {
      response
        .status(404)
        .send("User not found, _id: " + request.params.user_id);
      return;
    }

    response.status(200).send("User deleted sucessfully");
  });
});

// Get upcoming all events for a user
router.get("/:user_id/events", VerifyToken.verifyUser, (request, response) => {
  const page = request.query.page || 1;
  const amount = Number(request.query.amount) || 20;

  Event.find({
    participant_ids: request.params.user_id,
    date: { $gte: moment().subtract(1, "hours").format() },
  })
    .populate("participant_ids", "firstname lastname")
    .sort("date")
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

module.exports = router;

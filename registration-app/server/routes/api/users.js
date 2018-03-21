const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../../config/index');
const randomstring = require("randomstring");

const VerifyToken = require('../../authentication/verifytoken');
const User = require('../../models/user');
const Event = require('../../models/event');
const mailer = require('../../config/mailer');

// Users ------------------------
//   route: /api/users
// ------------------------------

// Public Routes ----------------
// ------------------------------

// Authenticate user
router.post('/authenticate', (request, response) => {
  var body = request.body;
  User.findOne({ email: body.email }, (error, user) => {
    if(error) {
      response.status(500).send(error);
      return;
    }

    if(!user) {
      response.status(404).send('User not found, email: ' +  body.email);
      return;
    }

    if (user && user.activated && bcrypt.compareSync(body.password, user.password)) {
      var authenticatedUser = {
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        token: jwt.sign({ sub: user._id, admin: user.admin }, config.auth.secret, { expiresIn: '14d'}),
        admin: user.admin
      };  

      response.status(200).send(authenticatedUser);
    } else {
        response.status(401).send('User authentication failed, email: ' +  body.email);
    }
  });
});

// Create user
router.post('/', (request, response) => {
  var body = request.body;
  var newUser = new User({
    firstname: body.firstname,
    lastname: body.lastname,
    phone: body.phone,
    email: body.email,
    password: body.password,
    activated: false,
    activation_code: randomstring.generate(7)
  });

  User.create(newUser, (error, document) => {
    if(error) {
      response.status(500).send(error);
      return;
    }

    var locals = {
      email: newUser.email,
      subject: 'Registrierung bestätigen',
      firstname: newUser.firstname,
      url: 'http://ctn.musca.uberspace.de/activate/' + newUser.activation_code
    };
    mailer.sendMail('registration', locals);

    response.status(200).send("User created successfully");
  });
});

router.put('/activate/:code', (request, response) => {
  User.findOne({activation_code: request.params.code})
    .exec((error, document) => {
      if(error) {
        response.status(500).send(error);
        return;
      }
      
      if(!document || document.activated) {
        response.status(404).send('User not found, _id: ' +  request.params.user_id);
        return;
      }

      document.activated = true;
      document.activation_code = "";
      document.save((error, document) => {
        if(error) {
          response.send(error);
          return;
        }
        response.status(200).send({activated: true});
      });
    });

});

router.put('/reset', (request, response) => {
  User.findOne({email: request.body.email})
    .exec((error, document) => {
      if(error) {
        response.status(500).send(error);
        return;
      }
      
      if(!document) {
        response.status(404).send('User not found, email: ' +  request.body.email);
        return;
      }

      const newPW = randomstring.generate(7);

      document.password = newPW;
      document.save((error, document) => {
        if(error) {
          response.status(500).send(error);
          return;
        }

        var locals = {
          email: request.body.email,
          subject: 'Neues Passwort',
          password: newPW,
        };
        mailer.sendMail('password', locals);

        response.status(200).send({reset: true});
      });
    });
});

router.put('/changepassword', (request, response) => {
  console.log(request.body.email, request.body.password, request.body.newpassword)
  User.findOne({email: request.body.email})
    .exec((error, document) => {
      if(error) {
        response.status(500).send(error);
        return;
      }
      
      if(!document) {
        response.status(404).send('User not found, email: ' +  request.body.email);
        return;
      }
      
      if(!bcrypt.compareSync(request.body.password, document.password)) {
        response.status(500).send('Old password is wrong');
        return;
      }

      const newPW = request.body.newpassword

      document.password = newPW;
      document.save((error, document) => {
        if(error) {
          response.status(500).send(error);
          return;
        }

        response.status(200).send();
      });
    });
});

// Secured Routes --------------------
// -----------------------------------

// Get all users
router.get('/', VerifyToken.verifyAdmin, (request, response) => {
  User.find({})
    .select({"password": 0, "__v": 0})
    .sort({lastname: 1, firstname: 1})
    .exec((error, documents) => {
      if(error) {
        response.status(500).send(error);
        return;
      }

      response.status(200).json(documents);
    });
});

// Get user by {user_id}
router.get('/:user_id', VerifyToken.verifyUser, (request, response) => {
  User.findById(request.params.user_id)
    .select({ "_id": 0, "password": 0, "__v": 0 })
    .exec((error, document) => {
      if(error) {
        response.status(500).send(error);
        return;
      }
      
      if(!document) {
        response.status(404).send('User not found, _id: ' +  request.params.user_id);
        return;
      }

      response.status(200).json(document);
    });
});

// Update user
router.put('/:user_id', VerifyToken.verifyUser, (request, response) => {
  var body = request.body;
  User.findById(request.params.user_id)
    .exec((error, document) => {
      if(error) {
        response.status(500).send(error);
        return;
      }

      if(!document) {
        response.status(404).send('User not found, _id: ' +  request.body._id);
        return;
      }

      document.firstname = body.firstname || document.firstname;
      document.lastname = body.lastname || document.lastname;
      document.phone = body.phone || document.phone;
      document.email = body.email || document.email;
      document.password = body.password || document.password;

      document.save((error, document) => {
        if(error) {
          response.send(error);
          return;
        }

        response.status(200).send("User updated sucessfully");
      });
    });
});

// Delete user
router.delete('/:user_id', VerifyToken.verifyAdmin, (request, response) => {
  User.remove({_id: request.params.user_id}, (error, document) => {
    if(error) {
      response.status(500).send(error);
      return;
    }

    if(!document.n){
      response.status(404).send('User not found, _id: ' +  request.params.user_id);
      return;
    }

    response.status(200).send("User deleted sucessfully");
  });
});

// Get upcoming all events for a user
router.get('/:user_id/events', VerifyToken.verifyUser, (request, response) => {
  console.log(new Date(Date.now()).toISOString());
  Event.find({participant_ids: request.params.user_id, date: {"$gte": new Date(Date.now()).toISOString()}})
      .select({ "_id": 0, "password": 0, "__v": 0, "allow_trials:": 0 })
      .sort('date')
      .populate('participant_ids', 'firstname lastname -_id')
      .exec((error, document) => {
        if(error) {
          response.status(500).send(error);
          return;
        }

        response.status(200).json(document);
      });
});

module.exports = router;

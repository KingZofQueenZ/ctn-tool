const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../models/user')

/* Users
  route: /api/users
*/

// Authenticate user
router.post('/authenticate', (request, response) => {
  var body = request.body;
  User.findOne({ email: body.email }, (error, user) => {
    if(error) {
      console.log('Error in POST authenticate /users', error);
      response.status(500).send(error);
      return;
    }

    if(user == undefined) {
      console.log('User not found, email:', body.email);
      response.status(404).send('User not found, email: ' +  body.email);
      return;
    }

    if (user && bcrypt.compareSync(body.password, user.password)) {
      // authentication successful
      var authenticatedUser = {
        _id: user._id,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        token: jwt.sign({ sub: user._id }, 'lololol', { expiresIn: '14d'})
      };

      console.log("User authenticated", authenticatedUser);
      response.status(200).send(authenticatedUser);
    } else {
        // authentication failed
        console.log('User authentication failed, email: ' +  body.email);
        response.status(401).send('User authentication failed, email: ' +  body.email);
    }
  });
});

// Get all users
router.get('/', (request, response) => {
  User.find({})
    .sort({lastname: 1, firstname: 1})
    .exec((error, documents) => {
      if(error) {
        console.log('Error in GET /users', error);
        response.status(500).send(error);
        return;
      }

      console.log('GET /users successfull');
      response.status(200).json(documents);
    });
});

// Get user by id
router.get('/:user_id', (request, response) => {
  User.findById(request.params.user_id, (error, document) => {
      if(document == undefined) {
        console.log('User not found, id:', request.params.user_id);
        response.status(404).send('User not found, id: ' +  request.params.user_id);
        return;
      }
    })
    .exec((error, document) => {
      if(error) {
        console.log('Error in GET /users by id', error);
        response.status(500).send(error);
        return;
      }

      console.log('GET /users by id successfull');
      response.status(200).json(document);
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
    password: body.password
  });

  User.create(newUser, (error, document) => {
    if(error) {
      console.log('Error in POST /users', error);
      response.status(500).send(error);
      return;
    }

    console.log('POST /users successfull');
    response.status(200).json(document);
  });
});

// Update user
router.put('/', (request, response) => {
  var body = request.body;
  User.findOne({ _id: body._id }, (error, document) => {
    if(error) {
      console.log('Error in PUT find /users', error);
      response.status(500).send(error);
      return;
    }

    if(document === null) {
      console.log('User not found, id:', request.body._id);
      response.status(404).send('User not found, id: ' +  request.body._id);
      return;
    }

    document.firstname = body.firstname || document.firstname;
    document.lastname = body.lastname || document.lastname;
    document.phone = body.phone || document.phone;
    document.email = body.email || document.email;
    document.password = body.password || document.password;

    document.save((error, document) => {
      if(error) {
        console.log('Error in PUT save /users', error);
        response.send(error);
        return;
      }

      console.log('PUT /users successfull');
      response.status(200).json(document);
    });
  });
});

// Delete user
router.delete('/:user_id', (request, response) => {
  User.remove({_id: request.params.user_id}, (error, document) => {
    if(error) {
      console.log('Error in DELETE /users', error);
      response.status(500).send(error);
      return;
    }

    response.status(200).send();
  });
});

module.exports = router;

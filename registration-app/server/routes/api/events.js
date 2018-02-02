const express = require('express');
const router = express.Router();
const VerifyToken = require('../../authentication/verifytoken');
const Event = require('../../models/event');

// Events ------------------------
//   route: /api/events
// -------------------------------

// Handle Event ------ ----------------------
// ------------------------------------------
Event.exec = function(callback) {
  process.nextTick(function() {
    callback(new Error('this is an error'));
  });
};


// Create events
router.post('/', VerifyToken.verifyAdmin, (request, response) => {
  var body = request.body;
  var newEvent = new Event({
    name: body.name,
    description: body.description,
    max_participants: body.max_participants,
    date: body.date,
    time_to: body.time_to,
    sign_in: body.sign_in,
    sign_out: body.sign_out,
    allow_trials: body.allow_trials
  });

  Event.create(newEvent, (error, document) => {
    if(error) {
      response.status(500).send(error);
      return;
    }

    response.status(200).json(document);
  });
});

// Get all events
router.get('/', VerifyToken.verify, (request, response) => {
  Event.find({}).populate('participant_ids', 'firstname lastname').sort('date')
    .exec()
    .then((documents) => {
      response.status(200).json(documents);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

// Get event by id
router.get('/:event_id', VerifyToken.verify, (request, response) => {
  Event.findById(request.params.event_id)
    .populate('participant_ids', 'firstname lastname')
    .exec()
    .then((document) => {
      if(document) {
        response.status(200).json(document)
      } else {
        response.status(404).send('Event not found, id: ' +  request.params.event_id);
      }
    })
    .catch((error) => {
      response.status(500).send(error);
    })
});

// Update event
router.put('/:event_id', VerifyToken.verifyAdmin, (request, response) => {
  Event.findById(request.params.event_id)
    .exec()
    .then((document) => {
      if(document) {
        var body = request.body;
        document.name = body.name || document.name;
        document.description = body.description || document.description;
        document.max_participants = body.max_participants || document.max_participants;
        document.date = body.date || document.date;
        document.time_to = body.time_to || document.time_to;
        document.sign_in = body.sign_in || document.sign_in;
        document.sign_out = body.sign_out || document.sign_out;
        document.allow_trials = body.allow_trials || document.allow_trials;

        return document.save((error, document) => {
          if(error) {
            response.send(error);
            return;
          }

          response.status(200).json(document);
        });
      }
      else {
        response.status(404).send('Event not found, id: ' +  request.params.event_id);
      }
   })
   .catch((error) => {
     response.status(500).send(error);
   });
});

// Delete event
router.delete('/:event_id', VerifyToken.verifyAdmin, (request, response) => {
  Event.remove({_id: request.params.event_id}, (error, document) => {
    if(error) {
      response.status(500).send(error);
      return;
    }

    response.status(200).send();
  });
});

// Handle Event-Participants ----------------
// ------------------------------------------

// Add user or trial user to event
router.post('/:event_id/participants', VerifyToken.verify, (request, response) => {
  Event.findById(request.params.event_id)
    .exec((error, document) => {
      if(error) {
        response.status(500).send(error);
        return;
      }

      if(!document) {
        response.status(404).send('Event not found, id: ' +  request.body._id);
        return;
      }

      // Add to participants of event
      if(request.body._id) {
        document.participant_ids.push(request.body._id);
      }

      // Add to trial workouts of event
      if(request.body.name) {
        document.trial_workouts.push({
          name: body.name,
          phone: body.phone
        });
      }

      document.save((error, document) => {
        if(error) {
          response.status(500).send(error);
          return;
        }

        response.status(200).json(document);
      });
    });
});

// Delete user or trial user from event
router.delete('/:event_id/participants/:user_id', VerifyToken.verifyUser, (request, response) => {
  Event.findById(request.params.event_id)
    .exec((error, document) => {
      if(error) {
        response.status(500).send(error);
        return;
      }

      if(!document) {
        response.status(404).send('Event not found, id: ' +  request.params.user_id);
        return;
      }

      var indexToDelete = document.participant_ids.indexOf(request.params.user_id);
      if(indexToDelete !== -1)
        document.participant_ids.splice(indexToDelete, 1);

      var trialWorkoutToDelete = document.trial_workouts.id(request.params.user_id);
      if(trialWorkoutToDelete)
        trialWorkoutToDelete.remove();

      document.save((error, document) => {
        if(error) {
          response.status(500).send(error);
          return;
        }

        response.status(200).json(document);
      });
    });
});

module.exports = router;


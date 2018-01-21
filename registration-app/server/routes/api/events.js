const express = require('express');
const router = express.Router();
const Event = require('../../models/event')

/* Events
  route: /api/events
*/

// Get all events
router.get('/', (request, response) => {
  Event.find({})
    .populate('participant_ids')
    .sort('-date')
    .exec((error, documents) => {
      if(error) {
        console.log('Error in GET /events', error);
        response.status(500).send(error);
        return;
      }

      console.log('GET /events successfull');
      response.status(200).json(documents);
    });
});

// Get event by id
router.get('/:event_id', (request, response) => {
  Event.findById(request.params.event_id, (error, document) => {
      if(document == undefined) {
        console.log('Event not found, id:', request.params.event_id);
        response.status(404).send('Event not found, id: ' +  request.params.event_id);
        return;
      }
    })
    .populate('participant_ids')
    .exec((error, document) => {
      if(error) {
        console.log('Error in GET /events by id', error);
        response.status(500).send(error);
        return;
      }

      console.log('GET /events by id successfull');
      response.status(200).json(document);
    });
});

// Create events
router.post('/', (request, response) => {
  var body = request.body;
  var newEvent = new Event({
    name: body.name,
    description: body.description,
    max_participants: body.max_participants,
    date: body.date,
    sign_in: body.sign_in,
    sign_out: body.sign_out,
    allow_trials: body.allow_trials
  });

  Event.create(newEvent, (error, document) => {
    if(error) {
      console.log('Error in POST /events', error);
      response.status(500).send(error);
      return;
    }

    console.log('POST /events successfull');
    response.status(200).json(document);
  });
});

// Update event
router.put('/', (request, response) => {
  var body = request.body;
  Event.findOne({ _id: body._id }, (error, document) => {
    if(error) {
      console.log('Error in PUT find /events', error);
      response.status(500).send(error);
      return;
    }

    if(document === null) {
      console.log('Event not found, id:', request.body._id);
      response.status(404).send('Event not found, id: ' +  request.body._id);
      return;
    }

    document.name = body.name || document.name;
    document.description = body.description || document.description;
    document.max_participants = body.max_participants || document.max_participants;
    document.date = body.date || document.date;
    document.sign_in = body.sign_in || document.sign_in;
    document.sign_out = body.sign_out || document.sign_out;
    document.allow_trials = body.allow_trials || document.allow_trials;

    document.save((error, document) => {
      if(error) {
        console.log('Error in PUT save /events', error);
        response.send(error);
        return;
      }

      console.log('PUT /events successfull');
      response.status(200).json(document);
    });
  });
});

// Delete event
router.delete('/:event_id', (request, response) => {
  Event.remove({_id: request.params.event_id}, (error, document) => {
    if(error) {
      console.log('Error in DELETE /events', error);
      response.status(500).send(error);
      return;
    }

    response.status(200).send();
  });
});

// Add user or trial user to event
router.post('/participants', (request, response) => {
  var body = request.body;
  Event.findOne({ _id: body._id }, (error, document) => {
    if(error) {
      console.log('Error in PUT find /events/participants', error);
      response.status(500).send(error);
      return;
    }

    if(document === null) {
      console.log('Event not found, id:', request.body._id);
      response.status(404).send('Event not found, id: ' +  request.body._id);
      return;
    }

    if(body.user_id) {
      document.participant_ids.push(body.user_id);
    }

    if(body.name) {
      document.trial_workouts.push({
        name: body.name,
        phone: body.phone
      });
    }

    document.save((error, document) => {
      if(error) {
        console.log('Error in PUT save /events/participants', error);
        response.status(500).send(error);
        return;
      }

      console.log('PUT /events/participants successfull');
      response.status(200).json(document);
    });
  });
});

// Delete user or trial user from event
router.delete('/participants/:user_id', (request, response) => {
  var userToDelete = request.params.user_id;
  Event.findOne({ _id: request.body._id }, (error, document) => {
    if(error) {
      console.log('Error in DELETE find /events/participants', error);
      response.status(500).send(error);
      return;
    }

    if(document === null) {
      console.log('Event not found, id:', request.body._id);
      response.status(404).send('Event not found, id: ' +  request.body._id);
      return;
    }

    var indexToDelete = document.participant_ids.indexOf(userToDelete);
    if(indexToDelete !== -1)
      document.participant_ids.splice(indexToDelete, 1);

    var trialWorkoutToDelete = document.trial_workouts.id(userToDelete);
    if(trialWorkoutToDelete)
      trialWorkoutToDelete.remove();

    document.save((error, document) => {
      if(error) {
        console.log('Error in DELETE /events/participants', error);
        response.status(500).send(error);
        return;
      }

      console.log('DELETE /events/participants successfull');
      response.status(200).json(document);
    });
  });
});

module.exports = router;


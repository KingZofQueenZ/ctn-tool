const express = require("express");
const router = express.Router();
const VerifyToken = require("../../authentication/verifytoken");
const Event = require("../../models/event");
const moment = require("moment");

// Events ------------------------
//   route: /api/events
// -------------------------------

// Handle Event ------ ----------------------
// ------------------------------------------
Event.exec = function (callback) {
  process.nextTick(function () {
    callback(new Error("this is an error"));
  });
};

// Create events
router.post("/", VerifyToken.verifyAdmin, (request, response) => {
  var body = request.body;
  var newEvent = new Event({
    name: body.name,
    description: body.description,
    max_participants: body.max_participants,
    date: body.date,
    time_from: body.time_from,
    time_to: body.time_to,
    sign_in: body.sign_in,
    sign_out: body.sign_out,
    allow_trials: body.allow_trials,
  });

  Event.create(newEvent)
    .then((document) => {
      response.status(200).json(document);
    })
    .catch((err) => {
      response.status(500).send(err);
      return;
    });
});

// Get all events
router.get("/", (request, response) => {
  const page = request.query.page || 1;
  const amount = Number(request.query.amount) || 40;

  Event.find({ date: { $gte: moment().subtract(1, "hours").format() } })
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

// Get event by id
router.get("/:event_id", (request, response) => {
  Event.findById(request.params.event_id)
    .populate("participant_ids", "firstname lastname")
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
          .send("Event not found, id: " + request.params.event_id);
      }
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

// Update event
router.put("/:event_id", VerifyToken.verifyAdmin, (request, response) => {
  Event.findById(request.params.event_id)
    .exec()
    .then((document) => {
      if (document) {
        var body = request.body;
        document.name = body.name;
        document.description = body.description;
        document.max_participants = body.max_participants;
        document.date = body.date || document.date;
        document.time_from = body.time_from || document.time_from;
        document.time_to = body.time_to;
        document.sign_in = body.sign_in;
        document.sign_out = body.sign_out;
        document.allow_trials = body.allow_trials || document.allow_trials;

        document
          .save()
          .then(() => {
            response.status(200).send(document);
          })
          .catch((err) => {
            response.status(500).send(err);
            return;
          });
      } else {
        response
          .status(404)
          .send("Event not found, id: " + request.params.event_id);
      }
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

// Delete event
router.delete("/:event_id", VerifyToken.verifyAdmin, (request, response) => {
  Event.deleteOne({ _id: request.params.event_id })
    .then(() => {
      response.status(200).send("Event deleted sucessfully");
    })
    .catch((err) => {
      response.status(500).send(error);
      return;
    });
});

// Handle Event-Participants ----------------
// ------------------------------------------

// Add user to event
router.post(
  "/:event_id/participants",
  VerifyToken.verify,
  (request, response) => {
    Event.findById(request.params.event_id)
      .then((document) => {
        if (!document) {
          response.status(404).send("Event not found, id: " + request.body._id);
          return;
        }

        // Add to participants of event
        if (request.body._id) {
          if (document.participant_ids.indexOf(request.body._id) === -1) {
            document.participant_ids.push(request.body._id);
          } else {
            // Array already contains user
            response
              .status(405)
              .send("User already registered for this Event!");
            return;
          }
        }

        document
          .save()
          .then(() => {
            response.status(200).send(document);
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
  },
);

// Add trial user to event
router.post("/:event_id/trialparticipants", (request, response) => {
  Event.findById(request.params.event_id)
    .then((document) => {
      if (!document) {
        response.status(404).send("Event not found, id: " + request.body._id);
        return;
      }

      // Add to participants of event
      if (request.body.firstname) {
        // Add to trial workouts of event
        document.trial_workouts.push({
          firstname: request.body.firstname,
          lastname: request.body.lastname,
          phone: request.body.phone,
        });
      }

      document
        .save()
        .then(() => {
          response.status(200).send(document);
        })
        .catch((err) => {
          response.status(500).send(err);
          return;
        });
    })
    .catch((err) => {
      response.status(500).send(error);
      return;
    });
});

// Delete user or trial user from event
router.delete(
  "/:event_id/participants/:user_id",
  VerifyToken.verifyUser,
  (request, response) => {
    Event.findById(request.params.event_id)
      .then((document) => {
        if (!document) {
          response
            .status(404)
            .send("Event not found, id: " + request.params.user_id);
          return;
        }

        if (document.sign_out && moment().isAfter(moment(document.sign_out))) {
          response.status(500).send("Sign out date reached");
          return;
        }

        if (document.date < moment().format()) {
          response.status(500).send("Event already started");
          return;
        }

        var indexToDelete = document.participant_ids.indexOf(
          request.params.user_id,
        );
        if (indexToDelete !== -1)
          document.participant_ids.splice(indexToDelete, 1);

        var trialWorkoutToDelete = document.trial_workouts.id(
          request.params.user_id,
        );
        if (trialWorkoutToDelete) trialWorkoutToDelete.remove();

        document
          .save()
          .then(() => {
            response.status(200).send(document);
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
  },
);

// Delete user or trial user from event (Admin - no time check)
router.delete(
  "/:event_id/participants-admin/:user_id",
  VerifyToken.verifyAdmin,
  (request, response) => {
    Event.findById(request.params.event_id)
      .then((document) => {
        if (!document) {
          response
            .status(404)
            .send("Event not found, id: " + request.params.user_id);
          return;
        }

        var indexToDelete = document.participant_ids.indexOf(
          request.params.user_id,
        );
        if (indexToDelete !== -1)
          document.participant_ids.splice(indexToDelete, 1);

        var trialWorkoutToDelete = document.trial_workouts.id(
          request.params.user_id,
        );
        if (trialWorkoutToDelete) trialWorkoutToDelete.remove();

        document
          .save()
          .then(() => {
            response.status(200).send(document);
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
  },
);

module.exports = router;

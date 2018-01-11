const express = require('express');
const router = express.Router();

// mongoose setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/heroes', { useMongoClient: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Sucessfully connected to MongoDB");
});

// mongoose schemas
var heroSchema = mongoose.Schema({
	name: String,
	id: Number,
});
var Hero = mongoose.model('Hero', heroSchema); 

// ---- GET ----

// GET api listing. 
router.get('/', (req, res) => {
  res.send('api works');
});

// Get all heroes
router.get('/heros', (req, res) => {
  Hero.find(function(err, heros) {
	// if there is an error retrieving, send the error. nothing after res.send(err) will execute
	if (err){
		res.send(err);
		console.log("Get Error");
	}
	console.log("Get Successful");
	res.json(heros); // return all todos in JSON format
  });
});

// Get one heroes
router.get('/heros/:hero_id', (req, res) => {
  Hero.findOne({_id: req.params.hero_id}, function(err, heros) {
	// if there is an error retrieving, send the error. nothing after res.send(err) will execute
	if (err){
		console.log("Get Error");
		res.send(err);
	}
	console.log("Get Successful");
	res.json(heros); // return all todos in JSON format
  });
});

// ---- POST ----

// Post new hero
router.post('/heros', (req, res) => {
  var newHero = new Hero({ name: req.body.name})
  
  Hero.create(newHero, function (err, hero) {
	  if (err) return handleError(err);
	  console.log("Post Successful");
	  res.json(hero);
  });
});

// ---- UPDATE ----

// Put new hero
router.put('/heros', (req, res) => {
	console.log(req.body._id);
  
  Hero.findOne({_id: req.body._id}, function(err, hero) {
	// if there is an error retrieving, send the error. nothing after res.send(err) will execute
	if (err){
		res.status(500).send(err);
	} else {
		hero.name = req.body.name || hero.name;
		
        // Save the updated document back to the database
        hero.save((err, hero) => {
            if (err) {
                res.status(500).send(err)
            }
			console.log("Put Successful");
            res.status(200).send(hero);
        });
	}
  });
});

// ---- DELETE ----

// Delete a hero
router.delete('/heros/:hero_id', function(req, res) {
	Hero.remove({_id : req.params.hero_id}, function(err, todo) {
		if (err){
			res.send(err);
			console.log("Get Error");
		}

		// get and return all the heros after you delete another
		Hero.find(function(err, heros) {
			if (err)
				res.send(err)
			res.json(heros);
		});
	});
});

module.exports = router;
const mongoose = require('mongoose');

var newsSchema = mongoose.Schema({
  title: String,
  content: String,
  date: Date
});
module.exports = mongoose.model('News', newsSchema);

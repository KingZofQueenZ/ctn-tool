const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: Boolean
});

// Hash the user's password before inserting a new user
userSchema.pre('save', function(next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(error, salt) {
      if (error) {
        return next(error);
      }
      bcrypt.hash(user.password, salt, function(error, hash) {
        if (error) {
          return next(error);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// Compare password input to password saved in database
userSchema.methods.comparePassword = function(passwort, crypto) {
  bcrypt.compare(passwort, this.password, function(error, isMatch) {
    if (error) {
      return crypto(error);
    }
    crypto(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);

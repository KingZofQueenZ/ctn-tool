var jwt = require('jsonwebtoken');
var config = require("../config/index")

// Verify that the user has a valid token
function verify(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.auth.secret, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        // All good, save user-id to request
        req.userId = decoded.id;
        next();
    });
}

// Verify that only the admin has access to the ressources
function verifyAdmin(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.auth.secret, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        if(!decoded.admin) {
            return res.status(401).send({ auth: false, message: 'Your are not authorized for this request.' });
        }

        // All good, save user-id to request
        req.userId = decoded.id;
        next();
    });
}

// Verify that the user only has access to his own ressources
function verifyUser(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    
    jwt.verify(token, config.auth.secret, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        if(decoded.sub != req.params.user_id && decoded.sub != req.body._id && !decoded.admin) {
            return res.status(401).send({ auth: false, message: 'Your are not authorized for this request.' });
        }

        // All good, save user-id to request
        req.userId = decoded.id;
        next();
    });
}

module.exports = {
    verify,
    verifyAdmin,
    verifyUser
}
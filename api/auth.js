/**
 * Created by erika on 10/3/2016.
 */
(function () {
    "use strict";

    // GETS ALL THE PACKAGES AND MODULES NEEDED
    // Used to create, sign and verify tokens
    var jwt = require('jwt-simple')
        , config = require('./../config')
        // Crypts passwords
        , bcrypt = require('bcrypt-nodejs')
        // Creates a model of UserSchema
        , User = require('./models/user.js')
        // Requires password to contain one lowercase character, one uppercase character, a number
        // and be at least 8 characters long ('?=' checks if certain characters are a match, returns boolean)
        , patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,50}$/
        // Variable to export so other modules can access 'methods' in this document
        , auth;

    // Sets how long until a token expires
    function expiresIn(numDays) {
        var dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + numDays);
        return dateObj.getTime();
    }

    // Generates a token for a user
    function genToken(user) {
        var expires = expiresIn(7); // Alive for 7 day
        // Generates the token
        var token = jwt.encode({
            exp: expires,
            // Saves the auto generated mongodb _id for user so it can be accessed from token details
            id: user.id
        }, config.secret); // Defines which secret can decode the token

        return {
            token: token,
            expires: expires,
            user: user
        };
    }

    auth = {
        login: function (req, res) {
            var username = req.body.username || "";
            var password = req.body.password || "";

            // Sends an error message if username or password are blank
            if (username === '' || password === '') {
                res.status(401);
                res.json({
                    status: 401,
                    message: "Invalid credentials"
                });

                return;
            }

            // Generates a token for user if credentials are valid
            auth.validate(username, password, function (userObject) {
                // Sends a 401 error message if authentication fails
                if (!userObject) {
                    res.status(401);
                    res.json({
                        status: 401,
                        message: "Invalid credentials"
                    });
                } else {
                    // If authentication is a success, generates a token and
                    // dispatches it to the client.
                    res.json(genToken(userObject));
                }
            });
        },

        // Validates user's username and password
        validate: function (username, password, callback) {
            // Finds user from database
            User.findOne({username: username}, function (err, user) {
                if (err) {
                    callback();
                } else if (user === null || user === undefined) {
                    callback();
                } else {
                    // Compares passwords to each other
                    bcrypt.compare(password, user.password, function (err, result) {
                        var dbUserObj;
                        if (err) {
                            callback();
                        } else {
                            if (result) {
                                dbUserObj = user;
                            } else {
                                dbUserObj = false;
                            }

                            callback(dbUserObj);
                        }
                    });
                }
            });
        },

        // Creates a new user
        register: function (req, res) {
            if (req.body.username) {
                // Checks if user already exists
                User.findOne({username: req.body.username}, function (err, user) {
                    if (err) {
                        res.status(400);
                        res.json({
                            status: 400,
                            message: "Username already in use"
                        });
                    } else if (user === null) {
                        var username = req.body.username;
                        if (req.body.password && req.body.password.match(patternPassword)) {
                            // brypts the password for secure database storing
                            bcrypt.hash(req.body.password, null, null, function (err, hash) {
                                if (err) {
                                    res.status(500);
                                    res.json({
                                        status: 500,
                                        message: "password encryption failed"
                                    });
                                } else {
                                    // User is a model of UserSchema
                                    var userToSave = new User({username: username, password: hash});
                                    // Saves userToSave to db collection users
                                    userToSave.save(function (err) {
                                        if (err) {
                                            console.log(err);
                                            res.status(500);
                                            res.json({
                                                status: 500,
                                                message: "Error saving user details to database"
                                            });
                                        } else {
                                            res.json({
                                                status: 200,
                                                message: username + " successfully registered"
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            res.status(400);
                            res.json({
                                status: 400,
                                message: "Invalid password. Must contain uppercase, lowercase, a number and " +
                                "be at least 8 characters long"
                            });
                        }
                    } else {
                        res.status(400);
                        res.json({
                            status: 400,
                            message: "Invalid username"
                        });
                    }
                });
            } else {
                res.status(400);
                res.json({
                    status: 400,
                    message: "Did not receive a username"
                });
            }
        }
    };

    module.exports = auth;
}());
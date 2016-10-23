/**
 * Created by erika on 10/3/2016.
 */
(function () {
    "use strict";

    var express = require('express')
        , config = require('./config')
        , jwt = require('jwt-simple')
        , lists = require('./api/lists')
        , tasks = require('./api/tasks')
        , router = express.Router();

    // Middleware checks user's token before every get, post, put and delete request
    router.use(function (req, res, next) {
        var token = req.query.token || req.body.token || req.headers["x-access-token"];
        if (token) {
            try {
                // Decodes the token with secret that is saved in config file
                var decoded = jwt.decode(token, config.secret);
                var currentTime = new Date();
                if (decoded.exp > currentTime.getTime()) {
                    // Saves token's user id to req so it can be accessed later on
                    req.userId = decoded.id;
                    // Continues out from the middleware (middleware function was successful)
                    next();
                } else {
                    res.status(401);
                    res.json({
                        status: 401,
                        message: "Token has expired, please renew login"
                    });
                }

            } catch (error) {
                console.log(error);
                res.status(401);
                res.json({
                    status: 401,
                    message: "Token not valid"
                });
            }

        } else {
            res.status(401);
            res.json({
                status: 401,
                message: "Access denied. Please login again"
            });
        }
    });

    // Calls methods from api for lists when request type and URL match
    router.get("/lists", lists.getAll);
    router.post("/lists", lists.create);
    router.put("/lists/:id", lists.update);
    router.delete("/lists/:id", lists.remove);

    // Calls methods from api for tasks when request type and URL match
    router.get("/lists/:id/tasks", tasks.getAll);
    router.post("/lists/:id/tasks", tasks.create);
    router.put("/lists/:id/tasks/:taskId", tasks.update);
    router.delete("/lists/:id/tasks/:taskId", tasks.remove);

    // exports the router so it can be accessed in server.js
    module.exports = router;
}());
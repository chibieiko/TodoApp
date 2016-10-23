/**
 * Created by erika on 10/3/2016.
 */
(function () {
    "use strict";

    module.exports = {
        // Secret word for bcrypt. Store in a separate file for a real project.
        secret: 'test_secret',
        // Database url
        // Mongo is running in mLab
        database: 'mongodb://ebi:ebi24@ds061196.mlab.com:61196/todoapp'
    };
}());
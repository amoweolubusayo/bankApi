'use strict';


var mongoose = require('mongoose'),
    CustomerProfile = mongoose.model('CustomerProfile');

// this.(req,res) => {}

exports.create_a_task = (req, res) => {
    var new_profile = new CustomerProfile(req.body);
    new_profile.save(function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};
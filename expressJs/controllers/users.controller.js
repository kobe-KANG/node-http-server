const model = require('../models/users.model');

function getUsers(req, res) {
    res.json(model);
}

function getUser(req, res) {
    const userId = Number(req.params.userId);
    const user = model[userId];
    if(user) {
        res.json(user);
    } else {
        res.sendStatus(404).json({ error: "No User Found"});
    }
}

function postUser(req, res) {
    if(!req.body.name) {
        return res.status(400).json({
            error: "Missing user name"
        });
    }

    const newUser = {
        id: model.length + 1,
        name: req.body.name
    }
    model.push(newUser);
    res.json(newUser);
}

module.exports = {
    getUsers,
    getUser,
    postUser
}
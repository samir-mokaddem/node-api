const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'your-access-token'
var userModel = require('../models/Users-mysql');

userModel.create = async (req, res) => {
    let error = validationResult(req)
    console.log(error)
    if (error.isEmpty()) {
            let email = req.body.email
            let password = req.body.password
            let firstname = req.body.firstname
            let lastname = req.body.lastname
            let createdAt = new Date
            let updatedAt = new Date
            await userModel.create(email, password, firstname, lastname, createdAt, updatedAt)
            res.status(200).send('User Signup Success')
    }else {
        res.status(400).json({
            message: 'Email or password is incorrect'
        })
    }
}

userModel.login = async (req, res) => {
    var connexion = await userModel.checkLogin(req.body.email, req.body.password)
    if (connexion == true) { 
        let user = await userModel.findOneByEmail(req.body.email)
        console.log(user[0].id)
        let token = jwt.sign({id: user.id[0].id, accessTokenSecret})
    }else {
        res.status(401).json({
            message: 'Email or password is incorrect'
        })
        res.status(200)
        res.send('Route login sucess') 
        }
}

userModel.deleteUsers = (req, res) => {
    userModel.delete(req.params.id) 
    .then(response => {
        res.status(200).json(response)})
    .catch(err => {
        res.status(500).json(response)})
    }

userModel.modifyUser = (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let id = req.body.id
    userModel.pul(email, password, firstname, lastname, id)
    res.status(200).send('Modification utilisateur pris en compte')
}

userModel.findAll = async (req, res) => {
    let result = await userModel.find()
    res.send(200).send(result)
}


userModel.findOneById = async (req, res) => {
    let result = await userModel.findOneById(req.params.id)
    res.send(200).send(result) 
}

module.exports = userModel.create

const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//Validtaion
const Joi = require('@hapi/joi');

router.post('/', async (req,res) => {

    const schema =  Joi.object({
        name: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist)  return res.status(400).send('Email already exist');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req,res) => {

    const schema =  Joi.object({
        email: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
        //checking if the user is already in the database
        const user = await User.findOne({email: req.body.email});
        if (!user)  return res.status(400).send("Email doesn't exist");
        //Password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).send('Invalid password')

        //Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);

});

module.exports = router;
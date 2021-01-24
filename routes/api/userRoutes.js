const router = require('express').Router();
const validation = require('../../validation/validation');

//user model: mongoose
const User = require("../../models/user-model");

//test the api user routes
router.get("/test", (req, res) => {
    res.status(200).send("Welcome to the api: User Routes");
});

//create a user
router.post("/create", async (req, res) => {
    try {
        console.log("Create a user called!");

        //validate user data
        const {errors, isValid} = await validation.validateCreateUser(req.body);
        if (!isValid) {
            return res.status(400).json({isValid: isValid, errors: errors});
        }

        //generate the user model to be inserted into the database
        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        });

        //save the user schema to the database and return.
        const savedUser = await newUser.save();
        return res.status(200).json({user: savedUser});
    } catch {
        return res.sendStatus(500);
    }
});

//get a list of all users
router.get("/getusers", async (req, res) => {
    //get all users that have not been deleted
    const users = await User.find({});
    return res.status(200).json(users);
});

//upgrade to premium
router.post("/makepremium", async (req, res) => {
    try {
        console.log("upgrading a user to premium");
        //check that the authentication header contains a value
        if (req.headers.authentication != undefined) {

            //validate a user id was passed
            let {errors, isValid} = await validation.validateMakePremium(req.body);
            if (!isValid) {
                return res.status(400).json({isValid: isValid, errors: errors});
            }

            //upgrade the user to premium
            const updatedUser = await User.updateOne({_id: req.body.id}, {isPremium: true});

            //check that the action was completed successfully and send proper response
            if (updatedUser.nModified >= 1) {
                return res.sendStatus(200);
            } else {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(403);
        }
    } catch {
        return res.sendStatus(500);
    }
});

module.exports = router;
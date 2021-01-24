const router = require('express').Router();
const validation = require('../../validation/validation');

//recipe model
const Recipe = require("../../models/recipe-model");
const User = require("../../models/user-model");

//test the api route for the recipes is working
router.get("/test", (req, res) => {
    res.status(200).send("Welcome to the api: Recipe routes");
});

//create a recipe
router.post("/create", async (req, res) => {
    try {
        //validate recipe data
        const {errors, isValid} = await validation.validateCreateRecipe(req.body);
        if (!isValid) {
            return res.status(400).json({isValid: isValid, errors: errors});
        }

        //generate a new recipe model
        const newRecipe = new Recipe({
            author: req.body.author,
            content: req.body.content,
            category: req.body.category
        });

        //save the new recipe model to the database
        const savedRecipe = await newRecipe.save();
        res.status(200).json({recipe: savedRecipe});
    } catch {
        return res.sendStatus(500);
    }  
});

//edit a recipe
router.post("/edit", async (req, res) => {
    try {
        //validate the data to ensure the recipe can be updated
        const {errors, isValid} = await validation.validateUpdateRecipe(req.body);
        if (!isValid) {
            if (errors.author) {
                return res.sendStatus(403);
            }
            return res.status(400).json({isValid: isValid, errors: errors});
        }

        //update the recipe
        await Recipe.updateOne({_id: req.body.id, author: req.body.author}, {content: req.body.content, category: req.body.category, isPremium: req.body.isPremium, isPrivate: req.body.isPrivate});

        //return status 200 when update is complete
        //no need to check if a row was modified, if it was not modified still consider it as updated
        return res.sendStatus(200);
    } catch {
        return res.sendStatus(500);
    }
}); 

//delete a recipe
router.post("/delete", async (req, res) => {
    try {
        //validate the data to ensure the recipe can be set as deleted
        const {errors, isValid} = await validation.validateDeleteRecipe(req.body);
        if (!isValid) {
            if (errors.author) {
                return res.sendStatus(403);
            }
            return res.status(400).json({isValid: isValid, errors: errors});
        }

        //update the recipe to be deleted
        await Recipe.updateOne({_id: req.body.id, author: req.body.author}, {isDeleted: true});
        console.log("UDPATED TO DELETED");
        //return status 200 when the update is complete
        return res.sendStatus(200);
    } catch {
        return res.sendStatus(500);
    }
});

//list of recipes
router.get("/getrecipes", async (req, res) => {
    try {
        let foundRecipes;
        //If an author was not specified return the public recipes
        if (!req.body.author) {
            foundRecipes = await Recipe.find({isPrivate: false, isPremium: false, isDeleted: false});
            return res.status(200).json({foundRecipes});
        } else {
            //validate the passed data
            const {errors, isValid} = await validation.validateGetRecipes(req.body);
            if (!isValid) {
                return res.status(400).json({isValid: isValid, errors: errors});
            }

            //get the authors premium value
            let authorData = await User.findOne({_id: req.body.author});

            //query the recipes with or without premium based on users premium status
            if (authorData.isPremium) {
                foundRecipes = await Recipe.find({$or: [{isPremium: false, isPrivate: false, isDeleted: false}, {isPrivate: true, author: req.body.author, isDeleted: false}, {isPrivate: false, isPremium: true, isDeleted: false}]});
            } else {
                foundRecipes = await Recipe.find({$or: [{isPremium: false, isPrivate: false, isDeleted: false}, {isPrivate: true, author: req.body.author, isDeleted: false}]});
            }

            //return the recipes
            return res.status(200).json({foundRecipes});
        }
    } catch {
        return res.sendStatus(500);
    } 
});

//get single recipe
router.get("/getrecipe", async (req, res) => {
    try {
        let foundRecipe;

        if (!req.body.author) {
            foundRecipe = await Recipe.find({_id: req.body.id, isPrivate: false, isPremium: false, isDeleted: false});
            return res.status(200).json(foundRecipe);
        } else {
            //validate the passed data
            let {errors, isValid} = await validation.validateGetRecipe(req.body);
            if (!isValid) {
                return res.status(400).json({isValid: isValid, errors: errors});
            }

            //get the authors premium value
            let authorData = await User.findOne({_id: req.body.author});

            if (authorData.isPremium) {
                foundRecipe = await Recipe.find({$and: [{_id: req.body.id}, {$or: [{isPremium: false, isPrivate: false, isDeleted: false}, {isPrivate: true, author: req.body.author, isDeleted: false}, {isPrivate: false, isPremium: true, isDeleted: false}]}]});
            } else {
                foundRecipe = await Recipe.find({$and: [{_id: req.body.id}, {$or: [{isPremium: false, isPrivate: false, isDeleted: false}, {isPrivate: true, author: req.body.author, isDeleted: false}]}]});
            }

            return res.status(200).json(foundRecipe);
        }
    } catch {
        return res.sendStatus(500); 
    }
});

module.exports = router;
const userModel = require("../models/user-model");
const mongoose = require('mongoose');

//validates user creation data
exports.validateCreateUser = async (data) => {
    let errors = {};
    let isValid = true;

    //check first name
    if (!data.firstname) {
        errors.firstname = "First name field is required";
        isValid = false;
    }

    //check last name
    if (!data.lastname) {
        errors.lastname = "Last name field is required";
        isValid = false;
    }

    if (!data.email) {
        errors.email = "Email field is required";
        isValid = false;
    }

    //return the errors and is valid to the calling function
    return {
        errors,
        isValid
    }
}

//validates make premium 
exports.validateMakePremium = async (data) => {
    let errors = {};
    let isValid = true;

    //validate the id passed is a valid id
    if (!mongoose.Types.ObjectId.isValid(data.id)) {
        errors.aid = "ID is not a valid id format";
        isValid = false;
    }

    //validate the ID passed is not empty
    if (!data.id) {
        errors.id = "ID cannot be empty";
        isValid = false;
    }

    return {
        errors,
        isValid
    }
}

//validates recipe creation
exports.validateCreateRecipe = async (data) => {
    let errors = {};
    let isValid = true;
    let idValid = true;

    //validate the user id is a valid id
    if (!mongoose.Types.ObjectId.isValid(data.author)) {
        errors.author = "Author field is not a valid id format";
        isValid = false;
        idValid = false;
    }

    //validate author is not empty 
    if (!data.author) {
        errors.author = "Author field is required";
        isValid = false;
    }
    
    //validate user ID present in the database
    if (data.author) {
        let existingUser = await userModel.find({_id: data.author});
        if (existingUser.length == 0) {
            errors.author = "Author does not exist";
            isValid = false;
        }
    }

    //validate the content is not empty
    if (!data.content) {
        errors.content = "Content field is required";
        isValid = false;
    }

    //return the errors and is valid to the calling function
    return {
        errors, 
        isValid
    }
}

//validates a recipe can be updated
exports.validateUpdateRecipe = async (data) => {
    let errors = {};
    let isValid = true;
    let idValid = true;

    //validate the id is a valid id
    if (!mongoose.Types.ObjectId.isValid(data.id)) {
        errors.id = "ID field is not a valid id format";
        isValid = false;
        idValid = false;
    }

    //validate the id is not empty
    if (!data.id) {
        errors.id = "ID field is required";
        isValid = false;
    }

    //validate the author is not empty
    if (!data.author) {
        errors.author = "Author field is required";
        isValid = false;
    }

    //validate the author is the author for the recipe as long as the recipe id was valid
    //if the recipe id was not valid this would error
    if (idValid) {
        let foundRecipe = await Recipe.find({_id: data.id, author: data.author});
        if (foundRecipe.length == 0) {
            errors.author = "The author specified is not the author of this recipe";
            isValid = false;
        }
    }

    //validate the content is not empty
    if (!data.content) {
        errors.content = "Content field is required";
        isValid = false;
    }

    return {
        errors,
        isValid
    }
}

//validates a recipe can be deleted
exports.validateDeleteRecipe = async (data) => {
    let errors = {};
    let isValid = true;
    let idValid = true;

    //validate the id is a valid id
    if (!mongoose.Types.ObjectId.isValid(data.id)) {
        errors.id = "ID field is not a valid id format";
        isValid = false;
        idValid = false;
    }

    //validate the id is not empty
    if (!data.id) {
        errors.id = "ID field is required";
        isValid = false;
    }

    //validate the author is not empty
    if (!data.author) {
        errors.author = "Author field is required";
        isValid = false;
    }

    //validate the author is the author for the recipe as long as the recipe id was valid
    //if the recipe id was not valid this would error
    if (idValid) {
        let foundRecipe = await Recipe.find({_id: data.id, author: data.author});
        if (foundRecipe.length == 0) {
            errors.author = "The author specified is not the author of this recipe";
            isValid = false;
        }
    }

    //return
    return {
        errors,
        isValid
    }
}

exports.validateGetRecipes = async (data) => {
    let errors = {};
    let isValid = true;
    let idValid = true;

    //validate the author id is a valid id
    if (!mongoose.Types.ObjectId.isValid(data.author)) {
        errors.author = "ID field is not a valid id format";
        isValid = false;
        idValid = false;
    }

    //validate the author is in the database
    if (idValid) {
        let existingUser = await userModel.find({_id: data.author});
        if (existingUser.length == 0) {
            errors.author = "Author does not exist";
            isValid = false;
        }
    }

    return {
        errors,
        isValid
    }
}

exports.validateGetRecipe = async (data) => {
    let errors = {};
    let isValid = true;
    let userIdValid = true;

    //validate the recipe id was a valid format
    if (!mongoose.Types.ObjectId.isValid(data.id)) {
        errors.id = "ID field is not a valid id format";
        isValid = false;
    }

    //validate the recipe id was not empty
    if (!data.id) {
        errors.id = "Recipe ID cannot be empty";
        isValid = false;
    }

    //validate the user id was a valid format
    if (!mongoose.Types.ObjectId.isValid(data.author)) {
        errors.author = "Author ID field is not a valid id format";
        isValid = false;
        userIdValid = false;
    }

    //validate the user id was not empty
    if (!data.author) {
        errors.author = "Author ID cannot be empty";
        isValid = false;
    }

    //validate the author specified is in the database
    if (userIdValid) {
        let existingUser = await userModel.find({_id: data.author});
        if (existingUser.length == 0) {
            errors.author = "Author does not exist";
            isValid = false;
        }
    }

    return {
        errors,
        isValid
    }
}
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    datecreated: {type: Date, required: true, default: Date.now},
    datelastupdated: {type: Date, required: true, default: Date.now},
    author: {type: String, required: true},
    content: {type: String, required: true},
    category: {type: String},
    isPrivate: {type: Boolean, default: true, required: true}, 
    isPremium: {type: Boolean, default: false, required: true},
    isDeleted: {type: Boolean, default: false}
});

module.exports = Recipe = mongoose.model("recipe", recipeSchema);
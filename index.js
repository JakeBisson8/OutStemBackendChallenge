const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//set up express
const app = express();
app.use(express.json());
app.use(cors());

//connect to mongo DB via mongoose
mongoose.connect(process.env.MONGODB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, 
 }, (err) => {
     if (err) {
         console.log("Mongo DB did not connected!");
         throw err;
     } else {
         console.log("Mongo DB connected!");
     }
 });

//api routes
app.use("/api/users", require("./routes/api/userRoutes"));
app.use("/api/recipes", require("./routes/api/recipeRoutes"));

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});

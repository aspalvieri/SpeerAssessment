//Express app module
const express = require('express');
const app = express();

//Importing the routes
const userRoutes = require("./users");
const messagesRoutes = require("./messages");

//Registering our routes
app.use("/users", userRoutes);
app.use("/messages", messagesRoutes);

//Exporting the changes
module.exports = app;

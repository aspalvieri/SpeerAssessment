//Express app module
const express = require('express');
const app = express();

//Importing the routes
const userRoutes = require("./users");
const messagesRoutes = require("./messages");
const tweetsRoutes = require("./tweets");

//Registering our routes
app.use("/users", userRoutes);
app.use("/messages", messagesRoutes);
app.use("/tweets", tweetsRoutes);

//Exporting the changes
module.exports = app;

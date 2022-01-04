require("dotenv").config();

//Constants
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");

//Models
require("./models/User")

const app = express();

//Body parser and options
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Setting which database to connect to
const env = process.env.NODE_ENV || "development";
if (env === "test") {
  process.env.DB_CONN = process.env.DB_TEST_URL;
} 
else if (env === "development") {
  process.env.DB_CONN = process.env.DB_DEV_URL;
}

mongoose.connect(process.env.DB_CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => console.log(`ERROR: ${err}`));

//Passport middleware
app.use(passport.initialize());

//Passport config
require("./middleware/passport")(passport);

//Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

//Routes
const routes = require("./routes/index");
app.use("/api", routes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

//Set port, listen for requests
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = { app };

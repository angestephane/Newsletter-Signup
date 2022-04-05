const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log("server ok ! port : " + port);
});

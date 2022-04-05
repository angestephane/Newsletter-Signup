const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const https = require("https");

const app = express();
dotenv.config();

port = process.env.PORT;
const listID = process.env.ID;
const API_KEY = process.env.APIKey;
const url = "https://us14.api.mailchimp.com/3.0/lists/" + listID;

//module utilisé
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const mail = req.body.mail;
  const nom = req.body.nom;
  const prenom = req.body.prenom;

  const data = {
    members: [
      {
        email_address: mail,
        status: "subscribed",
        merge_fields: {
          FNAME: prenom,
          LNAME: nom,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const options = {
    method: "POST",
    auth: "stephane97:" + API_KEY,
  };
  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.listen(port, () => {
  console.log("server ok ! port : " + port);
});

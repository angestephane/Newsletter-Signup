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
app.use(express.static("public")); //Lecture des fichiers static

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const mail = req.body.mail;
  const nom = req.body.nom;
  const prenom = req.body.prenom;

  /**
   * Format de données recommandé par mailchimp
   * les données qu'on souhaite envoyer au server sont :
   * ! le mail
   * ! le status (selon qu'il a souscrit ou non)
   * !le nom et le prenom
   */
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

  //transformation des données en format JSON
  const jsonData = JSON.stringify(data);

  //Création de l'options de la methode request (voir doc sur nodeJS)
  const options = {
    method: "POST",
    auth: "stephane97:" + API_KEY,
  };

  //creation de la requette
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/succes.html");
    } else {
      res.sendFile(__dirname + "/faillure.html");
    }
    response.on("data", (data) => {});
  });

  //Envoie de la requette
  request.write(jsonData);

  //Fermeture de la requette
  request.end();
});

app.post("/faillure", (req, res) => {
  res.redirect("/");
});

app.post("/succes", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log("server ok ! port : " + port);
});

require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios")
var command = process.argv[2];
var cmdParam = process.argv[3];
var moment = require('moment');
moment().format();
// var spotify = new Spotify(keys.spotify);

function commandSwitch() {
  if(command === "concert-this") {
    bandsInTown();
  }
}

function bandsInTown() {
  axios.get("https://rest.bandsintown.com/artists/" + cmdParam + "/events?app_id=codingbootcamp").then(
    function(response) {
      for(var i = 0; i < response.data.length; i++) {
        console.log("----------------")
        var event = response.data[i];
        var date = moment(event.datetime, "YYYY-MM-DD hh:mm:ss").format("MM/DD/YYYY");
        console.log(date);
        console.log("Venue: " + event.venue.name);
        if(event.venue.region !== "") {
          console.log("Location: " + event.venue.city + ", " + event.venue.region + ", " + event.venue.country);
          console.log("----------------");
        }
        else {
          console.log("Location: " + event.venue.city + ", " + event.venue.country);
          console.log("----------------");

        }
      }
    }
  )
}

commandSwitch();
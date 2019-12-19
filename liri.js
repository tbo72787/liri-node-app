require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios")
var command = process.argv[2];
var cmdParam = process.argv[3];
var moment = require('moment');
// moment().format();
var spotify = new Spotify(keys.spotify);

function commandSwitch() {
  if(command === "concert-this") {
    bandsInTown();
  }
  if(command === "spotify-this-song") {
    spotifyer();
  }
}

function bandsInTown() {
  axios.get("https://rest.bandsintown.com/artists/" + cmdParam + "/events?app_id=codingbootcamp").then(
    function(response) {
      for(var i = 0; i < response.data.length; i++) {
        console.log("----------------")
        var event = response.data[i];
        var date = moment(event.datetime, "YYYY-MM-DD hh:mm:ss").format("MM/DD/YYYY");
        console.log("Date: " + date);
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
// spotifyer();
function spotifyer() {
spotify.search({ type: 'track', query: cmdParam }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 var name = data.tracks.items[0].name;
 var artist = data.tracks.items[0].album.artists[0].name;
 var album = data.tracks.items[0].album.name;
 var preview = data.tracks.items[0].preview_url;

console.log("Title: " + name);
console.log("Artist(s): " + artist);
console.log("Album: " + album);
console.log("Preview link: " + preview);
})};
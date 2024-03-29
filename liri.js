require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var command = process.argv[2];
var cmdParam = process.argv.slice(3).join(" ");
var moment = require('moment');
var spotify = new Spotify(keys.spotify);
var OMDBAPIkey = process.env.OMDB_API_KEY;

function commandSwitch() {
  if(command === "concert-this") {
    bandsInTown();
  }
  if(command === "spotify-this-song") {
    if(cmdParam) {
      spotifyer();
    }
    else {
      spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
      .then(function(data) {
        var name = data.name;
        var artist = data.album.artists[0].name;
        var album = data.album.name;
        var preview = data.preview_url;
        
        console.log("Title: " + name);
        console.log("Artist(s): " + artist);
        console.log("Album: " + album);
        console.log("Preview link: " + preview);
      })
      .catch(function(err) {
        console.error('Error occurred: ' + err); 
      });
    }
  }
  if(command === "movie-this") {
    if(cmdParam) {
      OMDB();
    }
    else {
      cmdParam = "Mr.+Nobody";
      OMDB();
    }
  }
  if(command === "do-what-it-says") {
    random();
  }
}

function bandsInTown() {
  axios.get("https://rest.bandsintown.com/artists/" + cmdParam + "/events?app_id=codingbootcamp")
  .then(function(response) {
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
  })
}



function spotifyer() {
spotify.search({ type: 'track', artist: 'Ace+Of+Base', query: cmdParam, limit: 5}, function(err, data) {
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

function OMDB() {
  axios.get("http://www.omdbapi.com/?apikey=" + OMDBAPIkey + "&t=" + cmdParam)
  .then(function(response) {
    var movie = response.data;
    // console.log(movie);
    console.log("Title: " + movie.Title);
    console.log("Year: " + movie.Year);
    console.log("IMDB Rating: " + movie.Ratings[0].Value);
    for(var i = 0; i < movie.Ratings.length; i++) {
      if(movie.Ratings[i].Source === 'Rotten Tomatoes') {
        console.log("Rotten Tomatoes Rating: " + movie.Ratings[i].Value);
      }
    }
    console.log("Country: " + movie.Country);
    console.log("Language: " + movie.Language);
    console.log("Plot: " + movie.Plot);
    console.log("Cast: " + movie.Actors);
  })
  .catch(function(err) {
    console.error('Error occurred: ' + err); 
  });
}

function random() {
  fs.readFile("random.txt", "utf8", function(error, data) {

    if(error) {
      return console.log(error);
    }
      var dataArr = data.split(",");
      command = dataArr[0];
      cmdParam = dataArr[1];
      commandSwitch();
  });
};

commandSwitch();
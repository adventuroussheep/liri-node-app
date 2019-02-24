require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var fs = require("fs");
var util = require("util");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);


var userInput = process.argv[2];
var userSearch = process.argv.slice(3);

// ,null,2 +"\n"

// OMDB call 
// Hide API Key
var omdbCall = function() {
  axios.get("http://omdbapi.com/?t=" + userSearch + "&apikey=7a97b916&").then(
    function(response) {
      console.log("Title: " + response.data.Title);
      console.log("Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.Ratings[0].Value);
      if (!response.data.Ratings[1]) {
        console.log("RT Rating not avaliable");
      } else {
        console.log("RT Rating: " + response.data.Ratings[1].Value);
      }
      console.log("Country Produced in: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Cast: " + response.data.Actors);
      console.log("Plot: " + response.data.Plot);
      console.log("~~~~~~~~~~~~~~~~");
    }
  );
};


// Bands in Town API 
//  fix multi argv and no concert found
var bandCall = function() {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        userSearch +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
        console.log("Line up: "+response.data[0].lineup);
        console.log("Venue name: "+response.data[0].venue.name);
        console.log("Location: "+response.data[0].venue.city +", "+ response.data[0].venue.country);
        venueDate = response.data[0].datetime;
        formatDate = moment(venueDate).format("MM/DD/YYYY");
        console.log("Line up: "+formatDate);
        console.log("~~~~~~~~~~~~~~~~");
    });

};



// Spotify API
// API Complete
var spotifySong = function(search) {
    if (search === undefined) {
      search = "Ace of Base";
    }

    spotify.search({ type: "track", query: search, limit: 1 }, function(err,data) {
      
    if (err) {
      console.log(err);
    }
    console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name));
    
    console.log("Song: " + JSON.stringify(data.tracks.items[0].name));

    if (data.tracks.items[0].preview_url === "null") {
        console.log("No preview avaliable.");
    } else {
        console.log("Preview Link: " + JSON.stringify(data.tracks.items[0].preview_url));
        } 
        console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name));
        console.log("~~~~~~~~~~~~~~~~");
    });
}



// Node input
if (userInput === "spotify-this-song") {
  spotifySong(userSearch);
} else if (userInput === "movie-this") {
  omdbCall(userSearch);
} else if (userInput === "concert-this") {
  bandCall(userSearch);

//   File System Read
} else if(userInput === "do-what-it-says"){
    fs.readFile("./random.txt", "utf8", function read(err,data){
        if (err) {
            console.log(err);
        }
        
        var dataSplit = data.split(",");
        userInput = dataSplit[0];
        userSearch = dataSplit[1];

        if(userInput === "spotify-this-song") {
            spotifySong(userSearch);
          } else if (userInput === "movie-this") {
            omdbCall(userSearch);
          } else if (userInput === "concert-this") {
            bandCall(userSearch);
        }
    })
}



// File System Write, Logs the console.log
var logFile = fs.createWriteStream(__dirname + "/log.txt", {flags: "a"});
var logStdout = process.stdout;

console.log = function(x){
    logFile.write(util.format(x)+"\r\n");
    logStdout.write(util.format(x)+"\r\n");
}
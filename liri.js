
var userInput = process.argv[2];
var userSearch = process.argv[3];

require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


// ,null,2 +"\n"


// OMDB API 
var omdbApi = "http://www.omdbapi.com/?apikey=7a97b916&"
// OMDB Poster
var omdbPoster = "http://img.omdbapi.com/?apikey=7a97b916&"



// Spotify API

var spotifySong = function(search){

    if (search === undefined){
        console.log("you need to add a song");
    }

    spotify.search({type: 'track', query: search, limit: 1}, function(err, data){
    if(err){
        console.log(err);
        
    } 
        console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name));
        
        console.log("Song: " + JSON.stringify(data.tracks.items[0].name));
                
        console.log("Preview Link: " + JSON.stringify(data.tracks.items[0].preview_url));
                
        console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name));
    });
    
}

if (userInput === "spotify-this-song"){
    spotifySong(userSearch);
}

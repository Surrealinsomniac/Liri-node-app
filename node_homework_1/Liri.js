require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;
var spotifyKeys = keys.spotifyKeys;
//console.log(spotifyKeys);



var cmnd = process.argv
var userInput = cmnd[2];

var liriCmnd = ""
for (i = 3; i < cmnd.length; i ++){
    liriCmnd += cmnd[i] + " ";
}

switch (userInput) {
    case "my-tweets" :
        twitter();
        break;
    
    case "spotify-this-song" :
        spotify();
        break;

    case "movie-this" :
        OMDB();
        break;
    
    case "do-what-it-says":
        readtxt();
        break;
}

function twitter() {
    fs.appendFile("./log.txt", "user command: my-tweets\n\n", (error) => {
        if (error){
            return console.log(error);
        }
    } )

    var twitter = require("twitter");

    var client = new twitter (twitterKeys)
    
    var params = {screen_name: 'boudiccasays', count: 5};

    client.get('statuses/user_timeline', params, function(error, tweets, response){
        if (error) {
            return console.log(error);
        }
        var outputStr = "----------------------\n" + "User Tweets:\n" + "----------------------\n\n"
        for (i = 0; i < tweets.length; i ++) {
            outputStr += "Created on: " + tweets[i].created_at + "\n" + "Tweet content: " + tweets[i].text + "\n" + "----------------------\n"
        }
        fs.appendFile("./log.txt", "Liri response: " + outputStr + "\n");
        console.log(outputStr);

    }
    )}
function spotify(search) {
    var Spotify = require("node-spotify-api");
    var spotify = new Spotify (spotifyKeys);
    var search = liriCmnd;
    if (search === ""){
        search = "The Sign Ace Of Base"
    }
    else {
        search = liriCmnd
    }
    fs.appendFile("./log.txt", "\nUser command: spotify-this-song: " + search + "\n\n", (error) => {
        if (error) {
            return console.log(error);
        }
    })
    spotify.search({type: 'track', query: search}, function(error, data){
        if (error) {
            return console.log(error)
        }
        var songInfo = data.tracks.items[0];
        var outputStr = "----------------------\n" + "Song Info\n" + "----------------------\n" + "Title: " + songInfo.name + "\n" + "Artist: " + songInfo.artists[0].name + "\n" + "Album: " + songInfo.album.name + "\n" + "Preivew Here: " + songInfo.preview_url;
        fs.appendFile("./log.txt", "Liri response:\n " + outputStr + "\n", (error) => {
            if (error) {
                return console.log(error);
            }
        })
        console.log(outputStr);
    })


}
function OMDB(search) {
    search = liriCmnd
    if (search === null){
        search = "Mr. Nobody"
    }
    else {
        fs.appendFile("./log.txt", "User command: movie-this " + search + "\n", (error) => {
            if (error) {
                return console.log(error);
            }
        })
        request("http://www.omdbapi.com/?t=" + liriCmnd + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
            if (error) {
                return console.log(error);
            }   
            var outputStr = "\n----------------------\n" + "Title: " + JSON.parse(body).Title + "\n" + "Released: " + JSON.parse(body).Year + "\nIMDb: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes: " + JSON.parse(body).tomatoRating + "\nCountry Produced: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nFeatures: " + JSON.parse(body).Actors
            fs.appendFile("./log.txt", "Liri response: " + outputStr + "\n")
            console.log(outputStr);
        })
    }
}
function readtxt() {
    fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var commandString = data.split(",");
        var command = commandString[0].trim();
        liriCmnd = commandString[1].trim();
        var search = liriCmnd
        console.log(liriCmnd)

        switch (command) {
            case "twitter" :
                twitter();
                break;
            
            case "spotify" :
                spotify(search);
                break;
        
            case "omdb" :
                OMDB(search);
                break;
            
            case "do-what-it-says":
                readtxt();
                break;
        }

    })
}
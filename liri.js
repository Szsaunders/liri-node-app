require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require("twitter")
var fs = require('fs');
var nodeArgs = process.argv.slice(2,4)

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function tweeter (screenName) {
    if (screenName) {var params  = {screen_name: screenName}}
    else {var params  = {screen_name: "TMonkey413"}}
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        if (!error && response.statusCode === 200) {
            for (i=0; i<20;i++) {
                if (!tweets[i]) {}
                else{
                    var output = "\n" + tweets[i].text
                    
                    console.log(output)
                    fs.appendFile('log.txt', output, function (err) {
                        if (err) throw err;
                    });
                }
            }
        }
    });
}

function spotter (songName) {
    if (songName) {var songQuery = songName}
    else {var songQuery = "The Sign Ace of Base"}
    
    spotify.search({ type: 'track', query: songQuery }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var trackInfo = data.tracks.items[0]
        var output = "Artist: " + trackInfo.artists[0].name + "\nSong: " + trackInfo.name + "\nSong Preview: "
        + trackInfo.external_urls.spotify
        +  "\nAlbum: " + trackInfo.album.name; 
        console.log(output)
        fs.appendFile('log.txt', output, function (err) {
            if (err) throw err;
        });
        
    })
}

function movieSearch (movieName) {
    
    if (movieName) {var mov = movieName}
    else {var mov = "Mr. Nobody"}
    
    request("http://www.omdbapi.com/?t=" + mov + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
    
    if (!error && response.statusCode === 200) {
        
        
        console.log(JSON.parse(body));
        var output = "Title: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year + 
        "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRT Rating: " + JSON.parse(body).Ratings[1].Value
        + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " 
        + JSON.parse(body).Plot + "\nMain Actors: " + JSON.parse(body).Actors
        
        console.log(output)
        fs.appendFile('log.txt', output, function (err) {
            if (err) throw err;
        });
    }
});
}

function followOrders () {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        switchboard(data.split(","))
    })}
    
    function switchboard (argArray) {
        switch (argArray[0]) {
            case "my-tweets":
            fs.appendFile('log.txt', "\nmy-tweets\n", function (err) {
                if (err) throw err;
            });
            //Added in an allowance to let you choose which Twitter account you want to look up.
            //Didn't feel right to make it only look up a single account, you know?
            tweeter(argArray[1]);
            break;
            case "spotify-this-song":
            fs.appendFile('log.txt', "\nspotify-this-song\n", function (err) {
                if (err) throw err;
            });
            spotter(argArray[1]);
            break;
            case "movie-this":
            fs.appendFile('log.txt', "\nmovie-this\n", function (err) {
                if (err) throw err;
            });
            
            movieSearch(argArray[1]);
            break;
            case "do-what-it-says":
            followOrders()
            fs.appendFile('log.txt', "\ndo-what-it-says\n", function (err) {
                if (err) throw err;
            });
            break;
        }
        
    }
    
    switchboard(nodeArgs)
    
require("dotenv").config();
var apikeys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(apikeys.spotify);
var request = require("request");
console.log(apikeys.spotify);
console.log("\n\n\n")
console.log("-----begin program\n")
var nodeArgs = process.argv

var helpMessage = "Please use one of these four commands\n 1) concert-this\n 2) spotify-this-song\n 3) movie-this\n 4) do-what-it-says\n"

if (nodeArgs.length < 3) {
    console.log("Missing command");
    console.log(helpMessage)
} else {

    var command = nodeArgs[2]
    var commandArgString = nodeArgs.slice(3).join(" ");
    console.log("Length: " + nodeArgs.length + "\nCommand: " + command + "\nParameters: " + commandArgString)

    
    switch (command) {
        case "concert-this":
            console.log("concert-this");
            concertThis(commandArgString);
            break;
        case "spotify-this-song":
            console.log("spotify-this-song");
            spotifySong(commandArgString);
            break;
        case "movie-this":
            console.log("movie-this");
            movieThis(commandArgString)
            break;
        case "do-what-it-says":
            console.log("do-what-it-says");
            doWhatItSays(commandArgString)
            break;
        default:
            console.log(helpMessage)
    }

}


// Make it so liri.js can take in one of the following commands:

// concert-this
// spotify-this-song
// movie-this
// do-what-it-says



// What Each Command Should Do


// node liri.js concert-this <artist/band name here>
function concertThis(artist) {
    console.log("\nIn function: \nHere is your band! " + artist);
    // This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error,response, body) {
        locationList = JSON.parse(body)
        prettyOutput = JSON.stringify(locationList,null,4)
        let allresults = ""
        for (let i=0; i<locationList.length; i++) {
            let result = ""
            result = result + locationList[i]["venue"]["name"] + "\n"
            // clean up date later   
            result = result + locationList[i]['datetime'] + "\n\n"
            allresults = allresults + result
        }
        console.log("\n\n"+allresults)
        // console.log(prettyOutput)
    });
    // Name of the venue
    // Venue location
    // Date of the Event (use moment to format this as "MM/DD/YYYY")
}


// node liri.js spotify-this-song '<song name here>'
function spotifySong(song2) {
    console.log("\nIn function: \nHere is your song! " + song)
    let artist = "Ace of Base"
    var song = "I will always love you"

    spotify.search({type: 'track', query:song, limit: 2},function(err, data) {
        prettyOutput = JSON.stringify(data, null, 2)
        console.log(prettyOutput)
    })



    // This will show the following information about the song in your terminal/bash window
    // Artist(s)
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from
    // If no song is provided then your program will default to "The Sign" by Ace of Base.
}


// node liri.js movie-this '<movie name here>'
function movieThis(movie) {
    console.log("\nIn function: \nHere is your movie " + movie)
    // This will output the following information to your terminal/bash window:

    //    * Title of the movie.
    //    * Year the movie came out.
    //    * IMDB Rating of the movie.
    //    * Rotten Tomatoes Rating of the movie.
    //    * Country where the movie was produced.
    //    * Language of the movie.
    //    * Plot of the movie.
    //    * Actors in the movie.


    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    // If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
    // It's on Netflix!

    // You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use trilogy.

}




// node liri.js do-what-it-says
function doWhatItSays(textfile) {
    console.log("\nIn function: \nHere is command file " + textfile)
    // Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

    // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
    // Feel free to change the text in that document to test out the feature for other commands.

}



// BONUS


// In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
// Make sure you append each command you run to the log.txt file. 
// Do not overwrite your file each time you run a command.




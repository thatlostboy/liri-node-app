require("dotenv").config();

// load API keys
var apikeys = require("./keys.js");

// initialize spotify with api keys
var Spotify = require("node-spotify-api");
var spotify = new Spotify(apikeys.spotify);

// load omdb api key
var moviekey = apikeys.omdb;

// initialize request handler
var request = require("request");





console.log(apikeys.spotify);
console.log("\n\n\n")
console.log(moviekey)
console.log("-----begin program\n")
var nodeArgs = process.argv

var helpMessage = "Please use one of these four commands\n 1) concert-this\n 2) spotify-this-song\n 3) movie-this\n 4) do-what-it-says\n"

if (nodeArgs.length < 3) {
    console.log("Missing command");
    console.log(helpMessage)
} else {

    let command = nodeArgs[2]
    let commandArgString = nodeArgs.slice(3).join(" ");
    commandArgString = commandArgString.trim()
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
    if (artist === "") {
        console.log ("No Band, I can't provide venue information.")
        return ("just starting all over")
    }
    // This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
        let resultList = JSON.parse(body)
        prettyOutput = JSON.stringify(resultList, null, 4)
        console.log(prettyOutput)
        console.log("-------------------------------------------------------------")
        let allresults = ""
        for (let i = 0; i < resultList.length; i++) {
            let result = ""
            venueName = resultList[i]["venue"]["name"]
            // clean up date later   
            date = resultList[i]['datetime']
            venueLoc = resultList[i]['venue']['city'] + " " + resultList[i]['venue']['country']
            eventInfo = "Name: " + venueName + "\nLocation: " + venueLoc + "\nDate: " + date + "\n\n";
            allresults = allresults + eventInfo;
        }
        console.log("\n\n" + allresults)
        // console.log(prettyOutput)
    });
    // Name of the venue
    // Venue location
    // Date of the Event (use moment to format this as "MM/DD/YYYY")
}


// node liri.js spotify-this-song '<song name here>'
function spotifySong(song) {
    console.log("\nIn function: \nHere is your song! " + song)
    if (song === "") {
        song = "The Sign"
    }

    var searchLimit = 10

    spotify.search({ type: 'track', query: song, limit: searchLimit}, function (err, data) {
        // console.log(data)
        // console.log(JSON.stringify(data, null, 2))
        results = data['tracks']['items']
        let display = "";
        for (i = 0; i < results.length; i++) {
            let result = "";
            // This will show the following information about the song in your terminal/bash window
            // Artist(s)
            // The song's name
            // A preview link of the song from Spotify
            // The album that the song is from
            // If no song is provided then your program will default to "The Sign" by Ace of Base.
            artist = results[i]['album']["artists"][0]['name']
            songName = results[i]['name']
            albumName = results[i]['album']['name']
            prevLink = results[i]['preview_url']

            console.log("Artist: " + artist + "\nSongName: " + songName + "\nAlbum: " + albumName)
            console.log("Preview Link: " + prevLink + "\n")
            // console.log(results[i]['album'])
        }
    })
}





// node liri.js movie-this '<movie name here>'
function movieThis(movie) {
    console.log("\nIn function: \nHere is your movie " + movie)
    // This will output the following information to your terminal/bash window:

    if (movie === "") {
        movie = "Mr. Nobody"
    }

    request("http://omdbapi.com?apikey=" + moviekey + "&type=movie&t=" + movie, function (error, response, body) {

        searchResults = JSON.parse(body)
        console.log(searchResults);
        //    * Title of the movie.
        title = searchResults['Title']

        //    * Year the movie came out.
        yearOut = searchResults['Year']

        //    * IMDB Rating of the movie.   
        //    * Rotten Tomatoes Rating of the movie.
        let imdbRating = "N/A"
        let rottenTomRating = "N/A"

        let ratings = searchResults['Ratings']
        for (let i = 0; i<ratings.length; i++) {
            if (ratings[i]['Source'] === 'Internet Movie Database') {
                imdbRating = ratings[i]['Value']
            } else if (ratings[i]['Source'] === 'Rotten Tomatoes') {
                rottenTomRating = ratings[i]['Value']
            }

        }
   

        //    * Country where the movie was produced.
        let country = searchResults['Country']
        //    * Language of the movie.
        let language = searchResults['Language']
        //    * Plot of the movie.
        let plot = searchResults['Plot']
        //    * Actors in the movie.
        let actors = searchResults['Actors']

        console.log(title, yearOut, imdbRating, rottenTomRating, country, language)
        console.log(actors)
        console.log(plot)
        
    });

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




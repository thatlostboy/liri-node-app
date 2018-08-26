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

// initialize file handler
var fs = require("fs")

// initialize time handler
var moment = require("moment")

//  initialize log file
var logfile = "./log.txt"

// console.log(apikeys.spotify);
// console.log("\n\n\n")
// console.log(moviekey)
// console.log("-----begin program\n")

var nodeArgs = process.argv
var helpMessage = "Please use one of these four commands\n 1) concert-this\n 2) spotify-this-song\n 3) movie-this\n 4) do-what-it-says\n"
var longLine = "----------------------------------------------------------------------------\n"

if (nodeArgs.length < 3) {
    console.log("Missing command");
    console.log(helpMessage)
} else {
    // console.log("\n\n")
    let command = nodeArgs[2]
    let commandArgString = nodeArgs.slice(3).join(" ");
    commandArgString = commandArgString.trim()
    // console.log("Length: " + nodeArgs.length + "\nCommand: " + command + "\nParameters: " + commandArgString)

    selectChoice(command, commandArgString)
}


// Make it so liri.js can take in one of the following commands:

// concert-this
// spotify-this-song
// movie-this
// do-what-it-says

function selectChoice(command, commandArgString) {
    switch (command) {
        case "concert-this":
            //console.log("concert-this");
            concertThis(commandArgString);
            break;
        case "spotify-this-song":
            //console.log("spotify-this-song");
            spotifySong(commandArgString);
            break;
        case "movie-this":
            //console.log("movie-this");
            movieThis(commandArgString)
            break;
        case "do-what-it-says":
            //console.log("do-what-it-says");
            doWhatItSays(commandArgString)
            break;
        default:
            console.log("Could not Recognize Commands\n")
            console.log(helpMessage)
    }
}



// What Each Command Should Do

// node liri.js concert-this <artist/band name here>
function concertThis(artist) {
    
    let display = longLine;
    display = display + "concert-this band requested: " + artist+"\n\n"

    // If no band, nothign will be provided
    if (artist === "") {
        console.log("No Band, I can't provide venue information.")
        return ("just starting all over")
    }

    // This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
        
        
        try {
            let resultList = JSON.parse(body)
        } catch (error) {
            console.log("Artist Not Found!")
            return (false)
        }
        

        // prettyOutput = JSON.stringify(resultList, null, 4)
        // console.log(prettyOutput)
       
        if (resultList.length === 0) {
            console.log("Sorry.  Couldn't find any events by "+artist)
        } else {
            
            for (let i = 0; i < resultList.length; i++) {
                let result = ""
                venueName = resultList[i]["venue"]["name"]
                // clean up date later   
                date = resultList[i]['datetime']
                venueLoc = resultList[i]['venue']['city'] + ", " + resultList[i]['venue']['country']
                eventInfo = "Name: " + venueName + "\nLocation: " + venueLoc + "\nDate: " + date + "\n\n";
                display = display + eventInfo;
            }
            console.log("\n\n" + display)
            appendFile(display)

        }
    });
    // Name of the venue
    // Venue location
    // Date of the Event (use moment to format this as "MM/DD/YYYY")
}


// node liri.js spotify-this-song '<song name here>'
function spotifySong(song) {
    let display = longLine;
    display = display + "spotify-this-song Song Requested: " + song+"\n\n"

    // If no song is provided then your program will default to "The Sign" by Ace of Base.
    if (song === "") {
        song = "The Sign"
    }

    var searchLimit = 10

    spotify.search({ type: 'track', query: song, limit: searchLimit }, function (err, data) {
        // console.log(data)
        // console.log(JSON.stringify(data, null, 2))

        if (data['tracks']['total'] > 1) {
            results = data['tracks']['items']
            
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

                result = "Artist: " + artist + "\nSongName: " + songName + "\nAlbum: " + albumName
                result = result + "\n"+"Preview Link: " + prevLink + "\n"
                display = display + result + "\n\n"
            }
            console.log(display)
            appendFile(display)
        } else {
            console.log("Sorry. No songs found by the name: "+song)
        }

    })
}





// node liri.js movie-this '<movie name here>'
function movieThis(movie) {
    let display = longLine;
    display = display + "movie-this movie Requested: " + movie+"\n\n"

    // This will output the following information to your terminal/bash window:

    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    // If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
    // It's on Netflix!
    if (movie === "") {
        movie = "Mr. Nobody"
    }

    request("http://omdbapi.com?apikey=" + moviekey + "&type=movie&t=" + movie, function (error, response, body) {

        searchResults = JSON.parse(body)
        // console.log(searchResults);

        if (searchResults['Response'] === "True") {



            //    * Title of the movie.
            title = searchResults['Title']

            //    * Year the movie came out.
            yearOut = searchResults['Year']

            //    * IMDB Rating of the movie.   
            //    * Rotten Tomatoes Rating of the movie.
            let imdbRating = "N/A"
            let rottenTomRating = "N/A"

            let ratings = searchResults['Ratings']
            for (let i = 0; i < ratings.length; i++) {
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

            
            display = display + "Title: "+title + "\nYear: " + yearOut + "\nIMBD Rating: "+ imdbRating + "\nRotten Tomatoes Rating: " + rottenTomRating + "\nCountry: "+ country + "\nLanguage: " + language + "\nActors: " + actors + "\nPlot: " + plot + "\n\n"
            console.log(display)
            appendFile(display)
        } else {
            console.log("Sorry.  No Movie found by that name: "+movie)
        }

    });





}




// node liri.js do-what-it-says
function doWhatItSays() {
    //console.log("\nIn function do-what-it-says\n")
    // Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

    fs.readFile("./random.txt", "utf8", function (err, data) {
        //console.log(data);

        if (err) {
            console.log("Stopped due to --> " + err)
            return (false)
        } 


        data = data.trim();

        // check for any commands
        if (data !== "") {
            commandArray = data.split(",")
            //console.log(commandArray)
            //console.log("length: "+commandArray.length)
            if (commandArray[0] === "do-what-it-says") {
                console.log("Sorry! Can't do that, that could possibly cause an infinite loop!")
                return ("Sorry")
            }
            selectChoice(commandArray[0], commandArray[1])
        } else {
            console.log("Didn't see any commands in text file")
            console.log(helpMessage)
        }

    })
    // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
    // Feel free to change the text in that document to test out the feature for other commands.

}


function appendFile (dataStr) {
    fs.appendFile(logfile, dataStr, function(err){
        if (err) throw err;
        console.log("appended to file: "+logfile)
    })
}


// BONUS


// In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
// Make sure you append each command you run to the log.txt file. 
// Do not overwrite your file each time you run a command.




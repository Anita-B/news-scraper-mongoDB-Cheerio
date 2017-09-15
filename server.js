// News Scraper using mongoDB and Cheerio

// Dependencies
// =============================================================
var express = require("express");
//var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
//var mongojs = require("mongojs");
// command line logger
var logger = require("morgan");

// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// mongo database helper
var mongoose = require("mongoose");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// scraping tools
var cheerio = require("cheerio");
var request = require("request");



// Express
// =============================================================
var PORT = process.env.PORT || 3000;
var app = express();
var path = require("path");


// Use morgan and body parser with our app
// =============================================================
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Serve static content for the app
// from the "public" directory in the application directory.
app.use(express.static("public"));



// Mongoose
// =============================================================
// Database configuration with mongoose
//mongoose.connect("mongodb://localhost/newsscraper");

var databaseUri = 'mongodb://localhost/newsscraper';

if (process.env.MONGODB_URI){
  //this executes if this is being executed in your heroku app
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

var db = mongoose.connection;

//Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});





// Routes
// =============================================================
//require("./routes/index_routes.js")(app);

// 2. Scrape the website
// ====================================================
// A GET request to scrape the echojs website
app.get("/scraper", function(req, res) {
  console.log("got here to scraper!!!!!!!!!!!");
  // First, we grab the body of the html with request
  request("https://www.newyorker.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("section .Card__content___10ZW7").each(function(i, element) {

      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(element).find("a").find("h3").text();
      result.link = $(element).find("a").find("h3").parent().attr("href");
      result.summary = $(element).find("div").find("p").text();
      result.saved = false;

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });

  });
  // Tell the browser that we finished scraping the text
  //res.send("Scrape Complete");
  res.sendFile(path.join(__dirname, "public/index.html"));
});
// // A GET request to scrape the echojs website
// app.get("/scraper", function(req, res) {
//   console.log("got here to scraper!!!!!!!!!!!");
//   // First, we grab the body of the html with request
//   request("http://www.echojs.com/", function(error, response, html) {
//     // Then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(html);
//     // Now, we grab every h2 within an article tag, and do the following:
//     $("article h2").each(function(i, element) {
//
//       // Save an empty result object
//       var result = {};
//       // Add the text and href of every link, and save them as properties of the result object
//       result.title = $(this).children("a").text();
//       result.link = $(this).children("a").attr("href");
//       result.summary = $(this).children("a").text();
//       result.saved = false;
//
//       // Using our Article model, create a new entry
//       // This effectively passes the result object to the entry (and the title and link)
//       var entry = new Article(result);
//
//       // Now, save that entry to the db
//       entry.save(function(err, doc) {
//         // Log any errors
//         if (err) {
//           console.log(err);
//         }
//         // Or log the doc
//         else {
//           //console.log(doc);
//         }
//       });
//
//     });
//
//   });
//   // Tell the browser that we finished scraping the text
//   //res.send("Scrape Complete");
//   res.sendFile(path.join(__dirname, "public/index.html"));
// });

app.get("/saved", function(req, res) {
  res.sendFile(path.join(__dirname, "public/saved.html"));
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});


// Create a new note or replace an existing note
app.post("/saved/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  //var newNote = new Note(req.body);

  // And save the new note the db
  // newNote.save(function(error, doc) {
  //   // Log any errors
  //   if (error) {
  //     console.log(error);
  //   }
  //   // Otherwise
  //   else {
      // Use the article id to find and update it's note
            console.log("params:"+req.params );
      console.log("_id:"+req.params._id );
      Article.findOneAndUpdate({ "_id": req.params.id }, { saved: true })
      // Execute the above query
      .exec(function(err, doc) {
        console.log('toto');
        // Log any errors
        if (err) {
          console.log('we got a problem');
          console.log(err);
        }
        else {
          // Or send the document to the browser
          console.log('correct!!!!');
          res.send(doc);
        }
      });
    //}
  //});
});

app.post("/delete/:id", function(req, res) {
  Article.findOneAndUpdate({ "_id": req.params.id }, { saved: false })
  // Execute the above query
  .exec(function(err, doc) {
    console.log('toto');
    // Log any errors
    if (err) {
      console.log('we got a problem');
      console.log(err);
    }
    else {
      // Or send the document to the browser
      console.log(req.params.id+'has been deleted - correct!!!!');
      console.log(doc)
      res.send(doc);
    }
  });
});

// Get the saved articles from the database
// ====================================================
app.get("/get-saved-articles", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.find({saved:true})
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      console.log("get saved article has been executed");
      res.json(doc);
    }
  });
});

// Listen on port 3000
// =============================================================
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});

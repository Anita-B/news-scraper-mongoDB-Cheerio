// Routes =============================================================
module.exports = function(app) {

  // TODO: You will make six more routes. Each will use mongojs methods
  // to interact with your mongoDB database.
  // -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/


  // 0. Simple index route
  // ===========================================
  // app.get("/", function(req, res) {
  //   res.render("index");
  // });


  // 1. Save a note to the database's collection
  // ===========================================




  // // 2. Scrape the website
  // // ====================================================
  // // A GET request to scrape the echojs website
  // app.get("/scraper", function(req, res) { console.log("got here!!!!!!!!!!!");
  //   // First, we grab the body of the html with request
  //   request("http://www.echojs.com/", function(error, response, html) {
  //     // Then, we load that into cheerio and save it to $ for a shorthand selector
  //     var $ = cheerio.load(html);
  //     // Now, we grab every h2 within an article tag, and do the following:
  //     $("article h2").each(function(i, element) {
  //
  //       // Save an empty result object
  //       var result = {};
  //
  //       // Add the text and href of every link, and save them as properties of the result object
  //       result.title = $(this).children("a").text();
  //       result.link = $(this).children("a").attr("href");
  //       result.summary = $(this).children("a").text();
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
  //           console.log(doc);
  //         }
  //       });
  //
  //     });
  //   });
  //   // Tell the browser that we finished scraping the text
  //   //res.send("Scrape Complete");
  //   res.render("index");
  // });



  // 3. Retrieve one note in the database's collection by it's ObjectId
  // TIP: when searching by an id, the id needs to be passed in
  // as (mongojs.ObjectId(IDYOUWANTTOFIND))
  // ==================================================================




  // 4. Update one note in the database's collection by it's ObjectId
  // (remember, mongojs.ObjectId(IDYOUWANTTOFIND)
  // ================================================================




  // 5. Delete one note from the database's collection by it's ObjectId
  // (remember, mongojs.ObjectId(IDYOUWANTTOFIND)
  // ==================================================================




  // 6. Clear the entire note collection
  // ===================================

};

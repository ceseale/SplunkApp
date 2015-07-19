/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');


var splunkjs = require('splunk-sdk');
    var Async = splunkjs.Async;
var service ; 


exports.login = function (req, res){

service = new splunkjs.Service({username: req.body.username , password: req.body.password });
service.login(function(err, success) {
    if (err) {
       res.send(err)
    } else {
    console.log("Login was successful: " + success);
    res.send(success)
  }

});

}



exports.getJobs = function (req, res){
  var jobList = [];

    service.jobs().fetch(function(err, jobs) {

        var list = jobs.list();
        for(var i = 0; i < list.length; i++) {
          jobList.push( {search : list[i]._state.name , time : list[i]._state.updated, sid: list[i].properties().sid } )
        }
        res.send(jobList) 
    });



}

  

// Get list of things
exports.index = function(req, res) {
  res.json([
  {
  name : 'Development Tools',
  info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
  name : 'Server and Client integration',
  info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
  name : 'Smart Build System',
  info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
  name : 'Modular Structure',
  info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
  name : 'Optimized Build',
  info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{ 
  name : 'Deployment Ready',
  info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  }
  ]);
};

  

  
 
exports.getAccidentData = function (req, res){


res.send({out:[], home: []})

} 
  
  
  
exports.search = function (req, res){
  if(req.body.age){
 var searchQuery = req.body.query  + "| search age>=0"
  } else if (req.body.ems){
  var searchQuery = req.body.query  + "| search ems_lag>=0"
  } else {
     var searchQuery = req.body.query  + "| search death_lag>=0"
  }

 

 
// var searchQuery = "head 200000 | " + req.body.query;
// , 'offset': 50000
var params = {output_mode : 'JSON' ,"exec_mode": "normal", "count" : 30000000 }
var searchParams = {output_mode : 'JSON' ,"exec_mode": "blocking", "count" : 30000000 }
// Create a blocking search, which returns the job's SID when the search is done
console.log("Wait for the search to finish...");
var spulnkData = [] ; 
var toCount = []; 
var showData = [];
var goodData = {}
// Create the search, wait for it to finish, and get back a job
service.search(
  searchQuery,
  searchParams,
  function(err, job) {
    console.log("...done!\n");
   
    // Get the job from the server to display more info
    job.fetch(function(err){
      // Display properties of the job
     
      // Page through results by looping through sets of 10 at a time
      var resultCount = job.properties().resultCount; // Number of results this job returned
      var myOffset = 0;         // Start at result 0
      var myCount = 49999;         // Get sets of 10 results at a time

      // Run an asynchronous while loop using the Async.whilst helper function to
      // loop through each set of results 
      splunkjs.Async.whilst(

        // Condition--loop while there are still results to display
        function() {
          return (myOffset < resultCount);
        },

        // Body--display each set of results
        function(done) {
          // Get one set of results
          job.results({count: myCount,offset:myOffset}, function(err, results) {
            results.rows.forEach(function (item,index){
              if (index < 11){
                showData.push({event: item[3]})
               
              }
              var rawData = (item[3].split(','))

              var ageOk = rawData[0].length && rawData[0]!="999" && rawData[0]!="998";
              var deathOk =  rawData[rawData.length -3].length ;
              var emsOk =   rawData[rawData.length -2].length ;



            if(req.body.age && ageOk){
              goodData[rawData[58] + rawData[61] + rawData[147]] = {GoogleLat : +rawData[58] ,GoogleLng : +rawData[61] ,lag_seconds : +rawData[0]}
            } else if(req.body.death && deathOk){
               goodData[rawData[58] + rawData[61] + rawData[147]] = {GoogleLat : +rawData[58] ,GoogleLng : +rawData[61] ,lag_seconds : +rawData[rawData.length -3]}
            } else if(req.body.ems && emsOk) {
               goodData[rawData[58] + rawData[61] + rawData[147]] = {GoogleLat : +rawData[58] ,GoogleLng : +rawData[61] ,lag_seconds : +rawData[rawData.length -2]}
            }
 
              // spulnkData.push({GoogleLat : +rawData[58] ,lgt_cond:rawData[3] , weather: rawData[2],drunk: rawData[0] ,GoogleLng : +rawData[61] ,lag_seconds : +rawData[6], doa : '1' })
            })
          
            
            // Increase the offset to get the next set of results
            // once we are done processing the current set.
            if(Object.keys(goodData).length < 85000){
            myOffset = myOffset + myCount;
          } else {
             myOffset = 1000000000;
          }

            done();
          })
        },
 
        // Done
        function(err){
          console.log(Object.keys(goodData).length )
          Object.keys(goodData).forEach(function (item){
            spulnkData.push(goodData[item])
          })
          res.send({out:spulnkData, home: showData})

            // console.log(spulnkData[]
          if (err) console.log("Error: " + err);
        }
      );
    });
  }
);

 
}

exports.getTerrorData = function (req, res){

 res.send(200)
}

// var cps = require('cps-api');
// var conn = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'bayesdata', 'ceseale3@gmail.com', 'Danger5475', 'document', 'document/id', {account: 100689});

// var search_req = new cps.SearchRequest(cps.Term("*"), 0 , 10);
// conn.sendRequest(search_req, function (err, search_resp) {
//    if (err) return console.log(err);
//    console.log(search_resp.results);
// });

///////


//////////////////////////////////////////////////////////////////////////////

function getCounts(data){
  return data.reduce(function (ob,  item ){

    ob[item.drunk] = (ob[item.drunk] += 1) || 1;
    ob[item.weather] = (ob[item.weather] += 1) || 1;
    ob[item.lgt_cond] = (ob[item.lgt_cond] += 1) || 1;
    return ob;
  }, {})

}


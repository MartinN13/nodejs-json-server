/**
 * The JSON server.
 */

// A better router to create a handler for all routes
//import Router from "./router";
import Router from "./router";
var router = new Router();

// Import the http server as base
var http = require("http");
var url = require("url");

// Global variables
var queryKey,
    queryValue;

/**
 * Create the server.
 */
var server = http.createServer((req, res) => {
    var ipAddress,
        urlParts,
        route,
        query,
        queryString;

    // Log incoming requests
    ipAddress = req.connection.remoteAddress;

    // Check what route is requested
    var qs = require('querystring');
 
    urlParts = url.parse(req.url, true);
    route = urlParts.pathname;
    query = urlParts.query;
    queryString = qs.stringify(query);

    // Save queryString
    Object.keys(query).forEach( key => {
        queryKey = key;
        queryValue = query[key];
    });

    if (queryString === "") {
        console.log("Incoming route " + route + " from ip " + ipAddress);
    } else {
        console.log("Incoming route " + route + " from ip " + ipAddress + " with querystring " + queryString);
    }

    // Let the router take care of all requests
    router.route(req, res);
});

// Load JSON file
var obj = "";
require('fs').readFile('../salar.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
});

/**
 * Wrapper function for sending a JSON response.
 *
 * @param  Object        res     The response
 * @param  Object/String content What should be written to the response
 * @param  Integer       code    HTTP status code
 */
function sendJSONResponse(res, content, code = 200) {
    res.writeHead(code, "Content-Type: application/json");
    res.write(JSON.stringify(content, null, "    "));
    res.end();

    if (debug == 1) {
      console.log("Sending response: \n" + JSON.stringify(content, null, "    "));
    }
}

/**
 * Display a helptext about the API.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/", (req, res) => {
    var indexMessage = ("Welcome to the server! This is the API:\n\n"
        + " /                           Display this helptext.\n"
        + " /room/list                  List all rooms.\n"
        + " /room/view/id/:number       View the room with the specified id.\n"
        + " /room/view/house/:house     View every room in a specified house.\n"
        + " /room/search/:search        Search for a room.\n"
    );

    res.writeHead(200, "Content-Type: text/plain");
    res.write(indexMessage);
    res.end();

    if (debug == 1) {
      console.log("Sending response: \n" + indexMessage);
    }    

});

/**
 * List all rooms.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/list", (req, res) => {
    if (queryKey == "max") {
      var objFiltered = JSON.stringify(obj, null, "    ").split("\n");
      var resultsToRemove = (objFiltered.length - 4) / 11 - queryValue;
    
      for (var i = 0; i < resultsToRemove * 11; i++) {
        objFiltered.splice(objFiltered.length - 3, 1);
      }
    
      objFiltered[objFiltered.length - 3] = "        }";
      objFiltered = objFiltered.join("\n");
      objFiltered = JSON.parse(objFiltered);
    
      queryKey = "";
    
      sendJSONResponse(res, objFiltered);
    } else {
      sendJSONResponse(res, obj);
    }
});

/**
 * List all rooms matching number.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/id/:number", (req, res) => {
    var number = req.params.number;
    var numberMatch = obj.salar.filter(function(sal) {
        return sal.Salsnr == number;
    });
    
    sendJSONResponse(res, numberMatch);
});

/**
 * List all rooms matching house.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/house/:house", (req, res) => {
    var house = req.params.house;
    var houseMatch = obj.salar.filter(function(sal) {
        return sal.Hus == house;
    });

    if (queryKey == "max") {
      var objFiltered = JSON.stringify(houseMatch, null, "    ").split("\n");
      var resultsToRemove = (objFiltered.length - 2) / 11 - queryValue;
  
      for (var i = 0; i < resultsToRemove * 11; i++) {
        objFiltered.splice(objFiltered.length - 3, 1);
      }

      objFiltered[objFiltered.length - 2] = "    }";
      objFiltered = objFiltered.join("\n");
      objFiltered = JSON.parse(objFiltered);
  
      queryKey = "";

      sendJSONResponse(res, objFiltered);
    } else {
      sendJSONResponse(res, houseMatch);
    }
});

/**
 * List all rooms matching search string.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/search/:search", (req, res) => {
    var search = String(req.params.search);

    var numberMatch = obj.salar.filter(function(sal) {
        if (sal.Salsnr != null) {
            return sal.Salsnr.indexOf(search) !== -1;
        }
    });

    var nameMatch = obj.salar.filter(function(sal) {
        if (sal.Salsnamn != null) {
            return sal.Salsnamn.indexOf(search) !== -1;
        }
    });

    var latMatch = obj.salar.filter(function(sal) {
        if (sal.Lat != null) {
            return sal.Lat.indexOf(search) !== -1;
        }
    });

    var longMatch = obj.salar.filter(function(sal) {
        if (sal.Lot != null) {
            return sal.Lot.indexOf(search) !== -1;
        }
    });

    var placeMatch = obj.salar.filter(function(sal) {
        if (sal.Ort != null) {
            return sal.Ort.indexOf(search) !== -1;
        }
    });

    var houseMatch = obj.salar.filter(function(sal) {
        if (sal.Hus != null) {
            return sal.Hus.indexOf(search) !== -1;
        }
    });

    var floorMatch = obj.salar.filter(function(sal) {
        if (sal.Våning != null) {
            return sal.Våning.indexOf(search) !== -1;
        }
    });

    var typeMatch = obj.salar.filter(function(sal) {
        if (sal.Typ != null) {
            return sal.Typ.indexOf(search) !== -1;
        }
    });

    var sizeMatch = obj.salar.filter(function(sal) {
        if (sal.Storlek != null) {
            return sal.Storlek.indexOf(search) !== -1;
        }
    });

    var searchMatch = numberMatch.concat(houseMatch, nameMatch, latMatch, longMatch,
                            placeMatch, floorMatch, typeMatch, sizeMatch);

    if (queryKey == "max") {
      var objFiltered = JSON.stringify(searchMatch, null, "    ").split("\n");
      var resultsToRemove = (objFiltered.length - 2) / 11 - queryValue;
  
      for (var i = 0; i < resultsToRemove * 11; i++) {
        objFiltered.splice(objFiltered.length - 3, 1);
      }

      objFiltered[objFiltered.length - 2] = "    }";
      objFiltered = objFiltered.join("\n");
      objFiltered = JSON.parse(objFiltered);
  
      queryKey = "";

      sendJSONResponse(res, objFiltered);
    } else {
      sendJSONResponse(res, searchMatch);
    }
});

/**
 * List all rooms matching search string with priority sorting.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/searchp/:search", (req, res) => {
    var search = String(req.params.search);

    var numberMatchExact = obj.salar.filter(function(sal) {
        if (sal.Salsnr != null) {
            return sal.Salsnr == search;
        }
    });

    var nameMatchExact = obj.salar.filter(function(sal) {
        if (sal.Salsnamn != null) {
            return sal.Salsnamn == search;
        }
    });

    var latMatchExact = obj.salar.filter(function(sal) {
        if (sal.Lat != null) {
            return sal.Lat == search;
        }
    });

    var longMatchExact = obj.salar.filter(function(sal) {
        if (sal.Lot != null) {
            return sal.Lot == search;
        }
    });

    var placeMatchExact = obj.salar.filter(function(sal) {
        if (sal.Ort != null) {
            return sal.Ort == search;
        }
    });

    var houseMatchExact = obj.salar.filter(function(sal) {
        if (sal.Hus != null) {
            return sal.Hus == search;
        }
    });

    var floorMatchExact = obj.salar.filter(function(sal) {
        if (sal.Våning != null) {
            return sal.Våning == search;
        }
    });

    var typeMatchExact = obj.salar.filter(function(sal) {
        if (sal.Typ != null) {
            return sal.Typ == search;
        }
    });

    var sizeMatchExact = obj.salar.filter(function(sal) {
        if (sal.Storlek != null) {
            return sal.Storlek == search;
        }
    });

    function relevance(score, match) {
      if (match.length > 0) {
        score = score + 0.5;
      }
      return score;
    }

    var numberMatchExactScore = 0.0,
        houseMatchExactScore = 0.0,
        nameMatchExactScore = 0.0,
        latMatchExactScore = 0.0,
        longMatchExactScore = 0.0,
        placeMatchExactScore = 0.0,
        floorMatchExactScore = 0.0,
        typeMatchExactScore = 0.0,
        sizeMatchExactScore = 0.0;

    numberMatchExactScore = relevance(numberMatchExactScore, numberMatchExact);
    houseMatchExactScore = relevance(houseMatchExactScore, houseMatchExact);
    nameMatchExactScore = relevance(nameMatchExactScore, nameMatchExact);
    latMatchExactScore = relevance(latMatchExactScore, latMatchExact);
    longMatchExactScore = relevance(longMatchExactScore, longMatchExact);
    placeMatchExactScore = relevance(placeMatchExactScore, placeMatchExact);
    floorMatchExactScore = relevance(floorMatchExactScore, floorMatchExact);
    typeMatchExactScore = relevance(typeMatchExactScore, typeMatchExact);
    sizeMatchExactScore = relevance(sizeMatchExactScore, sizeMatchExact);

    // Next add 0.3(?) if something partially matches

    // How do I return the score with each match? Maybe add a json item named score?

    var searchMatch = numberMatchExact.concat(houseMatchExact, nameMatchExact, latMatchExact, longMatchExact,
                            placeMatchExact, floorMatchExact, typeMatchExact, sizeMatchExact);

    if (queryKey == "max") {
      var objFiltered = JSON.stringify(searchMatch, null, "    ").split("\n");
      var resultsToRemove = (objFiltered.length - 2) / 11 - queryValue;
  
      for (var i = 0; i < resultsToRemove * 11; i++) {
        objFiltered.splice(objFiltered.length - 3, 1);
      }

      objFiltered[objFiltered.length - 2] = "    }";
      objFiltered = objFiltered.join("\n");
      objFiltered = JSON.parse(objFiltered);
  
      queryKey = "";

      sendJSONResponse(res, objFiltered);
    } else {
      sendJSONResponse(res, searchMatch);
    }
    
});

// Export the server
export default server;
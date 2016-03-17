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
}

/**
 * Display a helptext about the API.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/", (req, res) => {
    res.writeHead(200, "Content-Type: text/plain");
    res.write("Welcome to the server! This is the API:\n\n"
        + " /                           Display this helptext.\n"
        + " /room/list                  List all rooms.\n"
        + " /room/view/id/:number       View the room with the specified id.\n"
        + " /room/view/house/:house     View every room in a specified house.\n"
        + " /room/search/:search        Search for a room.\n"
    );
    res.end();
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

// Export the server
export default server;

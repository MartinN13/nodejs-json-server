// A better router to create a handler for all routes
//import Router from "./router";
import Router from "./router";
var router = new Router();

// Import the http server as base
var http = require("http");
var url = require("url");

// Load JSON file
var obj = "";

require('fs').readFile('../salar.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
});

/**
 * Wrapper function for sending a JSON response
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
 * List all rooms
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/list", (req, res) => {
    sendJSONResponse(res, obj);
});

/**
 * List all rooms matching number
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
 * List all rooms matching house
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/house/:house", (req, res) => {
    var house = req.params.house;
    var houseMatch = obj.salar.filter(function(sal) {
        return sal.Hus == house;
    });
     
    sendJSONResponse(res, houseMatch);
});

/**
 * List all rooms matching search string
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

    var merge = function() {
        var destination = {},
            sources = [].slice.call( arguments, 0 );
        sources.forEach(function( source ) {
            var prop;
            for ( prop in source ) {
                if ( prop in destination && Array.isArray( destination[ prop ] ) ) {
                    
                    // Concat Arrays
                    destination[ prop ] = destination[ prop ].concat( source[ prop ] );
                    
                } else if ( prop in destination && typeof destination[ prop ] === "object" ) {
                    
                    // Merge Objects
                    destination[ prop ] = merge( destination[ prop ], source[ prop ] );
                    
                } else {
                    
                    // Set new values
                    destination[ prop ] = source[ prop ];
                    
                }
            }
        });
        return destination;
    };

    var searchMatch = merge(numberMatch, houseMatch, nameMatch, latMatch, longMatch,
                            placeMatch, floorMatch, typeMatch, sizeMatch);

    sendJSONResponse(res, searchMatch);
});

/**
 * Create and export the server
 */
var server = http.createServer((req, res) => {
    var ipAddress,
        route;

    // Log incoming requests
    ipAddress = req.connection.remoteAddress;

    // Check what route is requested
    route = url.parse(req.url).pathname;
    console.log("Incoming route " + route + " from ip " + ipAddress);

    // Let the router take care of all requests
    router.route(req, res);
});

export default server;

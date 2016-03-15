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
        sendJSONResponse(res, obj);
});

/**
 * List all rooms matching house
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/house/:house", (req, res) => {
        sendJSONResponse(res, obj);
});

/**
 * List all rooms matching search string
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/search/:search", (req, res) => {
        sendJSONResponse(res, obj);
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

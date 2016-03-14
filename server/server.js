// A better router to create a handler for all routes
//import Router from "./router";
import Router from "./router";
var router = new Router();

// Import the http server as base
var http = require("http");
var url = require("url");

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
 * Initialize the game
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/start/:size", (req, res) => {

    // get the value of the parameter :size
    var size = req.params.size;

    // Init the Gomoku board
    var message = "The board is initialized.";
    try {
        gameBoard.start(size);
    } catch (e) {
        message = e.message;
    }

    // Send the response
    sendJSONResponse(res, {
        "message": message,
        "boardSize": gameBoard.getSize(),
        "nextPlayer": gameBoard.playerInTurn(),
        "nextPlayerMarker": gameBoard.playerInTurnMarker()
    });
});



/**
 * View the gameboard
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/view", (req, res) => {

    sendJSONResponse(res, {
        "boardSize": gameBoard.getSize(),
        "nextPlayer": gameBoard.playerInTurn(),
        "nextPlayerMarker": gameBoard.playerInTurnMarker(),
        "boardAscii": gameBoard.asAscii()
    });
});



/**
 * View the gameboard as ascii.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/view/ascii", (req, res) => {

    res.writeHead(200, "Content-Type: text/plain");
    res.write(gameBoard.asAscii()
        + "\nPlayer in turn is '"
        + gameBoard.playerInTurn()
        + "' playing the marker "
        + gameBoard.playerInTurnMarker()
        + ".\n");
    res.end();
});



/**
 * View the gameboard
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/place/:x/:y", (req, res) => {

    // get the value of the parameter :x and :y
    var x = Number.parseInt(req.params.x);
    var y = Number.parseInt(req.params.y);

    // Place the marker
    var message = "Ok.";
    try {
        gameBoard.place(x, y);
    } catch (e) {
        message = e.message;
    }

    sendJSONResponse(res, {
        "action": "Trying to place " + x + ", " + y,
        "message": message,
        "boardSize": gameBoard.getSize(),
        "nextPlayer": gameBoard.playerInTurn(),
        "nextPlayerMarker": gameBoard.playerInTurnMarker(),
        "boardIsFull": gameBoard.isFull(),
        "playerWon": gameBoard.gameOver()
    });

    if (gameBoard.gameOver() == "Player X has won!" || gameBoard.gameOver() == "Player Y has won!") {
        console.log("Game over, clearing gameboard...");
        gameBoard.clear();
    }
});



/**
 * Place a random marker
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/place/random", (req, res) => {

    var position = placeRandom();

    // Place the marker
    var message = "Ok.";
    try {
        gameBoard.place(position[0], position[1]);
    } catch (e) {
        message = e.message;
    }

    sendJSONResponse(res, {
        "action": "Trying to place " + position[0] + ", " + position[1],
        "message": message,
        "boardSize": gameBoard.getSize(),
        "nextPlayer": gameBoard.playerInTurn(),
        "nextPlayerMarker": gameBoard.playerInTurnMarker(),
        "boardIsFull": gameBoard.isFull(),
        "playerWon": gameBoard.gameOver()
    });

    if (gameBoard.gameOver() == "Player X has won!" || gameBoard.gameOver() == "Player Y has won!") {
        console.log("Game over, clearing gameboard...");
        gameBoard.clear();
    }
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

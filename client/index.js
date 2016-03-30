#!/usr/bin/env babel-node

/**
 * Main program to run the client for the JSON server.
 */

const VERSION = "1.0";
global.debug = 0;

// For CLI usage
var path = require("path");
var scriptName = path.basename(process.argv[1]);
var args = process.argv.slice(2);
var arg;

// Get the server with defaults
import JSONClient from "./client.js";

var client = new JSONClient();
var server = "http://localhost";
var port = "1337";

// Initialize prompt
var readline = require("readline");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Display helptext about usage of this script.
 */
function usage() {
    console.log(`Usage: ${scriptName} [options]

Options:
 -h               Display help text.
 -v               Display the version.
 --server <url>   Set the server url to use.
 --port <port>    Set the server port to use.`);
}

/**
 * Display helptext about bad usage.
 *
 * @param String message to display.
 */
function badUsage(message) {
    console.log(`${message}
Use -h to get an overview of the command.`);
}

/**
 * Display version.
 */
function version() {
    console.log(VERSION);
}

// Walkthrough all arguments checking for options
while ((arg = args.shift()) !== undefined) {
    switch (arg) {
        case "-h":
            usage();
            process.exit(0);
            break;

        case "-v":
            version();
            process.exit(0);
            break;

        case "--server":
            server = args.shift();
            if (server === undefined) {
                badUsage("--server must be followed by an url.");
                process.exit(1);
            }
            break;

        case "--port":
            port = args.shift();
            if (port === undefined) {
                badUsage("--port must be followed by a port number.");
                process.exit(1);
            }
            break;

        case "--debug2":
            console.log("Debugging on.");
            debug = 1;
            break;

        default:
            badUsage("Unknown argument.");
            process.exit(1);
            break;
    }
}

/**
 * Display a menu.
 */
function menu() {
    console.log(`Commands available:
exit            Leave this program.
menu            Print this menu.
url             Get url to view the server in browser.
list            List all rooms.
view <id>       View the room with the selected id.
house <house>   View the names of all rooms in this building (house).
search <string> View the details of all matching rooms (one per row).`);
}

/**
 * Menu options.
 */
 rl.on("line", function(line) {
     // Split incoming line with arguments into an array
     var args = line.trim().split(" ");
     args = args.filter(value => {
         return value !== "";
     });

    switch (args[0]) {
        case "exit":
             process.exit(0);
             break;

        case "menu":
             menu();
             rl.prompt();
             break;

        case "list":
            client.list(args[1])
            .then(value => {
                value = value.replace(/[{},"]/g, "").replace(/[\[\]']+/g,'')
                value = value.split("\n");
                var i = 3;
                while (i < value.length - 1) {
                    console.log(value[i].substring(4) + ", " + value[i+1].substring(12));
                    i = i + 11;
                };
                rl.prompt();
            })
            .catch(err => {
                console.log("FAILED: Could not list all rooms.\nDetails: " + err);
                rl.prompt();
            });
            break;

        case "view":
            client.view(args[1])
            .then(value => {
                value = value.replace(/[{},"]/g, "").replace(/[\[\]']+/g,'')
                console.log(value);
                rl.prompt();
            })
            .catch(err => {
                console.log("FAILED: Could not list rooms.\nDetails: " + err);
                rl.prompt();
            });
            break;

        case "house":
            client.house(args[1], args[2])
            .then(value => {
                value = value.replace(/[{},"]/g, "").replace(/[\[\]']+/g,'')
                value = value.split("\n");
                var i = 2;
                while (i < value.length - 1) {
                    console.log(value[i] + ", " + value[i+1].substring(8));
                    i = i + 11;
                };
                rl.prompt();
            })
            .catch(err => {
                console.log("FAILED: Could not list rooms.\nDetails: " + err);
                rl.prompt();
            });
            break;

        case "search":
            client.search(args[1], args[2])
            .then(value => {
                value = value.replace(/[{},"]/g, "").replace(/[\[\]']+/g,'')
                value = value.split("\n");
                var i = 2;
                while (i < value.length - 1) {
                    console.log(value[i] + ", " + value[i+1].substring(8));
                    i = i + 11;
                };
                rl.prompt();
            })
            .catch(err => {
                console.log("FAILED: Could not list rooms.\nDetails: " + err);
                rl.prompt();
            });
            break;

        case "searchp":
            client.searchp(args[1], args[2])
            .then(value => {
                value = value.replace(/[{},"]/g, "").replace(/[\[\]']+/g,'')
                value = value.split("\n");
                var i = 2;
                while (i < value.length - 1) {
                    console.log(value[i] + ", " + value[i+1].substring(8) + ", " + value[i+9].substring(8));
                    i = i + 12;
                };
                rl.prompt();
            })
            .catch(err => {
                console.log("FAILED: Could not list rooms.\nDetails: " + err);
                rl.prompt();
            });
            break;

        case "url":
            console.log("Use this url to view the server in a browser:\n" + server + ":" + port);
            rl.prompt();
            break;

        default:
            console.log("Enter 'menu' to see all available commands.");
            rl.prompt();
     }
 });

 rl.on("close", function() {
     process.exit(0);
 });

// Main
client.setServer(server + ":" + port);
console.log("Use -h to get a list of options to start this program.");
console.log("Ready to talk to server at '" + server + ":" + port + "'");
console.log("Use 'menu' to get a list of commands.");
rl.setPrompt("JSON Server$ ");
rl.prompt();

/**
 * Client for the JSON server.
 */

// Import the http server as base
var http = require("http");

/**
 * Class for the JSON client.
 */
class JSONClient {
    /**
     * Set the url of the server to connect to.
     *
     * @param  String url to use to connect to the server.
     *
     */
    setServer(url) {
        this.server = url;
    }

    /**
     * Make a HTTP GET request, wrapped in a Promise.
     *
     * @param  String url to connect to.
     *
     * @return Promise
     *
     */
    httpGet(url) {
        return new Promise((resolve, reject) => {
            http.get(this.server + url, (res) => {
                var data = "";

                res.on('data', (chunk) => {
                    data += chunk;
                }).on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                }).on('error', (e) => {
                    reject("Got error: " + e.message);
                });
            });
        });
    }

    /**
     * List all rooms.
     *
     * @return Promise
     *
     */
    list(max) {
        if (debug == 1 && !isNan(max)) {
            console.log("Sending URL '" + this.server + "/room/list?max" + max + "' to client.");
        } else if (debug == 1) {
            console.log("Sending URL '" + this.server + "/room/list" + "' to client.");   
        }

        if (!isNaN(max)) {
            return this.httpGet("/room/list?max=" + max);
        } else {
            return this.httpGet("/room/list");
        }
    }

    /**
     * List rooms by id.
     *
     * @return Promise
     *
     */
    view(id) {
        if (debug == 1) {
            console.log("Sending URL '" + this.server + "/room/view/id/" + id + "' to client.");
        }
        return this.httpGet("/room/view/id/" + id);
    }

    /**
     * List rooms by house.
     *
     * @return Promise
     *
     */
    house(house, max) {
        if (debug == 1 && !isNaN(max)) {
            console.log("Sending URL '" + this.server + "/room/view/house/" + house + "?max=" + max + "' to client.");
        } else if (debug == 1) {
            console.log("Sending URL '" + this.server + "/room/view/house/" + house + "' to client.");
        }

        if (!isNaN(max)) {
            return this.httpGet("/room/view/house/" + house + "?max=" + max);
        } else {
            return this.httpGet("/room/view/house/" + house);
        }
    }

    /**
     * Search all rooms.
     *
     * @return Promise
     *
     */
    search(search, max) {
        if (debug == 1 && !isNaN(max)) {
            console.log("Sending URL '" + this.server + "/room/search/" + search + "?max=" + max + "' to client.");
        } else if (debug == 1) {
            console.log("Sending URL '" + this.server + "/room/search/" + search + "' to client.");
        }

        if (!isNaN(max)) {
            return this.httpGet("/room/search/" + search + "?max=" + max);
        } else {
            return this.httpGet("/room/search/" + search);
        }
    }

    /**
     * Search all rooms with priority.
     *
     * @return Promise
     *
     */
    searchp(search, max) {
        if (debug == 1 && !isNaN(max)) {
            console.log("Sending URL '" + this.server + "/room/searchp/" + search + "?max=" + max + "' to client.");
        } else if (debug == 1) {
            console.log("Sending URL '" + this.server + "/room/searchp/" + search + "' to client.");
        }

        if (!isNaN(max)) {
            return this.httpGet("/room/searchp/" + search + "?max=" + max);
        } else {
            return this.httpGet("/room/searchp/" + search);
        }
    }
}

export default JSONClient;

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
    list() {
        return this.httpGet("/room/list");
    }

    /**
     * List rooms by id.
     *
     * @return Promise
     *
     */
    view(id) {
        return this.httpGet("/room/view/id/" + id);
    }

    /**
     * List rooms by house.
     *
     * @return Promise
     *
     */
    house(house) {
        return this.httpGet("/room/view/house/" + house);
    }

    /**
     * Search all rooms.
     *
     * @return Promise
     *
     */
    search(search) {
        return this.httpGet("/room/search/" + search);
    }
}

export default JSONClient;

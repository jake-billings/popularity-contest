/**
 * lib.js
 *
 * utility functions used by both background.js and popup.js for the
 *  popularity-contest chrome extension
 */

/**
 * MAIN_SITE
 *
 * address of where the server is hosted for popularity-contest
 *
 * @type {string} 'http://159.65.232.95'
 */
var MAIN_SITE = 'http://159.65.232.95';

/**
 * API_BASE
 *
 * REST API base
 *
 * MAIN_SITE + '/api'
 *
 * @type {string} MAIN_SITE + '/api'
 */
var API_BASE = MAIN_SITE + '/api';

/**
 * Call init() on the popularityContest library to set the proper API base
 *  and to load the required difficulty
 */
popularityContest.init(API_BASE);

/**
 * notify()
 *
 * show a notification with our logo
 *
 * @param title
 * @param message
 */
function notify(title, message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: '/logo/LogoV148.png',
        title: title,
        message: message
    });
}

/**
 * goto()
 *
 * navigate the current chrome tab to a string url
 *
 * @param url url to navigate to
 */
function goto(url) {
    chrome.tabs.update({
        url: url
    });
}

/**
 * getCurrentUrl()
 *
 * get the current url of the current chrome tab
 *
 * @param callback called with the url as the first argument
 */
function getCurrentUrl(callback) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;

        return callback(url);
    });
}

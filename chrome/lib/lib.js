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

function goto(url) {
    chrome.tabs.update({
        url: url
    });
}

function getCurrentUrl(callback) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;

        return callback(url);
    });
}

var MAIN_SITE = 'http://159.65.232.95';
var API_BASE = MAIN_SITE + '/api';

popularityContest.init(API_BASE);

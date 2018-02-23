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

popularityContest.init('http://159.65.232.95:3000/api');

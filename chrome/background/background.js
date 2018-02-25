function callback(event) {
    url = event.srcUrl||event.linkUrl;
    popularityContest.submit(url)
        .done(function () {
            notify('Successfully Submitted Link', url);
        })
        .fail(function () {
            notify('Sorry, your link was not submitted.', url);
        });
}

chrome.contextMenus.removeAll(function () {
    chrome.contextMenus.create({
        title: "Submit Image to Spider",
        contexts:["image"],  // ContextType
        onclick: callback
    });
});

function gotoRandom() {
    popularityContest.getRandom()
        .done(function (data) {
            goto(data.url);
        })
        .fail(function () {
            notify('Unsuccessful', 'Sorry, there was a problem loading a link.');
        });
}

function submitCurrent() {
    getCurrentUrl(function (url) {
        popularityContest.submit(url)
            .done(function () {
                notify('Successfully Submitted Link', url);
            })
            .fail(function () {
                notify('Sorry, your link was not submitted.', url);
            });
    });
}

chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case 'spider-goto-random':
            gotoRandom();
            break;
        case 'spider-add':
            submitCurrent();
            break;
        default:
            console.warn('received unknown command', command);
    }
});
function callback(event) {
    url = event.linkUrl;
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
        title: "Submit Link to Spider",
        contexts:["link"],  // ContextType
        onclick: callback
    });
    chrome.contextMenus.create({
        title: "Submit Image to Spider",
        contexts:["image"],  // ContextType
        onclick: callback
    });
});

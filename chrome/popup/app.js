function submit() {
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

function goToRandom() {
    popularityContest.getRandom()
        .done(function (data) {
            goto(data.url);
        })
        .fail(function () {
            notify('Unsuccessful', 'Sorry, there was a problem loading a link.');
        });
}

function init() {
    document.getElementById('submit').addEventListener('click', submit);
    document.getElementById('goToRandom').addEventListener('click', goToRandom);
}

init();
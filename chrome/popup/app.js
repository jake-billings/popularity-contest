function submit() {
    hideButtons();
    getCurrentUrl(function (url) {
        popularityContest.submit(url)
            .done(function () {
                notify('Successfully Submitted Link', url);
            })
            .fail(function () {
                notify('Sorry, your link was not submitted.', url);
            })
            .always(function () {
                showButtons();
            });
    });
}

function goToRandom() {
    hideButtons();
    popularityContest.getRandom()
        .done(function (data) {
            goto(data.url);
        })
        .fail(function () {
            notify('Unsuccessful', 'Sorry, there was a problem loading a link.');
        })
        .always(function () {
            showButtons();
        });
}
function goToMainSite() {
    popularityContest.getRandom()
        .done(function (data) {
            goto(MAIN_SITE);
        })
        .fail(function () {
            notify('Unsuccessful', 'Sorry, there was a problem loading a link.');
        });
}

function hideButtons() {
    document.getElementById('buttons').classList.add('hidden');
    document.getElementById('myProgress').classList.remove('hidden');
}

function showButtons() {
    document.getElementById('myProgress').classList.add('hidden');
    document.getElementById('buttons').classList.remove('hidden');
}

function init() {
    document.getElementById('submit').addEventListener('click', submit);
    document.getElementById('goToRandom').addEventListener('click', goToRandom);
    document.getElementById('goToMainSite').addEventListener('click', goToMainSite);
    popularityContest.getCount().done(function (data) {
        document.getElementById('linkCount').innerText=data+' links and counting...'
    });
}

init();
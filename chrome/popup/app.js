/**
 * app.js
 *
 * contains all javascript and event handling for the chrome extension popup html
 *
 * requires lib.js and popularity-contest.js
 */

/**
 * submit()
 *
 * event handler for the submit button
 *
 * submits the current tab then shows a notification
 */
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

/**
 * goToRandom()
 *
 * event handler for the go button
 *
 * pulls a random link from the popularity-contest library and navigates to it
 */
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

/**
 * goToMainSite()
 *
 * event handler for clicking on the link to vote on favorites
 *
 * navigates the current tab to the main website
 */
function goToMainSite() {
    popularityContest.getRandom()
        .done(function (data) {
            goto(MAIN_SITE);
        })
        .fail(function () {
            notify('Unsuccessful', 'Sorry, there was a problem loading a link.');
        });
}

/**
 * hideButtons()
 *
 * called after clicking a button to show the user we're working
 */
function hideButtons() {
    document.getElementById('buttons').classList.add('hidden');
    document.getElementById('myProgress').classList.remove('hidden');
}

/**
 * showButtons()
 *
 * called after an action completes to hide the loading text and bring the button back
 */
function showButtons() {
    document.getElementById('myProgress').classList.add('hidden');
    document.getElementById('buttons').classList.remove('hidden');
}

/**
 * init()
 *
 * setup the popup
 *
 * called when this file is loaded
 *
 * registers event handlers and loads link count
 */
function init() {
    document.getElementById('submit').addEventListener('click', submit);
    document.getElementById('goToRandom').addEventListener('click', goToRandom);
    document.getElementById('goToMainSite').addEventListener('click', goToMainSite);
    popularityContest.getCount().done(function (data) {
        document.getElementById('linkCount').innerText=data+' links and counting...'
    });
}

init();
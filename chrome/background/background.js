/**
 * background.js
 *
 * "background" code for the chrome extension for populatiry-contest
 *
 * Background code is anything that isn't library code or popup code.
 *
 * This file contains registration for keyboard shortcuts and contextual menus
 *
 * requires lib.js and popularity-contest.js
 */
(function (chrome) {
    /**
     * remove all contextual menus
     *
     * chrome will leave contextual menus in place even after an extension reload,
     *  so we first have to remove all contextual menus, then we register ours
     *
     * removeAll() only removes menus from this extension, so all it does is let us
     *  start from scratch
     */
    chrome.contextMenus.removeAll(function () {
        /**
         * chrome context menu
         *
         * Submit Image to Spider
         *
         * When a user right-clicks an image, they should receive a contextual menu allowing them
         *  to submit the image to Spider.
         */
        chrome.contextMenus.create({
            title: "Submit Image to Spider",
            contexts: ["image"],  // ContextType
            onclick: function (event) {
                url = event.srcUrl || event.linkUrl;
                popularityContest.submit(url)
                    .done(function () {
                        notify('Successfully Submitted Link', url);
                    })
                    .fail(function () {
                        notify('Sorry, your link was not submitted.', url);
                    });
            }
        })
        ;
    });

    /**
     * gotoRandom()
     *
     * fetch a random url using the popularity-contest.js library
     *
     * then, go to that url
     *
     * used as an event handler for keyboard shortcuts
     */
    function gotoRandom() {
        popularityContest.getRandom()
            .done(function (data) {
                goto(data.url);
            })
            .fail(function () {
                notify('Unsuccessful', 'Sorry, there was a problem loading a link.');
            });
    }

    /**
     * submitCurrent()
     *
     * submit the current tab url using the popularity-contest.js library and lib.js
     *
     * then, show a notification as to whether it was successful
     *
     * used as an event handler for keyboard shortcuts
     */
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

    /**
     * add command listener
     *
     * keyboard shortcuts are defined in manifest.json
     *
     * we get event names as strings through this listener
     *
     * unlike context menus, this gets wiped on a reload, so we don't have to remove old listeners
     */
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
})(chrome);
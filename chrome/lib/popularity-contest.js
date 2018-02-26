/**
 * popularity-contest.js
 *
 * frontend library for interacting with the popularity-contest API
 *
 * It is recommended to use this library since the backend API requires PoW hash and timestamp
 *  calculations to prevent spam. This library automatically loads the required difficulty from the
 *  server and wraps all required calls in PoW calculations for you.
 *
 * API calls are returned as jQuery promises.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', '$', 'js-sha256'], function (exports, sha256) {
            factory((root.popularityContest = exports), $, sha256);
        });
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('jquery'), require('js-sha256'));
    } else {
        // Browser globals
        factory((root.popularityContest = {}), root.$, root.sha256);
    }
}(typeof self !== 'undefined' ? self : this, function (exports, $, sha256) {
    /**
     * API_BASE
     *
     * string
     *
     * defaults to /api (for if it's served on the same server as the API) otherwise, call init({{api_path}}) with
     *  the address of the server running the API
     *
     * @type {string}
     */
    var API_BASE = '/api';

    /**
     * _difficulty
     *
     * the required hash difficulty (number of leading 0's) to submit an API call
     *
     * defaults to 5; however calls to init() query the server for the real difficulty, which may be higher or lower
     *
     * @type {number}
     * @private
     */
    var _difficulty = 5;

    /**
     * _onLoad()
     *
     * called from init() after the difficulty loads from the server;
     * set by exports.onLoad()
     * used when clients of this library want to run code as soon as this library is ready
     *
     * @private
     */
    var _onLoad = function () {};

    /**
     * onLoad()
     *
     * event registration for when this frontend library has loaded; the library isn't really
     *  ready to accept calls until the difficulty loads from the api server; this called in
     *  init()
     *
     * @param callback
     */
    exports.onLoad = function (callback) {
        _onLoad = callback;
    };

    /**
     * _getDifficulty()
     *
     * used internally by init() to load the required hash difficulty for PoW endpoints
     *
     * @returns {*} jQuery promise to difficulty from backend server
     * @private
     */
    exports._getDifficulty = function () {
        return $.get(API_BASE + '/difficulty');
    };

    /**
     * _getUnixTime()
     *
     * used internally to timestamp PoW API requests
     *
     * @returns {number} current unix time
     * @private
     */
    exports._getUnixTime = function () {
        return Math.floor(Date.now() / 1000);
    };

    /**
     * init()
     *
     * MUST BE CALLED BEFORE USING PoW ENDPOINTS
     *
     * loads the required hash difficulty from the backend server; can override the API_BASE if necessary
     *
     * @param apiBase OPTIONAL override the base api to point the library at a server (E.g. "http://localhost:3000")
     */
    exports.init = function (apiBase) {
        if (apiBase) API_BASE = apiBase;
        return exports._getDifficulty().done(function (difficulty) {
            _difficulty = difficulty;
            _onLoad();
        });
    };

    /**
     * _sha256()
     *
     * calculate the sha256 hash of a string; used by _mine() for PoW calculations
     *
     * @param a string to hash
     * @returns {string} sha256(str)
     * @private
     */
    exports._sha256 = function (a) {
        var hash = sha256.create();
        hash.update(a);
        return hash.hex();
    };

    /**
     * verifyPowHash()
     *
     * returns true if hash is an actual hash of nonce+str AND leads with DIFFICULTY 0's
     *
     * this verifies that the client had to "work hard" to find a nonce that hashed with str to lead with
     *  enough 0's
     *
     * used in candidateCreateAction to prevent spam submitting links and electionCreateAction to prevent
     *  spam in voting
     *
     * see frontend library for function _mine() that "works hard" to find valid nonces
     *
     * @param difficulty the required difficulty a hash must meet
     * @param hash sha256(nonce+str); must lead with DIFFICULTY number of 0's
     * @returns {boolean} true if the hash is valid and leads with enough 0's
     */
    exports._verifyPow = function (difficulty, hash) {
        for (var i = 0; i < difficulty; i++) {
            if (hash[i] !== '0') return false;
        }
        return true;
    };

    /**
     * _mine()
     *
     * this function puts the "work" in "proof-of-work"
     *
     * we try random strings (nonces) to str until a sha256(nonce+str) results leads with enough 0's to be considered
     *  valid by the backend; then, we return both to the API route that needs PoW.
     *
     * See _verifyPow()
     *
     * @param str the string we need to provide PoW for
     * @returns {{hash: *, nonce: *}} the hash and the nonce with sufficient work for str
     * @private
     */
    exports._mine = function (str) {
        if (!_difficulty) throw new Error('cannot call _mine() before _init resolves; _difficulty hasn\'t loaded yet');
        var hash, nonce;
        do {
            nonce = Math.random().toString();
            hash = exports._sha256(nonce + str);
        } while (!exports._verifyPow(_difficulty, hash));
        return {
            hash: hash,
            nonce: nonce
        }
    };

    /**
     * submit()
     *
     * submit a URL to the backend database
     *
     * CREATE candidate
     *
     * POW - performs a proof of work before submitting
     *
     * @param url
     * @returns {*} jQuery promise that resolves when the link is submitted (or fails)
     */
    exports.submit = function (url) {
        //Get timestamp and perform proof of work
        var time = exports._getUnixTime();
        var miningResult = exports._mine(time.toString() + url);

        //Send req
        return $.post({
            url: API_BASE + '/submit',
            contentType: 'application/json',
            data: JSON.stringify({
                time: time,
                hash: miningResult.hash,
                nonce: miningResult.nonce,
                url: url
            })
        });
    };

    /**
     * generateElection()
     *
     * get an "election" or set of two candidates to vote on
     *
     * CREATE election
     *
     * POW - performs a proof of work before submitting
     *
     * @returns {*} jQuery promise that resolves to the new election object
     */
    exports.generateElection = function () {
        //Timestamp and PoW
        var time = exports._getUnixTime();
        var miningResult = exports._mine(time.toString());

        //Send req
        return $.post({
            url: API_BASE + '/election',
            contentType: 'application/json',
            data: JSON.stringify({
                time: time,
                hash: miningResult.hash,
                nonce: miningResult.nonce
            })
        });
    };

    /**
     * Vote on an existing election
     *
     * no PoW required for this endpoint because PoW was performed when creating the election object, and calling
     *  this endpoint deletes said object
     *
     * @param _id the uuid of the election in the database (you get this from generateElection() when you create it)
     * @param voteForA true if you're voting for election.a; false if you're voting for election.b
     * @returns {*} jQuery promise that resolves when the vote is submitted and the election object is deleted
     */
    exports.vote = function (_id, voteForA) {
        return $.post({
            url: API_BASE + '/vote',
            contentType: 'application/json',
            data: JSON.stringify({
                _id: _id,
                voteForA: voteForA
            })
        });
    };

    /**
     * GET a random candidate object
     *
     * no PoW required for this simple GET endpoint
     *
     * @returns {*} jQuery promise that resolves to a random candidate object (link) in the database
     */
    exports.getRandom = function () {
        return $.get(API_BASE + '/random');
    };

    /**
     * GET the candidate count
     *
     * no PoW required for this simple GET endpoint
     *
     * @returns {*} jQuery promise that resolves to the number of candidates/links submitted
     */
    exports.getCount = function () {
        return $.get(API_BASE + '/count');
    };

    /**
     * GET candidates
     *
     * returns the TOP-RANKED candidates (only the top 30)
     *
     * no PoW required for this simple GET endpoint
     *
     * @returns {*} jQuery promise that resolves to the top-ranked links/candidates based on elo
     */
    exports.getCandidates = function () {
        return $.get(API_BASE + '/candidates');
    };
}));
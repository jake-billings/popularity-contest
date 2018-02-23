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
    var API_BASE = '/api';
    var _difficulty = 5;
    var _onLoad = function () {
    };

    exports.onLoad = function (callback) {
        _onLoad = callback;
    };

    exports._getDifficulty = function () {
        return $.get(API_BASE + '/difficulty');
    };

    exports._getUnixTime = function () {
        return Math.floor(Date.now() / 1000);
    };

    exports.init = function (apiBase) {
        if (apiBase) API_BASE = apiBase;
        return exports._getDifficulty().done(function (difficulty) {
            _difficulty = difficulty;
            _onLoad();
        });
    };

    exports._sha256 = function (a) {
        var hash = sha256.create();
        hash.update(a);
        return hash.hex();
    };

    exports._verifyPow = function (difficulty, hash) {
        for (var i = 0; i < difficulty; i++) {
            if (hash[i] !== '0') return false;
        }
        return true;
    };

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

    exports.submit = function (url) {
        var time = exports._getUnixTime();
        var miningResult = exports._mine(time.toString() + url);


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

    exports.generateElection = function () {
        var time = exports._getUnixTime();
        var miningResult = exports._mine(time.toString());


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

    exports.getRandom = function () {
        return $.get(API_BASE + '/random');
    };

    exports.getCount = function () {
        return $.get(API_BASE + '/count');
    };

    exports.getCandidates = function () {
        return $.get(API_BASE + '/candidates');
    };
}));
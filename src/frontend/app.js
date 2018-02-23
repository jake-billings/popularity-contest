angular.module('popularity-contest', ['ngRoute'])
    .factory('PopularityContest', function () {
        popularityContest.init();
        return popularityContest;
    })
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/election', {
                templateUrl: 'html/election.html',
                controller: 'ElectionCtrl'
            })
            .when('/rankings', {
                templateUrl: 'html/rankings.html',
                controller: 'RankingsCtrl'
            })
            .otherwise({
                redirectTo: '/election'
            })
    }])
    .service('API', ['$q', 'PopularityContest', function ($q, PopularityContest) {
        this.generateElection = function () {
            var defer = $q.defer();
            PopularityContest.generateElection()
                .done(function (data) {
                    return defer.resolve(data);
                })
                .fail(function (err) {
                    return defer.reject(err);
                });
            return defer.promise;
        };
        this.vote = function (_id, voteForA) {
            var defer = $q.defer();
            PopularityContest.vote(_id, voteForA)
                .done(function (data) {
                    return defer.resolve(data);
                })
                .fail(function (err) {
                    return defer.reject(err);
                });
            return defer.promise;
        };
        this.getCandidates = function () {
            var defer = $q.defer();
            PopularityContest.getCandidates()
                .done(function (data) {
                    return defer.resolve(data);
                })
                .fail(function (err) {
                    return defer.reject(err);
                });
            return defer.promise;
        };
    }])
    .controller('ElectionCtrl', ['$scope', 'API', function ($scope, API) {

        $scope.load = function () {
            API.generateElection().then(function (election) {
                $scope.election = election;
            }, function (err) {
                console.error(err);
            });
        };
        $scope.load();

        $scope.vote = function (voteForA) {
            API.vote($scope.election._id, voteForA).then(function () {
                console.info('vote processed')
            }, function (err) {
                console.error(err);
            });
            $scope.load();
        }
    }])
    .controller('RankingsCtrl', ['$scope', 'API', function ($scope, API) {

        $scope.load = function () {
            API.getCandidates().then(function (candidates) {
                $scope.candidates = candidates;
            }, function (err) {
                console.error(err);
            });
        };
        $scope.load();
    }]);
(function() {
    'use strict';

    angular
        .module('mediatimer')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, MovieService) {

        $scope.lastTimeQueryUpdate = new Date().getTime();

        $scope.results = {
            tv: [],
            movie: []
        };

        $scope.allResults = [];

        $scope.itemCart = [];

        $scope.$watch('query', function (newVal, oldVal) {

            var currentTime = new Date().getTime();

            if(currentTime - $scope.lastTimeQueryUpdate  > 200) {

                if($scope.query.length > 1) {
                    $scope.allResults = [];

                    $scope.results = {
                        tv: [],
                        movie: []
                    };

                    MovieService.search($scope.query)
                        .then(function (success) {
                            $scope.allResults = success.data.results;

                            var results = success.data.results;

                            results.forEach(function (a) {
                                if(a.media_type === "tv") $scope.results.tv.push(a);

                                if(a.media_type === "movie") $scope.results.movie.push(a);
                            })
                        });
                }

                $scope.lastTimeQueryUpdate = currentTime;
            }

        });

        $scope.addItem = function (item) {

            item.episodeCount = item.seasons
                .filter(function (a) {
                    return a.selected;
                })
                .map(function (a) {
                    return a.episode_count;
                })
                .reduce(function (a, b) {
                    return a + b;
                });

            item.averageLength = item.episode_run_time
                    .reduce(function (a, b) {
                        return a + b;
                    }) / item.episode_run_time.length;

            item.totalMinutes = item.averageLength * item.episodeCount;

            $scope.itemCart.push(item);

            $scope.closeModal();

            setTimeout(function () {
                window.scrollTo(0, $('.item-cart').offset().top);
            }, 200);
        };

        $scope.beginAddItem = function (item) {
            if(item.media_type === "tv") {
                $('#myModal').modal({show: true});

                MovieService.getSeasons(item.id)
                    .then(function (success) {

                        $scope.selected = {
                            name: item.name,
                            backdrop_path: item.backdrop_path,
                            poster_path: item.poster_path,
                            media_type: item.media_type,
                            seasons: success.data.seasons.filter(function (a) {
                                return a.season_number !== 0;
                            }),
                            episode_run_time: success.data.episode_run_time
                        };
                    }, angular.noop);
            } else {
                MovieService.getMovie(item.id)
                    .then(function (success) {

                        var item = success.data;
                        item.totalMinutes = item.runtime;

                        $scope.itemCart.push(item);
                    }, angular.noop);
            }
        };

        $scope.closeModal = function () {
            $('#myModal').modal('hide');
        };

        $scope.seasonStringFromShow = function (show) {
            var selected = show.seasons
                .filter(function (a) {
                    return a.selected;
                })
                .map(function (a) {
                    return a.season_number;
                });

            selected.sort(function (a, b) {
                return a - b;
            });

            var min = Math.min.apply(Math, selected) || 1;

            var max = Math.max.apply(Math, selected);

            if(max - min + 1 === selected.length)
                return "Seasons " + min + " - " + max;
            else
                return "Seasons " + selected.join(', ');

        };

        $scope.selectAll = function (show) {
            show.seasons.forEach(function (a) {
                if(a.season_number !== 0)
                    a.selected = true;
            });
        };

        $scope.millisecondsToTimeObject = function (ms) {
            var returnObj = {};

            var x = ms / 1000;
            returnObj.seconds = x % 60;
            x /= 60;
            returnObj.minutes = x % 60;
            x /= 60;
            returnObj.hours = x % 24;
            x /= 24;
            returnObj.days = x;

            delete returnObj.seconds;

            for(var key in returnObj) {
                returnObj[key] = Math.floor(returnObj[key]);
            }

            return returnObj;
        };

        $scope.stringFromTimeObject = function (obj) {
            return Object.keys(obj).reverse()
                .filter(function (a) {
                    return !isNaN(obj[a]);
                })
                .map(function (a) {
                    return obj[a] + " " + a;
                })
                .join(', ');
        };

        $scope.sumCart = function (cart) {
            if(cart.length > 0) {
                return cart.map(function (item) {
                    return item.totalMinutes;
                })
                    .reduce(function (a, b) {
                        return a + b;
                    });
            }
        }
    }
})();

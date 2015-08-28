'use strict';

/**
 * @ngdoc service
 * @name mediatimerApp.MovieService
 * @description
 * # MovieService
 * Factory in the mediatimerApp.
 */
angular.module('mediatimer')
  .factory('MovieService', function ($http) {

        var MovieService = {};

        MovieService.search = function (query) {
            return $http({
                url: "http://api.themoviedb.org/3/search/multi",
                method: "GET",
                params: {
                    api_key: "1822c93dec4da5a64a3d5a0276ef2d78",
                    query: query
                }
            });
        };

        MovieService.getSeasons = function (id) {
            return $http({
                url: "http://api.themoviedb.org/3/tv/" + id,
                method: "GET",
                params: {
                    api_key: "1822c93dec4da5a64a3d5a0276ef2d78"
                }
            });
        };

        MovieService.getMovie = function (id) {
            return $http({
                url: "http://api.themoviedb.org/3/movie/" + id,
                method: "GET",
                params: {
                    api_key: "1822c93dec4da5a64a3d5a0276ef2d78"
                }
            });
        }

        return MovieService;

  });

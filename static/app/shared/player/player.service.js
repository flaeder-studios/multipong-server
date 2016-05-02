(function () {
    angular.module('flaederGamesApp')
        .factory('playerService', ['httpMethodService', 'urlService', function (httpMethodService, urlService) {

            var service = {};

            service.setName = function (name, callback, errorhandler) {
                if (name) {
                    var data = {}
                    data.player = {};
                    data.player.name = name;
                    httpMethodService.post(urlService.playerUri, data, {}, function (result) {
                        callback(result.data);
                    }, errorhandler);
                }
            };

            service.getPlayer = function (callback) {
                httpMethodService.get(urlService.playerUri, {}, function (result) {
                    callback(result.data);
                });
            };

            return service;

        }]);
})();

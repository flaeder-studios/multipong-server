(function () {
    angular.module('flaederGamesApp')
        .factory('lobbyService', ['httpMethodService', 'urlService', function (httpMethodService, urlService) {
            service = {};

            service.getAllGames = function (callback) {
                httpMethodService.get(urlService.gameUri, {}, function (result) {
                    callback(result.data);
                });
            };

            service.createGame = function (game, callback, errorhandler) {

                game.name = "mpong";

                httpMethodService.post(urlService.gameUri + '/' + game.id, game, {}, function (result) {
                    callback(result.data);
                }, errorhandler);
            };

            service.removeGame = function (game, callback) {
                httpMethodService.delete(urlService.gameUri + '/' + game.id, {}, function (result) {
                    callback(result.data);
                });
            };

            service.joinGame = function (game, callback) {
                httpMethodService.post(urlService.joinUri + '/' + game.id, {}, {}, function (result) {
                    callback(result.data);
                });
            };

            service.leaveGame = function (callback) {
                httpMethodService.post(urlService.leaveUri, {}, {}, function (result) {
                    callback(result.data);
                });
            };

            service.getCurrentGame = function (callback) {
                httpMethodService.get(urlService.playerUri, {}, function (result) {
                    callback(result.data.player.currentGame);
                });
            };

            return service;
    }]);
})();

(function () {
    angular.module('flaederGamesApp')
        .factory('urlService', [function () {
            var service = {};

            service.gameUri = '/game';
            service.joinUri = '/game/method/join';
            service.leaveUri = '/game/method/leave';
            service.startUri = '/game/method/start';
            service.quitUri = '/game/method/quit';
            service.stateUri = '/game/state';
            service.paddleUri = '/game/paddle';
            service.playerUri = '/player';

            return service;
        }]);
})();

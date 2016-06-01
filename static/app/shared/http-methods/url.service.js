(function () {
    angular.module('flaederGamesApp')
        .factory('urlService', [function () {
            var service = {};

            service.gameUri = '/lobby/game';
            service.joinUri = '/lobby/method/join';
            service.leaveUri = '/lobby/method/leave';
            service.startUri = '/lobby/method/start';
            service.quitUri = '/lobby/method/quit';
            service.playerUri = '/lobby/player';

            service.stateUri = '/game/state';
            service.paddleUri = '/game/paddle';

            return service;
        }]);
})();

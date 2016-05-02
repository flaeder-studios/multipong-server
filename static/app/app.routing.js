(function () {

    'use strict';

    angular.module('flaederGamesApp')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/lobby', {
                templateUrl: '/app/components/lobby/lobby.view.html',
                controller: 'LobbyController',
            }).when('/game', {
                templateUrl: '/app/components/game/game.view.html',
                controller: 'GameController'
            }).when('/game/battlepong/:mode?/:gameId?', {
                templateUrl: '/app/components/battlepong/battlepong.view.html',
                controller: 'BattlePongController'
            }).when('/home', {
                templateUrl: '/app/components/home/home.view.html',
            }).otherwise({
                redirectTo: '/home'
            });
        }]);

})();

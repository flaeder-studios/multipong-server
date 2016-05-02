(function () {

    "use strict";

    angular.module('register-controller', ['ngRoute', 'player-service'])
        .controller('RegisterController', ['$scope', '$route', '$location', 'playerService', function ($scope, $route, $location, playerService) {

            $scope.newName = '';

            $scope.registerPlayer = function (name) {
                playerService.setName(name, function (data) {
                    $scope.setPlayerName(name);
                    console.log('registered as ', $scope.playerName);
                    $location.path('/lobby');
                });
            };

        }]);

})();

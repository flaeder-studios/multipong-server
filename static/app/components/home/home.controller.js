(function () {

    angular.module('flaederGamesApp')
        .controller('HomeController', ['$scope', '$location', '$uibModal', 'playerService', function ($scope, $location, $uibModal, playerService) {

            $scope.isRegistered = false;
            $scope.player = undefined;
            $scope.changeName = false;
            $scope.errorMessage = undefined

            $scope.initialize = function () {
                $scope.updatePlayerData(function (data) {
                    if ($scope.isRegistered) {
                        if ($scope.player.currentGame && $scope.player.currentGame.gameStarted) {
                            for (var idx = 0; idx < $scope.player.currentGame.joinedPlayers.length; ++idx) {
                                if ($scope.player.currentGame.joinedPlayers[idx] == $scope.player.name) {
                                    $location.path('/game/battlepong/play/' + $scope.player.currentGame.id);
                                }
                            }
                        } else {
                            $location.path('/lobby');
                        }
                    } else {
                        $scope.openRegisterModal();
                    }
                });
            };

            $scope.openRegisterModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/shared/register-modal/register-modal.template.html',
                    controller: 'RegisterModalController',
                    resolve: {
                        setPlayerName: function () {
                            return $scope.setPlayerName;
                        }
                    }
                });
            };

            $scope.openSetNameModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/shared/set-name-modal/set-name-modal.template.html',
                    controller: 'SetNameModalController',
                    resolve: {
                        setPlayerName: function () {
                            return $scope.setPlayerName;
                        }
                    }
                });
            };

            $scope.updatePlayerData = function (callback) {
                playerService.getPlayer(function (data) {
                    if (data.player) {
                        console.log('player is ', data.player);
                        $scope.player = data.player;
                        if ($scope.player.name) {
                            $scope.isRegistered = true;
                        }
                        if (callback) {
                            callback(data.player);
                        }
                    }
                });
            };

            $scope.setPlayerName = function (name, callback, errorhandler) {
                playerService.setName(name, function (data) {
                    $scope.player = data.player;
                    $scope.changeName = false;
                    $scope.isRegistered = true;
                    $location.path('/lobby');
                    if (callback) {
                        callback(data.player);
                    }
                }, errorhandler);
            };

            $scope.initialize();

            }]);

})();

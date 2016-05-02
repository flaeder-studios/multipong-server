(function () {

    angular.module('flaederGamesApp')
        .controller('CreateGameModalController', ['$scope', '$uibModalInstance', 'doCreateGame', 'alertService', function ($scope, $uibModalInstance, doCreateGame, alertService) {

            $scope.newGame = {};
            $scope.doCreateGame = doCreateGame;
            $scope.message = undefined;

            $scope.createGame = function () {
                $scope.doCreateGame($scope.newGame, function (game) {
                    alertService.displayAlert('success', 'created game ' + game.id);
                    $uibModalInstance.close(game);
                }, function (rejectReason) {
                    console.error(rejectReason.data.message);
                    $scope.message = rejectReason.data.message;
                });
            }

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }

        }]);

})();

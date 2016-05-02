(function () {

    angular.module('flaederGamesApp')
        .controller('SetNameModalController', ['$scope', '$uibModalInstance', 'setPlayerName', 'alertService', function ($scope, $uibModalInstance, setPlayerName, alertService) {

            $scope.newName = '';
            $scope.message = undefined;
            $scope.setPlayerName = setPlayerName;

            $scope.setName = function () {
                $scope.setPlayerName($scope.newName, function(player) {
                    alertService.displayAlert('info', 'set player name to ' + player.name);
                    $uibModalInstance.close($scope.newName);
                }, function (rejectReason) {
                    console.log(rejectReason);
                    $scope.message = rejectReason.data.message;
                });
            }

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }

        }]);

})();

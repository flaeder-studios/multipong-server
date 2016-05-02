(function () {

    angular.module('flaederGamesApp')
        .controller('RegisterModalController', ['$scope', '$uibModalInstance', 'setPlayerName', 'alertService', function ($scope, $uibModalInstance, setPlayerName, alertService) {

            $scope.newName = '';
            $scope.message = undefined;
            $scope.setPlayerName = setPlayerName;

            $scope.register = function () {
                $scope.setPlayerName($scope.newName, function(player) {
                    alertService.displayAlert('info', 'set player name to ' + player.name);
                    $uibModalInstance.close($scope.newName);
                }, function (rejectReason) {
                    $scope.message = rejectReason.data.message;
                });
            }

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }

        }]);

})();

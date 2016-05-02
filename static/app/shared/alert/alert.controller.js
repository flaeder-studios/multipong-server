(function () {

    "use strict";

    angular.module('flaederGamesApp')
        .controller('AlertController', ['$scope', 'alertService', function ($scope, alertService) {

            $scope.alertService = alertService;

        }]);

})();

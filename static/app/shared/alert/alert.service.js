(function () {

    "use strict";

    angular.module('flaederGamesApp')
        .factory('alertService', ['$http', '$location', function ($http, $location) {

            var service = {};

            service.alerts = [];

            service.displayAlert = function(type, message) {
                this.alerts.push({type: type, message: message});
                if (type == 'success' || type == 'info') {
                    console.info(message);
                } else if (type == 'warning') {
                    console.warn(message);
                } else {
                    console.error(message);
                }
            };
             
            service.closeAlert = function(index) {
                this.alerts.splice(index, 1);
            };

            return service;

        }]);

})();

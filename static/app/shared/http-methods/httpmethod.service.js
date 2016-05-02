(function () {
    angular.module('flaederGamesApp')
        .factory('httpMethodService', ['$http', '$location', 'alertService', function ($http, $location, alertService) {

            var service = {};

            var defaultErrorHandler = function (rejectReason) {
                console.error(rejectReason.data.message);
                alertService.displayAlert('danger', rejectReason.data.message);
            };

            service.get = function (uri, config, callback, errorhandler) {
                var res = {};

                if (!errorhandler) {
                    errorhandler = defaultErrorHandler;
                }

                $http.get(uri, config).then(
                    function (result) {
                        callback(result);
                    },
                        errorhandler
                    );
            };

            service.post = function (uri, data, config, callback, errorhandler) {
                var res = {};

                if (!errorhandler) {
                    errorhandler = defaultErrorHandler;
                }

                $http.post(uri, data, config).then(
                    function (result) {
                        callback(result);
                    },
                        errorhandler
                    );
            };

            service.delete = function (uri, config, callback, errorhandler) {
                var res = {};

                if (!errorhandler) {
                    errorhandler = defaultErrorHandler;
                }

                $http.delete(uri, config).then(
                    function (result) {
                        callback(result);
                    },
                        errorhandler
                    );
            };

            return service;

        }]);
})();

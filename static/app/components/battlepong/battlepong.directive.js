angular.module("flaederGamesApp")
    .directive("battlePong", ['$window', function ($window) {
    return {
        restrict: 'E',
        scope: {
            progress: '=',
            progressId: '@'
        },
        template: "<canvas width=777 height=480 id='gameCanvas'/>",
        link: function(scope, element, attrs) {
            console.log(element);
            scope.canvas = element.find('gameCanvas')[0];
            scope.gl = getWebGLContext(scope.canvas);
            scope.screenRatio = scope.canvas.width / scope.canvas.height;
            scope.gl.viewportWidth = scope.canvas.width;
            scope.gl.viewportHeight = scope.canvas.height;
        },
        controller: 'BattlePongController'
    };
}]);

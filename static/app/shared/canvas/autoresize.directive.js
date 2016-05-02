angular.module("flaederGamesApp")
    .directive("autoResize", ['$window', '$rootScope', function ($window, $rootScope) {
        return {
            restrict: "A",
            scope: {resizeFn: '&'},
            link: function (scope, element, attrs) {

                scope.ratio = parseInt(attrs.width) / parseInt(attrs.height);

                function resize() {
                    if (!document.fullscreenElement &&    // alternative standard method
                      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods

                        var footer = angular.element(document).find('footer'),
                            header = angular.element(document).find('header'),
                            gameControlBar = document.getElementById('gameControlBar'),
                            hsize = $window.innerHeight - footer.prop('offsetHeight') - header.prop('offsetHeight') - gameControlBar.offsetHeight - 80,
                            wsize = hsize * scope.ratio;
                        element.css('height', hsize.toString() + 'px');
                        element.css('width', wsize.toString() + 'px');

                        args = {width: wsize, height: hsize};
                        scope.resizeFn(args);
                    }
                }

                $window.onresize = resize;
                resize();

            }
        };
    }]);

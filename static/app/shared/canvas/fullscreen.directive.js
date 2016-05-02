angular.module("flaederGamesApp")
    .directive("fullScreen", ['$window', function ($window) {
        return {
            restrict: "A",
            scope: true,
            link: function (scope, element, attrs) {

                scope.ratio = parseInt(attrs.width) / parseInt(attrs.height);
                scope.inFullScreenMode = false;
                scope.element = element;

                scope.enterFullScreen = function () {
                }

                scope.exitFullScreen = function () {

                    scope.inFullScreenMode = false;
                };

                scope.handleFullScreen = function () {
                    console.log("handleFullScreen");
                    if (scope.inFullScreenMode) {
                        console.log("scope.inFullScreenMode");
                        scope.exitFullScreen();
                    } else {
                        console.log("else");
                        scope.enterFullScreen();
                    }
                };


                scope.toggleFullScreen = function () {
                  if (!document.fullscreenElement &&    // alternative standard method
                      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
                    if (document.documentElement.requestFullscreen) {
                      document.documentElement.requestFullscreen();
                    } else if (document.documentElement.msRequestFullscreen) {
                      document.documentElement.msRequestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                      document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                    var hsize = $window.innerHeight,
                        wsize = $window.innerWidth;
                    element.css('height', hsize.toString() + 'px');
                    element.css('width', (wsize / scope.ratio).toString() + 'px');
                  } else {
                    if (document.exitFullscreen) {
                      document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                      document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                      document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                      document.webkitExitFullscreen();
                    }
                    var footer = angular.element(document).find('footer'),
                        header = angular.element(document).find('header'),
                        gameControlBar = document.getElementById('gameControlBar'),
                        hsize = $window.innerHeight - footer.prop('offsetHeight') - header.prop('offsetHeight') - gameControlBar.offsetHeight - 80,
                        wsize = hsize * scope.ratio;
                    element.css('height', hsize.toString() + 'px');
                    element.css('width', wsize.toString() + 'px');
                  }
                }
                element.bind('dblclick', scope.toggleFullScreen);
            
            }
        };
    }]);

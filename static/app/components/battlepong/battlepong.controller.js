(function () {

    "use strict";

    angular.module('flaederGamesApp')
        .controller('BattlePongController', ['$scope', '$window', '$location', '$timeout', '$routeParams', 'BattlePongService', 'lobbyService', 'playerService', 'gameService', 'alertService', function ($scope, $window, $location, $timeout, $routeParams, BattlePongService, lobbyService, playerService, gameService, alertService) {

            $scope.pTime = 0;
            $scope.pPaddleUpdate = 0;
            $scope.gameState = {balls: {}, players: {}, counter: 0, gameOver: false, started: false, winner: ""};

            $scope.scoreBoardStyle = {}
            $scope.gameInfoStyle = {}
            $scope.gameContainerStyle = {}
            
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }

            function rgbToHex(r, g, b) {
                return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
            }

            function rgbArrayToHex(rgb) {
                return rgbToHex(rgb[0]*255|0, rgb[1]*255|0, rgb[2]*255|0);
            }

            $scope.resize = function (width, height) {
                $scope.width = width;
                $scope.height = height;
                $scope.updateStyle();
            };

            $scope.updateStyle = function () {
                for (var paddle in $scope.gameState.players) {
                    $scope.gameState.players[paddle].style = {
                        'color': rgbArrayToHex($scope.gameState.players[paddle].color),
                        'opacity': '0.6',
                        'font-size': '24px',
                        'position': 'relative',
                        'left': ($scope.width + 10).toString() + 'px'
                    };
                }
                $scope.gameInfoStyle = {
                    'position': 'relative',
                    'font-size': '48px',
                    'left': '10px',
                    'text-align': 'center',
                    'color': '#ff9831',
                    'width': $scope.width.toString() + 'px',
                    'height': $scope.height.toString() + 'px',
                    'bottom': ($scope.height / 2 + 96).toString() + 'px'
                };
                $scope.gameContainerStyle = {
                    'position': 'relative',
                    'width': ($scope.width + 20).toString() + 'px',
                    'height': ($scope.height + 20).toString() + 'px'
                };
            };

            $scope.viewGame = function (gameId) {
                console.log("viewing game", gameId);
                $scope.gameOn = true;
                BattlePongService.initGame();
                $scope.updatePlayerData(function (data) {
                    BattlePongService.getState(gameId, function (data) {
                        $scope.gameOn = true;
                        initState(data);
                        render($scope.pTime);
                        updateState(gameId);
                    });
                });
            };

            $scope.startGame = function () {
                console.log("starting game...");
                $scope.gameOn = true;
                BattlePongService.initGame();
                window.addEventListener('keydown', $scope.handleKeyPress, false);
                window.addEventListener('keyup', $scope.handleKeyRelease, false);
                $scope.updatePlayerData(function (data) {
                    BattlePongService.getState($scope.player.currentGame.id, function (data) {
                        $scope.gameOn = true;
                        initState(data);
                        render($scope.pTime);
                        updateState($scope.player.currentGame.id);
                        updatePaddleSpeed($scope.gameState.players[$scope.player.name]);
                    });
                });
            };

            function getLastItem(list) {
                return list[list.length - 1];
            }

            $scope.waitForPlayers = function () {
                console.log('waiting for players to join...');
                $scope.updatePlayerData(function (data) {
                    if ($scope.player.currentGame.joinedPlayers.length == $scope.player.currentGame.maxPlayers) {
                        $scope.startGame();
                    } else {
                        $timeout($scope.waitForPlayers, 1000);
                    }
                });
            }

            $scope.startGame = function () {
                console.log("starting game...");
                $scope.updatePlayerData(function (data) {
                    BattlePongService.getState($scope.player.currentGame.id, function (data) {
                        if (data.gameStarted) {
                            $scope.gameOn = true;
                            BattlePongService.initGame();
                            window.addEventListener('keydown', $scope.handleKeyPress, false);
                            window.addEventListener('keyup', $scope.handleKeyRelease, false);
                            $scope.gameOn = true;
                            initState(data);
                            render($scope.pTime);
                            updateState($scope.player.currentGame.id);
                            updatePaddleSpeed($scope.gameState.players[$scope.player.name]);
                        } else if (getLastItem($scope.player.currentGame.joinedPlayers) == $scope.player.name) {
                            gameService.startGame($scope.startGame);
                        } else {
                            $scope.startGame();
                        }
                    });
                });
            };

            $scope.quitGame = function () {
                console.log('quit!')
                if ($routeParams.mode != 'view')
                {
                    gameService.quitGame(function (data) {
                        $scope.updatePlayerData( function () {
                            $scope.gameOn = false;
                            $location.path('/lobby');
                        });
                    });
                } else {
                    $scope.gameOn = false;
                    $location.path('/lobby');
                }
            };

            $scope.handleKeyPress = function (e) {
                if ($scope.gameState.players[$scope.player.name]) {                
                    if (e.keyCode == 38) { // up
                        $scope.gameState.players[$scope.player.name].refVelocity = [0.0, 1.0];
                    } else if (e.keyCode == 40) { // down
                        $scope.gameState.players[$scope.player.name].refVelocity = [0.0, -1.0];
                    }
                }
            };

            $scope.handleKeyRelease = function (e) {
                if ($scope.gameState.players[$scope.player.name] && (e.keyCode == 38 || e.keyCode == 40)) {
                    $scope.gameState.players[$scope.player.name].refVelocity = [0.0, 0.0];
                }
            };

            function setState (data) {
                $scope.gameState.counter = data['startCountDown'];
                $scope.gameState.winner = data['winner'];
                $scope.gameState.started = data['gameStarted'];
                $scope.gameState.gameOver = data['gameOver'];                
                for (var ball in data.balls) {
                    $scope.gameState.balls[ball].position = data.balls[ball].position;
                    $scope.gameState.balls[ball].radius = data.balls[ball].radius;
                    $scope.gameState.balls[ball].velocity = data.balls[ball].velocity;

                    // convert to view coordinates
                    $scope.gameState.balls[ball].velocity[1];// /= BattlePongService.screenRatio;
                }
                for (var paddle in data.paddles) {
                    $scope.gameState.players[paddle].position = data.paddles[paddle].position;
                    data.paddles[paddle].dimensions = data.paddles[paddle].dimensions;
                    $scope.gameState.players[paddle].width = data.paddles[paddle].dimensions[0];
                    $scope.gameState.players[paddle].height = data.paddles[paddle].dimensions[1];
                    $scope.gameState.players[paddle].score = data.paddles[paddle].score;
                    $scope.gameState.players[paddle].velocity = data.paddles[paddle].velocity;

                    // Convert to view coordinates
                    $scope.gameState.players[paddle].velocity[1];// /= BattlePongService.screenRatio;
                }
            }

            function initState (data) {
                $scope.gameState.counter = data['startCountDown'];
                $scope.gameState.winner = data['winner'];
                $scope.gameState.started = data['gameStarted'];
                $scope.gameState.gameOver = data['gameOver'];
                for (var ball in data.balls) {
                    $scope.gameState.balls[ball] = {};
                    $scope.gameState.balls[ball].position = data.balls[ball].position;
                    $scope.gameState.balls[ball].radius = data.balls[ball].radius;
                    $scope.gameState.balls[ball].velocity = data.balls[ball].velocity;
                    $scope.gameState.balls[ball].color = [Math.random(), Math.random(), Math.random(), 1.0];
                }
                for (var paddle in data.paddles) {
                    $scope.gameState.players[paddle] = {};
                    $scope.gameState.players[paddle].position = data.paddles[paddle].position;
                    $scope.gameState.players[paddle].velocity = data.paddles[paddle].velocity;
                    $scope.gameState.players[paddle].refVelocity = [0.0,0.0];
                    $scope.gameState.players[paddle].acceleration = [0.0,2.0];
                    data.paddles[paddle].dimensions = data.paddles[paddle].dimensions;
                    $scope.gameState.players[paddle].width = data.paddles[paddle].dimensions[0];
                    $scope.gameState.players[paddle].height = data.paddles[paddle].dimensions[1];
                    $scope.gameState.players[paddle].color = [Math.random(), Math.random(), Math.random(), 1.0];
                    $scope.gameState.players[paddle].score = data.paddles[paddle].score;
                }
                $scope.updateStyle();
                console.log($scope.gameState)
            }

            function updatePaddleSpeed(paddle) {
                BattlePongService.setPaddleSpeed(paddle.velocity[1], function() {
                    var dt = 0,
                        time = new Date().getTime();
                    if ($scope.gameOn) {
                        if ($scope.pPaddleUpdate === 0) {
                            $scope.pPaddleUpdate = time;
                        }
                        dt = (time - $scope.pPaddleUpdate) / 1000.0;
                        paddle.velocity[1] += (paddle.refVelocity[1] - paddle.velocity[1]) * paddle.acceleration[1] * dt;
                        if (Math.abs(paddle.velocity[1]) > Math.abs(paddle.refVelocity[1])) {
                            paddle.velocity[1] = paddle.refVelocity[1];
                        }
                        $scope.pPaddleUpdate = time;
                        updatePaddleSpeed(paddle);
                    }
                });
            }

            function updateState(gameId) {
                BattlePongService.getState(gameId, function (data) {
                    setState(data);
                    if ($scope.gameOn == true && !$scope.gameState.gameOver) {
                        updateState(gameId);
                    }
                });
            }

            function render(time) {
                var i, ii, paddle, ball, dt;
                if ($scope.pTime === 0) {
                    dt = 0;
                } else {
                    dt = (time - $scope.pTime) / 1000
                }
                $scope.pTime = time;
                for (ball in $scope.gameState.balls) {
                    ball = $scope.gameState.balls[ball];
                    BattlePongService.handleWallBounce(ball);
		            for (paddle in $scope.gameState.paddles){
			            BattlePongService.handlePaddleBounce(ball, $scope.gameState.paddles[paddle])
	                }
                    BattlePongService.moveBall(ball, dt);
                    BattlePongService.drawBall(ball);
                }
                for (paddle in $scope.gameState.players) {
                    paddle = $scope.gameState.players[paddle];
                    BattlePongService.movePaddle(paddle, dt);
                    BattlePongService.drawPaddle(paddle);
                }
                if($scope.gameOn == true) {
                    $window.requestAnimationFrame(render);
                }
		
            };

            if ($routeParams.mode == 'view') {
                if ($routeParams.gameId) {
                    $scope.viewGame($routeParams.gameId);
                } else {
                    alertSerivce.displayAlert('game id undefined');
                }
            } else {
                $scope.waitForPlayers();
            }

    }]);
})();

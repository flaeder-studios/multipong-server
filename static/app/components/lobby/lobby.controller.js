(function () {

    'use strict';

    angular.module('flaederGamesApp')
        .controller('LobbyController', ['$scope', '$location', '$uibModal', 'lobbyService', 'uiGridConstants', function ($scope, $location, $uibModal, lobbyService, uiGridConstants) {

            $scope.games = [];
            $scope.selectionState = undefined;
            $scope.createGameFormActive = false;

            $scope.listGames = function () {
                return lobbyService.getAllGames(function (data) {
                    $scope.games = data.games;
                });
            };

            $scope.viewGame = function (game) {
                if (game.joinedPlayers.length == game.maxPlayers) {
                    $location.path('/game/battlepong/view/' + game.id);
                }
            }

            $scope.createGame = function (game, callback, errorhandler) {
                lobbyService.createGame(game, function (data) {
                    $scope.games.push(data.games[0]);
                    if (game.join) {
                        $scope.joinGame(data.games[0]);
                    }
                    if (callback) {
                        callback(data.games[0]);
                    }
                }, errorhandler);
            };

            $scope.removeGame = function (game, callback) {
                var idx, removedGame;

                lobbyService.removeGame(game, function (data) {
                    removedGame = data.games[0];

                    for (var i = 0; i < $scope.games.length; i++) {
                        if ($scope.games[i].id == removedGame.id) {
                            idx = i;
                            break;
                        }
                    }

                    if (idx > -1) {
                        $scope.games.splice(idx, 1);
                        if ($scope.player.currentGame && $scope.player.currentGame.id == removedGame.id) {
                            $scope.updatePlayerData();
                        }
                    }
                    console.log('removed game ' + data.games[0])
                    if (callback) {
                        callback(data.games[0]);
                    }
                });
            };

            $scope.joinGame = function (game, callback) {
                if (!$scope.player.currentGame) {
                    lobbyService.joinGame(game, function (data) {
                        var joinedGame = data.games[0],
                            idx = -1;

                        for (var i = 0; i < $scope.games.length; i++) {
                            if ($scope.games[i].id == joinedGame.id) {
                                idx = i;
                                break;
                            }
                        }

                        if (idx > -1) {
                            $scope.games[idx] = joinedGame;
                        } else {
                            $scope.games.push(joinedGame);
                        }

                        $scope.updatePlayerData();

                        console.log('joined game ', joinedGame);
                        if (callback) {
                            callback(data.games[0]);
                        }
                        
                        $location.path('/game/battlepong/play/' + game.id);
                    
                    });
                }
            };

            $scope.leaveGame = function (callback) {
                if ($scope.player.currentGame) {
                    lobbyService.leaveGame(function (data) {
                        var leftGame = data.games[0];
                        for (var i = 0; i < $scope.games.length; i++) {
                            if ($scope.games[i].id === leftGame.id) {
                                $scope.games[i] = leftGame;
                                break;
                            }
                        }
                        $scope.updatePlayerData();
                        console.log("leftGame: ", leftGame);
                        if (callback) {
                            callback(leftGame);
                        }
                    });
                }
            };

            $scope.gameGrid = {
                data: 'games',
                enableSorting: true,
                enableFiltering: false,
                enableRowSelection: true,
                multiSelect: false,
                enableRowHeaderSelection: false,
                enableSelectAll: false,
                rowTemplate: '/app/shared/gamegrid/game-grid-row.html',
                enableColumnMenus: false,
                enableColumnResize: true,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,

                enableGridMenu: false,
                gridMenuCustomItems: [{
                    title: 'Hide Filters',
                    action: function ($event) {
                        $scope.toggleFiltering();
                    },
                    shown: function () {
                        return $scope.gameGrid.enableFiltering;
                    },
                    order: 100
                }, {
                    title: 'Show Filters',
                    action: function ($event) {
                        $scope.toggleFiltering();
                    },
                    shown: function () {
                        return !$scope.gameGrid.enableFiltering;
                    },
                    order: 100
                }],

                onRegisterApi: function (gridApi) {
                    //set gridApi on scope
                    $scope.gridApi = gridApi;
                },

                columnDefs: [{
                    cellTemplate: '/app/shared/gamegrid/game-grid-control.html',
                    name: 'Control',
                    enableHiding: false,
                    enableSorting: false,
                    enableFiltering: false,
                    suppressRemoveSort: true,
                    width: '220'
                }, {
                    field: 'id',
                    name: 'name',
                    suppressRemoveSort: true,
                    enableHiding: false,
                    maxWidth: '220'
                }, {
                    cellTemplate: "<span> {{ row.entity.joinedPlayers.length + ' / ' + row.entity.maxPlayers }} </span>",
                    name: "Joined / Max",
                    suppressRemoveSort: true,
                    enableHiding: false,
                    sortingAlgorithm: function (a, b, rowA, rowB, direction) {
                        var aFullPercent = rowA.entity.joinedPlayers.length / rowA.entity.maxPlayers,
                            bFullPercent = rowB.entity.joinedPlayers.length / rowB.entity.maxPlayers;
                        if (Math.abs(aFullPercent - bFullPercent) < 0.00001) {
                            if (rowB.entity.maxPlayers == rowA.entity.maxPlayers) {
                                return 0;
                            } else if (rowB.entity.maxPlayers < rowA.entity.maxPlayers) {
                                return 1;
                            } else {
                                return -1;
                            }
                        } else if (aFullPercent > bFullPercent) {
                            return 1;
                        } else {
                            return -1;
                        }
                    },
                    filters: [{
                        condition: function (searchTerm, cellValue, row, column) {
                            return row.entity.joinedPlayers.length == searchTerm;
                        },
                        placeholder: 'Current'
                    }, {
                        condition: function (searchTerm, cellValue, row, column) {
                            return row.entity.maxPlayers == searchTerm;
                        },
                        placeholder: 'Max'
                    }],
                    width: '110'
                }, {
                    field: 'createdBy',
                    name: 'Created By',
                    suppressRemoveSort: true,
                    enableHiding: true
                    }, {
                    cellTemplate: '<span ng-repeat="name in row.entity.joinedPlayers"> {{ name }} </span>',
                    name: 'Joined Players',
                    sortingAlgorithm: function (a, b, rowA, rowB, direction) {
                        a = rowA.entity.joinedPlayers.length;
                        b = rowB.entity.joinedPlayers.length;
                        if (a > b) {
                            return -1;
                        } else if (a < b) {
                            return 1;
                        } else {
                            return 0;
                        }
                    },
                    filter: {
                        condition: function (searchTerm, cellValue, row, column) {
                            searchTerm = searchTerm.toLowerCase();
                            for (var i = 0; i < row.entity.joinedPlayers.length; i++) {
                                return row.entity.joinedPlayers[i].toLowerCase().search(searchTerm) > -1;
                            }
                        }
                    },
                }]
            };

            $scope.toggleFiltering = function () {
                console.log("toggleFiltering")
                $scope.gameGrid.enableFiltering = !$scope.gameGrid.enableFiltering;
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                return $scope.gameGrid.enableFiltering;
            };

            $scope.filtersEnabled = false;

            $scope.enableFiltering = function () {
                $scope.gameGrid.enableFiltering = true;
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                return true;
            };

            $scope.disableFiltering = function () {
                $scope.gameGrid.enableFiltering = false;
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                return false;
            };

            $scope.openCreateGameModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/shared/create-game/create-game-modal.template.html',
                    controller: 'CreateGameModalController',
                    resolve: {
                        doCreateGame: function () {
                            return $scope.createGame;
                        }
                    }
                });
            };

            if (!$scope.isRegistered) {
                $location.path('/home')
            }
            $scope.listGames();

        }]);

})();

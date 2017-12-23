angular.module('MyApp')
    .controller('HomeCtrl', function ($scope, $location, $window) {
        $scope.manager = {
            status: 'players',
            game: {
                round: 1,
                name: '',
                player: '',
                count: 0
            },
            players: [],
        };

        $scope.addPlayer = function (player) {
            if (player) {
                $scope.manager.players.push({
                    name: player,
                    rounds: []
                });
            }
        };

        $scope.deletePlayer = function (player) {
            var indexPlayerToDelete;
            angular.forEach($scope.manager.players, function(p, i) {
                if (p.name === player.name) {
                    indexPlayerToDelete = i;
                }
            });
            $scope.manager.players.splice(indexPlayerToDelete, 1);
        };

        $scope.chooseGame = function () {
            $scope.manager.status = 'game';
        };

        $scope.gameChoice = function (game) {
            if (!game) {
                if (1 === Math.floor(Math.random() * 2) + 1) {
                    game = '25';
                } else {
                    game = '10000';
                }
            }
            $scope.manager.game.name = game;
            if ($scope.manager.game.name === '10000') {
                angular.forEach($scope.manager.players, function (player) {
                    player.rounds.push({
                        score: 0
                    });
                });
            }
            if ($scope.manager.game.name === '25') {
                angular.forEach($scope.manager.players, function (player) {
                    player.rounds.push({
                        score: 25
                    });
                });
            }
            $scope.manager.status = 'first';
        };

        $scope.chooseFirstPlayer = function (player) {
            $scope.manager.game.player = player;
            $scope.manager.status = 'play';
            console.log($scope.manager);
        };

        $scope.getNumber = function (num) {
            return new Array(num);
        };

        $scope.resultatsPossibles25 = function () {
            var results = [];
            for (var i = 5; i < 31; i++) {
                results.push(i);
            }
            return results;
        };

        $scope.jouer = function (result, attaqueA) {
            if ($scope.manager.game.name === '25') {
                if (typeof attaqueA === 'undefined') {
                    if (result > 25) {
                        $scope.attaque = result - 25;
                        angular.forEach($scope.manager.players, function (player) {
                            if (player.name === $scope.manager.game.player) {
                                player.rounds.push({score: player.rounds[player.rounds.length - 1].score});
                            }
                        });
                    } else if (result < 25) {
                        angular.forEach($scope.manager.players, function (player) {
                            if (player.name === $scope.manager.game.player) {
                                var resultScore = player.rounds[player.rounds.length - 1].score - (25 - result);
                                if (resultScore < 0) {
                                    resultScore = 0;
                                }
                                player.rounds.push({score: resultScore});
                            }
                        });
                        var indexCurrentPlayer = $scope.nextPlayer();
                        while ($scope.manager.players[indexCurrentPlayer].rounds[$scope.manager.players[indexCurrentPlayer].rounds.length - 1].score === 0) {
                            indexCurrentPlayer = $scope.nextPlayer();
                            $scope.manager.game.count++;
                        }
                    } else {
                        angular.forEach($scope.manager.players, function (player) {
                            if (player.name === $scope.manager.game.player) {
                                player.rounds.push({score: player.rounds[player.rounds.length - 1].score});
                            }
                        });
                        var indexCurrentPlayer = $scope.nextPlayer();
                        while ($scope.manager.players[indexCurrentPlayer].rounds[$scope.manager.players[indexCurrentPlayer].rounds.length - 1].score === 0) {
                            indexCurrentPlayer = $scope.nextPlayer();
                            $scope.manager.game.count++;
                        }
                    }
                }

                if (typeof attaqueA !== 'undefined') {
                    var indexCurrentPlayer = $scope.nextPlayer();
                    while ($scope.manager.players[indexCurrentPlayer].rounds[$scope.manager.players[indexCurrentPlayer].rounds.length - 1].score === 0) {
                        indexCurrentPlayer = $scope.nextPlayer();
                        $scope.manager.game.count++;
                    }
                    if (attaqueA !== 0) {
                        var newScore = $scope.manager.players[indexCurrentPlayer].rounds[$scope.manager.players[indexCurrentPlayer].rounds.length - 1].score - attaqueA;
                        if (newScore < 0) {
                            newScore = 0;
                        }
                        $scope.manager.players[indexCurrentPlayer].rounds[$scope.manager.players[indexCurrentPlayer].rounds.length - 1].score = newScore;
                        while ($scope.manager.players[indexCurrentPlayer].rounds[$scope.manager.players[indexCurrentPlayer].rounds.length - 1].score === 0) {
                            indexCurrentPlayer = $scope.nextPlayer();
                            $scope.manager.game.count++;
                        }
                    }
                    $scope.attaque = false;
                }
            } else {
                var player = $scope.manager.players[$scope.getIndexPlayer()];
                var resultScore = player.rounds[player.rounds.length - 1].score + result;
                if (resultScore > 10000) {
                    resultScore = player.rounds[player.rounds.length - 1].score;
                }
                player.rounds.push({score: resultScore});
                $scope.nextPlayer();
            }

            if ($scope.manager.game.count % $scope.manager.players.length === 0) {
                $scope.manager.game.round++;
                $scope.manager.game.count = 0;
            }

            $scope.manager.game.count++;
            $scope.checkIfEndGame();
        };

        $scope.getIndexPlayer = function () {
            var indexCurrentPlayer = 0;
            angular.forEach($scope.manager.players, function (player, i) {
                if (player.name === $scope.manager.game.player) {
                    indexCurrentPlayer = i;
                }
            });
            return indexCurrentPlayer;
        };

        $scope.nextPlayer = function () {
            var indexCurrentPlayer = $scope.getIndexPlayer();
            if (indexCurrentPlayer + 1 > $scope.manager.players.length - 1) {
                $scope.manager.game.player = $scope.manager.players[0].name;
            } else {
                $scope.manager.game.player = $scope.manager.players[indexCurrentPlayer + 1].name;
            }

            var newIndex = 0;
            angular.forEach($scope.manager.players, function (player, i) {
                if (player.name === $scope.manager.game.player) {
                    newIndex = i;
                }
            });
            return newIndex;
        };

        $scope.checkIfEndGame = function () {
            if ($scope.manager.game.name === '25') {
                var totalForFinish = $scope.manager.players.length - 1;
                var totalFinish = 0;
                angular.forEach($scope.manager.players, function (player) {
                    if (player.rounds[player.rounds.length - 1].score === 0) {
                        totalFinish++;
                    }
                });

                if (totalForFinish === totalFinish) {
                    $scope.endGame = true;
                }
            } else if ($scope.manager.game.name === '10000') {
                var totalForFinish = 1;
                var totalFinish = 0;
                angular.forEach($scope.manager.players, function (player) {
                    if (player.rounds[player.rounds.length - 1].score === 10000) {
                        totalFinish++;
                    }
                });

                if (totalForFinish === totalFinish) {
                    $scope.endGame = true;
                }
            }
        };

        $scope.rejouer = function () {
            $scope.endGame = false;
            $scope.manager.status = 'players';
            $scope.manager.game = {
                round: 1,
                name: '',
                player: '',
                count: 0
            };
            angular.forEach($scope.manager.players, function (player) {
                player.rounds = [];
            });
        };
    });
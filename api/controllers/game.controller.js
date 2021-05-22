let GameState = require('../models/GameState');
let Tile = require('../models/Tile');

let gameService = require('../services/game.service');
let arrayToBoard = gameService.arrayToBoard
let checkForWinners = gameService.checkForWinners
let getRandomAvailableI = gameService.getRandomAvailableI


function newGame(gameState) {
    return new Promise((resolve, reject) => {
        let newGameState = new GameState();
        newGameState.gameId = gameState.playerId
        if(Array.isArray(gameState.board) && gameState.board.length==0){
            newGameState.board = arrayToBoard(new Array(100).fill(0))
        }
        else if (Array.isArray(gameState.board)) {
            newGameState.board = arrayToBoard(gameState.board);
        } else {
            newGameState.board = gameState.board;
        }
        newGameState.save().then( (saved_game_state, err) => {
            if(err) {
                reject(err)
            }
            else {
                resolve(saved_game_state)
            }
        })
    });
}


function findById(id) {
    return new Promise((resolve, reject) => {
        GameState.findById(id).exec( function(err, game){
            if(err) {
                reject(err)
            }
            else {
                resolve(game)
            }
        })
    });
}

function makeMove(id, player_i) {
    return new Promise((resolve, reject) => {
        // warto wyniesc
        if (player_i < 0 || player_i > 99 ) {
            reject(err)
        }
        GameState.findById(id).populate('board').exec( function(err, gs){           
            if(err){
                reject(err)
            }
            else {            
                let playerTile = new Tile()
                playerTile.i = player_i
                playerTile.checked = true
                playerTile.checker = 'player'
                playerTile.save().then(function (p_tile, err) {
                    gs.board[player_i] = p_tile;
                    if (checkForWinners(gs.board, player_i, 'player')) {
                        resolve(201)
                    }
                    else {
                        // TODO choose right place on board
                        backend_i = getRandomAvailableI(gs.board)
                        if (backend_i === -1) {
                            resolve(203)
                        }
                        else {
                            let backendTile = new Tile()
                            backendTile.i = backend_i
                            backendTile.checked = true
                            backendTile.checker = 'ai'
                            playerTile.save().then(function (b_tile, err) {
                                gs.board[backend_i] = b_tile;
                                if (checkForWinners(gs.board, backend_i, 'ai')) {
                                    resolve(202)
                                }
                                else {
                                    GameState.findOneAndUpdate({_id: gs._id},{board: gs.board}).exec( function(err, _){
                                        if(err){
                                            reject(err)
                                        }
                                        else {
                                            resolve(backend_i)
                                        }
                                    })
                                }
                                })
                            }
                        }
                    })
                
            }
        })
    });

}

module.exports = {
    newGame: newGame,
    findById: findById,
    makeMove: makeMove
};

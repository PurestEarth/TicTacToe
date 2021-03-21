const express = require('express'),
      gameRoutes = express.Router(),
      rateLimit = require("express-rate-limit");

let GameState = require('../models/GameState');
let Tile = require('../models/Tile');
let gameService = require('../services/game.service');
let arrayToBoard = gameService.arrayToBoard
let checkForWinners = gameService.checkForWinners
let isWinningSequence = gameService.isWinningSequence

const gsPostLimit = rateLimit({
    windowMs: 24*60 * 60 * 1000,
    max: 100,
    message:
      "Too many attempts"
});


/**
 * @swagger
 * path:
 *  /gameState/:
 *    post:
 *      summary: Start new game
 *      tags: [GameState]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      $ref: '#/components/schemas/GameState   '
 *      responses:
 *        "200":
 *          description: GameState
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/GameState'
*/

gameRoutes.route('/').post( gsPostLimit, function(req,res){
    if (req.body.gameState) {
        let gameState = new GameState();
        let reqgameState = req.body.gameState;
        gameState.gameId = reqgameState.playerId
        if(Array.isArray(reqgameState.board) && reqgameState.board.length==0){
            gameState.board = arrayToBoard(new Array(100).fill(0))
        }
        else if (Array.isArray(reqgameState.board)) {
            console.log('tu')
            gameState.board = arrayToBoard(reqgameState.board);
        } else {
            gameState.board = reqgameState.board;
        }
        gameState.save().then( (saved_game_state, err) => {
            if(err) {
                res.status(500).send('Something went terribly wrong');
            }
            else {
                res.status(200).json(saved_game_state);
            }
        })
    }
    else {
        res.status(500).send();
    }
})


/**
 * @swagger
 * path:
 *  /gameState/:id:
 *    get:
 *      summary: Get game with id
 *      tags: [GameState]
 *      responses:
 *        "200":
 *          description: GameState
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/GameState'
*/

gameRoutes.route('/:id').get( gsPostLimit, function(req,res){
    if (req.params.id) {
        GameState.findById(req.params.id).exec( function(err, gs){
            if(err) {
                res.status(500).send();
            }
            else {
                res.status(200).json(gs);
            }
        })
    }
    else {
        res.status(500).send();
    }
})


/**
 * @swagger
 * path:
 *  /gameState/makeMove/:id/:i:
 *    post:
 *      summary: Player makes a move at tile with id i, in given game 
 *      tags: [GameState]
 *      parameters:
 *        - in: 
 *          name: id
 *          required: true
 *          description: Id of GameState
 *        - in: 
 *          name: i
 *          required: true
 *          description: Place on the board with id of i
 *      responses:
 *        "200":
 *          description: Id of tile crossed by backend
 *          content:
 *            application/json:
 *              schema:
 *                type: boolean
 *        "201":
 *          description: Player has made winning move
 *          content:
 *            application/json:
 *              schema:
 *                type: boolean
 *        "202":
 *          description: Backend has made the winning move
 *          content:
 *            application/json:
 *              schema:
 *                type: boolean
*/

gameRoutes.route('/makeMove/:id/:i').get( gsPostLimit, function(req,res){
    if (req.params.id && req.params.i) {
        let gsId = req.params.id
        let player_i = req.params.i

        GameState.findOne({_id: req.params.id, user_id: req.userId}).populate('board').exec( function(err, gs){           
            if(err){
                res.status(500).send('Something went terribly wrong')
            }
            else {            
                let playerTile = new Tile()
                playerTile.i = player_i
                playerTile.checked = true
                playerTile.checker = 'player'
                playerTile.save().then(function (p_tile, err) {
                    gs.board[player_i] = p_tile;
                    if (checkForWinners(gs.board, player_i, 'player')) {
                        res.status(201).json(true)
                    }
                    else {
                        // TODO choose right place on board
                        let backendTile = new Tile()
                        backendTile.i = player_i - 1
                        backendTile.checked = true
                        backendTile.checker = 'ai'
                        playerTile.save().then(function (b_tile, err) {
                            gs.board[player_i - 1] = b_tile;
                            if (checkForWinners(gs.board, player_i - 1, 'ai')) {
                                res.status(202).json(true) 
                            }
                            else {
                                GameState.findOneAndUpdate({_id: gs._id},{board: gs.board}).exec( function(err, _){
                                    if(err){
                                        res.status(500).send('Something went terribly wrong')
                                    }
                                    else {
                                        res.status(200).json(true)
                                    }
                                })
                            }
                        })
                        }
                    })
                
            }
        })
    }
    else {
        res.status(500).send();
    }
})

module.exports = {
    gameRoutes: gameRoutes
};

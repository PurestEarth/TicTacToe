const express = require('express'),
      gameRoutes = express.Router(),
      gameController = require('../controllers/game.controller')
      rateLimit = require("express-rate-limit");


const gsPostLimit = rateLimit({
    windowMs: 24*60 * 60 * 1000,
    max: 100,
    message:
      "Too many attempts"
});


/**
 * @swagger
 * paths:
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
 *        "500":
 *          description: Request is missing required parameters
 *        "501":
 *          description: Controller wasnt able to save game
*/

gameRoutes.route('/').post( gsPostLimit, function(req,res){
    if (req.body.gameState) {
        gameController.newGame(req.body.gameState).then( saved_game_state => {
            res.status(200).json(saved_game_state);
        },err=>{
            res.status(500).send('Something went terribly wrong');
        })
    }
    else {
        res.status(500).send();
    }
})


/**
 * @swagger
 * paths:
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
 *        "500":
 *          description: Request is missing id
 *        "501":
 *          description: Controller wasnt able to retrieve game
 * 
*/

gameRoutes.route('/:id').get( gsPostLimit, function(req,res){
    if (req.params.id) {
        gameController.findById(req.params.id).then( game => {
            res.status(200).json(game);
        }, err => {
            res.status(501).send("Controller wasnt able to retrieve game");
        })
    }
    else {
        res.status(500).send("Missing required parameters");
    }
})


/**
 * @swagger
 * paths:
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
 *        "500":
 *          description: Request is missing required parameters
 *        "501":
 *          description: Controller wasnt able to finish requested move
*/

gameRoutes.route('/makeMove/:id/:i').get( gsPostLimit, function(req,res){
    if (req.params.id && req.params.i) {
        gameController.makeMove(req.params.id, req.params.i).then( status => {
            res.status(status).json(true)
        }, err => {
            res.status(501).send("Error while attempting to make a move");
        })
    }
    else {
        res.status(500).send("Missing required parameters");
    }
})

module.exports = {
    gameRoutes: gameRoutes
};

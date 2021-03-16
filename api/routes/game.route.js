const express = require('express'),
      gameRoutes = express.Router(),
      rateLimit = require("express-rate-limit");

let GameState = require('../models/GameState');
let Tile = require('../models/Tile');


const gsPostLimit = rateLimit({
    windowMs: 24*60 * 60 * 1000,
    max: 100,
    message:
      "Too many attempts"
});


function isWinningSequence(seq) {
    counter = 0
    seq.forEach(element => {
        if(element){
            counter++;
        }
        else {
            counter = 0;
        }
    });
    return counter >= 5;
}


function checkForWinners(board, last_i) {
    console.log('row')
    // check row
    row_seq = []
    for(let i = Math.max(0, last_i-5); i<Math.min(last_i+5, 100) ;i++) {
        if(last_i%10 == i%10) {
            row_seq.push(board[i].checked)
        }
    }
    if(row_seq.length >= 5) {
        if (isWinningSequence(row_seq)){
            return true;
        }
    }
    console.log(row_seq)
    console.log('column')
    // check column
    column_seq = []
    for(let i = Math.max(0, parseInt((last_i/10)-5)); i<Math.min(parseInt((last_i/10)+5), 10) ;i++) {
        current_i = i*10 + last_i%10
        row_seq.push(board[current_i].checked)
    }
    if (isWinningSequence(row_seq)){
        return true;
    }
    console.log(column_seq)
    console.log('axis')
    // check axis WN axis
    axis_wn = []
    axis_ws = []
    axis_en = []
    axis_es = []
    for(let i = 1; i < 5;i++) {
        if ((last_i)%10-i > 0) {
            axis_wn.push((parseInt(last_i/10)-i)*10 + (last_i)%10-i)
        }
        if ((last_i)%10+i < 10) {
            axis_ws.push((parseInt(last_i/10)+i)*10 + (last_i)%10+i)
        }
        if ((last_i)%10+i < 10) {
            axis_en.push((parseInt(last_i/10)-i)*10 + (last_i)%10+i)
        }
        if ((last_i)%10+i < 10) {
            axis_es.push((parseInt(last_i/10)+i)*10 + (last_i)%10-i)
        }
    }
    axis_wn.push(...axis_es)
    axis_wn.push(last_i)
    axis_ws.push(...axis_en)
    axis_ws.push(last_i)
    console.log(axis_ws)
    console.log(axis_wn)
    if (isWinningSequence(axis_wn)){
        return true;
    }
    if (isWinningSequence(axis_ws)){
        return true;
    }
    return false;
}


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
 *          description: Game id
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/GameState'
*/

gameRoutes.route('/').post( gsPostLimit, function(req,res){
    if (req.body.gameState) {
        let gameState = new GameState();
        let reqgameState = req.body.gameState;

        console.log(reqgameState)
        gameState.gameId = reqgameState.playerId
        gameState.board = reqgameState.board;

        gameState.save().then( (saved_game_state,err) => {
            if(err) {
                res.status(500).send('Something went terribly wrong');
            }
            else {
                res.json(saved_game_state);
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
 *                type: string
*/

gameRoutes.route('/').post( gsPostLimit, function(req,res){
    if (req.params.id && req.params.i) {
        let gsId = req.params.id
        let player_i = req.params.i

        GameState.findOne({_id: req.params.id, user_id: req.userId}).exec( function(err, gs){            
            if(err){
                res.status(500).send('Something went terribly wrong')
            }
            else {            
                let playerTile = new Tile()
                playerTile.i = player_i
                playerTile.checked = true
                playerTile.checker = 'player'
                gs.board[player_i] = playerTile;
                if (checkForWinners(gs.board, player_i)) {
                    // TODO response player wins   
                }
                else {
                    // TODO choose right place on board
                    let backendTile = new Tile()
                    backendTile.i = player_i - 1
                    backendTile.checked = true
                    backendTile.checker = 'backend'
                    gs.board[player_i - 1] = backendTile;
                    if (checkForWinners(gs.board, player_i - 1)) {
                        // TODO response player wins   
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
                        res.status(200).json(true)
                    }
                }
            }
        })
    }
    else {
        res.status(500).send();
    }
})

module.exports = {
    gameRoutes: gameRoutes,
    isWinningSequence: isWinningSequence,
    checkForWinners: checkForWinners
};

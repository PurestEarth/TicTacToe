const express = require('express'),
      playerRoutes = express.Router(),
      rateLimit = require("express-rate-limit");

let Player = require('../models/Player');


const playerLimit = rateLimit({
    windowMs: 24*60 * 60 * 1000,
    max: 100,
    message:
      "Too many attempts"
});


/**
 * @swagger
 * path:
 *  /player/:
 *    post:
 *      summary: Post new Player
 *      tags: [Player]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      $ref: '#/components/schemas/Player'
 *      responses:
 *        "200":
 *          description: Player
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Player'
*/

playerRoutes.route('/').post( playerLimit, function(req,res){
    if (req.body.player) {
        let player = new Player();
        player.name = req.body.player.name
        player.save().then( (player, err) => {
            if(err) {
                res.status(500).send('Something went terribly wrong');
            }
            else {
                res.status(200).json(player._id);
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
 *  /player/:id:
 *    get:
 *      summary: Get player with id
 *      tags: [Player]
 *      responses:
 *        "200":
 *          description: Player
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Player'
*/

playerRoutes.route('/:id').get( playerLimit, function(req,res){
    if (req.params.id) {
        Player.findById(req.params.id).exec( function(err, player){
            if(err) {
                res.status(500).send();
            }
            else {
                res.status(200).json(player);
            }
        })
    }
    else {
        res.status(500).send();
    }
})

playerRoutes.route('/stats/:id').get( playerLimit, function(req,res){
    if (req.params.id) {
        Player.findById(req.params.id).exec( function(err, player){
            if(err) {
                res.status(500).send();
            }
            else {
                res.status(200).json({"wins": player.wins, "draws": player.draws, "loses": player.loses});
            }
        })
    }
    else {
        res.status(500).send();
    }
})


module.exports = {
    playerRoutes: playerRoutes,
};

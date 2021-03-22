
let Player = require('../models/Player');


function createPlayer(name) {
    return new Promise((resolve, reject) => {
        let player = new Player();
        player.name = name
        player.save().then( (player, err) => {
            if(err) {
                reject(err)
            }
            else {
                resolve(player)
            }
        })
    });
}


function findById(id) {
    return new Promise((resolve, reject) => {
        Player.findById(id).exec( function(err, player){
            if(err) {
                reject(err)
            }
            else {
                resolve(player)
            }
        })
    });
}


function getStats(id) {
    return new Promise((resolve, reject) => {
        Player.findById(id).exec( function(err, player){
            if(err) {
                reject(err)
            }
            else {
                resolve({"wins": player.wins, "draws": player.draws, "loses": player.loses})
            }
        })
    });
}



module.exports = {
    createPlayer: createPlayer,
    findById: findById,
    getStats: getStats
};

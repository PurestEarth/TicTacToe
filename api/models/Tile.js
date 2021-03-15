
/**
 * @swagger
 *  components:
 *    schemas:
 *      Tile:
 *        type: object
 *        properties:
 *          i:
 *            type: number 
 *            description: 'id of tile'
 *          checked:
 *            type: boolean
 *            description: 'whether tile was checked by either player'
 *          checker:
 *            type: string
 *            description: 'Either AI or Player depending on who checked the tile'
 *          createdAt:
 *            type: Date
 *            default: Date.now
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Tile = new Schema({
    i: {
      type: Number
    },
    checked: {
        type: Boolean
    },
    checker: {
        type: String
    },
    createdAt: {
       type: Date, required: true, default: Date.now
    }
},{
    collection: 'tile'
    }
);

module.exports = mongoose.model('tile', Tile);


let Tile = require('../models/Tile');

function isWinningSequence(seq) {
    counter = 0
    for(let i = 0; i < seq.length; i++) {
        if(seq[i]){
            counter++;
            if (counter >=5) {
                return true;
            }
        } else {
            counter = 0;
        }
    }
    return false;
}


function arrayToBoard(board) {
    let tiles = [];
    let ownMap = {0: 'neither', 1: 'player', 2: 'ai'}
    for( let i=0; i<board.length; i++) {
        let tile = new Tile()
        tile.i = i
        tile.checked = false
        tile.checker = 'neither'
        tiles.push(tile)
    }
    Tile.insertMany(tiles).then(function(tiles, err) {
        if (err) {
            console.log('error instering tiles')
        }
        else {
        }
    })
    return tiles
}

function testArrayToBoard(board) {
    let tiles = [];
    let ownMap = {0: 'neither', 1: 'player', 2: 'ai'}
    for( let i=0; i<board.length; i++) {
        let tile = new Tile()
        tile.i = i
        tile.checked = board[i] != 0
        tile.checker = ownMap[board[i]]
        tiles.push(tile)
    }
    Tile.insertMany(tiles).then(function(tiles, err) {
        if (err) {
            console.log('error instering tiles')
        }
        else {
        }
    })
    return tiles
}


function getRandomAvailableI(board) {
    available_i = []
    for( let i=0; i<board.length; i++) {
        if( !board[i].checked ) {
            available_i.push(i)
        }
    }
    if (available_i.length === 0) {
        return -1
    }
    else {
        return available_i[Math.floor(Math.random() * available_i.length)];
    }
}


function checkForWinners(board, last_i, player) {
    // check row
    row_seq = []
    for(let i = Math.max(0, last_i-4); i<=Math.min(last_i+4, 100) ;i++) {
        if(parseInt(last_i/10) == parseInt(i/10) && board[i]) {
            row_seq.push(board[i].checked && (board[i].checker === player))
        }
    }
    if(row_seq.length >= 5) {
        if (isWinningSequence(row_seq)){
            return true;
        }
    }
    // check column
    column_seq = []
    for(let i = Math.max(0, parseInt((last_i/10)-5)); i<Math.min(parseInt((last_i/10)+5), 10) ;i++) {
        current_i = i*10 + last_i%10
        if (board[current_i]) {
            column_seq.push(board[current_i].checked && (board[current_i].checker === player))
        }
    }
    if (isWinningSequence(column_seq)){
        return true;
    }

    // check axis WN axis
    axis_wn = []
    axis_ws = []
    axis_en = []
    axis_es = []
    for(let i = 1; i <5;i++) {
        if ((last_i)%10-i >= 0) {
            current_i = (parseInt(last_i/10)-i)*10 + (last_i)%10-i
            if (board[current_i]) {
                axis_wn.unshift(board[current_i].checked && (board[current_i].checker === player))
            }
        }
        if ((last_i)%10+i < 10) {
            current_i = (parseInt(last_i/10)+i)*10 + (last_i)%10+i
            if (board[current_i]) {
                axis_es.push(board[current_i].checked && (board[current_i].checker === player))
            }
        }
        if ((last_i)%10+i < 10) {
            current_i = (parseInt(last_i/10)-i)*10 + (last_i)%10+i
            if (board[current_i]) {
                axis_en.unshift(board[current_i].checked && (board[current_i].checker === player))
            }
        }
        if ((last_i)%10+i < 10) {
            current_i = (parseInt(last_i/10)+i)*10 + (last_i)%10-i
            if (board[current_i]) {
                axis_ws.push(board[current_i].checked && (board[current_i].checker === player))
            }
        }
    }
    axis_es.push(board[last_i].checked && (board[last_i].checker === player))
    axis_es.push(...axis_wn)
    axis_en.push(board[last_i].checked && (board[last_i].checker === player)) 
    axis_en.push(...axis_ws)
    if (isWinningSequence(axis_es)){
        return true;
    }
    if (isWinningSequence(axis_en)){
        return true;
    }
    return false;
}

module.exports = {
    isWinningSequence: isWinningSequence,
    checkForWinners: checkForWinners,
    arrayToBoard: arrayToBoard,
    testArrayToBoard: testArrayToBoard, 
    getRandomAvailableI: getRandomAvailableI
};

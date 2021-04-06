const gameService = require('../services/game.service');

  
describe('Winning sequence test', () => {
    it('should return true for winning sequences', () => {
    expect(gameService.isWinningSequence([true,true,true,true,true])).toBe(true)
    expect(gameService.isWinningSequence([true,true,false,true,true])).toBe(false)
    expect(gameService.isWinningSequence([false,true,true,true,true])).toBe(false)
    expect(gameService.isWinningSequence([false,true,true,true,true,true])).toBe(true)
    expect(gameService.isWinningSequence([false,true,true,true,true,true,false,true,true,true,true,true])).toBe(true)
    expect(gameService.isWinningSequence([false,true,true,false,true,true,false,true,true,true,false,true])).toBe(false)
    })
})

describe('Test methods ability to validate winning state', () => {
    it('should return true for winning sequences', () => {
      let jsonBoards = require('./data/boards.json');
      Object.keys(jsonBoards).forEach( key => {
        let board = gameService.testArrayToBoard(jsonBoards[key]['board'])
        console.log(key)
        expect(gameService.checkForWinners(board, jsonBoards[key]['last_i'], jsonBoards[key]['player'])).toBe(jsonBoards[key]['expected_result'])
      })
    })
  })
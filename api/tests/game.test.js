const gameRoute = require('../routes/game.route');

describe('Winning sequence test', () => {
    it('should return true for winning sequences', () => {
      expect(gameRoute.isWinningSequence([true,true,true,true,true])).toBe(true)
      expect(gameRoute.isWinningSequence([true,true,false,true,true])).toBe(false)
      expect(gameRoute.isWinningSequence([false,true,true,true,true])).toBe(false)
      expect(gameRoute.isWinningSequence([false,true,true,true,true,true])).toBe(true)
      expect(gameRoute.isWinningSequence([false,true,true,true,true,true,false,true,true,true,true,true])).toBe(true)
      expect(gameRoute.isWinningSequence([false,true,true,false,true,true,false,true,true,true,false,true])).toBe(false)
    })
})

describe('Test methods ability to validate winning state', () => {
  it('should return true for winning sequences', () => {
    let jsonBoards = require('./data/boards.json');
    Object.keys(jsonBoards).forEach( key => {
      expect(gameRoute.checkForWinners(jsonBoards[key]['board'], jsonBoards[key]['last_i'])).toBe(jsonBoards[key]['expected_result'])
    })
  })
})

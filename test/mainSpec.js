/*global describe, it */

define(['main'], function (main) {
  var initial, board;

  var valuesWeights = {
    reachThree: 10,
    builtFourth: -1,
    1: 1,
    2: 0.5,
    3: 0.2,
    4: 0.1,
    '01': 2,
    '12': 5,
    '11': 2,
    '23': 8,
    '22': 6,
    '21': 4,
    '33': 9,
    '32': 7
  }

  beforeEach(function() {
    initial = [1,2]
  })

  // describe('calculateMove', function() {
  //   it ('moves north', function() {
  //     expect(main.calculateMove('N', initial)).toEqual([1,1]);
  //
  //   })
  //
  //   it ('moves south', function() {
  //     expect(main.calculateMove('S', initial)).toEqual([1,3]);
  //   })
  //
  //   it ('moves west', function() {
  //     expect(main.calculateMove('W', initial)).toEqual([0,2]);
  //   })
  //
  //   it ('moves north west', function() {
  //     expect(main.calculateMove('NW', initial)).toEqual([0,1]);
  //   })
  //
  //   it ('moves south east', function() {
  //     expect(main.calculateMove('SE', initial)).toEqual([2,3]);
  //   })
  // })

  // describe('checkSurroundings', function() {
  //   describe('cell in center', function() {
  //     it('returns 0 when no available', function() {
  //       board = [
  //         '00000',
  //         '00000',
  //         '00300',
  //         '00000',
  //         '00000'
  //       ]
  //
  //       initial = [2,2];
  //       var result = main.checkSurroundings(board, initial);
  //       expect(result).toEqual(0)
  //     })
  //   })
  //
  //   it('returns 8 when all available', function() {
  //     board = [
  //       '00000',
  //       '00000',
  //       '00000',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     initial = [2,2];
  //     board[2][2] = 1;
  //     var result = main.checkSurroundings(board, initial);
  //     expect(result).toEqual(8)
  //   })
  //
  //   it('returns 4 ', function() {
  //     board = [
  //       '10000',
  //       '21000',
  //       '10000',
  //       '41000',
  //       '00000'
  //     ]
  //
  //     initial = [0,2];
  //     var result = main.checkSurroundings(board, initial);
  //     expect(result).toEqual(4)
  //   })
  //
  //   it('returns 3 ', function() {
  //     board = [
  //       '10000',
  //       '210.0',
  //       '14000',
  //       '43.40',
  //       '00000'
  //     ]
  //
  //     initial = [2,2];
  //     var result = main.checkSurroundings(board, initial);
  //     expect(result).toEqual(3)
  //   })
  //
  //   it('passes rigth value to validCells', function() {
  //     board = [
  //       '00000',
  //       '01230',
  //       '08040',
  //       '0.650',
  //       '00000'
  //     ]
  //
  //     initial = [2,2];
  //     main.checkSurroundings(board, initial)
  //   })
  //
  //   it('passes rigth value to validCells on corner', function() {
  //     board = [
  //       '00000',
  //       '01230',
  //       '08040',
  //       '0.650',
  //       '00000'
  //     ]
  //
  //     initial = [0,0];
  //     main.checkSurroundings(board, initial)
  //   })
  //
  // })

  // describe('simulateMove', function() {
  //   it('1', function() {
  //     var board = [
  //       '00000',
  //       '00000',
  //       '00000',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var newBoard = [
  //       '00000',
  //       '00000',
  //       '00100',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var move = ['sdsd', 0, 'NE', 'SW', 0];
  //     var position = [2,2]
  //
  //     var result = main.simulateMove(board, move, position);
  //     var expected = {
  //       newBoard: newBoard,
  //       newPosition: [3,1],
  //       blockPosition: [2,2]
  //     };
  //     expect(result).toEqual(expected);
  //   })
  //
  //   it('2', function() {
  //     var board = [
  //       '11000',
  //       '01000',
  //       '10000',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var newBoard = [
  //       '21000',
  //       '01000',
  //       '10000',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var move = ['sdsd', 0, 'N', 'W', 0];
  //     var position = [1,1]
  //
  //     var result = main.simulateMove(board, move, position);
  //     var expected = {
  //       newBoard: newBoard,
  //       newPosition: [1,0],
  //       blockPosition: [0,0]
  //     };
  //     expect(result).toEqual(expected);
  //   })
  //
  // })

  // describe('calculateStepGain', function () {
  //   it('1', function() {
  //     var board = [
  //       '00000',
  //       '04300',
  //       '00000',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var position = [2,1];
  //     var blockPosition = [1,1];
  //
  //     var result = main.calculateStepGain(board, position, blockPosition);
  //     var expected = valuesWeights['reachThree']  + valuesWeights['builtFourth']
  //     expect(result).toEqual(expected);
  //   })
  //
  // })

  // describe('calculateCellValue', function() {
  //   xit('2', function() {
  //     var board = [
  //       '01000',
  //       '00000',
  //       '00000',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var position = [1,1]
  //
  //     var result = main.calculateCellValue(board, position, 1);
  //     var expected = valuesWeights['01']+7
  //     expect(result).toEqual(expected);
  //   })
  //
  //   xit('3', function() {
  //     var board = [
  //       '11100',
  //       '10100',
  //       '11100',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var position = [1,1]
  //
  //     var result = main.calculateCellValue(board, position, 1);
  //     var expected = valuesWeights['01']*8
  //     expect(result).toEqual(expected);
  //   })
  //
  //   xit('4', function() {
  //     var board = [
  //       '11100',
  //       '11100',
  //       '11100',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var position = [0,0]
  //
  //     var result = main.calculateCellValue(board, position, 1);
  //     var expected = valuesWeights['11']*3
  //     expect(result).toEqual(expected);
  //   })
  //
  //   xit('5', function() {
  //     var board = [
  //       '1.100',
  //       '11100',
  //       '11100',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var position = [0,0]
  //
  //     var result = main.calculateCellValue(board, position, 1);
  //     var expected = valuesWeights['11']*2
  //     expect(result).toEqual(expected);
  //   })
  //
  //   xit('6', function() {
  //     var board = [
  //       '1.100',
  //       '41100',
  //       '11100',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var position = [0,0]
  //
  //     var result = main.calculateCellValue(board, position, 1);
  //     var expected = valuesWeights['11']
  //     expect(result).toEqual(expected);
  //   })
  //
  //   xit('7', function() {
  //     var board = [
  //       '33300',
  //       '32300',
  //       '33300',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var position = [1,1]
  //
  //     var result = main.calculateCellValue(board, position, 1);
  //     var expected = valuesWeights['23']*8
  //     expect(result).toEqual(expected);
  //   })
  //
  //   xit('8', function() {
  //     var board = [
  //       '33300',
  //       '33300',
  //       '33300',
  //       '00000',
  //       '00000'
  //     ]
  //
  //     var position = [1,1]
  //
  //     var result = main.calculateCellValue(board, position, 1);
  //     var expected = valuesWeights['33']*8
  //     expect(result).toEqual(expected);
  //   })
  //
  //   xit('9', function() {
  //     var board = [
  //       '00000',
  //       '01002',
  //       '01001',
  //       '01100',
  //       '00000'
  //     ]
  //
  //     var position = [3,3]
  //     var depth = 3
  //
  //     var maxValue = 0;
  //     var maxCell = 0;
  //
  //     for (var x=0; x<5; x++) {
  //       for (var y=0; y<5; y++) {
  //         var value = main.calculateCellValue(board, [x,y], depth, 0, false, [])
  //         if (value > maxValue) {
  //           maxValue = value;
  //           maxCell = [x,y]
  //         }
  //       }
  //     }
  //
  //     expect([maxCell, maxValue]).toEqual(4);
  //   })
  //
  // })

  describe('getBestAction', function() {
    it('1', function() {
      var board = [
        '01000',
        '00000',
        '00000',
        '00000',
        '00000'
      ]

      var units = [[0,0]]
      var oponentUnits = [[1,1]]
      var legalActions = ['PUSH$MOVE 0 SE NE', 'PUSH$MOVE 0 NE NE']

      var bestAction = main.getBestAction(board, units, oponentUnits, legalActions)
      expect(bestAction).toEqual('PUSH$MOVE 0 SE NE');
    })

  })
});




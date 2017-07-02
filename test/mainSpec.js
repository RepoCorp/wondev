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


  // var board = [
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0]
  // ];


  xdescribe('calculateMove', function() {
    it('N', function() {
      var current = [1,1];
      var endPoint = main.calculateMove('N', current);
      expect(endPoint).toEqual([1,0])
    })

    it('SE', function() {
      var current = [1,1];
      var endPoint = main.calculateMove('SE', current);
      expect(endPoint).toEqual([2,2])
    })
  })

  xdescribe('getUnitInPosition', function() {
    it('true', function() {
      var units = [[2, 2], [4, 0]];
      var isIn = main.getUnitInPosition(units, [4, 0]);
      expect(isIn).toEqual(1);
    })

    it('false', function() {
      var units = [[2, 2], [4, 0]];
      var isIn = main.getUnitInPosition(units, [3, 0]);
      expect(isIn).toEqual(-1);
    })
  })

  xdescribe('calculateHeight', function() {
    it('0', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
      var theGame = new main.game(board, [], []);
      var height = theGame.calculateHeight([4, 0]);
      expect(height).toEqual(0);
    })

    it('3', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
      var theGame = new main.game(board, [], []);
      var height = theGame.calculateHeight([1, 1]);
      expect(height).toEqual(3);
    })
  })

  xdescribe('getSurroundings', function() {
    it('0', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [0, 4, '.', 1, 0],
        [0, 0, 0, '.', 0],
        [0, 2, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
      var theGame = new main.game(board, [], []);
      var surroundings = theGame.getSurroundings([2, 2]);
      expect(surroundings.length).toEqual(5);
    })

    it('3', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
      var theGame = new main.game(board, [], []);
      var surroundings = theGame.getSurroundings([0, 0]);
      expect(surroundings.length).toEqual(3);
    })
  })

  xdescribe('getMoveValue', function() {
    it('0', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [0, 4, '.', 1, 0],
        [0, 0, 0, '.', 0],
        [0, 2, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
      var theGame = new main.game(board, [], []);
      theGame.lastMovePosition = [0, 0];
      var value = theGame.getLastMoveValue();
      expect(value).toEqual(0);
    })

    it('3', function() {
      var board = [
        [0, 3, 0, 0, 0],
        [0, 4, '.', 1, 0],
        [0, 0, 0, '.', 0],
        [0, 2, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
      var theGame = new main.game(board, [], []);
      theGame.lastMovePosition = [1, 0];
      var value = theGame.getLastMoveValue();
      expect(value).toEqual(20);
    })
  })

  xdescribe('calculateCellValue', function() {
    it('0', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [0, 4, '.', 1, 0],
        [0, 2, 2, '.', 0],
        [0, 2, 1, 3, 3],
        [0, 2, 3, 1, 3]
      ];
      var theGame = new main.game(board, [], []);
      var value = theGame.calculateCellValue([3,4], 3, 0, []);
      expect(value).toEqual(33);
    })
  })

  xdescribe('simulateMovePush', function() {
    it('0', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [0, 4, '.', 1, 0],
        [0, 2, 2, '.', 0],
        [0, 2, 1, 3, 3],
        [0, 2, 3, 1, 3]
      ];
      var theGame = new main.game(board, [[3,3]], [[2,3]]);
      var value = theGame.simulateMovePush({action: 'PUSH&BUILD', unit: 0, move1: 'W', move2: 'SW'});
      expect(theGame.calculateHeight([2,3])).toEqual(2);
      expect(theGame.playerUnits[0][1]).toEqual(3);
      expect(theGame.oponentUnits[0][1]).toEqual(4);
    })
  })

  xdescribe('simulateMoveMove', function() {
    it('0', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [0, 4, '.', 1, 0],
        [0, 2, 2, '.', 0],
        [0, 2, 2, 3, 3],
        [0, 2, 3, 1, 3]
      ];
      var theGame = new main.game(board, [[3,3]], [[2,3]]);
      var value = theGame.simulateMoveMove({action: 'MOVE&BUILD', unit: 0, move1: 'W', move2: 'SW'});
      expect(theGame.calculateHeight([1,4])).toEqual(3);
      expect(theGame.playerUnits[0][0]).toEqual(2);
    })
  })

  xdescribe('getUnitsDispersionValue', function() {
    it('0', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];
      var theGame = new main.game(board, [[1,2], [2,3], [4,4]], []);
      var value = theGame.getUnitsDispersionValue();
      expect(value).toEqual(3);
    })
  })

  xdescribe('calculateStateValue', function() {
    it('0', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [3, 3, 2, 0, 0],
        [3, 3, 3, 2, 3],
        [3, 3, 3, 2, 3],
        [3, 2, 3, 3, 3]
      ];
      var theGame = new main.game(board, [[3,2], [4,4]], []);
      var value = theGame.calculateStateValue();
      expect(value).toEqual(3);
    })
  })

  xdescribe('getPushActionsWorstValue', function() {
    it('0', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [0, 3, 3, 0, 0],
        [0, 3, 3, 4, 4],
        [0, 0, 0, 2, 0],
        [0, 0, 1, 0, 3]
      ];
      var theGame = new main.game(board, [[3,3]], [[4,4]]);
      var value = theGame.getPushActionsWorstValue([2,3], [3,3], 0);
      expect(value).toEqual(3);
    })
  })

  describe('calculateOponentMovesResult', function() {
    it('0', function() {
      var board = [
        [0, 0, 0, 0, 0],
        [0, 3, 3, 0, 0],
        [0, 3, 3, 4, 4],
        [0, 0, 0, 2, 0],
        [0, 0, 1, 0, 3]
      ];
      var theGame = new main.game(board, [[3,3]], [[4,4]]);
      var value = theGame.calculateOponentMovesResult();
      expect(value).toEqual(3);
    })
  })

});




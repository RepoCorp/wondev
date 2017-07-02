// define(["lodash"], function (_) {

  var valuesWeights = {
    reachThree: 20,
    builtFourth: -1,
    up: 0.4,
    down: 0.4,
    stay: 0.4,
    0: 1,
    1: 0.6,
    2: 0.4,
    3: 0.3
  };

  var depthConfig = 2;

  function Game(board, playerUnits, oponentUnits) {
    var self = this;
    self.board = [];
    board.forEach(function(row) {
      self.board.push(row.slice());
    });
    self.playerUnits = [];
    playerUnits.forEach(function(unit) {
      self.playerUnits.push(unit.slice());
    })
    self.oponentUnits = [];
    oponentUnits.forEach(function(unit) {
      self.oponentUnits.push(unit.slice());
    })
  }

  Game.prototype.simulateMove = function(move) {
    if (move.action == 'PUSH&BUILD') {
      this.simulateMovePush(move);
    } else if (move.action == 'MOVE&BUILD') {
      this.simulateMoveMove(move);
    }
  };

  Game.prototype.simulateMovePush = function (move) {
    var oponentPosition = calculateMove(move.move1, this.playerUnits[move.unit]);
    var newOponentPosition = calculateMove(move.move2, oponentPosition);
    var oponentIndex = getUnitInPosition(this.oponentUnits, oponentPosition);
    this.oponentUnits[oponentIndex] = newOponentPosition;
    this.board[oponentPosition[1]][oponentPosition[0]] += 1;
    this.lastMovePosition = this.playerUnits[move.unit];
  };

  function getUnitInPosition(units, position) {
    return units.findIndex(function(unit) {
      return unit[0] == position[0] && unit[1] == position[1];
    })
  }

  Game.prototype.simulateMoveMove = function (move) {
    var newPosition = calculateMove(move.move1, this.playerUnits[move.unit]);
    this.playerUnits[move.unit] = newPosition;
    var blockPosition = calculateMove(move.move2, newPosition);
    this.board[blockPosition[1]][blockPosition[0]] += 1;
    this.lastMovePosition = newPosition;
  };

var size = parseInt(readline());
var unitsPerPlayer = parseInt(readline());

while (true) {
  var board = [];
  var myUnits = [];
  var herUnits = [];
  var actions = [];
  var i;
  var inputs;

  for (i = 0; i < size; i++) {
    var row = readline().split('');
    row = row.map(function(element) {
      if (element != '.')
        return parseInt(element);
      else
        return element;

    });
    board.push(row);
    printErr(row);
  }

  var unit;
  for (i = 0; i < unitsPerPlayer; i++) {
    inputs = readline().split(' ');
    unit = [parseInt(inputs[0]), parseInt(inputs[1])]
    myUnits.push(unit);
  }
  for (i = 0; i < unitsPerPlayer; i++) {
    inputs = readline().split(' ');
    unit = [parseInt(inputs[0]), parseInt(inputs[1])]
    herUnits.push(unit);
  }

  var legalActions = parseInt(readline());
  var action = {};
  for (i = 0; i < legalActions; i++) {
    action = {};
    inputs = readline();
    action.string = inputs;
    inputs = inputs.split(' ');
    action.action = inputs[0];
    action.unit = parseInt(inputs[1]);
    action.move1 = inputs[2];
    action.move2 = inputs[3];
    actions.push(action);
  }

  var gameBoard = new Game(board, myUnits, herUnits);
  action = gameBoard.getBestAction(actions);
  print(action);

}

  function calculateMove(movDir, current) {
    var x = current[0];
    var y = current[1];

    if (movDir.includes('N'))
      y -= 1;
    if (movDir.includes('S'))
      y += 1;
    if (movDir.includes('E'))
      x += 1;
    if (movDir.includes('W'))
      x -= 1;

    return [x,y];
  }

  Game.prototype.getBestAction = function (legalActions) {
    var bestAction;
    var bestValue = 0;

    legalActions.forEach(function(action) {
      var actionValue = this.getActionValue(action);
      if (actionValue > bestValue) {
        bestValue = actionValue;
        bestAction = legalActions[i]
      }
    });
    return bestAction;
  };

  Game.prototype.calculateHeight = function(position) {
    return this.board[position[1]][position[0]]
  }

  function checkMemoized(memoized, cell, stepNum) {
    var memoSaved = memoized.find(function(memo) {
      return memo.cell[0] == cell[0] && memo.cell[1] == cell[1];
    });

    if (memoSaved) {
      if (stepNum > memoSaved.step) {
        return {value: 0};
      } else {
        var diff = memoSaved.rawValue * (valuesWeights[stepNum] - valuesWeights[memoSaved.step]);
        memoSaved.step = stepNum;
        return {value: diff};
      }
    } else {
      return 0;
    }
  }

  Game.prototype.calculateCellValue = function (cell, depth, stepNum, memoized) {
    if (stepNum == depth) {
      return 0;
    }

    var isMemoized = checkMemoized(memoized, cell, stepNum);
    if (isMemoized) {
      return isMemoized.value;
    }

    var cells = this.getSurroundings(cell);
    var cellHeight = this.calculateHeight(cell);
    var cellValue = cellHeight * 2;

    for (var i=0; i<cells.length; i++) {
      var surrCellValue = this.calculateHeight(cells[i]);
      if (Math.abs(surrCellValue - cellHeight) < 2) {
        var pairValue = 0;
        switch (surrCellValue - cellHeight) {
          case 0:
            pairValue = valuesWeights['stay'];
            break;
          case 1:
            pairValue = valuesWeights['up'];
            break;
          case -1:
            pairValue = valuesWeights['down'];
            break;
        }
        cellValue += pairValue;
        if (surrCellValue == 3) {
          cellValue += 2;
        }
      }
    }

    memoized.push({cell: cell, step: stepNum, rawValue: cellValue});

    var surroundingCellsValue = 0;
    for (var i=0; i<cells.length; i++) {
      var surrCellValue = this.calculateHeight(cells[i]);
      if (Math.abs(surrCellValue - cellHeight) < 2) {
        surroundingCellsValue += this.calculateCellValue(cells[i], depth, stepNum + 1, memoized)
      }
    }

    var weightedCellValue = cellValue * valuesWeights[stepNum];
    return weightedCellValue + surroundingCellsValue;
  }

  Game.prototype.calculateStateValue = function() {
    var stateValue = 0;
    var unitsDispersionValue = this.getUnitsDispersionValue();

    var self = this;
    this.playerUnits.forEach(function(playerCell) {
        stateValue += self.calculateCellValue(playerCell, depthConfig, 0, []);
    })

    return stateValue + unitsDispersionValue;
  };

  Game.prototype.getUnitsDispersionValue = function () {
    var totalDistance = 0;

    var self = this;
    this.playerUnits.forEach(function(playerCell) {
      self.playerUnits.forEach(function (otherCell) {
        totalDistance += Math.abs(playerCell[0] - otherCell[0]);
        totalDistance += Math.abs(playerCell[1] - otherCell[1]);
      })
    })

    var mainDistance = (totalDistance / this.playerUnits.length);

    return mainDistance * -4;
  };

  Game.prototype.getSurroundings = function (unit) {
    var cells = [];
    for (var y=-1; y<2; y++) {
      if ((unit[1] + y) >=0 && (unit[1] + y) < this.board.length) {
        for (var x=-1; x<2; x++) {
          if ((unit[0] + x) >=0 && (unit[0] + x) < this.board.length) {
            if(!(x===0 && y===0)) {
              var cellValue = this.board[y+unit[1]][x+unit[0]];
              if (!(cellValue=='.') && !(cellValue==4)) {
                cells.push([unit[0]+ x, unit[1] + y]);
              }
            }
          }
        }
      }
    }

    return cells;
  }

  Game.prototype.getLastMoveValue = function() {
    if (this.calculateHeight(this.lastMovePosition) == 3) {
      return 20;
    } else {
      return 0;
    }
  };

  function getActionValue(action) {

    var simulation = new Game(this.board, this.playerUnits, this.oponentUnits);
    simulation.simulateMove(action);

    var moveValue = simulation.getLastMoveValue();

    var worstValue = simulation.calculateOponentMovesResult();

    var cellValue;

    if (worstValue ==  99999999) {
      cellValue = simulation.calculateStateValue(depthConfig, 0, []);
    } else {
      cellValue = worstValue;
    }
    return moveValue + cellValue;
  }

  Game.prototype.calculateOponentMovesResult = function() {
    var worstActionValue = 99999999;
    var tempActionValue;

    var theGame = this;
    this.oponentUnits.forEach(function(oponentUnit, unitIndex) {
      if (oponentUnit[0] != -1) {
        var unitHeight = theGame.calculateHeight(oponentUnit);
        var surroundings = theGame.getSurroundings(oponentUnit);
        surroundings.forEach(function(surroundingCell) {
          var myUnitIndex = getUnitInPosition(theGame.playerUnits, surroundingCell);
          if (myUnitIndex != -1) {
            tempActionValue = theGame.getPushActionsWorstValue(oponentUnit, surroundingCell, myUnitIndex);
            if (tempActionValue < worstActionValue) {
              worstActionValue = tempActionValue;
            }
          } else if (getUnitInPosition(theGame.oponentUnits, surroundingCell) != -1) {
            // nothing
          } else {
            var cellHeight = theGame.calculateHeight(surroundingCell);
            if (Math.abs(cellHeight - unitHeight) < 2) {
              var blockOptions = this.getSurroundings(surroundingCell);
              blockOptions.forEach(function(blockCell) {
                if (getUnitInPosition(theGame.playerUnits.concat(theGame.oponentUnits), blockCell) == -1) {
                  var tempGame = new Game(theGame.board, theGame.playerUnits, theGame.oponentUnits);
                  tempGame.oponentUnits[unitIndex] = surroundingCell;
                  tempGame.board[blockCell[1]][blockCell[0]] += 1;
                  tempActionValue = tempGame.calculateStateValue();
                  if (tempActionValue < worstActionValue) {
                    worstActionValue = tempActionValue;
                  }
                }
              })
            }

          }
        })
      }
    });

    return worstActionValue;

  }

  Game.prototype.getPushActionsWorstValue = function(oponentUnit, myUnit, myUnitIndex) {
    var worstActionValue = 99999999;
    var tempActionValue;

    var myUnitHeight = this.calculateHeight(myUnit);
    var mySurroundings = this.getSurroundings(myUnit);
    var theGame = this;
    mySurroundings.forEach(function (surroundingCell) {
      var cellHeight = theGame.calculateHeight(surroundingCell);
      if (Math.abs(cellHeight - myUnitHeight) < 2) {
        if (getUnitInPosition(theGame.playerUnits.concat(theGame.oponentUnits), surroundingCell) == -1) {
          var tempGame = new Game(theGame.board, theGame.playerUnits, theGame.oponentUnits);
          tempGame.playerUnits[myUnitIndex] = surroundingCell;
          tempGame.board[myUnit[1]][myUnit[0]] += 1;
          tempActionValue = tempGame.calculateStateValue();
          if (tempActionValue < worstActionValue) {
            worstActionValue = tempActionValue;
          }
        }
      }
    })
    return worstActionValue;

  }


//   return {
//     version: _.VERSION,
//     calculateMove: calculateMove,
//     getUnitInPosition: getUnitInPosition,
//     game: Game
//   };
// });

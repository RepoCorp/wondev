define([], function () {


  /**
   * Auto-generated code below aims at helping you parse
   * the standard input according to the problem statement.
   **/

  var size = parseInt(readline());
  var unitsPerPlayer = parseInt(readline());
  var depthConfig = 2;

  var valuesWeights = {
    reachThree: 20,
    builtFourth: -1,
    up: 0.1,
    down: 0.1,
    stay: 0.1,
    0: 1,
    1: 0.9,
    2: 0.8,
    3: 0.7
  };


// game loop
  function mainAppyyy() {
    while (true) {
      var board = [];
      var myUnits = [];
      var herUnits = [];
      var actions = [];
      var unitActions = [];
      var actionMax = [];

      for (var i = 0; i < size; i++) {
        var row = readline();
        board.push(row);
        //printErr(row);
      }
      for (var i = 0; i < unitsPerPlayer; i++) {
        var inputs = readline().split(' ');
        var unit = [parseInt(inputs[0]), parseInt(inputs[1])]
        myUnits.push(unit);
        unitActions.push([]);
        actionMax.push(0);
      }
      for (var i = 0; i < unitsPerPlayer; i++) {
        var inputs = readline().split(' ');
        var unit = [parseInt(inputs[0]), parseInt(inputs[1])]
        herUnits.push(unit);
        printErr(inputs);
      }

      var legalActions = parseInt(readline());
      for (var i = 0; i < legalActions; i++) {
        var action = [];
        var inputs = readline().split(' ');
        action.push(inputs[0]);
        action.push(parseInt(inputs[1]));
        action.push(inputs[2]);
        action.push(inputs[3]);
      }

      var action = getBestAction(board, myUnits, herUnits, legalActions);
      print(action);

    }
  }

  function getBestAction(board, units, oponentUnits, legalActions) {

    var bestAction;
    var bestValue = 0;

    for (var i=0; i<legalActions.length; i++) {
      var actionValue = getActionValue(board, units, oponentUnits, legalActions[i]);
      if (actionValue > bestValue) {
        bestValue = actionValue;
        bestAction = legalActions[i]
      }
    }

  }

  function getActionValue(board, units, oponentUnits, action) {
    var unit = units[action[1]];
    var oponentInitalValue = calculateOponentAvgValue(board, units, oponentUnits);
    var unitInitialValue = calculateCellValue(board, unit, depthConfig, 0, false, [], oponentUnits)

    var pushed = (action[0] == 'PUSH&BUILD');
    var simulation = simulateMove(board, action, unit);

    var simulatedUnits = units.clone()
    simulatedUnits[action[1]] = simulation.newPosition;

    var moveValue = 0;

    if (calculateHeight(board, simulation.newPosition) == 3) {
      moveValue = 20;
    }
    var oponentMoves = getOponentMoves(simulation.newBoard, oponentUnits, simulatedUnits);

    var minValue = 'x';

    if (oponentMoves.length == 0) {
      minValue = calculateCellValue(simulation.newBoard, simulation.newPosition, depthConfig, 0, pushed, [])
    }

    for(var i=0; i<oponentMoves.lenght; i++) {
      var updatedBoard = addBlockToBoard(board, oponentMoves.blockPosition);
      var cellValue = calculateCellValue(updatedBoard, simulation.newPosition, depthConfig, 0, pushed, [])
      if (minValue == 'x' || minValue > cellValue) {
        minValue = cellValue;
      }
    }

    return moveValue + minValue;
  }

  function getOponentMoves(board, oponentUnits, units) {
    var possibleMoves = [];

    for (var i = 0; i < oponentUnits; i++) {
      var unit = oponentUnits[i];
      var unitHeight = calculateHeight(board, unit);

      if (unit[0] != -1) {
        var surroundings = getSurroundings(board, unit);
        for (var j = 0; j < surroundings.length; j++) {
          if (unitInCell(units, surroundings[j].point)) {  // y si hay otro oponente en esa celda?
          } else {
            if (Math.abs(surroundings[j].value - unitHeight) < 2) {
              var updatedOponentUnits = getUpdatedUnits(oponentUnits, oponentPosition, i);
              var oponentPosition = surroundings[j].point;
              var blockOptions = getSurroundings(board, oponentPosition)
              for (var n = 0; n < blockOptions.lenght; n++) {
                if (!unitInCell(units + oponentUnits, blockOptions[n])) {
                  possibleMoves.push({oponentUnits: updatedOponentUnits, blockPosition: blockOptions[n], units: units})
                }
              }
            }
          }
        }
      }
    }
    return possibleMoves;
  }

  function getUpdatedUnits(units, changedUnit, index) {
    var copyUnits = units.clone();
    copyUnits[index] = changedUnit;
    return copyUnits
  }

  function calculateOponentAvgValue(board, units, oponentUnits) {
    var oponentsValue = 0
    var oponentsCount = 0;

    for (var i = 0; i < oponentUnits; i++) {
      var unit = oponentUnits[i];
      if (unit[0] != -1) {
        oponentsCount += 1;
        oponentsValue += calculateCellValue(board, unit, depthConfig, 0, false, [], units)
      }
    }

    if (oponentsCount) {
      oponentsValue = oponentsValue / oponentsCount;
    }

    return oponentsValue
  }

  function calculateMove(movDir, current) {
    var position = oneMove(movDir[0], current[0], current[1]);
    if (movDir.length > 1) {
      position = oneMove(movDir[1], position[0], position[1])
    }
    return position;
  }

  function oponentInCell(cell, herUnits) {
    //for (var i=0; i<unitsPerPlayer; i++) {
    //    if (herUnits[i][0] == cell[0] && herUnits[i][1] == cell[1]) {
    //        return false;
    //   }
    //    }
    return false;
  }

  function oneMove(movDir, x, y) {
    switch (movDir) {
      case 'N':
        y -= 1;
        break;
      case 'S':
        y += 1;
        break;
      case 'E':
        x += 1;
        break;
      case 'W':
        x -= 1;
        break;
    }
    return [x, y];
  }

  function simulateMove(board, move, position) {

    if (move[0] == 'MOVE&BUILD') {
      var newPosition = calculateMove(move[2], position);
      var blockPosition = calculateMove(move[3], newPosition);
    } else {
      var newPosition = position;
      var oponentPosition = calculateMove(move[2], position);
      blockPosition = calculateMove(move[3], oponentPosition);
    }

    var boardUpdated = addBlockToBoard(board, blockPosition)

    return {newBoard: boardUpdated, newPosition: newPosition, blockPosition: blockPosition}
  }

  function addBlockToBoard(board, blockPosition) {
    var boardCopy = board.slice();
    var value = boardCopy[blockPosition[1]][blockPosition[0]]
    value = parseInt(value) + 1;
    var boardRow = boardCopy[blockPosition[1]];
    boardRow = boardRow.substr(0,blockPosition[0]) + value.toString() + boardRow.substr(blockPosition[0] + 1)
    boardCopy[blockPosition[1]] = boardRow;
    return boardCopy;
  }

  function calculateCellValue(board, cell, depth, stepNum, pushed, memoized,herUnits) {
    if (stepNum == depth) {
      return 0;
    }

    if (oponentInCell(cell, herUnits)) {
      return 0;
    }


    var memoSaved = memoized.find(function(memo) {
      return memo.cell[0] == cell[0] && memo.cell[1] == cell[1];
    });

    if (memoSaved) {
      if (stepNum > memoSaved.step) {
        return 0;
      } else {
        var diff = memoSaved.rawValue * (valuesWeights[stepNum] - valuesWeights[memoSaved.step]);
        memoSaved.step = stepNum;
        return diff
      }
    }

    var cells = getSurroundings(board, cell);
    var cellHeight = calculateHeight(board, cell);
    var cellValue = cellHeight * 2;

    if (cellHeight == 3) {
      cellValue += valuesWeights['reachThree'];
    }

    for (var i=0; i<cells.length; i++) {
      if (Math.abs(cells[i].value - cellHeight) < 2) {
        var pairValue = 0;
        switch (cells[i].value - cellHeight) {
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
      }
    }
    memoized.push({cell: cell, step: stepNum, rawValue: cellValue});

    var surroundingCellsValue = 0;
    for (var i=0; i<cells.length; i++) {
      if (Math.abs(cells[i].value - cellHeight) < 2) {
        surroundingCellsValue += calculateCellValue(board, cells[i].point, depth, stepNum + 1, false, memoized, herUnits)
      }
    }

    if (cellHeight == 3 && pushed) {
      cellValue -= valuesWeights['reachThree'];
    }

    if (pushed) {
      cellValue += 5
    }

    var weightedCellValue = cellValue * valuesWeights[stepNum];
    return weightedCellValue + surroundingCellsValue;
  }

  function calculateHeight(board, position) {
    return parseInt(board[position[1]][position[0]])
  }

  function getSurroundings(board, unit) {
    var cells = [];
    for (var y=-1; y<2; y++) {
      if ((unit[1] + y) >=0 && (unit[1] + y) < board.length) {
        for (var x=-1; x<2; x++) {
          if ((unit[0] + x) >=0 && (unit[0] + x) < board.length) {
            if(!(x===0 && y===0)) {
              var cellValue = board[y+unit[1]][x+unit[0]];
              if (!(cellValue=='.') && !(cellValue==4)) {
                cells.push({point: [unit[0]+ x, unit[1] + y], value: parseInt(cellValue)});
              }
            }
          }
        }
      }
    }

    return cells;
  }

  function printBoard(board) {
    for(var i=0; i<board.length; i++) {
      printErr(board[i])
    }
  }








  return {
    version: _.VERSION,
    getBestAction: getBestAction
  };
});







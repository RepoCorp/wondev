define(["lodash"], function (_) {

  var valuesWeights = {
    reachThree: 20,
    builtFourth: -1,
    up: 1,
    down: 1,
    stay: 1,
    0: 1,
    1: 0.8,
    2: 0.6,
    3: 0.4
  };

  function calculateMove(movDir, current) {
    var position = oneMove(movDir[0], current[0], current[1]);
    if (movDir.length > 1) {
      position = oneMove(movDir[1], position[0], position[1])
    }
    return position;
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
    var newPosition = calculateMove(move[2], position);
    var blockPosition = calculateMove(move[3], newPosition);
    var boardCopy = board.slice();
    var value = boardCopy[blockPosition[1]][blockPosition[0]]
    value = parseInt(value) + 1;
    var boardRow = boardCopy[blockPosition[1]];
    boardRow = boardRow.substr(0,blockPosition[0]) + value.toString() + boardRow.substr(blockPosition[0] + 1)
    boardCopy[blockPosition[1]] = boardRow;

    return {newBoard: boardCopy, newPosition: newPosition, blockPosition: blockPosition}
  }

  function calculateStepGain(board, position, blockPosition) {
    var stepGain = 0;
    if (calculateHeight(board, position) == 3)  {
      stepGain += valuesWeights['reachThree'];
    }
    if (calculateHeight(board, blockPosition) ==4 ) {
      stepGain += valuesWeights['builtFourth'];
    }
    return stepGain;
  }

  function calculateHeight(board, position) {
    return board[position[1]][position[0]]
  }

  function calculateCellValue(board, cell, depth, stepNum, memoized) {
    if (stepNum == depth) {
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
    var cellValue = 0;

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
        surroundingCellsValue += calculateCellValue(board, cells[i].point, depth, stepNum + 1, memoized)
      }
    }

    var weightedCellValue = cellValue * valuesWeights[stepNum];
    return weightedCellValue + surroundingCellsValue;
  }


  function containsPoint(container, point) {
    var isContained = false;
    for(var i=0; i<container.length; i++) {
      var element = container[i];
      if (element[0] == point[0] && element[1] == point[1]) {
        isContained = true;
        break;
      }
    }
    return isContained;
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

  function checkSurroundings(board, unit) {
    var currentHight = board[unit[1]][unit[0]];
    var cells = getSurroundings(board, unit);

    return validCells(cells, currentHight);
  }

  function validCells(cells, unitHight) {
    var validCells = 0;
    for (var i=0; i<cells.length;i++) {
      if (checkValidCell(cells[i], unitHight)) {
        validCells += 1;
      }
    }
    return validCells;
  }

  function checkValidCell(cell, unitHight) {
    if (cell == '.') {
      return false;
    } else if (cell == 4) {
      return false;
    } else {
      return (Math.abs(cell - unitHight) < 2)
    }
  }

  function oneHigherAdjacent(board, point) {
    var heigth = board[point[1]][point[0]]
    var cells = getSurroundings(board, point);
    for (var hi=0; hi<cells.length; hi++) {
      if (cells[hi].value != '.') {
        if (cells[hi].value==(heigth + 1)) {
          return true;
        }
      }
    }
  }
  return {
    version: _.VERSION,
    calculateMove: calculateMove,
    oneMove: oneMove,
    simulateMove: simulateMove,
    calculateStepGain: calculateStepGain,
    calculateHeight: calculateHeight,
    calculateCellValue: calculateCellValue
  };
});


//
// /**
//  * Auto-generated code below aims at helping you parse
//  * the standard input according to the problem statement.
//  **/
//
// var size = parseInt(readline());
// var unitsPerPlayer = parseInt(readline());
//
// // game loop
// while (true) {
//   var board = [];
//   var myUnits = [];
//   var herUnits = [];
//   var actions = [];
//
//   for (var i = 0; i < size; i++) {
//     var row = readline();
//     board.push(row);
//     //printErr(row);
//   }
//   for (var i = 0; i < unitsPerPlayer; i++) {
//     var inputs = readline().split(' ');
//     var unit = [parseInt(inputs[0]), parseInt(inputs[1])]
//     myUnits.push(unit);
//   }
//   for (var i = 0; i < unitsPerPlayer; i++) {
//     var inputs = readline().split(' ');
//     var unit = [parseInt(inputs[0]), parseInt(inputs[1])]
//     herUnits.push(unit);
//   }
//   var legalActions = parseInt(readline());
//   for (var i = 0; i < legalActions; i++) {
//     var action = [];
//     var inputs = readline().split(' ');
//     action.push(inputs[0]);
//     action.push(parseInt(inputs[1]));
//     action.push(inputs[2]);
//     action.push(inputs[3]);
//
//     printErr('action: ' + action);
//
//     var boardCopy = board.slice();
//     var endPosition = calculateMove(action[2], myUnits[0]);
//     var blockPosition = calculateMove(action[3], endPosition);
//     var value = boardCopy[blockPosition[1]][blockPosition[0]]
//     value = parseInt(value) + 1;
//     var boardRow = boardCopy[blockPosition[1]];
//     boardRow = boardRow.substr(0,blockPosition[0]) + value.toString() + boardRow.substr(blockPosition[0] + 1)
//     boardCopy[blockPosition[1]] = boardRow
//
//
//     var valid = checkSurroundings(boardCopy, endPosition)
//     var height = boardCopy[endPosition[1]][endPosition[0]]
//     var blockHeight = boardCopy[blockPosition[1]][blockPosition[0]]
//
//     var moveScore = 0;
//
//     // Montada en tres  8
//     if (height == 3) {
//       moveScore = 8;
//       printErr('montada en 3')
//
//     }
//
//     // Montada en dos con tres adjacente 6
//     if (height == 2) {
//       printErr('montada en 2')
//       if (haveAdjacent(boardCopy, endPosition, 3)) {
//         moveScore = 6;
//         printErr('con tres al lado')
//       } else if(haveAdjacent(boardCopy, endPosition, 2)) {
//         moveScore = 3;
//         printErr('con dos al lado')
//       }
//
//     }
//
//     // En uno con dos adjacente con tres adjacente 4
//     if (height == 1) {
//       printErr('montada en 1')
//
//       var cells = getSurroundings(boardCopy, endPosition)
//       for (var j=0; j<cells.length; j++) {
//         if (cells[j].value == 2) {
//           printErr('con dos al lado')
//           moveScore = 2;
//           if (haveAdjacent(boardCopy, cells[j].point, 3)) {
//             printErr('con tres al lado')
//             moveScore = 4;
//             break;
//           }
//         }
//       }
//     }
//
//     if (height == 0) {
//       printErr('montada en 0')
//       var cells = getSurroundings(boardCopy, endPosition)
//       for (var j=0; j<cells.length; j++) {
//
//         if (cells[j].value == 1) {
//           printErr('con uno al lado')
//
//           var cells2 = getSurroundings(boardCopy, cells[j].point)
//         }
//       }
//
//
//     }
//
//
//     // Montada en dos sin tres adjacente 0
//     // En uno con dos adjacente sin tres adjacente 0
//
//     // Contruir cuatro resta -2
//     if (blockHeight == 4) {
//       moveScore -= 10
//     }
//     // Menos de dos salidas resta -6
//     if (valid < 1) {
//       moveScore -= 6;
//     }
//
//     action.push(moveScore)
//     //printErr(action)
//
//     actions.push(action);
//   }
//
//   // Write an action using print()
//   // To debug: printErr('Debug messages...');
//   actions.sort(compare);
//   var action = actions[0];
//
//   printErr(JSON.stringify(actions));
//   printErr('selected action: ' + action);
//   print(action.slice(0,4).join(' '));
//
// }
//
// function haveAdjacent(board, point, value) {
//   var cells = getSurroundings(board, point);
//   for (var hi=0; hi<cells.length; hi++) {
//     if (cells[hi].value != '.') {
//       if (cells[hi].value==value) {
//         return true;
//       }
//     }
//   }
// }
//
// function compare(a,b) {
//   if (a[4] > b[4])
//     return -1;
//   if (a[4] < b[4])
//     return 1;
//   return 0;
// }
//
// function printBoard(board) {
//   for(var i=0; i<board.length; i++) {
//     printErr(board[i])
//   }
// }
//
// function calculateMove(movDir, current) {
//   var position = oneMove(movDir[0], current[0], current[1]);
//   if (movDir.length > 1) {
//     position = oneMove(movDir[1], position[0], position[1])
//   }
//   return position;
// }
//
// function oneMove(movDir, x, y) {
//   switch (movDir) {
//     case 'N':
//       y -= 1;
//       break;
//     case 'S':
//       y += 1;
//       break;
//     case 'E':
//       x += 1;
//       break;
//     case 'W':
//       x -= 1;
//       break;
//   }
//   return [x, y];
// }
//
// function getSurroundings(board, unit) {
//   var cells = [];
//   for (var y=-1; y<2; y++) {
//     if ((unit[1] + y) >=0 && (unit[1] + y) < board.length) {
//       for (var x=-1; x<2; x++) {
//         if ((unit[0] + x) >=0 && (unit[0] + x) < board.length) {
//           if(!(x===0 && y===0)) {
//             var cellValue = board[y+unit[1]][x+unit[0]];
//             if (cellValue=='.') {
//               cells.push({point: [x+unit[0],y+unit[1]], value: cellValue})
//             } else {
//               cells.push({point: [x+unit[0],y+unit[1]], value: parseInt(cellValue)});
//             }
//           }
//         }
//       }
//     }
//   }
//
//   return cells;
// }
//
// function checkSurroundings(board, unit) {
//   var currentHight = board[unit[1]][unit[0]];
//   var cells = getSurroundings(board, unit);
//
//   return validCells(cells, currentHight);
// }
//
// function validCells(cells, unitHight) {
//   var validCells = 0;
//   for (var i=0; i<cells.length;i++) {
//     if (checkValidCell(cells[i].value, unitHight)) {
//       validCells += 1;
//     }
//   }
//   return validCells;
// }
//
// function checkValidCell(cell, unitHight) {
//   if (cell == '.') {
//     return false;
//   } else if (cell == 4) {
//     return false;
//   } else {
//     return (Math.abs(cell - unitHight) < 2)
//   }
// }
//
//
//
//
//
//

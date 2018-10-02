var ansi = require('ansi')
  , cursor = ansi(process.stdout);
process.stdout.write('\x1Bc');
var keypress = require('keypress');
var direction = 3;
var xWindow = process.stdout.getWindowSize()[0];
var yWindow = process.stdout.getWindowSize()[1];
var points = 0;
var positions = [positionSnake];
var xApple = Math.floor((Math.random() * xWindow) + 1);
var yApple = Math.floor(Math.random() * (yWindow - 2) + 2);
var i;

process.stdin.setRawMode(true);
keypress(process.stdin);

prepareBoard();
cursor.goto(0, 0).write("Points: " + points + "  Speed: " + 350 / (points + 1) + "ms");
cursor.goto(xApple, yApple).bg.red().write(" ");
cursor.reset();
process.stdout.write('\x1B[?25l');


run();

process.stdin.on('keypress', function (ch, key) {
  if (key.name === "q") {
    stopGame();
    process.exit(0);
  }
  switch (key.name) {
    case "up":
      if (direction != 2) {
        direction = 4;
      }

      break;
    case "down":
      if (direction != 4) {
        direction = 2;
      }
      break;
    case "right":
      if (direction != 1) {
        direction = 3;
      }

      break;
    case "left":
      if (direction != 3) {
        direction = 1;
      }

      break;
  }



});


function stopGame() {
  cursor.goto(xWindow / 2, yWindow / 2).red().write("GAME OVER");
  cursor.fg.reset();
  cursor.reset();
  process.stdout.write('\x1B[?25h');
  process.exit(0);
}
function findPosition(position, index) {
  if (index != 0 && (position.x === positions[0].x && position.y === positions[0].y)) {
    return true;
  }
  return false;
}
function prepareBoard() {
  for (var i = 0; i <= xWindow; i++) {
    cursor.goto(i, 0).bg.grey().write(" ");
  }
}
function run() {
  cursor.goto(xApple, yApple).bg.black().write(" ");
  for (i = 0; i < positions.length; i++) {
    cursor.goto(positions[i].x, positions[i].y).bg.black().write(" ");
  }
  switch (direction) {
    case 1:
      for (i = positions.length - 1; i >= 0; i--) {
        if (i === 0) {
          positions[0].x--;
        } else {
          positions[i].x = positions[i - 1].x;
          positions[i].y = positions[i - 1].y;
        }
      }
      break;
    case 2:
      for (i = positions.length - 1; i >= 0; i--) {
        if (i === 0) {
          positions[0].y++;
        } else {
          positions[i].x = positions[i - 1].x;
          positions[i].y = positions[i - 1].y;
        }
      }
      break;
    case 3:
      for (i = positions.length - 1; i >= 0; i--) {

        if (i === 0) {
          positions[0].x++;

        } else {

          positions[i].x = positions[i - 1].x;
          positions[i].y = positions[i - 1].y;
        }
      }

      break;
    case 4:
      for (i = positions.length - 1; i >= 0; i--) {
        if (i === 0) {
          positions[0].y--;
        } else {
          positions[i].x = positions[i - 1].x;
          positions[i].y = positions[i - 1].y;
        }
      }
      break;
  }

  cursor.goto(xApple, yApple).bg.red().write(" ");
  for (i = 0; i < positions.length; i++) {
    cursor.goto(positions[i].x, positions[i].y).bg.green().write(" ");
  }
  cursor.reset();
  if (positions.find(findPosition)) {
    stopGame();
    return;
  }
  if ((positions[0].y > yWindow || positions[0].x > xWindow || positions[0].x < 0 || positions[0].y < 2)) {
    stopGame();
    return;
  }
  if (xApple === positions[0].x && positions[0].y === yApple) {
    switch (direction) {
      case 1:
        positions.push({ x: positions[positions.length - 1].x + 1, y: positions[positions.length - 1].y });
        break;
      case 2:
        positions.push({ x: positions[positions.length - 1].x, y: positions[positions.length - 1].y + 1 });
        break;
      case 3:
        positions.push({ x: positions[positions.length - 1].x - 1, y: positions[positions.length - 1].y });
        break;
      case 4:
        positions.push({ x: positions[positions.length - 1].x, y: positions[positions.length - 1].y - 1 });
        break;
    }
    xApple = Math.floor((Math.random() * xWindow) + 1);
    yApple = Math.floor((Math.random() * yWindow) + 1);

    cursor.goto(xApple, yApple).bg.red().write(" ");
    cursor.fg.reset();
    cursor.reset();
    for (var i = 0; i < positions.length; i++) {
      cursor.goto(positions[i].x, positions[i].y).bg.green().write(" ");
      cursor.reset();
    }
    points++;

    cursor.goto(0, 0).horizontalAbsolute(0).eraseLine();

    prepareBoard();
    cursor.goto(0, 0).write("Points: " + points + "  Speed: " + 350 / (points + 1) + "ms");

    cursor.goto(positions[0].x, positions[0].y);
    cursor.reset();
  }

  setTimeout(run, 350 / (points + 1));
}


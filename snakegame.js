class Snake {
  constructor() {
    this.body = [
      // Snake Body
      { x: 150, y: 150 },
      { x: 140, y: 150 },
      { x: 130, y: 150 },
    ];
    (this.color = "green"), "blue";
    this.direction = "R";
  }
}

class Food {
  constructor() {
    this.score = 100;
    this.color = "red";
    this.setRandomPosition(); // regenerate after eat
  }
  setRandomPoint() {
    return Math.round((Math.random() * (300 - 10) + 10) / 10) * 10;
  }
  setRandomPosition() {
    this.x = this.setRandomPoint();
    this.y = this.setRandomPoint();
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Walls {
  constructor() {
    this.color = "white";
    this.bricks = [
      { x: 200, y: 200 },
      { x: 190, y: 200 },
      { x: 180, y: 200 },
      { x: 170, y: 200 },
      { x: 90, y: 90 },
      { x: 80, y: 90 },
      { x: 70, y: 90 },
      { x: 60, y: 90 },
    ];
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById("SnakeCanvas");
    this.context = this.canvas.getContext("2d");
    this.direct = document.addEventListener("keydown", this.keydown.bind(this));
    this.vel = { x: 10, y: 0 };
    this.score = 0;
    this.hiscore = 0;
    this.level = 0;
    this.gameOver = false;
    this.dx = 10;
    this.dy = 10;
    this.clockSpeedInitial = 500;
    this.clockSpeed = 500;
    this.clockDecrement = 50;
    this.grid = [];
    this.obstacle = new Walls();
    this.food = new Food();
    this.snake = new Snake();
    this.resetGame();
    this.canvas.focus();
  }

  clockClick() {
    console.log("this.clockClick..");
    this.generateMove();
    this.checkGrow();
    this.GameOver();
    // draw
    this.clearCanvas();
    this.drawWalls();
    this.drawSnake();
    this.drawFood();
    this.drawScore();
    this.drawHighScore();
    this.drawLevel();
  }

  initGame() {
    this.initGrid();
    this.drawWalls();
    this.drawSnake();
    this.drawFood();
  }

  initGrid() {
    this.grid = [];
    for (let y = 0; y < this.rows; y++) {
      const row = [];
      for (let x = 0; x < this.columns; x++) {
        row.push(new Cell(x, y));
      }
      this.grid.push(row);
    }
  }

  drawFood() {
    this.context.fillStyle = this.food.color;
    this.context.fillRect(this.food.x, this.food.y, 10, 10);
  }

  drawLevel() {
    document.getElementById("LEVEL").innerHTML = "Level:  " + this.level;
  }

  drawScore() {
    document.getElementById("scoreBox").innerHTML =
      "Current Score:  " + this.score;
  }

  drawHighScore() {
    document.getElementById("HighScore").innerHTML =
      "High Score:  " + this.hiscore;
  }

  drawSnake() {
    this.snake.body.forEach((snakePart) => {
      this.context.fillStyle = this.snake.color;
      this.context.fillRect(snakePart.x, snakePart.y, 10, 10);
      this.context.strokestyle = this.snake.color;
      this.context.strokeRect(snakePart.x, snakePart.y, 10, 10);
    });
  }

  drawWalls() {
    this.obstacle.bricks.forEach((muro) => {
      this.context.fillStyle = this.obstacle.color;
      this.context.fillRect(muro.x, muro.y, 10, 10);
      this.context.strokestyle = this.obstacle.color;
      this.context.strokeRect(muro.x, muro.y, 10, 10);
    });
  }

  // Movment and Direction
  keydown(e) {
    switch (e.keyCode) {
      case 37: {
        if (this.vel.x == 0) this.vel = { x: -10, y: 0 };
        break;
      }
      case 38: {
        if (this.vel.y == 0) this.vel = { x: 0, y: -10 };
        break;
      }
      case 39: {
        if (this.vel.x == 0) this.vel = { x: 10, y: 0 };
        break;
      }
      case 40: {
        if (this.vel.y == 0) this.vel = { x: 0, y: 10 };
        break;
      }
    }
  }

  generateMove() {
    const head = {
      x: this.snake.body[0].x + this.vel.x,
      y: this.snake.body[0].y + this.vel.y,
    };
    if (head.x >= 300) head.x = 0;
    if (head.y >= 300) head.y = 0;
    if (head.x < 0) head.x = 300 - 10;
    if (head.y < 0) head.y = 300 - 10;

    this.snake.body.unshift(head);
    this.snake.body.pop();
  }
  clearCanvas() {
    /// clear-canvas
    this.context.clearRect(0, 0, 300, 300);
  }

  // check-Grow
  checkGrow() {
    const head = this.snake.body[0];
    const tail = this.snake.body[this.snake.body.length - 1];
    if (head.x == this.food.x && head.y == this.food.y) {
      this.snake.body.push({ x: tail.x, y: tail.y });
      this.food.setRandomPosition();

      this.score += 1;

      if (this.score % 3 === 0) {
        this.clockSpeed -= this.clockDecrement;
        clearInterval(this.timer);
        this.timer = setInterval(this.clockClick.bind(this), this.clockSpeed);
        this.level += 1;
      }
      // HIGH SCORE
      if (this.score > this.hiscore) this.hiscore = this.score;
    }
  }

  //  Game-Over check
  GameOver() {
    let head = this.snake.body[0];
    // GAME OVER WALLS
    if (head.x < 0) {
      this.gameOver = true;
      alert("Game Over. Your score was " + this.score);
      this.resetGame();
    } else if (head.x === 0) {
      this.gameOver = true;
      alert("Game Over. Your score was " + this.score);
      this.resetGame();
    } else if (head.y < 0) {
      this.gameOver = true;
      alert("Game Over. Your score was " + this.score);
      this.resetGame();
    } else if (head.y === 0) {
      this.gameOver = true;
      alert("Game Over. Your score was " + this.score);
      this.resetGame(); //
    }
    for (let i = 1; i < this.snake.body.length; i++) {
      let body = this.snake.body[i];
      let head = this.snake.body[0];
      if (body.x === head.x && body.y === head.y) {
        this.gameOver = true;
        alert("Game Over. Your score was " + this.score);
        this.resetGame();
        break;
      }
    }

    for (let i = 0; i < this.obstacle.bricks.length; i++) {
      let wall = this.obstacle.bricks[i];
      let head = this.snake.body[0];
      if (wall.x === head.x && wall.y === head.y) {
        this.gameOver = true;
        alert("Game Over. Your score was " + this.score);
        this.resetGame();
      }
    }
  }

  //  Reset-Game
  resetGame() {
    this.clockSpeed = this.clockSpeedInitial;
    clearInterval(this.timer);
    this.timer = setInterval(this.clockClick.bind(this), this.clockSpeed);
    this.vel = { x: 10, y: 0 };
    this.score = 0;
    this.snake = new Snake();
    this.food = new Food();
    this.initGrid();
    this.drawWalls();
    this.drawSnake();
    this.drawFood();
    this.drawScore();
    this.drawLevel();
  }
}

// START OF THE GAME
let gameState = null;

function startGame() {
  gameState = new Game();
  gameState.initGame();
}

startGame(gameState);

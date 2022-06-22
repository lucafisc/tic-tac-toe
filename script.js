class player {
  constructor(name, marker, score) {
    this.name = name
    this.marker = marker
    this.score = score
  }
  addPoint() {
    this.score++
  }
  get myName() {
    return  this.name
  }
  get myMarker() {
    return this.marker
  }
  get currentScore() {
    return this.score
  }
}

class ai extends player {
  constructor(name, marker, score, level) {
    super(name, marker, score)
    this.level = level
  }
  set newLevel(level) {
    this.level = level
  }

  randomMove() {
    do {
    let i = Math.floor(Math.random() * 9);
    }
    while (gameboard.getBoard()[i] !== "")
    return i;
  }

  bestMove() {

  }

  get Move() {
    if (this.level === 1) {
      return randomMove()
    }
    else if (this.level === 3) {
      return bestMove()
    }
    else {
      let x = Math.floor(Math.random() * 2);
      if (x == 0) {
        return randomMove()
      }
      else {
        return bestMove()
      }
    }
  }
}

const human = new player("human", "x", 0);
const cpu = new ai("cpu", "o", 0, 1);

const modeMenu = (() => {
const _humanMode = document.getElementById("human-mode");
const _cpuMode = document.getElementById("cpu-mode");
const _levels = document.querySelectorAll(".level");
const _levelMenu = document.getElementById("select-level");
const _menu = document.getElementById("menu");
let _mode;
let _level;

_humanMode.addEventListener("click", () => {
  _setMode("human");
  _startGame();
})
_cpuMode.addEventListener("click", () => {
  _setMode("cpu");
  _selectLevel();
})
for (let choice of _levels) {
  choice.addEventListener("click", (e) => {
    cpu.newLevel = e.target.value;
    _startGame();
  })
}

const _setMode = (mode) => {
  _mode = mode;
}

const _selectLevel = () => {
_levelMenu.classList.remove("hidden");
}

const getMode = () => {
  return _mode;
}

const getLevel = () => {
  return _level;
}

const _startGame = () => {
  _menu.classList.add("scale-down-ver-bottom");
  setTimeout(() => {
    _menu.classList.add("hidden");
    gameboard.renderBoard();
  }, "400")
}

  return {
    getMode: getMode,

  }
})();

const gameboard = (() => {
  let _board = ["", "", "", "", "", "", "", "", ""];
  const _cells = document.querySelectorAll(".cell");
  const boardDiv = document.querySelector(".board");

  const renderBoard = () => {
    boardDiv.classList.remove("hidden");
    boardDiv.classList.add("scale-up-ver-top");

  }

  //event listener for cells
  for (let cell of _cells) {
    cell.addEventListener("click", function (e) {
      if (
        this.classList.contains("x") ||
        this.classList.contains("o") ||
        gameControl.isThereWinner()
        // modeMenu.getMode() === "cpu"
      )
        return;
      _render(this, gameControl.whoseTurn().myMarker);
      gameControl.gameRound();
    });
  }

  const _render = (cell, marker) =>{
    cell.classList.add(marker);
    _board[cell.id] = marker;
  }

  const endRound = (winnerArray) =>{
    for (let i = 0; i < _cells.length; i++) {
      _cells[i].classList.add("new-round");
      if (!winnerArray.includes(i)) {
        _cells[i].classList.add("grayed");
      }
    }
    setTimeout(function () {
      for (let i = 0; i < _cells.length; i++) {
        _cells[i].classList.remove("new-round", "grayed", "x", "o");
      }
    }, 3000);

    _board = ["", "", "", "", "", "", "", "", ""];
  }

  const getBoard = () => {
    return _board;
  }

  return {
    getBoard: getBoard,
    endRound: endRound,
    renderBoard: renderBoard,
  };
})();

const gameControl = (() => {
  let _indexes = [];
  let _winnerArray;
  let _currentPlayer = human;
  let _winner = false;
  const _boardContainer = document.querySelector(".board");
  const _playerScore = document.querySelector('[data-index="human"]');
  const _cpuScore = document.querySelector('[data-index="cpu"]');
  const _winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const _switchPlayer = () => {
    _currentPlayer === human
      ? (_currentPlayer = cpu)
      : (_currentPlayer = human);
    _boardContainer.classList.toggle("human");
    _boardContainer.classList.toggle("cpu");
  }

  const _updatePoints = (winner) => {
    winner === human ? human.addPoint() : cpu.addPoint();

    _playerScore.textContent = human.currentScore;
    _cpuScore.textContent = cpu.currentScore;
  }

  const _checkWin = (marker, array, winCondition) => {
    //check index of markers
    _indexes = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i] === marker) {
        _indexes.push(i);
      }
    }
    //check if matches winner array
    for (let i = 0; i < winCondition.length; i++) {
      if (winCondition[i].every((j) => _indexes.includes(j))) {
        _winnerArray = winCondition[i];
        _winner = true;
      }
    }
  }

  const _checkDraw = (array) => {
    return !array.includes("");
  }

  const _gameOver = () => {
    title.animateGameOver();
    gameboard.endRound(_winnerArray);
    _indexes = [];
    _winnerArray = [];
    _winner = false;
  }

  const whoseTurn = () => {
    return _currentPlayer;
  }

  const gameRound = () => {
    _checkWin(whoseTurn().myMarker, gameboard.getBoard(), _winConditions);
    if (isThereWinner()) {
        _updatePoints(_currentPlayer);
      _gameOver();
    } else if (_checkDraw(gameboard.getBoard())) {
        _gameOver();
    } else {
      title.animateTurn(_currentPlayer);
      _switchPlayer();
    }
  }

  const isThereWinner = () => {
    return _winner;
  }

  return {
    gameRound: gameRound,
    whoseTurn: whoseTurn,
    isThereWinner: isThereWinner,
  };
})();

const title = (() => {
  const _titles = document.querySelectorAll(".title");
  let _animationClass;

  const _resetAnimation = (prop) => {
    for (let i = 0; i < _titles.length; i++) {
      _titles[i].classList.remove(prop);
    }
  }

  const animateTurn = (currentPlayer) => {
    _resetAnimation(_animationClass);
    _resetAnimation("title-game-over");
    currentPlayer.myName === "human"
      ? (_animationClass = "title-animate")
      : (_animationClass = "title-reverse");
    for (let i = 0; i < _titles.length; i++) {
      _titles[i].classList.remove(_animationClass);
      _titles[i].offsetWidth;
      _titles[i].classList.add(_animationClass);
    }
  }
  const animateGameOver = () => {
    _resetAnimation(_animationClass);
    for (let i = 0; i < _titles.length; i++) {
      _titles[i].classList.remove("title-game-over");
      _titles[i].offsetWidth;
      _titles[i].classList.add("title-game-over");
      _titles[i].offsetWidth;
    }
  }

  return {
    animateTurn: animateTurn,
    animateGameOver: animateGameOver,
  };
})();

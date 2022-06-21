class player {
  constructor(name, marker, score) {
    this.name = name;
    this.marker = marker;
    this.score = score;
  }
  addPoint() {
    this.score++;
  }
  get myName() {
    return this.name;
  }
  get myMarker() {
    return this.marker;
  }
  get currentScore() {
    return this.score;
  }
}

class ai extends player {
  constructor(name, marker, score, level) {
    super(name, marker, score);
    this.level = level;
  }
  set newLevel(level) {
    this.level = level;
  }

  randomMove() {
    do {
      let i = Math.floor(Math.random() * 9);
    } while (gameboard.getBoard()[i] !== "");
    return i;
  }

  bestMove() {}

  get Move() {
    if (level === 1) {
      return randomMove();
    } else if (level === 3) {
      return bestMove();
    } else {
      let x = Math.floor(Math.random() * 2);
      if (x == 0) {
        return randomMove();
      } else {
        return bestMove();
      }
    }
  }
}

const human = new player("human", "x", 0);
const human2 = new player("human2", "o", 0);
const cpu = new ai("cpu", "o", 0, 1);

const gameboard = (() => {
  const modeHumanBtns = document.querySelectorAll(".mode-human");
  const modeCpuBtns = document.querySelectorAll(".mode-cpu");

  const _changeColor = (color, modeBtns) => {
    return function () {
      for (let btn of modeBtns) {
        btn.style.color = color;
      }
    };
  };

  for (let btn of modeHumanBtns) {
    btn.addEventListener(
      "mouseenter",
      _changeColor("var(--color-1)", modeHumanBtns)
    );
    btn.addEventListener(
      "mouseleave",
      _changeColor("var(--text-color)", modeHumanBtns)
    );
    btn.addEventListener("click", function () {
      gameControl.setMode("2p");
      _prepareBoard();
      ;
    });
  }

  for (let btn of modeCpuBtns) {
    btn.addEventListener(
      "mouseenter",
      _changeColor("var(--color-2)", modeCpuBtns)
    );
    btn.addEventListener(
      "mouseleave",
      _changeColor("var(--text-color)", modeCpuBtns)
    );
    btn.addEventListener("click", function () {
      gameControl.setMode("cpu");
      _chooseLevel();
    });
  }

  const _prepareBoard = () => {
    choice.choiceAnimation("mode-animate");
    title.titleMoveUp();
    const _notCells = document.querySelectorAll(".choose-mode");

    setTimeout(() => {
    for (let i=0; i<_notCells.length; i++) {
      _notCells[i].classList.remove("choose-mode", "mode-human", "mode-cpu", "choose-level", "mode-animate");
      _notCells[i].classList.add("cell");
    }}, 2500); 

    _addEventListenertoCells();

  }



  // const _chooseLevel = () => {
  //   for (let i=0; i<modeHumanBtns.length; i++) {
  //     modeHumanBtns[i].classList.remove("mode-human", "choose-mode");
  //     modeHumanBtns[i].classList.add("choose-level");
  //   }
  //   modeHumanBtns[0].textContent = "easy"
  //   modeHumanBtns[1].textContent = "medium"
  //   modeHumanBtns[2].textContent = "hard"

  
  // }

  let _board = ["", "", "", "", "", "", "", "", ""];

  //event listener for cells
  const _addEventListenertoCells = () => {
    const _cells = document.querySelectorAll(".cell");

    for (let cell of _cells) {
      cell.addEventListener("click", function (e) {
        if (this.classList.contains("x") ||
          this.classList.contains("o") ||
          gameControl.isThereWinner())
          return; // || gameControl.whoseTurn() === cpu
        _render(this, gameControl.whoseTurn().myMarker);
        gameControl.gameRound();
      });
    }
  }

  const _render = (cell, marker) => {
    cell.classList.add(marker);
    _board[cell.id] = marker;
  };

  const endRound = (winnerArray) => {
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
  };

  const getBoard = () => {
    return _board;
  };

  return {
    getBoard: getBoard,
    endRound: endRound,
  };
})();

const gameControl = (() => {
  let _mode;
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

  const setMode = (mode) => {
    let _mode = mode;
  };

  const _switchPlayer = () => {
    _currentPlayer === human
      ? (_currentPlayer = cpu)
      : (_currentPlayer = human);
    _boardContainer.classList.toggle("human");
    _boardContainer.classList.toggle("cpu");
  };

  const _updatePoints = (winner) => {
    winner === human ? human.addPoint() : cpu.addPoint();

    _playerScore.textContent = human.currentScore;
    _cpuScore.textContent = cpu.currentScore;
  };

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
  };

  const _checkDraw = (array) => {
    return !array.includes("");
  };

  const _gameOver = () => {
    title.animateGameOver();
    gameboard.endRound(_winnerArray);
    _indexes = [];
    _winnerArray = [];
    _winner = false;
  };

  const whoseTurn = () => {
    return _currentPlayer;
  };

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
  };

  const isThereWinner = () => {
    return _winner;
  };

  return {
    setMode: setMode,
    gameRound: gameRound,
    whoseTurn: whoseTurn,
    isThereWinner: isThereWinner,
  };
})();

const title = (() => {
  const _titles = document.querySelectorAll(".title");
  const _titlesContainer = document.querySelector(".title-container");
  let _animationClass;

  const _resetAnimation = (prop) => {
    for (let i = 0; i < _titles.length; i++) {
      _titles[i].classList.remove(prop);
    }
  };

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
  };
  const animateGameOver = () => {
    _resetAnimation(_animationClass);
    for (let i = 0; i < _titles.length; i++) {
      _titles[i].classList.remove("title-game-over");
      _titles[i].offsetWidth;
      _titles[i].classList.add("title-game-over");
      _titles[i].offsetWidth;
    }
  };

  const titleMoveUp = () => {
    _titlesContainer.classList.add("title-move-up")
  }

  return {
    animateTurn: animateTurn,
    animateGameOver: animateGameOver,
    titleMoveUp: titleMoveUp
  };
})();

const choice = (() => {
const choice = document.querySelectorAll(".choose-mode")
const choiceAnimation = (_animationClass) => {
  for (let i = 0; i < choice.length; i++) {
    choice[i].classList.remove(_animationClass);
    choice[i].offsetWidth;
    choice[i].classList.add(_animationClass);
  }
}

return {
  choiceAnimation: choiceAnimation,
}

})();



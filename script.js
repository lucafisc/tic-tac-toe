const playerFactory = (name, marker, score) => {
  return { name, marker, score };
};
const human = playerFactory("human", "x", 0);
const cpu = playerFactory("cpu", "o", 0);

const gameboard = (() => {
  let _board = ["", "", "", "", "", "", "", "", ""];
  const _cells = document.querySelectorAll(".cell");

  //event listener for cells
  for (let cell of _cells) {
    cell.addEventListener("click", function (e) {
      if (
        this.classList.contains("x") ||
        this.classList.contains("o") ||
        gameControl.isThereWinner()
      )
        return; // || gameControl.whoseTurn() === cpu
      _render(this, gameControl.whoseTurn().marker);
      gameControl.gameRound();
    });
  }

  function _render(cell, marker) {
    cell.classList.add(marker);
    _board[cell.id] = marker;
  }

  function endRound(winnerArray) {
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

  function getBoard() {
    return _board;
  }

  return {
    getBoard: getBoard,
    endRound: endRound,
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

  function _switchPlayer() {
    _currentPlayer === human
      ? (_currentPlayer = cpu)
      : (_currentPlayer = human);
    _boardContainer.classList.toggle("human");
    _boardContainer.classList.toggle("cpu");
  }

  function _updatePoints(winner) {
    winner === human ? human.score++ : cpu.score++;

    _playerScore.textContent = human.score;
    _cpuScore.textContent = cpu.score;
  }

  function _checkWin(marker, array, winCondition) {
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

  function _checkDraw(array) {
    return !array.includes("");
  }

  function _gameOver() {
    title.animateGameOver();
    gameboard.endRound(_winnerArray);
    _indexes = [];
    _winnerArray = [];
    _winner = false;
  }

  function whoseTurn() {
    return _currentPlayer;
  }

  function gameRound() {
    _checkWin(whoseTurn().marker, gameboard.getBoard(), _winConditions);
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

  function isThereWinner() {
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

  function _resetAnimation(prop) {
    for (let i = 0; i < _titles.length; i++) {
      _titles[i].classList.remove(prop);
    }
  }

  function animateTurn(currentPlayer) {
    _resetAnimation(_animationClass);
    _resetAnimation("title-game-over");
    currentPlayer.name === "human"
      ? (_animationClass = "title-animate")
      : (_animationClass = "title-reverse");
    for (let i = 0; i < _titles.length; i++) {
      _titles[i].classList.remove(_animationClass);
      _titles[i].offsetWidth;
      _titles[i].classList.add(_animationClass);
    }
  }
  function animateGameOver() {
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

const playerFactory = (name, marker, score) => {
  return { name, marker, score };
};

const human = playerFactory("human", "x", 0);
const cpu = playerFactory("cpu", "o", 0);

const gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];
  const _cells = document.querySelectorAll(".cell");

  //event listener for cells
  for (let cell of _cells) {
    cell.addEventListener("click", function (e) {
        console.log(gameControl.isWinner);

      if (this.textContent !== "" || gameControl.isWinner) return; // || gameControl.whoseTurn() === cpu
      _render(this, gameControl.whoseTurn().marker);
      gameControl.gameRound();
    });
  }

  function _render(cell, marker) {
    cell.classList.add("marked");
    cell.textContent = marker;
    board[cell.id] = marker;
  }

  function grayOut(winnerArray) {
    for (let i = 0; i < _cells.length; i++) {
      if (!winnerArray.includes(i)) {
        _cells[i].classList.add("grayed");
      }
    }
  }

  return {
    board: board,
    grayOut: grayOut,
  };
})();

const gameControl = (() => {
  let indexes = [];
  let winnerArray;
  let _currentPlayer = human;
  let isWinner = false;

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
  }

  function _checkWin(marker, array, winCondition) {
    //check index of markers
    indexes = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i] === marker) {
        indexes.push(i);
      }
    }
    //check if matches winner array
    for (let i = 0; i < winCondition.length; i++) {
      if (winCondition[i].every((j) => indexes.includes(j))) {
        isWinner = true;
        winnerArray = winCondition[i];
      }
    }
    return isWinner;
  }

  function _gameOver() {}

  function whoseTurn() {
    return _currentPlayer;
  }

  function gameRound() {
    if (_checkWin(whoseTurn().marker, gameboard.board, _winConditions)) {
      _gameOver();
      title.animateGameOver();
      gameboard.grayOut(winnerArray);
    } else {
      title.animateTurn(_currentPlayer);
      _switchPlayer();
    }
  }
  return {
    gameRound: gameRound,
    whoseTurn: whoseTurn,
    isWinner: isWinner
  };
})();

const title = (() => {
  const _titles = document.querySelectorAll(".title");
  let _animationClass;

  function _resetAnimation() {
    for (let i = 0; i < _titles.length; i++) {
      _titles[i].classList.remove(_animationClass);
    }
  }

  function animateTurn(currentPlayer) {
    _resetAnimation();
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
    _resetAnimation();
    for (let i = 0; i < _titles.length; i++) {
      _titles[i].classList.remove("title-game-over");
      _titles[i].offsetWidth;
      _titles[i].classList.add("title-game-over");
    }
  }

  return {
    animateTurn: animateTurn,
    animateGameOver: animateGameOver,
  };
})();

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

      if (this.classList.contains("x") || this.classList.contains("o") || gameControl.isThereWinner()) return; // || gameControl.whoseTurn() === cpu
      _render(this, gameControl.whoseTurn().marker);
      gameControl.gameRound();
    });
  }

  function _render(cell, marker) {
    cell.classList.add(marker);
    console.log(cell.id);
    console.log(marker);
    board[cell.id] = marker;
    console.log(board);
  }

  function grayOut(winnerArray) {
    for (let i = 0; i < _cells.length; i++) {
        _cells[i].classList.add("new-round");
      if (!winnerArray.includes(i)) {
        _cells[i].classList.add("grayed");
      }
    }
    setTimeout(function(){
        for (let i = 0; i < _cells.length; i++)  {
            _cells[i].classList.remove("new-round");
            _cells[i].classList.remove("grayed");
            _cells[i].classList.remove("x");
            _cells[i].classList.remove("o");
        }
},3000);

board = ["", "", "", "", "", "", "", "", ""];
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
  let _isWinner = false;
  let _boardContainer = document.querySelector(".board");
  let _playerPoints = 0;
  let _cpuPoints = 0;
  let _playerScore = document.querySelector('[data-index="human"]');
  let _cpuScore = document.querySelector('[data-index="cpu"]');


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
    winner === human
      ? _playerPoints++
      : _cpuPoints++;
    
      _playerScore.textContent = _playerPoints;
      _cpuScore.textContent = _cpuPoints;
  }

  function _checkWin(marker, array, winCondition) {
    console.log(array);

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
        _isWinner = true;
        winnerArray = winCondition[i];
      }
    }
  }

  function _gameOver() {
      _isWinner = false;
indexes = [];
winnerArray = [];
gameboard.board = ["", "", "", "", "", "", "", "", ""];

  }

  function whoseTurn() {
    return _currentPlayer;
  }

  function gameRound() {
    _checkWin(whoseTurn().marker, gameboard.board, _winConditions)
    if (_isWinner) {
      title.animateGameOver();
      gameboard.grayOut(winnerArray);
      _updatePoints(_currentPlayer);
      _gameOver();
    } else {
      title.animateTurn(_currentPlayer);
      _switchPlayer();
    }
  }

  function isThereWinner() {
      return _isWinner;
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


const gameboard = (() => {
  let _board = ["", "", "", "", "", "", "", "", ""];
  const _cells = document.querySelectorAll(".cell");

  for (let cell of _cells) {
    cell.addEventListener("click", function (e) {
        if (this.textContent !== "") return;
      _render(this, gameControl.whoseTurn());
      _addToArray(this.id, gameControl.whoseTurn());
      gameControl.gameRound();
    });
  }

  function _myFunction(e) {
      
  }

  function _addToArray(index, currentPlayer) {
    _board[index] = currentPlayer;
    console.log(_board)
  }

  function _render(e, currentPlayer) {
      let cell = e;
    cell.classList.add("marked");
    currentPlayer === "x" ? cell.textContent = "x" : cell.textContent = "o";
  }
})();

const gameControl = (() => {
    let _currentPlayer = "x";
    function _switchPlayer() {
        _currentPlayer === "x" ? _currentPlayer = "o" : _currentPlayer = "x";
    }
    function whoseTurn() {
        return _currentPlayer;
    }
    function gameRound() {
        title.animate(gameControl.whoseTurn());
        _switchPlayer();
    }
    return {
        gameRound: gameRound,
        whoseTurn: whoseTurn
    };

})()

const title = (() => {
  const _titles = document.querySelectorAll(".title");
    let _animationClass;
  function animate(currentPlayer) {
    currentPlayer === "x" ? _animationClass = "title-animate" : _animationClass = "title-reverse";
    for (let i = 0; i < _titles.length; i++) {
      _titles[i].classList.remove(_animationClass);
      _titles[i].offsetWidth;
      _titles[i].classList.add(_animationClass);
    }
  }

  return {
    animate: animate,
  };
})();

const playerFactory = (name, turn) => {};

// const playerFactory = (name) => {
//   const sayHello = () => console.log("hello!");
//   return { name, sayHello };
// };

// const playerOne = personFactory("playerOne");

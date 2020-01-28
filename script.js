"use strict";

const cells = document.querySelectorAll(".cell"),
  modeSelectors = document.querySelectorAll(".mode"),
  play = document.getElementById("play"),
  goHome = document.getElementById("goHome"),
  restart = document.getElementById("restart");

const Gameboard = (() => {
  const _combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let _gameboard = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
  const _render = element => {
    element.textContent = _gameboard[element.getAttribute("data-index")];
  };
  const _checkWinner = arrays => {
    _winningCombination = arrays.find(
      array =>
        _gameboard[array[0]] == _gameboard[array[1]] &&
        _gameboard[array[1]] == _gameboard[array[2]]
    );
    return _winningCombination;
  };
  const _checkTie = () => _gameboard.indexOf(0) == -1;
  let _winningCombination = "";
  const input = function(e) {
    _gameboard[e.target.getAttribute("data-index")] = GameInfo.isPlayerOneTurn
      ? "X"
      : "O";
    e.target.toggleAttribute("marked");
    _render(e.target);
    if (
      _checkWinner(
        _combinations.filter(array =>
          array.includes(parseInt(e.target.getAttribute("data-index")))
        )
      )
    )
      alert("WIN");
    else if (_checkTie()) {
      alert("TIE");
    } else GameInfo.isPlayerOneTurn = !GameInfo.isPlayerOneTurn;
  };
  const reset = () => {
    _gameboard = _gameboard.map(() => 0);
    cells.forEach(cell => {
      cell.textContent = "";
      cell.removeAttribute("marked");
    });
  };
  return { input, reset };
})();

const GameDisplay = (() => {
  let _inGame = false;
  const _home = document.getElementById("home"),
    _game = document.getElementById("game"),
    changeGameStatus = () => {
      _inGame = !_inGame;
      _home.toggleAttribute("active");
      _game.toggleAttribute("active");
    },
    resetGame = 0,
    inGame = () => _inGame;
  return { changeGameStatus, inGame };
})();

const GameInfo = (() => {
  let PlayerOneStarts = true,
    isPlayerOneTurn = true,
    isPvP = true;
  return { PlayerOneStarts, isPlayerOneTurn, isPvP };
})();

cells.forEach(cell =>
  cell.addEventListener("click", e => {
    if (!e.target.hasAttribute("marked")) {
      Gameboard.input(e);
    }
  })
);

modeSelectors.forEach(mode =>
  mode.addEventListener("click", e => {
    if (!e.target.hasAttribute("selected")) {
      modeSelectors[0].toggleAttribute("selected");
      modeSelectors[1].toggleAttribute("selected");
      GameInfo.isPvp = !GameInfo.isPvP;
    }
  })
);

play.addEventListener("click", () => GameDisplay.changeGameStatus());
goHome.addEventListener("click", () => {
  GameDisplay.changeGameStatus();
});

restart.addEventListener("click", () => {
  Gameboard.reset();
  GameInfo.isPlayerOneTurn = GameInfo.PlayerOneStarts;
});

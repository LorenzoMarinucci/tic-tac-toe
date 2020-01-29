"use strict";

const cells = document.querySelectorAll(".cell"),
  container = document.getElementById("container"),
  CONTAINER_WIDTH = container.offsetWidth,
  modeSelectors = document.querySelectorAll(".mode"),
  play = document.getElementById("play"),
  goHome = document.getElementById("goHome"),
  restart = document.getElementById("restart"),
  pvpForm = document.getElementById("pvp"),
  player1Name = document.getElementById("player1Name"),
  player2Name = document.getElementById("player2Name"),
  player1Div = document.getElementById("player1Score"),
  player2Div = document.getElementById("player2Score"),
  tiesDiv = document.getElementById("ties");

let player1 = null,
  player2 = null;

const Prototype = () => {
  const addPoint = () => null;
};

const Player = input => {
  const name = input;
  let score = 0;
  return { name, score };
};

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
      reset();
      tiesDiv.childNodes[2].textContent =
        1 + parseInt(tiesDiv.childNodes[2].textContent);
      GameInfo.PlayerOneStarts = !GameInfo.PlayerOneStarts;
      GameInfo.isPlayerOneTurn = GameInfo.PlayerOneStarts;
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
  const _home = document.getElementById("home"),
    _game = document.getElementById("game"),
    changeGameStatus = () => {
      _home.toggleAttribute("active");
      _game.toggleAttribute("active");
    },
    adjustWidth = sum => {
      console.log(sum);
      container.style.width = (sum > 410 ? sum + 60 : CONTAINER_WIDTH) + "px";
    };
  return { changeGameStatus, adjustWidth };
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
      pvpForm.toggleAttribute("active");
    }
  })
);

play.addEventListener("click", () => {
  player1 = player1Name.value ? Player(player1Name.value) : Player("Player 1");
  player1Div.childNodes[0].textContent = player1.name;
  player1Div.childNodes[2].textContent = player1.score;
  player1Name.value = null;
  if (GameInfo.isPvP)
    player2 = player2Name.value
      ? Player(player2Name.value)
      : Player("Player 2");
  else player2 = Player("AI");
  player2Div.childNodes[0].textContent = player2.name;
  player2Div.childNodes[2].textContent = player2.score;
  player2Name.value = null;
  tiesDiv.childNodes[2].textContent = 0;
  GameDisplay.changeGameStatus();
  GameDisplay.adjustWidth(
    player1Div.offsetWidth + player2Div.offsetWidth + tiesDiv.offsetWidth + 40
  );
  GameInfo.PlayerOneStarts = true;
  GameInfo.isPlayerOneTurn = true;
});

goHome.addEventListener("click", () => {
  GameDisplay.changeGameStatus();
  container.style.width = CONTAINER_WIDTH + "px";
  Gameboard.reset();
});

restart.addEventListener("click", () => {
  Gameboard.reset();
  GameInfo.isPlayerOneTurn = GameInfo.PlayerOneStarts;
});

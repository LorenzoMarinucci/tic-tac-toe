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
  tiesDiv = document.getElementById("ties"),
  message = document.getElementById("message"),
  scores = document.getElementById("scores"),
  difficulty = document.getElementById("difficulty"),
  difficultyButtons = document.querySelectorAll("#difficulty button");

let player1 = null,
  player2 = null;

const Player = input => {
  const name = input;
  let score = 0;
  return { name, score };
};

const Gameboard = (() => {
  const _easyMode = () => {
    let possibleMoves = Array.from(cells).filter(
        cell => !cell.hasAttribute("marked")
      ),
      move = Math.floor(Math.random() * possibleMoves.length);
    possibleMoves[move].textContent = "O";
    possibleMoves[move].toggleAttribute("marked");
    return parseInt(possibleMoves[move].getAttribute("data-index"));
  };
  const _combinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ],
    changeCurrentMode = () => {
      _currentMode = GameInfo.easy ? _easyMode : _impossibleMode;
    };
  let _gameboard = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0),
    _currentMode = _easyMode;
  const _render = element => {
    element.textContent = _gameboard[element.getAttribute("data-index")];
  };
  const _checkWinner = arrays => {
    return arrays.find(
      array =>
        _gameboard[array[0]] == _gameboard[array[1]] &&
        _gameboard[array[1]] == _gameboard[array[2]]
    );
  };
  const _checkTie = () => _gameboard.indexOf(0) == -1;
  const input = function(e) {
    _gameboard[e.target.getAttribute("data-index")] = GameInfo.isPlayerOneTurn
      ? "X"
      : "O";
    e.target.toggleAttribute("marked");
    _render(e.target);
    _processTurn(parseInt(e.target.getAttribute("data-index")));
  };
  const _processTurn = index => {
    let winningCombination = _checkWinner(
      _combinations.filter(array => array.includes(index))
    );
    if (winningCombination) {
      Array.from(cells)
        .filter(cell => !cell.hasAttribute("marked"))
        .forEach(cell => cell.toggleAttribute("marked"));
      if (GameInfo.isPlayerOneTurn) {
        player1Div.childNodes[2].textContent = ++player1.score;
        message.textContent = `${player1.name} `;
      } else {
        player2Div.childNodes[2].textContent = ++player2.score;
        message.textContent = `${player2.name} `;
      }
      message.textContent += "wins!";
      GameInfo.PlayerOneStarts = !GameInfo.PlayerOneStarts;
      GameInfo.isPlayerOneTurn = GameInfo.PlayerOneStarts;
      GameDisplay.toggleMessage();
      GameDisplay.toggleCells(winningCombination);
      setTimeout(() => {
        reset();
        GameDisplay.toggleMessage();
        GameDisplay.toggleCells(winningCombination);
        if (!GameInfo.isPvP && !GameInfo.isPlayerOneTurn) _AImove();
      }, 2000);
    } else if (_checkTie()) {
      GameInfo.PlayerOneStarts = !GameInfo.PlayerOneStarts;
      GameInfo.isPlayerOneTurn = GameInfo.PlayerOneStarts;
      message.textContent = "It's a tie!";
      GameDisplay.toggleMessage();
      setTimeout(() => {
        reset();
        GameDisplay.toggleMessage();
        if (!GameInfo.isPvP && !GameInfo.isPlayerOneTurn) _AImove();
      }, 1500);
      tiesDiv.childNodes[2].textContent =
        1 + parseInt(tiesDiv.childNodes[2].textContent);
    } else {
      GameInfo.isPlayerOneTurn = !GameInfo.isPlayerOneTurn;
      if (!GameInfo.isPvP && !GameInfo.isPlayerOneTurn) _AImove();
    }
  };
  const reset = () => {
    _gameboard = _gameboard.map(() => 0);
    cells.forEach(cell => {
      cell.textContent = "";
      cell.removeAttribute("marked");
    });
  };
  const _AImove = () => {
    setTimeout(() => {
      let markedCell = _currentMode();
      _gameboard[markedCell] = "O";
      _processTurn(markedCell);
    }, 500);
  };
  return { input, reset, changeCurrentMode };
})();

const GameDisplay = (() => {
  const _home = document.getElementById("home"),
    _game = document.getElementById("game"),
    changeGameStatus = () => {
      _home.toggleAttribute("active");
      _game.toggleAttribute("active");
    },
    adjustWidth = sum =>
      (container.style.width = (sum > 410 ? sum + 60 : CONTAINER_WIDTH) + "px"),
    toggleCells = winningCombination =>
      winningCombination.forEach(index =>
        cells[index].toggleAttribute("winner")
      ),
    toggleMessage = () => {
      scores.toggleAttribute("hidden");
      message.toggleAttribute("hidden");
    };
  return { changeGameStatus, adjustWidth, toggleMessage, toggleCells };
})();

const GameInfo = (() => {
  let PlayerOneStarts = true,
    isPlayerOneTurn = true,
    isPvP = false,
    easy = true;
  return { PlayerOneStarts, isPlayerOneTurn, isPvP, easy };
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
      modeSelectors.forEach(mode => mode.toggleAttribute("selected"));
      GameInfo.isPvP = !GameInfo.isPvP;
      difficulty.toggleAttribute("active");
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

difficultyButtons.forEach(button =>
  button.addEventListener("click", e => {
    if (!e.target.hasAttribute("selected")) {
      difficultyButtons.forEach(button => button.toggleAttribute("selected"));
      GameInfo.easy = !GameInfo.easy;
      Gameboard.changeCurrentMode();
    }
  })
);

const cells = document.querySelectorAll(".cell");

const Gameboard = (() => {
  let _gameboard = [];
  let _playerOne = true;
  const _render = element => {
    element.textContent = _gameboard[element.getAttribute("data-index")];
  };
  const input = function(e) {
    _gameboard[e.target.getAttribute("data-index")] = _playerOne ? "X" : "O";
    e.target.toggleAttribute("marked");
    _render(e.target);
    _playerOne = !_playerOne;
  };
  return { input };
})();

cells.forEach(cell =>
  cell.addEventListener("click", e => {
    if (!e.target.hasAttribute("marked")) Gameboard.input(e);
  })
);

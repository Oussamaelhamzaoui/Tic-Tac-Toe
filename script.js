const ticTacToeGame = new TicTacToeGame();
ticTacToeGame.start();

function TicTacToeGame() {
  const board = new Board();
  const humanPlayer = new HumanPlayer(board);
  const computerPlayer = new ComputerPlayer(board);
  let turn = 0;

  this.start = function() {
  /*when the game starts we want to make sure that we are watching all of
  these differente positions for changes because when a change happens
  it gonna trigger when it's next person turn to do that we gonna use mutation observer
   to observe whether things are changed and in the Dom so to do that
   we start with a config first so what are we listening for changing 
   when there is a change the childlist will convert to false and does not trigger mutation back*/
    const config = { childList: true };
    const observer = new MutationObserver(() => takeTurn());
    /* first :we set board to OUR DOM postions
     Second:we want to observe this element (el) on our config*/
    board.positions.forEach((el) => observer.observe(el, config));
    takeTurn();
  }

  function takeTurn() {
    if (board.checkForWinner()) {
      return;
    }

    if (turn % 2 === 0) {
      humanPlayer.takeTurn();
    } else {
      computerPlayer.takeTurn();
    }

    turn++;
  };
}

function Board() {
  this.positions = Array.from(document.querySelectorAll('.col'));

  this.checkForWinner = function() {
    let winner = false;

    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6],
        [0,3,6],
        [1,4,7],
        [2,5,8]
    ];
  /*extract position*/
    const positions = this.positions;
  /*what we do here is cycling through the winning combinations and 
  we are getting the inner text of the position so we're checking 
  what is the inner text of that so we want to do that for all the
  three positions in each one in combination*/
    winningCombinations.forEach((winningCombo) => {
      const pos0InnerText = positions[winningCombo[0]].innerText;
      const pos1InnerText = positions[winningCombo[1]].innerText;
      const pos2InnerText = positions[winningCombo[2]].innerText;
  /*the winning combo is if the position isn't empty and these two are
  equal it's a winning combination  */
      const isWinningCombo = pos0InnerText !== '' &&
        pos0InnerText === pos1InnerText && pos1InnerText === pos2InnerText;
      if (isWinningCombo) {
          winner = true;
          winningCombo.forEach((index) => {
            positions[index].className += ' winner';
          })
      }
    });

    return winner;
  }
}

function ComputerPlayer(board) {
  this.takeTurn = function() {
/*the filter option is to check if their innerTEXT is empty so just*/
    let availablePositions = board.positions.filter((p) => p.innerText === '');
    const move = Math.floor(Math.random() * (availablePositions.length - 0));
    availablePositions[move].innerText = 'O';
  }
}

function HumanPlayer(board) {
  this.takeTurn = function() {
    board.positions.forEach(el =>
      el.addEventListener('click', handleTurnTaken));
  }

  function handleTurnTaken(event) {
    event.target.innerText = 'X';
    board.positions
/*when our turn is taken we want to remove this event listener 
to not keep clicking when it's not our turn   */
      .forEach(el => el.removeEventListener('click', handleTurnTaken));
  }
}

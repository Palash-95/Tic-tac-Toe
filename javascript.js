/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable padded-blocks */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable indent */
const gameModeDiv = document.getElementById('game-mode');
const playerVsPlayer = document.getElementById('vsPlayer');
const playerVsComputer = document.getElementById('vsComputer');
const mainGameDisplay = document.getElementById('main-game-display');
const form = document.querySelector('form');

playerVsPlayer.addEventListener('click', () => {
    gameModeDiv.style.display = 'none';
    form.style.display = 'flex';
});



 const players = [
    {
        mark: 'X'
    },
    {
        mark: 'O'
    }
];
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const playerOne = document.getElementById('player1');
    const playerTwo = document.getElementById('player2');
    players[0].name = playerOne.value ? playerOne.value : playerOne.placeholder;
    players[1].name = playerTwo.value ? playerTwo.value : playerTwo.placeholder;
    form.style.display = 'none';
    mainGameDisplay.style.display = 'block';
    
});

const board = (() => {
    const Board = [];

    for (let i = 0; i < 9; i++) {
        Board.push(cell());
    }

    const getBoard = () => Board;

    const dropMark = (index, player) => {
        Board[index].addMark(player);
    };

    return {
        getBoard,
        dropMark,
    };
})();

function cell() {
    let value = '';

    const addMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addMark,
        getValue,
    };
    }

function gameController() {
    
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (index) => {
        if (board.getBoard()[index].getValue()) return;

        board.dropMark(index, getActivePlayer().mark);

        const winnerDiv = document.querySelector('.winner-board');
        const playButton = document.createElement('button');
        playButton.textContent = 'Play again!';
        playButton.addEventListener('click', () => {
            for (let i = 0; i < 9; i++) {
                board.dropMark(i, '');
            }
            winnerDiv.style.display = 'none';
            screenController.updateScreen();
        });
        
        // eslint-disable-next-line consistent-return
        const checkForWinner = (() => {
            const winningCombinations = [[0, 1, 2],
                                         [3, 4, 5],
                                         [6, 7, 8],
                                         [0, 3, 6],
                                         [1, 4, 7],
                                         [2, 5, 8],
                                         [0, 4, 8],
                                         [2, 4, 6]];
            // eslint-disable-next-line no-restricted-syntax
            for (const combination of winningCombinations) {
                const [a, b, c] = combination;

                let A = board.getBoard()[a].getValue();
                let B = board.getBoard()[b].getValue();
                let C = board.getBoard()[c].getValue();

                if (A === B && B === C && A) { 
                    winnerDiv.textContent = `${getActivePlayer().name} Wins`;
                    winnerDiv.style.display = 'flex'; 
                    winnerDiv.appendChild(playButton);

                    return true;
                }
            }
        })();

        if (checkForWinner) return;

        const checkForDraw = (() => {
            // eslint-disable-next-line no-restricted-syntax
            for (let i of board.getBoard()) {
                if (!i.getValue()) return;
            }
            winnerDiv.textContent = 'Its a Draw!!!';
            winnerDiv.style.display = 'flex'; 
            winnerDiv.appendChild(playButton);
            // eslint-disable-next-line consistent-return
            return true;
        })();

        if (checkForDraw) return;

        switchPlayerTurn();
    };

    return {
        getActivePlayer,
        playRound,
        getBoard: board.getBoard
    };
}

const screenController = (() => {
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const Board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn`;

        // eslint-disable-next-line no-shadow
        Board.forEach((cell, index) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');
            cellButton.dataset.index = index;
            cellButton.textContent = `${cell.getValue()}`;
            boardDiv.appendChild(cellButton);
        });
    };

    function clickHandlerBoard(e) {
        const selectedCell = e.target.dataset.index;

        if (!selectedCell) return;

        game.playRound(selectedCell);

        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();

    return {
        updateScreen
    };
})();


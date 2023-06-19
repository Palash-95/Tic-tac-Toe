/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable indent */
function gameBoard() {
    const board = [];

    for (let i = 0; i < 9; i++) {
        board.push(cell());
    }

    const getBoard = () => board;

    const dropMark = (index, player) => {
        board[index].addMark(player);
    };

    return {
        getBoard,
        dropMark,
    };
}

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

function gameController(
    playerOne = 'Player One',
    playerTwo = 'Player Two'
) {
    const board = gameBoard();

    const players = [
        {
            name: playerOne,
            mark: 'X'
        },
        {
            name: playerTwo,
            mark: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (index) => {
        board.dropMark(index, getActivePlayer().mark);

        //here goes the winning logic

        switchPlayerTurn();
    };

    return {
        getActivePlayer,
        playRound,
        getBoard: board.getBoard
    };
}

function screenController() {
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn`;

        // eslint-disable-next-line no-shadow
        board.forEach((cell, index) => {
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
}

screenController();

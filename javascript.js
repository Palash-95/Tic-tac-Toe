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
};

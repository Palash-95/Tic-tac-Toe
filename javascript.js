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

/* eslint-disable no-unreachable-loop */
/* eslint-disable no-else-return */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-restricted-syntax */
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
let gameMode;

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
let screenController1;

playerVsComputer.addEventListener('click', () => {
    players[0].name = 'You';
    players[1].name = 'Computer';
    gameModeDiv.style.display = 'none';
    mainGameDisplay.style.display = 'block';
    screenController1 = screenController();
    gameMode = 'player vs computer';
});
 
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const playerOne = document.getElementById('player1');
    const playerTwo = document.getElementById('player2');
    players[0].name = playerOne.value ? playerOne.value : playerOne.placeholder;
    players[1].name = playerTwo.value ? playerTwo.value : playerTwo.placeholder;
    form.style.display = 'none';
    mainGameDisplay.style.display = 'block';
    screenController1 = screenController();
    gameMode = 'player vs player';
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
        if (board.getBoard()[index].getValue()) return 'already marked';

        board.dropMark(index, getActivePlayer().mark);

        const winnerDiv = document.querySelector('.winner-board');
        const playButton = document.createElement('button');
        playButton.textContent = 'Play again!';
        playButton.addEventListener('click', () => {
            for (let i = 0; i < 9; i++) {
                board.dropMark(i, '');
            }
            winnerDiv.style.display = 'none';
            screenController1.updateScreen();
            if (activePlayer.name === 'Computer') {
                screenController1.playComputerTurn();
                screenController1.updateScreen();
            }
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

                const A = board.getBoard()[a].getValue();
                const B = board.getBoard()[b].getValue();
                const C = board.getBoard()[c].getValue();

                if (A === B && B === C && A) { 
                    // eslint-disable-next-line no-nested-ternary
                    winnerDiv.textContent = (gameMode === 'player vs player')
                    ? `${getActivePlayer().name} Wins`
                    : (getActivePlayer().name === 'Computer') 
                        ? 'You Lost' : 'You Won';
                    winnerDiv.style.display = 'flex'; 
                    winnerDiv.appendChild(playButton);

                    return true;
                }
            }
        })();

        if (checkForWinner) return 'game over';

        const checkForDraw = (() => {
            // eslint-disable-next-line no-restricted-syntax, prefer-const
            for (let i of board.getBoard()) {
                if (!i.getValue()) return;
            }
            winnerDiv.textContent = 'Its a Draw!!!';
            winnerDiv.style.display = 'flex'; 
            winnerDiv.appendChild(playButton);
            // eslint-disable-next-line consistent-return
            return true;
        })();

        if (checkForDraw) return 'game over';

        switchPlayerTurn();
    };

    return {
        getActivePlayer,
        playRound,
        getBoard: board.getBoard
    };
}

const screenController = () => {
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const Board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = (gameMode === 'player vs computer' && activePlayer.name !== 'Computer')
        ? 'Your turn' : `${activePlayer.name}'s turn`;

        // eslint-disable-next-line no-shadow
        Board.forEach((cell, index) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');
            cellButton.dataset.index = index;
            cellButton.textContent = `${cell.getValue()}`;
            boardDiv.appendChild(cellButton);
        });
    };

    function getAIMove() {
        const Board = game.getBoard().map((cell) => cell.getValue());
	    function evaluate(board) {
 	    	const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], 
 	    	[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
 
	    	for (const combination of winningCombinations) {
                const pattern = combination.map((i) => board[i]);
	    		if (pattern.every(cell => cell === 'O')) return 1;

	    		else if (pattern.every(cell => cell === 'X')) return -1;
	    	}
	    	if (board.every(cell => cell !== '')) return 0;
        
	    	return null;
        
	    }

	    function minimax(board, depth, isMaximizer) {
	    	const score = evaluate(board);
	    	if (score !== null) return score;

	    	if (isMaximizer) {
	    		let bestScore = -Infinity;
	    		for (let i = 0; i < 9; i++) {
	    			if (board[i] === '') {
	    				board[i] = 'O';
	    				const currentScore = minimax(board, depth + 1, false);
	    				board[i] = '';
	    				bestScore = Math.max(bestScore, currentScore);
				    }
			    }
			    return bestScore;
		    } else {
                 let bestScore = Infinity;
                 for (let i = 0; i < 9; i++) {
				    if (board[i] === '') {
				    	board[i] = 'X';
				    	const currentScore = minimax(board, depth + 1, true);
				    	board[i] = '';
				    	bestScore = Math.min(bestScore, currentScore);
				    }
			     }
			return bestScore;
	         }
        }

        let bestScore = -Infinity;
        let bestMOve;

        for (let i = 0; i < 9; i++) {
            if (Board[i] === '') {
                Board[i] = 'O';
                const currentScore = minimax(Board, 0, false);
                Board[i] = '';
                if (bestScore < currentScore) {
                    bestScore = currentScore;
                    bestMOve = i;
                }
            }
        }
        return bestMOve;
    }

    function playComputerTurn() {
        if (false) {
            const buttonList = document.querySelectorAll('.cell');
            const filteredButtonList = Array.from(buttonList).filter((button) => button.textContent === '');
            const randomIndex = Math.floor(Math.random() * filteredButtonList.length);
            const targetButtonIndex = filteredButtonList[randomIndex].dataset.index;
            game.playRound(targetButtonIndex);
        }
        else {
            const index = getAIMove();
            game.playRound(index);
        }
    }

    function clickHandlerBoard(e) {
        const selectedCell = e.target.dataset.index;

        if (!selectedCell) return;

        const playerTurn = game.playRound(selectedCell);
        if (playerTurn === 'already marked') return;
        updateScreen();

        if (playerTurn === 'game over') return;
        if (gameMode === 'player vs player') return;
        
        playComputerTurn();
        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();

    return {
        updateScreen,
        playComputerTurn
    };
};
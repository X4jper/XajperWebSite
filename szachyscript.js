document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('chess-board');
    const pieces = {
        pawn: '♙', rook: '♖', knight: '♘', bishop: '♗', queen: '♕', king: '♔',
    };
    const boardState = [];
    let currentTurn = 'white';

    function createBoard() {
        for (let row = 0; row < 8; row++) {
            boardState[row] = [];
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square', (row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;

                boardState[row][col] = null;
                board.appendChild(square);
            }
        }
        setupPieces();
    }

    function setupPieces() {
        const setup = [
            ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
            Array(8).fill('pawn'),
            null, null, null, null,
            Array(8).fill('pawn'),
            ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
        ];

        for (let row = 0; row < 8; row++) {
            if (setup[row]) {
                for (let col = 0; col < 8; col++) {
                    if (setup[row][col]) {
                        const piece = document.createElement('span');
                        piece.textContent = row < 2 ? pieces[setup[row][col]] : pieces[setup[row][col]].toLowerCase();
                        piece.classList.add('piece', row < 2 ? 'black' : 'white');
                        piece.dataset.type = setup[row][col];
                        piece.dataset.color = row < 2 ? 'black' : 'white';
                        boardState[row][col] = piece;

                        const square = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                        square.appendChild(piece);
                    }
                }
            }
        }
    }

    function isValidMove(piece, fromRow, fromCol, toRow, toCol) {

        const type = piece.dataset.type;
        const color = piece.dataset.color;
        const deltaRow = toRow - fromRow;
        const deltaCol = toCol - fromCol;

        if (color !== currentTurn) return false;
        switch (type) {
            case 'pawn':
                if (color === 'white') {
                    return deltaRow === -1 && deltaCol === 0 && !boardState[toRow][toCol];
                } else {
                    return deltaRow === 1 && deltaCol === 0 && !boardState[toRow][toCol];
                }
            case 'rook':
                return deltaRow === 0 || deltaCol === 0;
            case 'bishop':
                return Math.abs(deltaRow) === Math.abs(deltaCol);
            case 'queen':
                return deltaRow === 0 || deltaCol === 0 || Math.abs(deltaRow) === Math.abs(deltaCol);
            case 'king':
                return Math.abs(deltaRow) <= 1 && Math.abs(deltaCol) <= 1;
            case 'knight':
                return (Math.abs(deltaRow) === 2 && Math.abs(deltaCol) === 1) ||
                       (Math.abs(deltaRow) === 1 && Math.abs(deltaCol) === 2);
        }

        return false;
    }

    function handlePieceClick(event) {
        const piece = event.target;
        const fromRow = parseInt(piece.parentElement.dataset.row);
        const fromCol = parseInt(piece.parentElement.dataset.col);

        document.querySelectorAll('.square').forEach(square => {
            square.addEventListener('click', (e) => {
                const toRow = parseInt(e.target.dataset.row);
                const toCol = parseInt(e.target.dataset.col);

                if (isValidMove(piece, fromRow, fromCol, toRow, toCol)) {
                    movePiece(piece, fromRow, fromCol, toRow, toCol);
                }
            }, { once: true });
        });
    }

    function movePiece(piece, fromRow, fromCol, toRow, toCol) {
        boardState[fromRow][fromCol] = null;
        boardState[toRow][toCol] = piece;
        const destinationSquare = document.querySelector(`[data-row='${toRow}'][data-col='${toCol}']`);
        destinationSquare.appendChild(piece);
        currentTurn = currentTurn === 'white' ? 'black' : 'white';
    }

    function initializeGame() {
        createBoard();
        document.querySelectorAll('.piece').forEach(piece => {
            piece.addEventListener('click', handlePieceClick);
        });
    }

    initializeGame();
});

function blokujMysz(event) {
    if (event.button === 2 || event.which === 3) {
        event.preventDefault();
    }
  }
  
  function blokujKlawisze(event) {
    if (event.key === 'F12') {
        event.preventDefault();
    }
  
    if (event.ctrlKey && event.key === 'u') {
        event.preventDefault();
    }
  }
  
  document.addEventListener('mousedown', blokujMysz);
  
  document.addEventListener('keydown', blokujKlawisze);
  
  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });

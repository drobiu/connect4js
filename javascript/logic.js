var size = 7;

function generateBoard() {
    var result = [];
    for (let i = 0; i < size; i++) {
        result.push([]);
    }
    return result;
}

function checkBoard(board) {
    //checking for horizontal matches
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - 3; j++) {
            if (board[i][j] == board[i][j + 1] && board[i][j + 2] == board[i][j + 3] && board[i][j] == board[i][j + 2] && board[i][j + 3] != undefined) return board[i][j];
        }
    }

    //checking for vertical matches
    for (let i = 0; i < size - 3; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] == board[i + 1][j] && board[i + 2][j] == board[i + 3][j] && board[i][j] == board[i + 3][j] && board[i + 3][j] != undefined) return board[i][j];
        }
    }

    //checking for diagonal matches (\)
    for (let i = 0; i < size - 3; i++) {
        for (let j = 0; j < size - 3; j++) {
            if (board[i][j] == board[i + 1][j + 1] && board[i + 2][j + 2] == board[i + 3][j + 3] && board[i][j] == board[i + 3][j + 3] && board[i][j] != undefined) return board[i][j];
        }
    }

    //checking for diagonal matches (/)
    for (let i = 0; i < size - 3; i++) {
        for (let j = 3; j < size; j++) {
            if (board[i][j] == board[i + 1][j - 1] && board[i + 2][j - 2] == board[i + 3][j - 3] && board[i][j] == board[i + 3][j - 3] && board[i][j] != undefined) return board[i][j];
        }
    }
    return false;
}

function checkFull(board) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - 1; j++) {
            if (board[i][j] == undefined) return false;
        }
    }
    return true;
}

var logic = {};
logic.generateBoard = generateBoard;
logic.checkBoard = checkBoard;
logic.checkFull = checkFull;

module.exports = logic;
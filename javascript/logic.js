var size = 7;

var board = function () {
    var result = [];
    for (let i = 0; i < size; i++) {
        result.push([]);
    }
    return result;
}();

// board = [
//     ['r'],
//     ['y', 'r'],
//     ['y', 'y', 'r'],
//     ['r', 'y', 'r', 'r'],
//     [],
//     [],
//     []
// ];

checkBoard = function (board) {
    //checking for horizontal matches
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - 3; j++) {
            if (board[i][j] == board[i][j+1] && board[i][j+2] == board[i][j+3] && board[i][j] == board[i][j+2] && board[i][j+3] != undefined) return true;
        }
    }

    //checking for vertical matches
    for (let i = 0; i < size - 3; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] == board[i+1][j] && board[i+2][j] == board[i+3][j] && board[i][j] == board[i+3][j]) return true;
        }
    }

    //checking for diagonal matches (\)
    for (let i = 0; i < size - 3; i++) {
        for (let j = 0; j < size - 3; j++) {
            if (board[i][j] == board[i+1][j+1] && board[i+2][j+2] == board[i+3][j+3] && board[i][j] == board[i+3][j+3]) return true;
        }
    }

    //checking for diagonal matches (/)
    for (let i = 0; i < size - 3; i++) {
        for (let j = 3; j < size; j++) {
            if (board[i][j] == board[i+1][j-1] && board[i+2][j-2] == board[i+3][j-3] && board[i][j] == board[i+3][j-3]) return true;
        }
    }
    return false;
}

console.log(checkBoard(board));
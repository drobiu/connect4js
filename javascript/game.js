/* every game has two players, identified by their WebSocket */
var game = function (gameID, board) {
    this.playerA = null;
    this.playerB = null;
    this.currentPlayer = null;
    this.id = gameID;
    this.board = board;
    this.nPlayers = 0;
};

game.prototype.addPlayer = function (p) {
    if (this.nPlayers > 1) {
        return new Error(
            "Trying to join third player"
        );
    }

    if (this.nPlayers == 0) {
        this.playerA = p;
        this.nPlayers++;
        return "A";
    } else {
        this.playerB = p;
        this.nPlayers++;
        return "B";
    }
}

game.prototype.hasTwoConnectedPlayers = function () {
    return this.nPlayers == 2;
};

module.exports = game;
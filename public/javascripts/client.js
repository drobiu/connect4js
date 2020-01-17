var user = 'y';
if (Math.random() > 0.5) {
    user = 'r';
}

var board;
/* 
     * Update list of board and corresponding actions
     */
function updateboard(board) {
    // Select the <div> that contains the suggestion list and clear it
    var thediv = $("#board");
    thediv.empty();

    var boardRotated = [];

    for (let i = 0; i < board.length; i++) {
        boardRotated.push([]);
        for (let j = 0; j < board.length; j++) {
            if (board[j][i] != undefined) boardRotated[i][j] = board[j][i];
        }
    }

    for (let i = 0; i < boardRotated.length - 1; i++) {
        for (let j = 0; j < boardRotated.length; j++) {
            if (boardRotated[i][j] != undefined) {
                var newLine = '<div id="ball' + i + j + '" class="ball"></div>';
                thediv.prepend(newLine);
                var height = $(document).height();
                var width = $(document).width();
                $('#ball' + i + j).css({ 'top': height / 2 - 7 * 30 + (7 - i) * 60 + "px", "left": width / 2 - 7 * 30 + (j * 60) + "px" });
                if (boardRotated[i][j] == 'B') {
                    //$('#ball' + i + j).css({ 'background': "radial-gradient(yellow, #D1D118)"});
                    $('#ball' + i + j).css({ 'background': "url('../images/lama_p2.png')", 'background-size': '100% 100%' });

                }
            }
        }
    }

    var d = $(document);
   $('#boardBackground').css({ 'top': d.height() / 2 - 118 + 'px', 'left': d.width() / 2 - 236 + 'px' });
   //$('#boardBackground').css({ 'top': d.height() / 2 - 118 + 'px', 'left': d.width() / 2 - 236 + 'px'});

    var leftBase = d.width() / 2 - 216;
    var topBase = d.height() / 2 - 118;

    for (let i = 0; i < 7; i++) {
        $('#column-' + i).css({ 'left': leftBase + 60 * i + 'px', 'top': topBase + 'px' });
    }

    disableFull();

    console.log(leftBase);

}

function disableFull() {
    for (let i = 0; i < 7; i++) {
        if (board[i].length >= 6) {
            $('#column-' + i).click(false);
            $('#column-' + i).css({ 'visibility': 'hidden' });
        }
    }
}

function disableAll() {
    for (let i = 0; i < 7; i++) {
        //$('#column-' + i).click(false);
        $('#column-' + i).css({ 'visibility': 'hidden' });
    }
}

function enableAll() {
    for (let i = 0; i < 7; i++) {
        //$('#column-' + i).click(postDisk(event));
        $('#column-' + i).css({ 'visibility': 'visible' });
    }
    disableFull();
}

function setup() {
    var socket = new WebSocket('ws://localhost:3000');
    

    socket.onopen = function () {
        socket.send(JSON.stringify({ code: 'connect' }));
    };

    socket.onmessage = function (event) {
        var jmessage = JSON.parse(event.data);
        console.log(jmessage.code);

        if (jmessage.code == 'update') {
            board = jmessage.data;
            user = jmessage.user;
            console.log(jmessage.data);
            updateboard(jmessage.data);
        }
        if (jmessage.code == 'wait') {
            disableAll();
            $('#status').text("Waiting for an opponent");
        }
        if (jmessage.code == 'enable') {
            enableAll();
            $('#status').text("Your turn!");
        }
        if (jmessage.code == 'disable') {
            disableAll();
            $('#status').text("Opponent's turn!");
        } 
        if (jmessage.code == 'win') {
            disableAll();
            $('#status').text("You won!");
        } 
        if (jmessage.code == 'lose') {
            disableAll();
            $('#status').text("You lost :(");
        }
    }

    function postDisk(event) {
        var columnId = event.target.id.slice(-1);
        socket.send(JSON.stringify({ code: 'postDisk', column: columnId, user: user }));
        $('#status').text("Opponent's turn!");
        disableAll();
    }

    $('.column').click(function () { postDisk(event) });

    //server sends a close event only if the game was aborted from some side

    socket.onerror = function () { };
};



// When the document is ready:
// - First call to update the list of board
// - Set timer to refresh every 1 seconds
// - Link the form to our own function postSuggestion
$(document).ready(function () {

    setup();
    // updateboard();
    // window.setInterval(updateboard, 1000);

    // $(document).getElementsByClassName('column').addEventListener('click', function() {console.log('click')});
    // $('.column').click(function () { postDisk(event) });

    window.addEventListener("resize", function () { updateboard(board) }, true);
});
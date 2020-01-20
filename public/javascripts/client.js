// setting up the sing sound
var ping = document.createElement('audio');
ping.setAttribute('src', '/../sounds/ping.wav');
var user;
var gameStarted = false;
var board;
/* 
     * Update list of board and corresponding actions
     */
function updateboard(board) {
    // Select the <div> that contains the suggestion list and clear it
    var thediv = $("#board");
    thediv.empty();

    // create a new array for rotating the board counter-clockwise
    var boardRotated = [];

    for (let i = 0; i < board.length; i++) {
        boardRotated.push([]);
        for (let j = 0; j < board.length; j++) {
            if (board[j][i] != undefined) boardRotated[i][j] = board[j][i];
        }
    }

    var height = $(document).height();
    var width = $('#background').width();

    for (let i = 0; i < boardRotated.length - 1; i++) {
        for (let j = 0; j < boardRotated.length; j++) {
            if (boardRotated[i][j] != undefined) {
                var newLine = '<div id="ball' + i + j + '" class="ball"></div>';
                thediv.prepend(newLine);

                $('#ball' + i + j).css({ 'top': height / 2 - 7 * 30 + (7 - i) * 60 + "px", "left": width / 2 - 7 * 30 + (j * 60) + "px" });

                if (boardRotated[i][j] == 'B') {
                    //$('#ball' + i + j).css({ 'background': "radial-gradient(yellow, #D1D118)"});
                    $('#ball' + i + j).css({ 'background': "url('../images/lama_p2.png')", 'background-size': '100% 100%' });

                }
            }
        }
    }


    $('#boardBackground').css({ 'top': height / 2 - 118 + 'px', 'left': width / 2 - 236 + 'px' });
    //$('#boardBackground').css({ 'top': d.height() / 2 - 118 + 'px', 'left': d.width() / 2 - 236 + 'px'});

    var leftBase = width / 2 - 216;
    var topBase = height / 2 - 118;

    for (let i = 0; i < 7; i++) {
        $('#column-' + i).css({ 'left': leftBase + 60 * i + 'px', 'top': topBase + 'px' });
    }

    disableFull();
}

function disableFull() {
    for (let i = 0; i < 7; i++) {
        if (board[i].length >= 6) {
            $('#column-' + i).click(false);
            $('#column-' + i).css({ 'visibility': 'hidden' });
        }
    }
}

function disableAll() { // disabling all columns
    for (let i = 0; i < 7; i++) {
        $('#column-' + i).css({ 'visibility': 'hidden' });
    }
}

function enableAll() { // enabling columns that can still be accessed
    for (let i = 0; i < 7; i++) {
        $('#column-' + i).css({ 'visibility': 'visible' });
    }
    disableFull();
}

function hideAll() { // hiding the board with all its elements
    disableAll();
    $('#board').css({ 'visibility': 'hidden' });
    $('#boardBackground').css({ 'visibility': 'hidden' });
}

function setup() {
    var socket = new WebSocket('ws://80.112.185.110:3000');


    socket.onopen = function () {
        // sending a connect message to server on connect
        socket.send(JSON.stringify({ code: 'connect', user: user }));
    };

    socket.onmessage = function (event) {
        var jmessage = JSON.parse(event.data);
        console.log(jmessage.code);

        if (jmessage.code == 'start') {
            gameStarted = true;
            timer();
        }
        if (jmessage.code == 'update') {
            if(gameStarted) ping.play();
            board = jmessage.data;
            user = jmessage.user;
            console.log('user: ' + jmessage.user);
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

            $('#status').text("You won! Click to play again ").append("<img src='/images/happy_cowboy.png'/>");
            $('#status').click(function () { window.location.href = "/play"; });
        }
        if (jmessage.code == 'lose') {

            $('#status').text("You lost. Click to play again ").append("<img src='/images/sad_cowboy.png'/>");
            $('#status').click(function () { window.location.href = "/play"; });
        }
        if (jmessage.code == 'tie') {

            $('#status').text("It's a tie. Click to play again ");
            $('#status').click(function () { window.location.href = "/play"; });
        }
        if (jmessage.code == 'abort') {
            hideAll();
            $('#status').text('Your opponent has chickened out. Click to play again ');
            $('#status').click(function () { window.location.href = "/play"; });
        }
    }

    function postDisk(event) { // sending the info aboud column clicked
        var columnId = event.target.id.slice(-1); // taking the last character from column id
        socket.send(JSON.stringify({ code: 'postDisk', column: columnId, user: user }));
        $('#status').text("Opponent's turn!"); // changing status text
        disableAll(); // disabling ability to click on columns
    }

    // setting a listener on column class divs
    $('.column').click(function () { postDisk(event) });

    function abort() {
        socket.send(JSON.stringify({ code: 'abort', user: user }));
    }

    $('#back-button').click(function () { abort() });


    socket.onerror = function () { };
}

 function timer() {
    var time = 0;
    setInterval(function () {
        time++;
        $('#timer').text('Play time: ' + time + ' seconds.');
    }, 1000);
}



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
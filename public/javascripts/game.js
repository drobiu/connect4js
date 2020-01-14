
/* 
     * Update list of board and corresponding actions
     */
function updateboard() {
    // AJAX request to obtain suggestion list
    $.getJSON("/board").done(function (board) {
        // Select the <div> that contains the suggestion list and clear it
        var thediv = $("#board");
        thediv.empty();

        //console.log(board);

        var boardRotated = [];

        for (let i = 0; i < board.length; i++) {
            boardRotated.push([]);
            for (let j = 0; j < board.length; j++) {
                if (board[j][i] != undefined) boardRotated[i][j] = board[j][i];
            }
        }

        // for (let i = 0; i < board.length; i++) {
        //     var newLine = '<p id="row' + i + '" class="row">|';
        //     for (let j = 0; j < board.length; j++) {
        //         if (boardRotated[i][j] != undefined) newLine += boardRotated[i][j] + ' ';
        //         else newLine += '. ';
        //     }
        //     newLine += '|</p>'
        //     thediv.prepend(newLine);
        // }

        for (let i = 0; i < boardRotated.length; i++) {
            for (let j = 0; j < boardRotated.length; j++) {
                if (boardRotated[i][j] != undefined) {
                    var newLine = '<div id="ball' + i + j + '" class="ball"></div>';
                    thediv.prepend(newLine);
                    var width = $(document).width();
                    $('#ball' + i + j).css({ 'top': (7 - i) * 60 + "px", "left": width/2 - 7*30 + (j * 60) + "px" });
                    if (boardRotated[i][j] == 'y') {
                        $('#ball' + i + j).css({ 'background': "radial-gradient(yellow, #D1D118)"});
                    }
                }
            }
        }

        console.log(boardRotated);
    });
}

/*
 * Post a new suggestion and refresh list
 */
function postSuggestion(event) {
    event.preventDefault();

    var sug = {
        color: $('input[name=color]').val(),
        row: $('input[name=row]').val()
    }

    $.post('/color/', sug).done(updateboard);
}

/*
 * Upvote an existing suggestion
 */
function upvote(sid) {
    $.post('/votes/' + sid).done(function (res) {
        var currentVote = $("#s" + sid + " span.votes")[0];
        currentVote.innerHtml = parseInt(currentVote.innerHtml) + 1;

        var link = $("#s" + sid + " a.action")[0];
        link.innerHtml = '-1';
        link.onclick(function (event) {

        });
    });
    //$( "#" ).getElementById('s' + sid).onclick = function changeContent() {};
}

/*
 * Downvote an existing suggestion
 */
function downvote(sid) {
    // STEP 9
}

// When the document is ready:
// - First call to update the list of board
// - Set timer to refresh every 5 seconds
// - Link the form to our own function postSuggestion
$(document).ready(function () {
    updateboard();
    window.setInterval(updateboard, 5000);

    $("form").submit(postSuggestion);
});
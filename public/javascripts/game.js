var user = 'y';
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

        for (let i = 0; i < boardRotated.length - 1; i++) {
            for (let j = 0; j < boardRotated.length; j++) {
                if (boardRotated[i][j] != undefined) {
                    var newLine = '<div id="ball' + i + j + '" class="ball"></div>';
                    thediv.prepend(newLine);
                    var height = $(document).height();
                    var width = $(document).width();
                    $('#ball' + i + j).css({ 'top': height/2 - 7*30 + (7 - i) * 60 + "px", "left": width/2 - 7*30 + (j * 60) + "px" });
                    if (boardRotated[i][j] == 'y') {
                        $('#ball' + i + j).css({ 'background': "radial-gradient(yellow, #D1D118)"});
                    
                    }
                }
            }
        }

        var d = $(document);
            $('#boardBackground').css({ 'top': d.height()/2-118 + 'px', 'left' : d.width()/2-237 + 'px'});

        var leftBase = d.width()/2-216;
        var topBase = d.height()/2-118;

        for (let i = 0; i < 7; i++) {
            $('#column-' + i).css({'left' : leftBase + 60*i + 'px', 'top' : topBase + 'px'});
        }

        for (let i = 0; i < 7; i++) {
            if (board[i].length >= 6) {
                $('#column-' + i).click(false);
                $('#column-' + i).css({'visibility' : 'hidden'});
            }
        }

        console.log(leftBase);
    });
}

function postDisk(event) {
    var cid = event.target.id.slice(-1);
    console.log(cid);
    postDUID(user, cid);
}

/*
 * Post a new suggestion and refresh list
 */
function postDUID(user, col) {
    event.preventDefault();

    var sug = {
        color: user,
        row: col
    }

    $.post('/color/', sug).done(updateboard);
}
/*
 * Post a new suggestion and refresh list
 */
function postDUI(event) {
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

// When the document is ready:
// - First call to update the list of board
// - Set timer to refresh every 1 seconds
// - Link the form to our own function postSuggestion
$(document).ready(function () {
    updateboard();
    window.setInterval(updateboard, 1000);

   // $(document).getElementsByClassName('column').addEventListener('click', function() {console.log('click')});
    $('.column').click(function() {postDisk(event)});

    window.addEventListener("resize", function(){updateboard()}, true);

    $("form").submit(postDUI);
});
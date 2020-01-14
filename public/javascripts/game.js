
/* 
     * Update list of suggestions and corresponding actions
     */
function updateSuggestions() {
    // AJAX request to obtain suggestion list
    $.getJSON("/suggestions").done(function (suggestions) {
        // Select the <div> that contains the suggestion list and clear it
        var thediv = $("#suggestions");
        thediv.empty();

        console.log(suggestions);
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

    $.post('/color/', sug).done(updateSuggestions);
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
// - First call to update the list of suggestions
// - Set timer to refresh every 5 seconds
// - Link the form to our own function postSuggestion
$(document).ready(function () {
    updateSuggestions();
    window.setInterval(updateSuggestions, 5000);

    $("form").submit(postSuggestion);
});
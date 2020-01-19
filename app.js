var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var sessions = require('express-session');



var bodyParser = require('body-parser');
var websocket = require('ws');

var logic = require('./javascript/logic');
var game = require('./javascript/game');

var router = express.Router();

var app = express();

module.exports = app;

var port = 3000;

var generateBoard = logic.generateBoard;

var checkBoard = logic.checkBoard;

var gameStatus = {
    since: Date.now() /* since we keep it simple and in-memory, keep track of when this object was created */,
    gamesStarted: 0 /* number of games started */,
    gamesCompleted: 0 /* number of games successfully completed */,
    totalPlayers: 0
};

// Serve static files under /client, if available
app.use(express.static(__dirname + "/public"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// //app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/* Pressing the 'PLAY' button, returns this page */
router.get("/play", function (req, res) {
    res.sendFile("game.html", { root: "./public" });
});

app.get("/play", router);

app.use(cookieParser("C4_cookie"));

var sessionConfig = {
    secret: "C4_cookie",
    resave: false,
    saveUninitialized: true,
};

app.use(sessions(sessionConfig));


app.get("/", (req, res) => {
    var session = req.session;
    var cookieMessage;
    if (session.views) {
        session.views++;
        var lv = session.lastVisit;
        session.lastVisit = new Date().toUTCString();
        cookieMessage = "You have been here " + session.views + " times (last visit: " + lv + ").";
    }
    else {
        session.views = 1;
        session.lastVisit = new Date().toUTCString();
        cookieMessage = "[x] Welcome on our site! This site uses cookies";
    }
    res.render('splash.ejs', {
        gamesStarted: gameStatus.gamesStarted,
        gamesCompleted: gameStatus.gamesCompleted,
        totalPlayers: gameStatus.totalPlayers,
        cookieMessage: cookieMessage
    });
});

var server = http.createServer(app);
const wss = new websocket.Server({ server });

var currentGame = new game(gameStatus.gamesStarted, generateBoard());
var conID = 0;

var websockets = {};

wss.on("connection", function connection(ws) {
    let connection = ws;
    connection.id = conID++;
    let playerType = currentGame.addPlayer(connection);
    gameStatus.totalPlayers++;
    websockets[connection.id] = currentGame;
    console.log(currentGame.id);


    console.log(
        "Player %s placed in game %s as %s",
        connection.id,
        currentGame.id,
        playerType
    );

    if (currentGame.hasTwoConnectedPlayers()) {
        console.log("disable");
        currentGame.playerB.send(JSON.stringify({ code: 'disable' }));
        currentGame.playerA.send(JSON.stringify({ code: 'enable' }));
        currentGame = new game(gameStatus.gamesStarted++, generateBoard());
    }

    var newMessage = {};

    if (currentGame.nPlayers == 1) {
        newMessage.code = 'wait';
        console.log('wait');
        newMessage.board = generateBoard();
        currentGame.currentPlayer = currentGame.playerA;
        currentGame.playerA.send(JSON.stringify(newMessage));
    }

    connection.send(JSON.stringify({ code: 'update', data: currentGame.board }));

    connection.on('message', function incoming(message) {
        var jmessage = JSON.parse(message);

        let currGame = websockets[connection.id];
        let board = currGame.board;

        newMessage.code = 'update';

        console.log(jmessage.code);

        if (jmessage.code == 'connect') {
            newMessage.data = board;
            newMessage.user = playerType;
            currGame.playerA.send(JSON.stringify(newMessage));
        }

        if (jmessage.code == 'abort') {

            if (currGame.playerB != null) {
                currGame.playerB.send(JSON.stringify({ code: 'abort' }));
            }
            if (currGame.playerA != null) {
                currGame.playerA.send(JSON.stringify({ code: 'abort' }));
            }

            currentGame = new game(gameStatus.gamesStarted++, generateBoard());
        }

        if (jmessage.code == 'postDisk') {
            board[jmessage.column].push(jmessage.user);
            newMessage.data = board;

            currGame.playerA.send(JSON.stringify(newMessage));
            currGame.playerB.send(JSON.stringify(newMessage));

            let lastPlayer = currGame.currentPlayer;

            if (logic.checkFull(board)) {
                currGame.playerA.send(JSON.stringify({ code: 'tie' }));
                currGame.playerB.send(JSON.stringify({ code: 'tie' }));
                return;
            }

            if (checkBoard(board)) {
                if (lastPlayer == currGame.playerA) {
                    currGame.playerB.send(JSON.stringify({ code: 'lose' }));
                } else {
                    currGame.playerA.send(JSON.stringify({ code: 'lose' }));
                }
                gameStatus.gamesCompleted++;
                lastPlayer.send(JSON.stringify({ code: 'win' }))
            } else {

                if (lastPlayer == currGame.playerA) {
                    currGame.currentPlayer = currGame.playerB;
                } else {
                    currGame.currentPlayer = currGame.playerA;
                }

                currGame.currentPlayer.send(JSON.stringify({ code: 'enable' }));
            }


        } else {
            //connection.send(JSON.stringify(board));
        }
    });



});


// ! change port to 3000 !
http.createServer(app).listen(3001);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

//error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(port);
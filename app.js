var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var bodyParser = require('body-parser');
var websocket = require('ws');

var router = express.Router();

var app = express();

module.exports = app;





var port = 3000;

var size = 7;

generateBoard = function () {
    var result = [];
    for (let i = 0; i < size; i++) {
        result.push([]);
    }
    return result;
};

var board = generateBoard();

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

//app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* GET home page */
// router.get("/splash", function (req, res) {
//     res.sendFile("splash.html", { root: "./public" });
// });

// router.get("/home", function (req, res) {
//     res.sendFile("splash.html", { root: "./public" });
// });

/* Pressing the 'PLAY' button, returns this page */
router.get("/play", function (req, res) {
    res.sendFile("game.html", { root: "./public" });
});

app.get("/play", router);

// router.get("/", (req, res) => {
//     res.render('splash.ejs', {});
// });

app.get("/", (req, res) => {
    res.render('splash.ejs', {});
});

var server = http.createServer(app);
const wss = new websocket.Server({ server });

var conID = 0;

var websockets = {};

wss.on("connection", function connection(ws) {
    let connection = ws;
    connection.id = conID++;

    console.log(
        "Player %s placed in game",
        connection.id,
    );

    connection.on('message', function incoming(message) {
        var jmessage = JSON.parse(message);
        if (jmessage.type == 'postDisk') {
        board[jmessage.column].push(jmessage.user);
        connection.send(JSON.stringify(board));
        } else {
            connection.send(JSON.stringify(board));
        }
    });


    
});

// //catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// //error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


// app.post('/color/', function (req, res) {
//     board[req.body.row].push(req.body.color);
//     if (req.body.color == 'reset') {
//         board = generateBoard();
//     }
//     for (let i = 0; i < size; i++) {
//         console.log(board[i]);
//     }
//     console.log(checkBoard(board));
//     res.end();
// });

// app.get('/board/', function (req, res) {
//     res.json(board);
//     res.end();
// });

// // Create HTTP server and listen to port 3000
// http.createServer(app).listen(3000, function () {
//     console.log("# Listening to port 3000...");
// });

// console.log(checkBoard(board));

server.listen(port);
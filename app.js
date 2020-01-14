var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var bodyParser = require('body-parser');

module.exports = app;

var app = express();

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
          if (board[i][j] == board[i][j+1] && board[i][j+2] == board[i][j+3] && board[i][j] == board[i][j+2] && board[i][j+3] != undefined) return board[i][j];
      }
  }

  //checking for vertical matches
  for (let i = 0; i < size - 3; i++) {
      for (let j = 0; j < size; j++) {
          if (board[i][j] == board[i+1][j] && board[i+2][j] == board[i+3][j] && board[i][j] == board[i+3][j] && board[i+3][j] != undefined) return board[i][j];
      }
  }

  //checking for diagonal matches (\)
  for (let i = 0; i < size - 3; i++) {
      for (let j = 0; j < size - 3; j++) {
          if (board[i][j] == board[i+1][j+1] && board[i+2][j+2] == board[i+3][j+3] && board[i][j] == board[i+3][j+3] && board[i][j] != undefined) return board[i][j];
      }
  }

  //checking for diagonal matches (/)
  for (let i = 0; i < size - 3; i++) {
      for (let j = 3; j < size; j++) {
          if (board[i][j] == board[i+1][j-1] && board[i+2][j-2] == board[i+3][j-3] && board[i][j] == board[i+3][j-3] && board[i][j] != undefined) return board[i][j];
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

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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


app.post('/color/', function (req, res) {
	board[req.body.row].push(req.body.color);
  for (let i = 0; i < size; i++) {
    console.log(board[i]);
  }
	console.log(checkBoard(board));
	res.end();
});

app.get('/board/', function (req, res) {
	res.json(board);
	res.end();
});

// Create HTTP server and listen to port 3000
http.createServer(app).listen(3000, function() {
	console.log("# Listening to port 3000...");
});

console.log(checkBoard(board));
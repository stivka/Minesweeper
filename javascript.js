var boardLength;
var numberOfBombs; //show on scoreboard
var board; //show on scoreboard
var bombsArray = null;
var revealedSquares = 0; //show on scoreboard
var playerName; //show on scoreboard
var lostOrWon; // show on scoreboard
var moves;

var validateInput = function () {
    var textFieldNumberOfBombs = parseInt(document.getElementById('textfieldNumberOfBombs').value);
    var selector = parseInt(document.getElementById('selectedBoardLength').value);
    var textfieldPlayerName = document.getElementById('textfieldName').value;

    if (textFieldNumberOfBombs !== parseInt(textFieldNumberOfBombs, 10)) {
        alert("Sisetage arvuline väärtus!");
        return false;
    }
    if (textFieldNumberOfBombs < 1 || textFieldNumberOfBombs >= Math.pow(boardLength, 2)) {
        alert("Pomme peab vähemalt 1 olema ja mitte rohkem kui ruute laual! ");
        return false;
    }

    if (textfieldPlayerName !== undefined) {
        console.log(textfieldPlayerName);
    }
    // if (textField >= Math.pow(boardLength, 2)) {
    //     alert("Pomme on rohkem kui ruute laual!");
    //     return false;
    // }
    return true;
}

var loadBoard = function () {
    if (validateInput()) {

        document.getElementById('boardDiv').innerHTML = "";
        boardLength = document.getElementById("selectedBoardLength").value;
        numberOfBombs = document.getElementById("textfieldNumberOfBombs").value;
        board = document.getElementById('boardDiv');
        playerName = document.getElementById("textfieldName").value;
        moves = [];

        console.log("Input for board length and number of bombs is: " + boardLength, numberOfBombs);

        for (let y = 0; y < boardLength; y++) {
            var rowDiv = document.createElement('div');

            for (let x = 0; x < boardLength; x++) {
                var button = document.createElement('button');

                button.className = 'boardSquare';

                var id = y + ':' + x;
                button.id = id;
                button.x = x;
                button.y = y;

                console.log("Button is given the id: " + id);
                button.onclick = function () {
                    checkSquare(x, y)
                };

                rowDiv.appendChild(button);
            }
            board.appendChild(rowDiv);
        }

        bombsArray = [];
        for (var x = 0; x < boardLength; x++) {
            bombsArray[x] = [];
            for (var y = 0; y < boardLength; y++) {
                bombsArray[x][y] = 0;
            }
        }

        var n = numberOfBombs;
        // while there are bombs left, generate an index for a bomb
        while (n > 0) {
            var x = Math.floor(Math.random() * boardLength);
            var y = Math.floor(Math.random() * boardLength);
            console.log("Bomb is created on: " + x + ", " + y + " coordinate.");

            if (bombsArray[x][y] != 1) {
                bombsArray[x][y] = 1;
                n--;
            }
        }
    }
}

var checkSquare = function (x, y) {

    console.log("x and y coordinate repectively derived from id are: " + x, y);

    document.getElementById(y + ':' + x).className = "boardSquareClicked";


    if (bombsArray[x][y] === 1) {
        revealedSquares++;
        alert("Ai piraki!");

        saveResults("kaotas");

        disableSquareButtons();

        document.getElementById(event.target.id).innerHTML = "*";
    }

    // when same button is clicked twice
    else if (document.getElementById(y + ':' + x).classname !== "" && document.getElementById(y + ':' + x).classname === "boardSquare") {

    } else {
        revealedSquares++;

        moves.push(y);
        moves.push(x);

        checkWin();

        var list = [];

        //get coordinates for neighbour squares
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                // square is not a neighbour of itself
                if (i == 0 && j == 0) continue;
                // check whether the the neighbour is inside board bounds
                if ((x + i) >= 0 && (x + i) < boardLength && (y + j) >= 0 && (y + j) < boardLength) {
                    if (bombsArray[x + i][y + j] === 1) {
                        list.push([x + i, y + j]);
                    }
                }
            }
        }
        console.log(list.length);
        document.getElementById(y + ':' + x).innerHTML = list.length;

        if (list.length == 0) {
            //get coordinates for neighbour squares
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    // square is not a neighbour of itself
                    if (i == 0 && j == 0) continue;
                    // check whether the the neighbour is inside board bounds
                    if ((x + i) >= 0 && (x + i) < boardLength && (y + j) >= 0 && (y + j) < boardLength) {

                        var temporaryBombs = 0;
                        //get coordinates for neighbour squares
                        for (var q = -1; q <= 1; q++) {
                            for (var w = -1; w <= 1; w++) {
                                // square is not a neighbour of itself
                                if (q == 0 && w == 0) continue;
                                // check whether the the neighbour is inside board bounds
                                if ((x + i + q) >= 0 && (x + i + q) < boardLength && (y + j + w) >= 0 && (y + j + w) < boardLength) {
                                    if (bombsArray[x + i + q][y + j + w] === 1) {
                                        temporaryBombs += 1;
                                    }
                                }
                            }
                        }
                        document.getElementById((y + j) + ":" + (x + i)).innerHTML = temporaryBombs;
                        console.log(temporaryBombs);
                    }
                }
            }
        }
        // now if there are no bombs around that x,y coordinate
        // if (list.length == 0) {
        //     revealSquaresAroundZeroSquare(x, y);
        // }

    }
}


var disableSquareButtons = function () {
    for (let y = 0; y < boardLength; y++) {
        for (let x = 0; x < boardLength; x++) {
            document.getElementById(x + ":" + y).disabled = true;
        }
    }
}

var checkWin = function () {
    console.log("revealed squares: " + revealedSquares + ", number of bombs " + numberOfBombs);
    var sumOfRevealedSquaresAndBombs = parseInt(revealedSquares, 10)
        + parseInt(numberOfBombs, 10);

    console.log("Sum of revealed squares and bombs is: " + sumOfRevealedSquaresAndBombs);
    if (sumOfRevealedSquaresAndBombs === Math.pow(boardLength, 2)) {

        var para = document.createElement("P");
        var t = document.createTextNode("Võitsid, " + revealedSquares + " käiguga.");
        para.appendChild(t);
        document.getElementById("infoDiv").appendChild(para);

        saveResults("voitis");

        disableSquareButtons();
        revealedSquares = 0;
        playerName = "";
    }
}

function saveGame() {
    const url = 'http://dijkstra.cs.ttu.ee/~stkapt/cgi-bin/prax3/savegame.py';

    let boardDivAsText = String(document.getElementById("boardDiv"));
    let regboard = (document.getElementById("boardDiv"));
    // var boardDivAsText = 'tervist';
    var gameBoardData = { html: regboard };
    // Send log to server
    console.log(boardDivAsText);

    fetch(url, {
        method: "POST",
        body: JSON.stringify({playerName: playerName, numberOfBombs: numberOfBombs, boardLength: boardLength,
            bombsArray: JSON.stringify(bombsArray), moves: JSON.stringify(moves)}),
        headers: new Headers()
    }).catch(function (error) {
        console.log(error)
    });
    // Reset conditions
    revealedSquares = 0;
}

function parseJson(manguasi) {
    return manguasi.json();
}

function loadGame() {

    var url = "http://dijkstra.cs.ttu.ee/~stkapt/cgi-bin/prax3/loadgame.py";
    url += '?playerName=' + document.getElementById('textfieldName').value;

    fetch(url).then(parseJson).then(function (data) {
        numberOfBombs = data.numberOfBombs;
        document.getElementById('textfieldNumberOfBombs').value = numberOfBombs;
        boardLength = data.boardLength;
        document.getElementById('selectedBoardLength').value = boardLength;

        loadBoard();

        bombsArray = JSON.parse(data.bombsArray);
        tempMoves = JSON.parse(data.moves);

        for (let i = 0; i < tempMoves.length; i += 2) {
            checkSquare(tempMoves[i + 1], tempMoves[i]);
        }
    }).catch(function (error) {
        console.log(error);
    })


}

function saveResults(lostOrWon) {
    // Create ending message
    var message = playerName + " " + lostOrWon + " " + revealedSquares + " kaiguga "
        + boardLength + "X" + boardLength + " laual " + numberOfBombs + " pommiga.";

    // Add log under board
    let para = document.createElement("P");
    para.appendChild(document.createTextNode(message));
    document.getElementById("infoDiv").appendChild(para);

    // Send log to server
    console.log(message);
    console.log({playerName: playerName, message: message});
    console.log(JSON.stringify({playerName: playerName, message: message}));

    fetch("http://dijkstra.cs.ttu.ee/~stkapt/cgi-bin/prax3/fetch.py", {
        method: "POST",
        body: JSON.stringify({playerName: playerName, message: message}),
        headers: new Headers()
    }).catch(function (error) {
        console.log(error)
    });
    // Reset conditions
    revealedSquares = 0;
}

function showResults() {
    // /home/stkapt/public_html/cgi-bin/prax3/fetch.py
    var url = "http://dijkstra.cs.ttu.ee/~stkapt/cgi-bin/prax3/fetch.py";
    window.open(url, "Autahvel");

}
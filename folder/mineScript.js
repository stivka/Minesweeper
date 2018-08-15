var name;
var bombs;
var tablesize;
var result;
var moves;
var fileData;
var bombList;
var clickedSquares = [];
function gameStart() {
	clickedSquares = [];
	name = document.getElementById("name").value;
	bombs = document.getElementById("bombs").value;
	var selectionElement = document.getElementById("selector");
	var userChoice = selectionElement.options[selectionElement.selectedIndex].value;
	if (name !== null && name != "" && bombs !== null && bombs > 0 && bombs < userChoice*userChoice) {
		var anyTables = document.getElementsByTagName("table");
		if (anyTables.length > 0) {
			anyTables[0].parentNode.removeChild(anyTables[0]);
		}
		if (userChoice === "6") {
			generateTable(6, 6);
		} else if (userChoice === "9") {
			generateTable(9, 9);
		} else if (userChoice === "16") {
			generateTable(16, 16);
		}
	} else {
		if (name === null || name == "") {
			window.alert("Enter a name.")
		} else {
			window.alert("Enter the correct number of mines (has to be over 0 and under " + userChoice * userChoice + ").");
		}
	}
}

function generateTable(col, row) {
	tablesize = col + " x " + col;
	var clickCount = 0;
	var allTableElements = []
	var tableDiv = document.getElementById("board");
	var mineTable = document.createElement("table");
	var tableBody = document.createElement("tbody");
	for (var i = 0; i < row; i++) {
		var rowElement = document.createElement("tr");
		for (var k = 0; k < col; k++) {
			var colElement = document.createElement("td");
			if (i < 10 && k < 10) {
				colElement.id = "0" + i.toString()+ "0" + k.toString();
			} else if (k < 10) {
				colElement.id = i.toString() + "0" + k.toString();
			} else if (i < 10) {
				colElement.id = "0" + i.toString() + k.toString();
			} else {
				colElement.id = i.toString() + k.toString();
			}
			allTableElements.push(colElement.id);
			colElement.onclick = function () {
				clickCount += 1;
                checkForMine(this, col, bombList, clickCount);
            };
			var span = document.createElement("span");
			span.setAttribute("class", "mineText");
			var nodeElement = document.createTextNode("?.");
			span.appendChild(nodeElement);
			colElement.appendChild(span); 
			colElement.style.textAlign = "center";
			rowElement.appendChild(colElement);
		}
		tableBody.appendChild(rowElement);
	}
	mineTable.appendChild(tableBody);
	mineTable.style.width = "100%";
	mineTable.style.height = "100%";
	tableDiv.appendChild(mineTable);
	mineTable.setAttribute("border", "1");
	bombList = generateBombs(allTableElements);
}

function checkForMine(oneElement, col, bombList, clickCount) {
	clickedSquares.push(oneElement.id);
	console.log(bombList);
	console.log(clickedSquares);
	oneElement.onclick = "";
	if (bombList.indexOf(oneElement.id) >= 0) {
		window.alert("Game Lost in " + clickCount + " Move/Moves.");
		for (var i = 0; i < bombList.length; i++) {
			document.getElementById(bombList[i]).style.backgroundColor = "red";
			document.getElementById(bombList[i]).childNodes[0].style.color = "red";
		}
		result = "Lost";
		moves = clickCount;
		console.log(name + ";" + bombs + ";" + tablesize + ";" + result + ";" + moves);
		writeToFile();
		document.getElementById("textarea").value += "\nGame Lost by " + name + " in " + clickCount + " Move/Moves.";
		var square = document.getElementsByTagName("td");
		for (var i = 0; i < col * col; i++) {
				square[i].onclick = "";
			}
	} else {
		var listOfMoves = calculate(oneElement.id, col);
		oneElement.style.backgroundColor = "blue";
		if (listOfMoves[1] === 0) {
			oneElement.childNodes[0].style.color = "blue";
			for (var v = 0; v < listOfMoves[0].length; v++) {
				calculate(listOfMoves[0][v], col);
			}
		}
		if (col**2 - clickCount == bombList.length) {
			window.alert("Game Won in " + clickCount + " Move/Moves.");
			result = "Won";
			moves = clickCount;
			writeToFile();
			document.getElementById("textarea").value += "\nGame Won by " + name + " in " + clickCount + " Move/Moves.";
			var square = document.getElementsByTagName("td");
			for (var i = 0; i < col * col; i++) {
				square[i].onclick = "";
			}
		} 
	}
}

function generateBombs(allTableElements) {
	allElements = allTableElements;
	newBombList = [];
	while (newBombList.length < bombs) {
		randomIndex = Math.floor(Math.random() * allElements.length);
		bombElement = allElements[randomIndex];
		newBombList.push(bombElement);
		allElements.splice(randomIndex, 1);
	}
	return newBombList;
}

function calculate(elementString, col) {
	var allMoves = [];
	var firstElement = parseInt(elementString.substring(0, 2));
	var secondElement = parseInt(elementString.substring(2, 4));
	for (var i = -1; i < 2; i++) {
		for (var k = -1; k < 2; k++) {
			if (i === 0 && k === 0) {
				continue;
			}
			if ((firstElement + i) < col && (firstElement + i) >= 0 && (secondElement + k) < col && (secondElement + k) >= 0) {
				if ((firstElement + i).toString().length === 1 && (secondElement + k).toString().length === 1) {
					allMoves.push("0" + (firstElement + i) + "0" + (secondElement + k));
				} else if ((firstElement + i).toString().length === 1) {
					allMoves.push("0" + (firstElement + i) + "" + (secondElement + k));
				} else if ((secondElement + k).toString().length === 1) {
					allMoves.push((firstElement + i) + "0" + (secondElement + k));
				} else {
					allMoves.push((firstElement + i) + "" + (secondElement + k));
				}
			}
		}
	}
	var count = 0;
	for (var i = 0; i < allMoves.length; i++) {
		if (bombList.indexOf(allMoves[i]) >= 0) {
			count += 1;
		}
	}
	if (count > 0) {
		document.getElementById(elementString).childNodes[0].childNodes[0].nodeValue = " " + count.toString() + " ";
		document.getElementById(elementString).childNodes[0].style.color = "black";
	}
	return [allMoves, count];
}

function writeToFile(){
	$.ajax({
        type: 'POST',
		dataType: "json",
        url: "http://dijkstra.cs.ttu.ee/~frvarb/cgi-bin/prax3/test.py",
        data: JSON.stringify(
			{'name' :name,
			'results': {
			'bombs' : bombs,
			'tablesize' : tablesize,
			'result' : result,
			'moves' : moves,
			'saveGame': 'false'}}),
		contentType: "application/json",
	}).done(function(){
		console.log("did it")
	}).fail(function(xhr, status, error){
		console.log(error)
		console.log(status)
		console.warn(xhr.responseText)
	});
}

function saveGameToFile(){
	$.ajax({
        type: 'POST',
		dataType: "json",
        url: "http://dijkstra.cs.ttu.ee/~frvarb/cgi-bin/prax3/test.py",
        data: JSON.stringify(
			{'name' :name,
			'results': {
			'bombs' : bombs,
			'tablesize' : tablesize,
			'result' : 'saved',
			'moves' : moves,
			'saveGame': 'true',
			'bombList': bombList,
			'movesList': clickedSquares
			}}),
		contentType: "application/json",
	}).done(function(){
		console.log("did it")
	}).fail(function(xhr, status, error){
		console.log(error)
		console.log(status)
		console.warn(xhr.responseText)
	});
	clickedSquares = [];
}

function readFromFile(){
	$.ajax({
		type: 'GET',
		url: "http://dijkstra.cs.ttu.ee/~frvarb/cgi-bin/prax3/test.py",
		async: true,
		cache: false,
		contentType: "application/json; charset=UTF-8",
		timeout: 50000,
		success: function(data){
			fileData = JSON.parse(data);
		}
	});
}
function pressSearch(){
	$(".smallerDiv").html("");
	readFromFile();
	var inputValue = document.getElementsByClassName("nameInput")[0].value;
	if (typeof inputValue == "undefined" || inputValue == ""){
		setTimeout(function(){
			var count = 0;
			for (var i = fileData.length - 1; i >= 0; --i) {
				jsonObject = fileData[i];
				count += 1;
				if (jsonObject.results.result == "Won" || jsonObject.results.result == "Lost") {
					$('<p>' +  jsonObject.name + " " + jsonObject.results.result + " the game in " +
					jsonObject.results.moves + " move/moves on a " +
					jsonObject.results.tablesize + " table with " + jsonObject.results.bombs + ' bombs.</p>').appendTo('.smallerDiv');
				}
				if (count == 100) {
					break;
				}
			}
		}, 200);
	} else {
		setTimeout(function(){
			var count = 0;
			for (var i = fileData.length - 1; i >= 0; --i) {
				jsonObject = fileData[i];
				if (jsonObject.name === inputValue && (jsonObject.results.result == "Won" || jsonObject.results.result == "Lost")) {
					count += 1;
					$('<p>' +  jsonObject.name + " " + jsonObject.results.result + " the game in " +
					jsonObject.results.moves + " move/moves on a " +
					jsonObject.results.tablesize + " table with " + jsonObject.results.bombs + ' bombs.</p>').appendTo('.smallerDiv');
				}
				if (count == 100) {
					break;
				}
			}
			if (count == 0) {
				alert("No such saved game for the given name.");
			}
		}, 200);
	}
}

function highScoreClick(){
	window.location.href = "index1.html";
}

function back(){
	window.location.href = "index.html";
}

function saveGame(){
	if (typeof tablesize === "undefined") {
		window.alert("You need to start the game first.");
	} else {
		saveGameToFile();
	}
}

function loadGame(){
	var nameInput = document.getElementById("name").value;
	if (typeof nameInput === "undefined" || nameInput === "") {
		window.alert("Enter your player name first.");
	} else {
		readFromFile();
		setTimeout(function(){
			for (var i = fileData.length - 1; i >= 0; --i) {
				jsonObject = fileData[i];
				if (jsonObject.name === nameInput && jsonObject.results.saveGame === "true") {
					bombList = jsonObject.results.bombList;
					bombs = bombList.length;
					console.log(jsonObject.results.movesList);
					console.log(jsonObject.results.bombList);
					console.log(jsonObject.results.tablesize[0]);
					var anyTables = document.getElementsByTagName("table");
					if (anyTables.length > 0) {
						anyTables[0].parentNode.removeChild(anyTables[0]);
					}
					if (parseInt(jsonObject.results.tablesize[0]) == 1) {
						generateLoadedTable(parseInt(jsonObject.results.tablesize[0] + jsonObject.results.tablesize[1]) ,jsonObject.results.bombList);
					} else {
						generateLoadedTable(parseInt(jsonObject.results.tablesize[0]) ,jsonObject.results.bombList);
					}
					for (var i = 0; i < jsonObject.results.movesList.length; i++) {
						document.getElementById(jsonObject.results.movesList[i]).click();
					}
					break;
				}
			}
		}, 200);
	}
	clickedSquares = [];
}

function generateLoadedTable(col, loadedBomblist){
	tablesize = col + " x " + col;
	var clickCount = 0;
	var allTableElements = []
	var tableDiv = document.getElementById("board");
	var mineTable = document.createElement("table");
	var tableBody = document.createElement("tbody");
	for (var i = 0; i < col; i++) {
		var rowElement = document.createElement("tr");
		for (var k = 0; k < col; k++) {
			var colElement = document.createElement("td");
			if (i < 10 && k < 10) {
				colElement.id = "0" + i.toString()+ "0" + k.toString();
			} else if (k < 10) {
				colElement.id = i.toString() + "0" + k.toString();
			} else if (i < 10) {
				colElement.id = "0" + i.toString() + k.toString();
			} else {
				colElement.id = i.toString() + k.toString();
			}
			allTableElements.push(colElement.id);
			colElement.onclick = function () {
				clickCount += 1;
                checkForMine(this, col, bombList, clickCount);
            };
			var span = document.createElement("span");
			span.setAttribute("class", "mineText");
			var nodeElement = document.createTextNode("?.");
			span.appendChild(nodeElement);
			colElement.appendChild(span); 
			colElement.style.textAlign = "center";
			rowElement.appendChild(colElement);
		}
		tableBody.appendChild(rowElement);
	}
	mineTable.appendChild(tableBody);
	mineTable.style.width = "100%";
	mineTable.style.height = "100%";
	tableDiv.appendChild(mineTable);
	mineTable.setAttribute("border", "1");
	bombList = loadedBomblist;
}





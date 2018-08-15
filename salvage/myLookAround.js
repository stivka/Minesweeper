var revealSquaresAroundZeroSquare = function(x, y) {
    //check for an available square again..
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            // square is not a neighbour of itself
            if (i == 0 && j == 0) continue;
            // check whether the the neighbour is inside board bounds
            if ((x + i) >= 0 && (x + i) < boardLength && (y + j) >= 0 && (y + j) < boardLength) {

                // that's your square! The next middle square to look around
                var a = x + i;
                var b = y + j;

                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {
                        // square is not a neighbour of itself
                        if (i == 0 && j == 0) continue;
                        // check whether the the neighbour is inside board bounds
                        if ((a + i) >= 0 && (b + i) < boardLength && (y + j) >= 0 && (y + j) < boardLength) {
                            if (bombsArray[a + i][b + j] === 1) {
                                list.push([a + i, b + j]);
                            }
                        }
                    }
                }
                // check around all those squares
                document.getElementById(a + "" + b).innerHTML = list.length;
            }
        }
    }
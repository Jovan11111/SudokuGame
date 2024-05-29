var intervalId = setInterval(function() {
    let grid = [];
    for (let row = 0; row < 9; row++) {
        grid[row] = [];
        for (let col = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            grid[row][col] = cell.textContent === '' ? 0 : parseInt(cell.textContent);
        }
    }

    let valid = true;

    // Reset cell colors
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            document.getElementById(`cell-${row}-${col}`).style.color = '';
        }
    }

    // check rows and columns
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            for(let m = 0; m < 9; m++){
                for(let n = 0; n < 9; n++){
                    if(grid[i][j] === grid[m][n] && (i === m || j === n) && !(i === m && j === n)){
                        console.log(i + " " + j + " " + m + " " + n);
                        highlightMistake(i, j);
                    }
                }
            }
        }
    }

    // Check subgrids
    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            let subgridSet = new Set();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let num = grid[row + i][col + j];
                    if (num !== 0 && subgridSet.has(num)) {
                        valid = false;
                        console.log(row + i + "  " + col + j);
                        highlightMistake(row + i, col + j);
                    }
                    subgridSet.add(num);
                }
            }
        }
    }
  }, 1000);
  function highlightMistake(row, col) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    cell.style.color = 'red';
}
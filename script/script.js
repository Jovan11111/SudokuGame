let selectedCell = null;
let isPlaying = false;
let guessCounter = 0;
let sleepTime = 200;

function generateEmptyGrid() {
    const grid = document.getElementById('sudoku-grid');
    grid.innerHTML = '';
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            td.id = `cell-${row}-${col}`;
            td.onclick = () => selectCell(row, col);

            // Add thick borders between 3x3 subgrids
            if (row % 3 === 0 && row !== 0) td.classList.add('thick-top');
            if (col % 3 === 0 && col !== 0) td.classList.add('thick-left');
            if (row === 8) td.classList.add('thick-bottom');
            if (col === 8) td.classList.add('thick-right');

            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }
    generateNumberButtons();
}

function generateNumberButtons() {
    const buttonContainer = document.querySelector('.btn-group');
    buttonContainer.innerHTML = '';
    for (let num = 1; num <= 9; num++) {
        const button = document.createElement('button');
        button.textContent = num;
        button.onclick = () => placeNumber(num);
        button.className = "btn btn-dark";
        buttonContainer.appendChild(button);
    }
}

function selectCell(row, col) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (!cell.classList.contains('initial-number')) { 
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = cell;
        selectedCell.classList.add('selected');
    }
}

function placeNumber(num) {
    if (selectedCell) {
        selectedCell.textContent = num;
        if (isBoardFull()) {
            document.getElementById('check-button').disabled = false;
        }
    }
}

function isSafe(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num || grid[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
            return false;
        }
    }
    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                let numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (let num of numbers) {
                    if (isSafe(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (solveSudoku(grid)) {
                            return true;
                        }
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function generateSolution() {
    let grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveSudoku(grid);
    return grid;
}

function revealCells(grid, numberOfCells) {
    let revealedGrid = Array.from({ length: 9 }, () => Array(9).fill(''));
    let cells = [];
    for (let i = 0; i < 81; i++) {
        cells.push(i);
    }
    cells.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numberOfCells; i++) {
        const row = Math.floor(cells[i] / 9);
        const col = cells[i] % 9;
        revealedGrid[row][col] = grid[row][col];
    }
    return revealedGrid;
}

function fillGrid(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (grid[row][col] !== '') {
                cell.textContent = grid[row][col];
                cell.classList.add('initial-number');
                cell.onclick = null; 
            } else {
                cell.textContent = '';
                cell.classList.remove('initial-number');
                cell.onclick = () => selectCell(row, col);
            }
        }
    }
}

function generateSudoku(difficulty) {
    const solution = generateSolution();
    let puzzle;
    switch (difficulty) {
        case 'easy':
            puzzle = revealCells(solution, 45);
            break;
        case 'medium':
            puzzle = revealCells(solution, 35);
            break;
        case 'hard':
            puzzle = revealCells(solution, 25);
            break;
    }
    guessCounter = 0;
    sleepTime = 200;
    fillGrid(puzzle);
    document.getElementById('check-button').disabled = true; // Disable check button initially
    isPlaying = true;
    document.getElementById('easy-button').disabled = true; // Disable generate buttons
    document.getElementById('medium-button').disabled = true;
    document.getElementById('hard-button').disabled = true;
}

window.onload = function() {
    generateEmptyGrid();
};

function isBoardFull() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (cell.textContent === '') {
                return false;
            }
        }
    }
    return true;
}

function checkSolution() {
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

    // Check rows and columns
    for (let i = 0; i < 9; i++) {
        let rowSet = new Set();
        let colSet = new Set();
        for (let j = 0; j < 9; j++) {
            // Check row
            if (grid[i][j] !== 0 && rowSet.has(grid[i][j])) {
                valid = false;
                highlightMistake(i, j);
            }
            rowSet.add(grid[i][j]);

            // Check column
            if (grid[j][i] !== 0 && colSet.has(grid[j][i])) {
                valid = false;
                highlightMistake(j, i);
            }
            colSet.add(grid[j][i]);
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
                        highlightMistake(row + i, col + j);
                    }
                    subgridSet.add(num);
                }
            }
        }
    }

    if (valid) {
        alert("Congratulations, you solved it correctly!");
        isPlaying = false;
        document.getElementById('easy-button').disabled = false; // Enable generate buttons
        document.getElementById('medium-button').disabled = false;
        document.getElementById('hard-button').disabled = false;
    } else {
        alert("There are mistakes in your solution.");
    }
}

function highlightMistake(row, col) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    cell.style.color = 'red';
}
function getCurrentGrid() {
    let grid = [];
    for (let row = 0; row < 9; row++) {
        grid[row] = [];
        for (let col = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            grid[row][col] = cell.textContent === '' ? 0 : parseInt(cell.textContent);
        }
    }
    return grid;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function solveSudokuWithAnimation() {
    let grid = getCurrentGrid();
    await solveWithAnimation(grid);
}

async function solveWithAnimation(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafe(grid, row, col, num)) {
                        guessCounter++;
                        if(guessCounter % 100 == 0){
                            sleepTime = Math.floor(sleepTime*0.9);
                        }
                        grid[row][col] = num;
                        document.getElementById(`cell-${row}-${col}`).textContent = num;
                        await sleep(sleepTime);  

                        if (await solveWithAnimation(grid)) {
                            return true;
                        }

                        grid[row][col] = 0;
                        document.getElementById(`cell-${row}-${col}`).textContent = '';
                    }
                }
                return false;
            }
        }
    }
    document.getElementById('check-button').disabled = false; // Disable check button initially
    isPlaying = false;
    document.getElementById('easy-button').disabled = false; // Disable generate buttons
    document.getElementById('medium-button').disabled = false;
    document.getElementById('hard-button').disabled = false;
    return true;
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const cellRadius = 2;
const colors = ['#9be9a8', '#40c463', '#30a14e', '#216e39'];
const UPDATE_INTERVAL = 500; // 0.5 seconds
let lastUpdate = 0;
let rows, cols;
let grid, nextGrid;

/**
 * @description Initialize the grid with random values
 */
function initializeGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() > 0.85 ? 1 : 0;
        }
    }
}

/**
 * @description Create a grid with specified rows and columns
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {Array} A 2D array representing the grid
 */
function createGrid(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
}

/**
 * @description Resize the canvas and initialize the grids
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rows = Math.floor(canvas.height / cellSize);
    cols = Math.floor(canvas.width / cellSize);
    grid = createGrid(rows, cols);
    nextGrid = createGrid(rows, cols);
    initializeGrid();
}

/**
 * @description Draw a cell with a color based on the number of neighbors
 * @param {number} row - Row index of the cell
 * @param {number} col - Column index of the cell
 * @param {number} neighbors - Number of neighboring cells
 */
function drawCell(row, col, neighbors) {
    const x = col * cellSize;
    const y = row * cellSize;
    const colorIndex = Math.min(Math.floor(neighbors / 2), colors.length - 1);
    ctx.fillStyle = colors[colorIndex];
    ctx.beginPath();
    ctx.roundRect(x, y, cellSize - 1, cellSize - 1, cellRadius);
    ctx.fill();
}

/**
 * @description Draw the entire grid
 */
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col]) {
                const neighbors = countNeighbors(row, col);
                drawCell(row, col, neighbors);
            }
        }
    }
}

/**
 * @description Count the number of neighbors for a given cell
 * @param {number} row - Row index of the cell
 * @param {number} col - Column index of the cell
 * @returns {number} Number of neighboring cells
 */
function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = (row + i + rows) % rows;
            const newCol = (col + j + cols) % cols;
            count += grid[newRow][newCol];
        }
    }
    return count;
}

/**
 * @description Update the grid based on the rules of the game
 */
function updateGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(row, col);
            if (grid[row][col]) {
                nextGrid[row][col] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
            } else {
                nextGrid[row][col] = neighbors === 3 ? 1 : 0;
            }
        }
    }
    [grid, nextGrid] = [nextGrid, grid];
}

/**
 * @description Main game loop
 * @param {DOMHighResTimeStamp} timestamp - Current time
 */
function gameLoop(timestamp) {
    if (timestamp - lastUpdate >= UPDATE_INTERVAL) {
        updateGrid();
        drawGrid();
        lastUpdate = timestamp;
    }
    requestAnimationFrame(gameLoop);
}

// Event listener for window resize
window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas();
requestAnimationFrame(gameLoop);

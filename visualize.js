document.addEventListener('DOMContentLoaded', function () {


    const height = window.innerHeight / 2;
    const width = window.innerWidth / 2;

    const graph = new Graph(10, 10);

    console.log("2D Grid with Random Charges:");
    console.log(graph.grid);

    console.log("Graph Representing Neighbors:");
    console.log(graph.graph);

    let previouslyHighlightedCells = [];

    let isRunningMultiTreeBFS = false;

    let startCell = null;
    let targetCell = null;

    // Add a state variable to track the current selection mode
    let selectionMode = 'start';


    document.body.appendChild(drawGrid());



    function drawGrid() {

        const tileSize = height / graph.rows;


        var grid = document.createElement('table');
        grid.className = 'grid';

        for (let x = 0; x < graph.rows; x++) {

            var tr = grid.appendChild(document.createElement('tr'));
            for (let y = 0; y < graph.columns; y++) {
                var cell = tr.appendChild(document.createElement('td'));
                cell.style.height = tileSize + 'px'; // Set the cell's height using CSS
                cell.style.width = tileSize + 'px';

                // Assign a unique ID to each cell
                cell.id = `cell_${x}_${y}`;

                // Add a click event listener to each cell
                // Use a closure to capture the current values of x and y
                // Add a click event listener to each cell
                // Update the cell click logic
                (function (currentCell, currentX, currentY) {
                    currentCell.addEventListener('click', function () {
                        handleCellClick(currentCell, currentX, currentY);
                    });
                })(cell, x, y);

                (function (currentCell, currentX, currentY) {
                    currentCell.addEventListener('mouseover', function () {
                        handleCellHover(currentCell, currentX, currentY);
                    });
                    currentCell.addEventListener('mouseleave', handleCellMouseLeave);
                })(cell, x, y);

                cell.innerHTML = graph.grid[x][y];


            }
        }

        return grid;



    }


    function handleCellClick(cell, x, y) {
        // Check if the cell is already part of the path and skip if it is
        if (cell.style.backgroundColor === 'red' || cell.style.backgroundColor === 'orange') {
            return;
        }

        // Highlight the neighbors on hover, and update the selected cells
        highlightNeighbors(cell, x, y);
        updateCell(cell, x, y);
    }

    let previouslyHighlightedCellIds = [];
    let hoveredCell = null; // To track the currently hovered cell

    // Update the highlightNeighbors function to handle hover
    function highlightNeighbors(cell, x, y) {


        const currentCell = `${x}-${y}`;
        const currentCellId = `cell_${x}_${y}`;

        previouslyHighlightedCellIds.push(currentCellId);

        const neighbors = graph.getNeighbors(x, y);

        // Highlight the clicked cell with a different color
        cell.style.backgroundColor = 'yellow';

        // Highlight the neighbors in one color
        neighbors.forEach((neighbor) => {
            const [neighborX, neighborY] = neighbor.split('-');
            const neighborCellId = `cell_${neighborX}_${neighborY}`;
            const neighborCell = document.getElementById(neighborCellId);
            if (neighborCell) {
                neighborCell.style.backgroundColor = 'lightblue';
                previouslyHighlightedCellIds.push(neighborCellId);
            }
        });

        // Include diagonals in a different color
        const diagonalNeighbors = graph.getDiagonalNeighbors(x, y);
        diagonalNeighbors.forEach((diagonalNeighbor) => {
            const [diagonalX, diagonalY] = diagonalNeighbor.split('-');
            const diagonalNeighborCellId = `cell_${diagonalX}_${diagonalY}`;
            const diagonalNeighborCell = document.getElementById(diagonalNeighborCellId);
            if (diagonalNeighborCell) {
                diagonalNeighborCell.style.backgroundColor = 'lightgreen';
                previouslyHighlightedCellIds.push(diagonalNeighborCellId);
            }
        });

        // Store the IDs of the highlighted cells for removal
        previouslyHighlightedCellIds.push(currentCell);
    }

    function handleCellHover(cell, x, y) {
        if (hoveredCell !== cell) {
            // Clear previously highlighted neighbors
            previouslyHighlightedCellIds.forEach((prevCellId) => {
                const prevCell = document.getElementById(prevCellId);
                if (prevCell) {
                    prevCell.style.backgroundColor = '';
                }

                if (prevCell === startCell) {
                    hoveredCell.style.backgroundColor = 'gold';
                }

                if (prevCell === targetCell) {
                    hoveredCell.style.backgroundColor = 'deepskyblue';
                }

            });

            hoveredCell = cell;
            // Highlight neighbors when hovering
            highlightNeighbors(cell, x, y);
        }
    }

    function handleCellMouseLeave() {



        if (hoveredCell) {
            hoveredCell.style.backgroundColor = ''; // Clear the hovered cell's background color
        }



    }


    // Keep track of previously highlighted cells
    let highlightedCells = [];

    function visualizePath(path, source, target) {

        console.log("Visualizing path");

        // Define unique colors for the start and target cells
        const startColor = 'gold';
        const targetColor = 'deepskyblue';


        console.log(path);
        clearPreviouslyHighlightedCells();

        for (let i = 0; i < path.length - 1; i++) {
            const [currentX, currentY] = path[i].split('-');
            const [nextX, nextY] = path[i + 1].split('-');
            const currentCellId = `cell_${currentX}_${currentY}`;
            const nextCellId = `cell_${nextX}_${nextY}`;

            const currentCell = document.getElementById(currentCellId);
            const nextCell = document.getElementById(nextCellId);

            if (currentCell && nextCell) {
                currentCell.style.backgroundColor = 'red';
                nextCell.style.backgroundColor = 'red';

                // Keep track of highlighted cells
                highlightedCells.push(currentCell);
                highlightedCells.push(nextCell);
            }
        }
        // Highlight the start and target cells with the defined colors
        highlightCell(source, startColor);
        highlightCell(target, targetColor);
    }

    function clearPreviouslyHighlightedCells() {
        console.log("Clearing previously highlighted cells");

        highlightedCells.forEach((cell) => {
            cell.style.backgroundColor = '';
            cell.classList.remove('highlighted-cell');
        });

        // Clear the array of highlighted cells
        highlightedCells = [];
    }


    function visualizePathStep(node) {
        const [x, y] = node.split('-');
        const currentCellId = `cell_${x}_${y}`;

        // Highlight the current node being evaluated
        const currentNode = document.getElementById(currentCellId);
        if (currentNode) {
            console.log(`Visualizing step for node: ${node}`);
            currentNode.style.backgroundColor = 'orange';
            currentNode.classList.add('highlighted-cell');

            // Optionally add a delay here to make the animation visible
            setTimeout(() => {
                // Remove the highlight from the current node
                currentNode.style.backgroundColor = '';
                currentNode.classList.remove('highlighted-cell');
            }, 200); // Delay in milliseconds
        }
    }
    function visualizeAlgorithm(algorithmName, startCell, targetCell) {
        console.log(`Visualizing algorithm: ${algorithmName}`);

        const source = startCell.replace('cell_', '').replace('_', '-');
        const target = targetCell.replace('cell_', '').replace('_', '-');

        const path = graph.findPath(algorithmName, source, target);
        visualizePath(path, source, target);
    }






    function highlightCell(node, color) {
        const [x, y] = node.split('-');
        const currentCellId = `cell_${x}_${y}`;
        const currentCell = document.getElementById(currentCellId);

        if (currentCell) {
            currentCell.style.backgroundColor = color;
        }
    }




    function updateCell(cell, x, y) {
        // Remove the previous start or target class from the previous start or target cell
        const prevStartCell = document.querySelector('.start-cell');
        if (prevStartCell) {
            prevStartCell.classList.remove('start-cell');
        }

        const prevTargetCell = document.querySelector('.target-cell');
        if (prevTargetCell) {
            prevTargetCell.classList.remove('target-cell');
        }

        // Highlight the clicked cell with different colors based on the selection mode
        if (selectionMode === 'start') {
            startCell = cell.id;
            cell.classList.add('start-cell');
            selectionMode = 'target';
        } else if (selectionMode === 'target') {
            targetCell = cell.id;
            cell.classList.add('target-cell');
            selectionMode = 'start';
        }
    }


    // Add a mouseout event listener for the grid to clear the previously highlighted neighbors
    document.querySelector('.grid').addEventListener('mouseout', function () {
        clearPreviouslyHighlightedCells();
    });


    // Add event listeners for different pathfinding algorithms
    document.getElementById('visualizeAStarButton').addEventListener('click', () => {
        visualizeAlgorithm('aStar', startCell, targetCell);
    });
    document.getElementById('visualizeDijkstraButton').addEventListener('click', () => {
        visualizeAlgorithm('dijkstra', startCell, targetCell);
    });
    document.getElementById('visualizeDFSButton').addEventListener('click', () => {
        visualizeAlgorithm('dfs', startCell, targetCell);
    });


});
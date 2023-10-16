



class Graph {


    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.graph = {};
        this.initializeGrid();
        this.generateNeighbours();
    }

    generateRandomCharge = () => {
        return parseFloat((Math.random() * 2).toFixed(1));
    }

    initializeGrid = () => {

        // Populate the grid with random charge values
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.columns; j++) {
                this.grid[i][j] = this.generateRandomCharge();
            }
        }
    }

    generateNeighbours = () => {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const neighbors = this.getNeighbors(i, j);
                const currentCell = `${i}-${j}`;
                this.graph[currentCell] = neighbors;
            }
        }
    }

    getNeighbors = (i, j) => {
        const neighbors = [];
        if (i > 0) neighbors.push(`${i - 1}-${j}`);
        if (i < this.rows - 1) neighbors.push(`${i + 1}-${j}`);
        if (j > 0) neighbors.push(`${i}-${j - 1}`);
        if (j < this.columns - 1) neighbors.push(`${i}-${j + 1}`);
        return neighbors;
    }

    getDiagonalNeighbors = (i, j) => {
        const diagonalNeighbors = [];
        if (i > 0 && j > 0) diagonalNeighbors.push(`${i - 1}-${j - 1}`);
        if (i > 0 && j < this.columns - 1) diagonalNeighbors.push(`${i - 1}-${j + 1}`);
        if (i < this.rows - 1 && j > 0) diagonalNeighbors.push(`${i + 1}-${j - 1}`);
        if (i < this.rows - 1 && j < this.columns - 1) diagonalNeighbors.push(`${i + 1}-${j + 1}`);
        return diagonalNeighbors;
    }


    // Perform multi-tree BFS starting from multiple sources
    singleTreeBFS = (start, target, visualizePathCallback) => {
        console.log("Initializing single-tree BFS in Graph.js");
        this.performBFS(start, target, visualizePathCallback);
    }


    performBFS = (start, target, visualizePathCallback) => {
        const queue = [start];
        const visited = new Set();
        visited.add(start);

        while (queue.length > 0) {
            const current = queue.shift();
            this.exploreNeighbors(current, visited, queue, visualizePathCallback);
        }
    }

    exploreNeighbors = (current, visited, queue, visualizePathCallback) => {
        const neighbors = this.graph[current];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
                visited.add(neighbor);
                if (typeof visualizePathCallback === 'function') {

                    const [currentX, currentY] = current.split('-');
                    const [neighborX, neighborY] = neighbor.split('-');
                    const currentrCellId = `cell_${currentX}_${currentY}`;
                    const neighborrCellId = `cell_${neighborX}_${neighborY}`;
                    visualizePathCallback(currentrCellId, neighborrCellId);
                }
            }
        }
    }



    // ...

    bfs = (startNode, targetNode) => {
        const visited = new Set();
        const queue = [startNode];
        const cameFrom = {};

        while (queue.length > 0) {
            const currentNode = queue.shift();

            if (currentNode === targetNode) {
                // Reconstruct the path
                const path = [currentNode];
                let current = currentNode;
                while (current !== startNode) {
                    current = cameFrom[current];
                    path.unshift(current);
                }
                return path;
            }

            for (const neighbor of this.graph[currentNode]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    cameFrom[neighbor] = currentNode;
                    queue.push(neighbor);
                }
            }
        }

        return null; // Target node not found
    };

    dfs = (startNode, targetNode) => {
        const visited = new Set();
        const stack = [startNode];
        const cameFrom = {};

        while (stack.length > 0) {
            const currentNode = stack.pop();

            if (currentNode === targetNode) {
                // Reconstruct the path
                const path = [currentNode];
                let current = currentNode;
                while (current !== startNode) {
                    current = cameFrom[current];
                    path.unshift(current);
                }
                return path;
            }

            for (const neighbor of this.graph[currentNode]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    cameFrom[neighbor] = currentNode;
                    stack.push(neighbor);
                }
            }
        }

        return null; // Target node not found
    };

    dijkstra = (startNode, targetNode) => {
        const distances = {};
        const cameFrom = {};
        const unvisited = new Set(Object.keys(this.graph));
        distances[startNode] = 0;

        while (unvisited.size > 0) {
            const currentNode = this.getMinDistanceNode(unvisited, distances);

            if (currentNode === targetNode) {
                // Reconstruct the path
                const path = [currentNode];
                let current = currentNode;
                while (current !== startNode) {
                    current = cameFrom[current];
                    path.unshift(current);
                }
                return path;
            }

            unvisited.delete(currentNode);

            for (const neighbor of this.graph[currentNode]) {
                const distance = distances[currentNode] + 1; // Assuming unit weight for simplicity
                if (distance < distances[neighbor]) {
                    distances[neighbor] = distance;
                    cameFrom[neighbor] = currentNode;
                }
            }
        }

        return null; // Target node not found
    };

    aStar = (startNode, targetNode) => {
        const fDistance = {};
        const gDistance = {};
        const cameFrom = {};
        const openSet = new Set();
        const closedSet = new Set();

        fDistance[startNode] = manhattanDistance(startNode, targetNode);
        gDistance[startNode] = 0;
        cameFrom[startNode] = null;

        openSet.add(startNode);

        while (openSet.size > 0) {
            const currentNode = getMinFScoreNode(openSet, fDistance);

            if (currentNode === targetNode) {
                // Reconstruct the path
                const path = [currentNode];
                let current = currentNode;
                while (current !== startNode) {
                    current = cameFrom[current];
                    path.unshift(current);
                }
                return path;
            }

            openSet.delete(currentNode);
            closedSet.add(currentNode);

            for (const neighbor of this.graph[currentNode]) {
                if (closedSet.has(neighbor)) {
                    continue;
                }

                const tentativeG = gDistance[currentNode] + 1; // Assuming unit weight for simplicity

                if (!openSet.has(neighbor) || tentativeG < gDistance[neighbor]) {
                    cameFrom[neighbor] = currentNode;
                    gDistance[neighbor] = tentativeG;
                    fDistance[neighbor] =
                        gDistance[neighbor] + manhattanDistance(neighbor, targetNode);
                    openSet.add(neighbor);
                }
            }
        }

        return null; // Target node not found
    };






    // Add more pathfinding algorithms as needed

    findPath = (algorithm, start, target) => {
        switch (algorithm) {
            case 'aStar':
                return this.aStar(start, target);
            case 'dijkstra':
                return this.dijkstra(start, target);
            case 'dfs':
                return this.dfs(start, target);
            // Add cases for other algorithms
        }
    }





    getMinDistanceNode = (unvisited, distances) => {
        return Array.from(unvisited).reduce(
            (minNode, node) =>
                distances[node] < distances[minNode] ? node : minNode,
            Array.from(unvisited)[0]
        );
    }




}


const manhattanDistance = (node1, node2) => {
    // Get the coordinates of each node
    const [x1, y1] = node1.split('-').map(Number);
    const [x2, y2] = node2.split('-').map(Number);

    // Return the sum of the absolute differences
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}



// Create a graph to represent connections between neighboring cells








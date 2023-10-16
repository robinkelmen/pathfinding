// Heuristic function (Manhattan distance)
const heuristic = (node, target) => {
    const [x1, y1] = node.split('-').map(Number);
    const [x2, y2] = target.split('-').map(Number);
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Calculate the distance between two nodes (assuming they are neighbors)
const distance = (node1, node2) => {
    return 1; // Assuming each step has a cost of 1
}

const getMinFScoreNode = (openSet, fScore) => {
    return Array.from(openSet).reduce(
        (minNode, node) =>
            fScore[node] < fScore[minNode] ? node : minNode,
        Array.from(openSet)[0]
    );
}

// Reconstruct the path from the cameFrom data
const reconstructPath = (cameFrom, current) => {
    const path = [current];
    while (cameFrom[current]) {
        current = cameFrom[current];
        path.push(current);
    }
    return path.reverse();
}

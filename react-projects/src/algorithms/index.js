import dijkstra from "./dijkstra"
import astar from "./astar"
import biastar from "./biastar"
import bidijkstra from "./bidijkstra"

const funcMapping = {
    "dijkstra" : dijkstra,
    "astar": astar,
    "biastar": biastar,
    "bidijkstra": bidijkstra
}

export const algoNameMapping = {
    "none": "Choose an Algorithm",
    "dijkstra": "Dijkstra's Algorithm",
    "astar": "A* Search Algorithm",
    "biastar": "Bidirectional A* Search Algorithm",
    "bidijkstra" : "Bidirectional Dijkstra's Search Algorithm"
}

export default function getAlgorithm(algorithmName) {
    /*
    Algorithm parameters should be of the form (grid, startSquare, endSquare) where
    startSquare and endSquare should be [row, col] pairs 
    Algorithm returns should be of [visitSequence, shortestPath]
    */

    if (algorithmName === "none") {
        return (grid, startSquare, endSquare) => {return [[], []]}
    }
    else if (algorithmName in funcMapping) {
        return funcMapping[algorithmName];
    }
    else {
        console.log(`Unrecognized algorithm ${algorithmName}`)
    }
}


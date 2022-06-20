const euclideanDistance = (x1, x2, y1, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

const manhattanDistance = (x1, x2, y1, y2) => {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1) 
}

const heuristicMapping = {
    "euclidean" : euclideanDistance,
    "manhattan": manhattanDistance,
}

/**
 * Returns the heuristic function associated with the provided heuristic name
 *
 * @param {String} heuristicName The string name of the heuristic function
 * @return {function(x1, x2, y1, y2)} Function that calculates the heuristic between points (x1, y1) and (y1, y2).
 */
export default function getHeuristic(heuristicName) {
    if (heuristicName in heuristicMapping) {
        return heuristicMapping[heuristicName]
    }
    else {
        console.log(`Unrecognized heuristic ${heuristicName}`)
    }
}
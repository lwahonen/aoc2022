import {fetchInputData} from "./libraries.js"
import 'nerdamer/Algebra.js'
import 'nerdamer/Calculus.js'
import 'nerdamer/Solve.js'

const year = 2022
const day = 22

let file = ""

const isBrowser = () => typeof window !== `undefined`
const isNode = !isBrowser()

if (isNode) {
    file = fetchInputData(year, day)
} else {
    const sync_fetch = require('sync-fetch')
    file = sync_fetch(`data/day_${day}.txt`).text()
}


///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////


let input = file.split("\n\n")
let map = input[0].split("\n").map(g => g.split(""))

let part2 = false
console.log("Part 1: " + runInput())
part2 = true
console.log("Part 2: " + runInput())

function runInput() {
    let row = 0
    let col = map[0].indexOf(".")
    let facing = "R"
    let moves = input[1].trim()
    while (moves.length > 0) {
        let m = moves.match(/(\d+)([RL])/)
        if (m == null) {
            let last = parseInt(moves)
            for (let i = 0; i < last; i++) {
                let next = move(row, col, facing)
                row = next.row
                col = next.col
                facing = next.facing
                // console.log("Moved 1 position now " + row + ", " + col + " facing " + facing)
            }
            break
        }
        moves = moves.substring(m[0].length)
        let amount = parseInt(m[1])
        let dir = m[2]
        for (let i = 0; i < amount; i++) {
            let next = move(row, col, facing)
            row = next.row
            col = next.col
            facing = next.facing
            // console.log("Moved 1 position now " + row + ", " + col + " facing " + facing)
        }
        if (dir == "R") {
            facing = turnRight(facing)
        } else {
            facing = turnLeft(facing)
        }
        // console.log("Turned " + dir + " now facing " + facing)
    }
    let score = 0
    if (facing == "D") {
        score = 1
    }
    if (facing == "L") {
        score = 2
    }
    if (facing == "U") {
        score = 3
    }

    let number = score + (1000 * (1 + row) + (4 * (1 + col)));
    return number
}


function turnRight(dir) {
    if (dir == "U") {
        return "R";
    }
    if (dir == "R") {
        return "D";
    }
    if (dir == "D") {
        return "L";
    }
    if (dir == "L") {
        return "U";
    }
}

function turnLeft(dir) {
    if (dir == "U") {
        return "L";
    }
    if (dir == "L") {
        return "D";
    }
    if (dir == "D") {
        return "R";
    }
    if (dir == "R") {
        return "U";
    }
}

function getSide(row, col) {
    if (row >= 0 && row < 50 && col >= 50 && col < 100) {
        return "A"
    }
    if (row >= 0 && row < 50 && col >= 100 && col < 150) {
        return "B"
    }
    if (row >= 50 && row < 100 && col >= 50 && col < 100) {
        return "C"
    }
    if (row >= 100 && row < 150 && col >= 50 && col < 100) {
        return "D"
    }
    if (row >= 100 && row < 150 && col >= 0 && col < 50) {
        return "E"
    }
    if (row >= 150 && row < 200 && col >= 0 && col < 50) {
        return "F"
    }
}

function wrap(row, col, facing) {
    if (!part2) {
        return null;
    }
    let side = getSide(row, col);
    // A up <=> F left
    if (facing == "U" && side == "A" && row == 0) {
        return {row: col + 100, col: 0, facing: "R"}
    }
    if (facing == "L" && side == "F" && col == 0) {
        return {row: 0, col: row - 100, facing: "D"}
    }

    // A left <=> E left
    if (facing == "L" && side == "A" && col == 50) {
        return {row: 149 - row, col: 0, facing: "R"}
    }
    if (facing == "L" && side == "E" && col == 0) {
        return {row: -1 * (row - 149), col: 50, facing: "R"}
    }

    // C right <=> B down
    if (facing == "R" && side == "C" && col == 99) {
        return {row: 49, col: 50 + row, facing: "U"}
    }
    if (facing == "D" && side == "B" && row == 49) {
        return {row: col - 50, col: 99, facing: "L"}
    }

    // C left <=> E up
    if (facing == "L" && side == "C" && col == 50) {
        return {row: 100, col: row - 50, facing: "D"}
    }
    if (facing == "U" && side == "E" && row == 100) {
        return {row: col + 50, col: 50, facing: "R"}
    }

    // D right <=> B right
    if (facing == "R" && side == "D" && col == 99) {
        return {row: -1 * (row - 149), col: 149, facing: "L"}
    }
    if (facing == "R" && side == "B" && col == 149) {
        return {row: 149 - row, col: 99, facing: "L"}
    }


    // D down <=> F right
    if (facing == "D" && side == "D" && row == 149) {
        return {row: col + 100, col: 49, facing: "L"}
    }
    if (facing == "R" && side == "F" && col == 49) {
        return {row: 149, col: row - 100, facing: "U"}
    }

    // B up <=> F down
    if (facing == "U" && side == "B" && row == 0) {
        return {row: 199, col: col - 100, facing: "U"}
    }
    if (facing == "D" && side == "F" && row == 199) {
        return {row: 0, col: col + 100, facing: "D"}
    }
    return null;
}

function getMapElement(row, col) {
    if (row < 0) {
        return " "
    }
    if (row >= map.length) {
        return " "
    }
    if (col < 0) {
        return " "
    }
    if (col >= map[row].length) {
        return " "
    }
    return map[row][col];
}

function move(row, col, dir) {
    let pot = wrap(row, col, dir)
    if (pot != null) {
        let there = map[pot.row][pot.col];
        if (there == "#") {
            return {row: row, col: col, facing: dir}
        }
        return pot
    }
    if (dir == "U") {
        let mapElementElement = getMapElement(row - 1, col);
        if (mapElementElement === ".") {
            return {row: row - 1, col: col, facing: dir};
        }
        if (mapElementElement === "#") {
            return {row: row, col: col, facing: dir};
        }
        if (mapElementElement === " ") {
            let drop = row;
            while (getMapElement(drop + 1, col) != " ") {
                drop++
            }
            if (getMapElement(drop, col) == "#") {
                return {row: row, col: col, facing: dir};
            }

            return {row: drop, col: col, facing: dir};
        }
    }
    if (dir == "L") {
        let mapElementElement = getMapElement(row, col - 1);
        if (mapElementElement === ".") {
            return {row: row, col: col - 1, facing: dir};
        }
        if (mapElementElement === "#") {
            return {row: row, col: col, facing: dir};
        }
        if (mapElementElement === " ") {
            let drop = col;
            while (getMapElement(row, drop + 1) != " ") {
                drop++
            }
            if (getMapElement(row, drop) == "#") {
                return {row: row, col: col, facing: dir};
            }

            return {row: row, col: drop, facing: dir};
        }
    }
    if (dir == "D") {
        let mapElementElement = getMapElement(row + 1, col);
        if (mapElementElement === ".") {
            return {row: row + 1, col: col, facing: dir};
        }
        if (mapElementElement === "#") {
            return {row: row, col: col, facing: dir};
        }
        if (mapElementElement === " ") {
            let drop = row;
            while (getMapElement(drop - 1, col) != " ") {
                drop--
            }
            if (getMapElement(drop, col) == "#") {
                return {row: row, col: col, facing: dir};
            }

            return {row: drop, col: col, facing: dir};
        }
    }
    if (dir == "R") {
        let mapElementElement = getMapElement(row, col + 1);
        if (mapElementElement === ".") {
            return {row: row, col: col + 1, facing: dir};
        }
        if (mapElementElement === "#") {
            return {row: row, col: col, facing: dir};
        }
        if (mapElementElement === " ") {
            let drop = col;
            while (getMapElement(row, drop - 1) != " ") {
                drop--
            }
            if (getMapElement(row, drop) == "#") {
                return {row: row, col: col, facing: dir};
            }
            return {row: row, col: drop, facing: dir};
        }
    }
}

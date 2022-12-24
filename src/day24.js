import {fetchInputData} from "./libraries.js"
import 'nerdamer/Algebra.js'
import 'nerdamer/Calculus.js'
import 'nerdamer/Solve.js'

const year = 2022
const day = 24

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
// file = `
// #.######
// #>>.<^<#
// #.<..<<#
// #>v.><>#
// #<^v^^>#
// ######.#
// `

let map = file.trim().split("\n").map(d => d.split(""))

let blizzards = {}
let start
let goal

function getKey(row, col) {
    return `${row},${col}`
}

let b = {}
for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] == "^") {
            b[getKey(row, col)] = [{row: row, col: col, dir: 0}]
        }
        if (map[row][col] == "v") {
            b[getKey(row, col)] = [{row: row, col: col, dir: 1}]
        }
        if (map[row][col] == "<") {
            b[getKey(row, col)] = [{row: row, col: col, dir: 2}]
        }
        if (map[row][col] == ">") {
            b[getKey(row, col)] = [{row: row, col: col, dir: 3}]
        }
        if (row == 0 && map[row][col] == ".") {
            start = {row: row, col: col}
        }
        if (row == map.length - 1 && map[row][col] == ".") {
            goal = {row: row, col: col}
        }
    }
}

let oneTrip = Math.abs(start.row - goal.row) + Math.abs(start.col - goal.col)

blizzards[0] = b

function trymove(move, r, c) {
    let newrow = move.row + r;
    let newcol = move.col + c;
    if (newrow == 0 && newcol != start.col) {
        return
    }
    if (newrow < 0)
        return;
    if (newcol == 0) {
        return
    }
    if (newrow == map.length - 1 && newcol != goal.col) {
        return
    }
    if (newrow > map.length - 1) {
        return
    }
    if (newcol == map[0].length - 1) {
        return
    }

    let b = getBlizzards(move.round + 1)
    if (!b.hasOwnProperty(getKey(newrow, newcol))) {
        let items = {row: newrow, col: newcol, round: move.round + 1, trips: move.trips, goal: move.goal};
        let k = JSON.stringify(items);
        if (!seen.hasOwnProperty(k)) {
            // console.log("Potential move " + k)
            potential.push(items)
            seen[k] = true
        }
    }
}

function remainingDist(a) {
    let arowd = Math.abs(a.row - a.goal.row)
    let acold = Math.abs(a.col - a.goal.col)
    return acold + arowd + a.trips * oneTrip
}

let considered=0
let potential = [{row: start.row, col: start.col, round: 0, goal:goal, trips:1}]
let seen={}
findPath()
potential = [{row: start.row, col: start.col, round: 0, goal:goal, trips:3}]
seen={}
findPath()

function findPath() {
    while (potential.length > 0) {
        potential = potential.sort((a, b) => {
            let atot = remainingDist(a) + a.round
            let btot = remainingDist(b) + b.round
            return atot - btot
        })
        let move = potential.shift()
        considered++
        if (move.col == move.goal.col && move.row == move.goal.row) {
            if (move.trips == 1) {
                console.log("Found shortest trip " + move.round + " after considering " + considered + " different paths")
                break
            } else {
                move.trips--
                if (move.trips == 2) {
                    move.goal = start
                } else
                    move.goal = goal
            }
        }
        trymove(move, -1, 0);
        trymove(move, +1, 0);
        trymove(move, 0, -1);
        trymove(move, 0, +1);
        trymove(move, 0, 0);
    }
}

function getBlizzards(round) {
    if (blizzards.hasOwnProperty(round)) {
        return blizzards[round]
    }
    let newblizzards = {}
    let lastRound = getBlizzards(round - 1);
    for (const blizzardstack of Object.values(lastRound)) {
        for (const blizzard of blizzardstack) {
            let m = moveBlizzard(blizzard.dir, blizzard.row, blizzard.col)
            let key = getKey(m.row, m.col);
            if (!newblizzards.hasOwnProperty(key)) {
                newblizzards[key] = []
            }
            newblizzards[key].push({row: m.row, col: m.col, dir: blizzard.dir})
        }
        blizzards[round] = newblizzards
    }
    return newblizzards
}

function toChar(c) {
    if (c == 0) {
        return "^"
    }
    if (c == 1) {
        return "v"
    }
    if (c == 2) {
        return "<"
    }
    if (c == 3) {
        return ">"
    }
    console.log()
}

function print(noprint, b) {
    let ret = ""
    if (!noprint) {
        console.log("\n")
    }
    for (let row = 0; row < map.length; row++) {
        let output = ""
        for (let col = 0; col < map[row].length; col++) {
            let key = getKey(row, col);
            if (b.hasOwnProperty(key)) {
                let len = b[key].length;
                if (len > 1) {
                    output += len
                } else {
                    output += toChar(b[key][0].dir)
                }
            } else {
                if ((row == 0 && col != start.col) || (row == map.length - 1 && col != goal.col) || col == 0 || col == map[row].length - 1) {
                    output += "#"
                } else {
                    output += "."
                }
            }
        }
        if (!noprint) {
            console.log(output)
        }
        ret += output + "\n"
    }
    return ret
}


function moveBlizzard(direction, row, col) {
    if (direction == 0) {
        if (row == 1) {
            return {row: map.length - 2, col: col}
        }
        return {row: row - 1, col: col}
    }
    // South
    if (direction == 1) {
        if (row == map.length - 2) {
            return {row: 1, col: col}
        }
        return {row: row + 1, col: col}
    }
    // West
    if (direction == 2) {
        if (col == 1) {
            return {row: row, col: map[row].length - 2}
        }
        return {row: row, col: col - 1}
    }

    // East
    if (direction == 3) {
        if (col == map[row].length - 2) {
            return {row: row, col: 1}
        }
        return {row: row, col: col + 1}
    }
}
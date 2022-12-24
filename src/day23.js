import {fetchInputData} from "./libraries.js"
import 'nerdamer/Algebra.js'
import 'nerdamer/Calculus.js'
import 'nerdamer/Solve.js'

const year = 2022
const day = 23

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
// file=`
// ....#..
// ..###.#
// #...#.#
// .#...##
// #.###..
// ##.#.##
// .#..#..
// `

let map = file.trim().split("\n").map(d => d.split(""))

let elves = {}

function getKey(row, col) {
    return `${row},${col}`
}

for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] == "#") {
            elves[getKey(row, col)] = {row: row, col: col}
        }
    }
}

function print(noprint) {
    let min_col = 9999
    let max_col = 0
    let min_row = 9999
    let max_row = 0
    for (const elf of Object.values(elves)) {
        max_col = Math.max(elf.col, max_col);
        max_row = Math.max(elf.row, max_row);
        min_col = Math.min(elf.col, min_col);
        min_row = Math.min(elf.row, min_row);
    }
    let ret = ""
    if (!noprint) {
        console.log("\n")
    }
    for (let row = min_row; row <= max_row; row++) {
        let output = ""
        for (let col = min_col; col <= max_col; col++) {
            if (elves.hasOwnProperty(getKey(row, col))) {
                output += "#"
            } else {
                output += "."
            }
        }
        if (!noprint) {
            console.log(output)
        }
        ret += output + "\n"
    }
    return ret
}

let dirmod = 0
let proposals={}
let max=0

for (max = 0; max < 9999999; max++) {
    if (max == 10) {
        let part1 = print(true)

        let r = part1.replaceAll('.', '');
        let ans = part1.length - r.length;
        console.log("Part 1 " + ans)
    }
    if (!round())
        break
}
console.log("Part 2 "+(max+1))

function round() {
    let moved = false;
    for (const elf of Object.values(elves)) {
        if (!hasNeighbors(elf.row, elf.col)) {
            continue
        }
        for (let i = 0; i < 4; i++) {
            let m = testMove(dirmod + i, elf.row, elf.col)
            if (m == null) {
                continue
            }
            let key = getKey(m.row, m.col);
            if (proposals.hasOwnProperty(key)) {
                proposals[key].valid = false
            } else {
                proposals[key] = {elf: elf, row: m.row, col: m.col, valid: true}
            }
            break
        }
    }
    for (let prop of Object.values(proposals)) {
        if (prop.valid == false)
            continue
        let e = prop.elf
        delete elves[getKey(e.row, e.col)]
        e.row = prop.row
        e.col = prop.col
        elves[getKey(e.row, e.col)] = e
        moved = true
    }
    dirmod++
    dirmod %= 4
    proposals = {}
    return moved
}

function hasNeighbors(row, col) {
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r == row && c == col) {
                continue
            }
            if (elves.hasOwnProperty(getKey(r, c))) {
                return true
            }
        }
    }
    return false
}

function testMove(direction, row, col) {
    direction=direction % 4
    // North
    if (direction == 0) {
        if (elves.hasOwnProperty(getKey(row - 1, col - 1))) {
            return null
        }
        if (elves.hasOwnProperty(getKey(row - 1, col))) {
            return null
        }
        if (elves.hasOwnProperty(getKey(row - 1, col + 1))) {
            return null
        }
        return {row: row - 1, col: col}
    }
    // South
    if (direction == 1) {
        if (elves.hasOwnProperty(getKey(row + 1, col - 1))) {
            return null
        }
        if (elves.hasOwnProperty(getKey(row + 1, col))) {
            return null
        }
        if (elves.hasOwnProperty(getKey(row + 1, col + 1))) {
            return null
        }
        return {row: row + 1, col: col}
    }
    // West
    if (direction == 2) {
        if (elves.hasOwnProperty(getKey(row - 1, col - 1))) {
            return null
        }
        if (elves.hasOwnProperty(getKey(row, col - 1))) {
            return null
        }
        if (elves.hasOwnProperty(getKey(row + 1, col - 1))) {
            return null
        }
        return {row: row, col: col - 1}
    }

    // East
    if (direction == 3) {
        if (elves.hasOwnProperty(getKey(row - 1, col + 1))) {
            return null
        }
        if (elves.hasOwnProperty(getKey(row, col + 1))) {
            return null
        }
        if (elves.hasOwnProperty(getKey(row + 1, col + 1))) {
            return null
        }
        return {row: row, col: col + 1}
    }
}
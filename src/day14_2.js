import {fetchInputData} from "./libraries.js"

const year = 2022
const day = 14

let file = ""

const isBrowser = () => typeof window !== `undefined`
const isNode = !isBrowser()

if (isNode) {
    file = fetchInputData(year, day)
} else {
    const sync_fetch = require('sync-fetch')
    file = sync_fetch(`data/day_${day}.txt`).text()
}

function getKey(row, col) {
    return "" + row + "," + col
}


///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let min_col = 9999999999
let max_col = 0
let min_row = 9999999999
let max_row = 0

let input = file.trim().split("\n").map(f => {
        return f.split("->").map(g => g.split(",").map(s => parseInt(s)))
    }
)

let rocks = {}

for (const row of input) {
    for (const rowElement of row) {
        let x = rowElement[0];
        let y = rowElement[1];
        min_col = Math.min(x, min_col)
        max_col = Math.max(x, max_col)
        min_row = Math.min(y, min_row)
        max_row = Math.max(y, max_row)
    }
}

for (const row of input) {
    while (true) {
        let start = row.shift()
        if (row.length == 0)
            break
        let end = row[0]
        let start_x = Math.min(start[0], end[0])
        let end_x = Math.max(start[0], end[0])

        let start_y = Math.min(start[1], end[1])
        let end_y = Math.max(start[1], end[1])

        for (let row = start_y; row <= end_y; row++) {
            for (let col = start_x; col <= end_x; col++) {
                rocks[getKey(row, col)] = "#"
            }
        }
    }
}

function getmap(row, col) {
    let key = getKey(row, col);
    if(row == max_row +2)
        return "#"
    if (rocks.hasOwnProperty(key))
        return rocks[key]
    else
        return "."
}

function print() {
    console.log("\n\n")
    for (let row = min_row - 1; row < max_row + 4; row++) {
        let output = ""
        for (let col = min_col - 1; col < max_col + 1; col++) {
            output += getmap(row, col)
        }
        console.log(output)
    }
}

function dropSand() {
    let sand_row = 0
    let sand_col = 500
    while (true) {
        if (getmap(sand_row + 1, sand_col) == ".") {
            sand_row++
            continue
        }
        if (getmap(sand_row + 1, sand_col - 1) == ".") {
            sand_row++
            sand_col--
            min_col = Math.min(sand_col, min_col)
            continue
        }
        if (getmap(sand_row + 1, sand_col + 1) == ".") {
            sand_row++
            sand_col++
            max_col = Math.max(max_col, sand_col)
            continue
        }
        if (sand_row == 0 && sand_col == 500)
            return false

        rocks[getKey(sand_row, sand_col)] = "o"
        min_row = Math.min(sand_row, min_row)
        return true
    }
}

while (    dropSand()){
    // print()
}

// print()
let c=0
for (const value of Object.values(rocks)) {
    if(value == "o")
    c++
}
console.log(c+1)
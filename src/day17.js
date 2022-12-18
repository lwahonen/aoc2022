import {fetchInputData, keyCount} from "./libraries.js"

const year = 2022
const day = 17

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

// file = ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>"
let input = file.trim().split("")

function col_blocked(rock_col, rock_row) {
    if (rock_col < 0 || rock_col > 6) return true
    if (rock_row < 0) return true
    let c = peaks[rock_col]
    return c.includes(rock_row)
}

function print(range) {
    let maxrow = 0
    let minrow = 1

    let ret = ""

    for (let i = 0; i < peaks.length; i++) {
        maxrow = Math.max(maxrow, ...peaks[i])
        minrow = Math.min(minrow, ...peaks[i])
    }
    if (range != 0)
        if (minrow < maxrow - range)
            minrow = maxrow - range

    for (let row = maxrow + 3; row >= minrow; row--) {
        let output = ""
        for (let col = 0; col < 7; col++) {
            if (col_blocked(col, row)) {
                output += "#"
            } else {
                output += "."
            }
        }
        ret += output + "\n"
    }
    return ret
}

let peaks;

let hashes = {}

function hash(inputIndex, rocktype, peaks) {
    let hashpeaks = print(20)
    // console.log("Top of the tower is "+hashpeaks)
    return "index " + inputIndex + " rock " + rocktype + " top " + hashpeaks
}

let additionalAnswer = 0

function runPart(rounds) {
    peaks = Array(7)
    for (let col = 0; col < 7; col++) {
        peaks[col] = []
    }
    let inputIndex = -1;
    let rocktype = -1
    for (let i = 0; i < rounds; i++) {
        let key = hash(inputIndex, rocktype, peaks);
        if (rounds > 2500) {
            if (hashes.hasOwnProperty(key)) {
                let previous = hashes[key];
                let cycleLen = i - previous.round
                console.log("I have already seen this tower top on round " + JSON.stringify(previous))
                console.log("Cycle len is " + cycleLen)
                let cycleSize = get_answer() - previous.height
                while (i + cycleLen < rounds) {
                    i += cycleLen
                    additionalAnswer += cycleSize
                }
                hashes={}
            } else {
                hashes[key] = {round: i, height: get_answer()}
            }
        }
        let rock_col = 2
        let rock_row = get_answer() + 3
        rocktype += 1
        rocktype %= 5
        let stopped = false
        while (!stopped) {
            inputIndex++
            inputIndex %= input.length
            if (rocktype == 0) {
                let left_blocked = col_blocked(rock_col - 1, rock_row);
                let right_blocked = col_blocked(rock_col + 4, rock_row);
                if (input[inputIndex] == ">" && !right_blocked) {
                    rock_col++
                }
                if (input[inputIndex] == "<" && !left_blocked) {
                    rock_col--
                }
                for (let i = 0; i < 4 && !stopped; i++) {
                    if (col_blocked(rock_col + i, rock_row - 1)) {
                        stopped = true
                    }
                }
                if (!stopped) {
                    rock_row--
                } else {
                    // console.log("Block " + i + " stopped on row " + rock_row)
                    for (let j = 0; j < 4; j++) {
                        let peak = peaks[rock_col + j];
                        peak.push(rock_row)
                    }
                }
            }
            if (rocktype == 1) {
                let left_blocked1 = col_blocked(rock_col, rock_row + 2);
                let left_blocked2 = col_blocked(rock_col - 1, rock_row + 1);
                let left_blocked3 = col_blocked(rock_col, rock_row);
                let left_blocked = left_blocked1 || left_blocked2 || left_blocked3

                let right_blocked3 = col_blocked(rock_col + 2, rock_row);
                let right_blocked2 = col_blocked(rock_col + 3, rock_row + 1);
                let right_blocked1 = col_blocked(rock_col + 2, rock_row + 2);
                let right_blocked = right_blocked1 || right_blocked2 || right_blocked3
                if (input[inputIndex] == ">" && !right_blocked) {
                    rock_col++
                }
                if (input[inputIndex] == "<" && !left_blocked) {
                    rock_col--
                }
                if (col_blocked(rock_col, rock_row)) {
                    stopped = true
                }
                if (col_blocked(rock_col + 1, rock_row - 1)) {
                    stopped = true
                }
                if (col_blocked(rock_col + 2, rock_row)) {
                    stopped = true
                }


                if (!stopped) {
                    rock_row--
                } else {
                    // console.log("Block " + i + " stopped on row " + rock_row)
                    peaks[rock_col].push(rock_row + 1)
                    peaks[rock_col + 1].push(rock_row)
                    peaks[rock_col + 1].push(rock_row + 1)
                    peaks[rock_col + 1].push(rock_row + 2)
                    peaks[rock_col + 2].push(rock_row + 1)
                }
            }
            if (rocktype == 2) {
                let left_blocked1 = col_blocked(rock_col + 1, rock_row + 2);
                let left_blocked2 = col_blocked(rock_col + 1, rock_row + 1);
                let left_blocked3 = col_blocked(rock_col - 1, rock_row);
                let left_blocked = left_blocked1 || left_blocked2 || left_blocked3

                let right_blocked1 = col_blocked(rock_col + 3, rock_row + 2);
                let right_blocked2 = col_blocked(rock_col + 3, rock_row + 1);
                let right_blocked3 = col_blocked(rock_col + 3, rock_row);
                let right_blocked = right_blocked1 || right_blocked2 || right_blocked3
                if (input[inputIndex] == ">" && !right_blocked) {
                    rock_col++
                }
                if (input[inputIndex] == "<" && !left_blocked) {
                    rock_col--
                }
                for (let i = 0; i < 3 && !stopped; i++) {
                    if (col_blocked(rock_col + i, rock_row - 1)) {
                        stopped = true
                    }
                }
                if (!stopped) {
                    rock_row--
                } else {
                    // console.log("Block " + i + " stopped on row " + rock_row)
                    for (let j = 0; j < 3; j++) {
                        let peak = peaks[rock_col + j];
                        peak.push(rock_row)
                    }
                    peaks[rock_col + 2].push(rock_row + 1)
                    peaks[rock_col + 2].push(rock_row + 2)
                }
            }
            if (rocktype == 3) {
                let left_blocked = false
                for (let j = 0; j < 4; j++) {
                    if (col_blocked(rock_col - 1, rock_row + j)) {
                        left_blocked = true
                        break
                    }
                }
                let right_blocked = false
                for (let j = 0; j < 4; j++) {
                    if (col_blocked(rock_col + 1, rock_row + j)) {
                        right_blocked = true
                        break
                    }
                }
                if (input[inputIndex] == ">" && !right_blocked) {
                    rock_col++
                }
                if (input[inputIndex] == "<" && !left_blocked) {
                    rock_col--
                }
                if (col_blocked(rock_col, rock_row - 1)) {
                    stopped = true
                }
                if (!stopped) {
                    rock_row--
                } else {
                    // console.log("Block " + i + " stopped on row " + rock_row)
                    for (let j = 0; j < 4; j++) {
                        let peak = peaks[rock_col];
                        peak.push(rock_row + j)
                    }
                }
            }
            if (rocktype == 4) {
                let left_blocked1 = col_blocked(rock_col - 1, rock_row + 1);
                let left_blocked2 = col_blocked(rock_col - 1, rock_row);
                let left_blocked = left_blocked1 || left_blocked2

                let right_blocked1 = col_blocked(rock_col + 2, rock_row + 1);
                let right_blocked2 = col_blocked(rock_col + 2, rock_row);
                let right_blocked = right_blocked1 || right_blocked2
                if (input[inputIndex] == ">" && !right_blocked) {
                    rock_col++
                }
                if (input[inputIndex] == "<" && !left_blocked) {
                    rock_col--
                }
                if (col_blocked(rock_col, rock_row - 1)) {
                    stopped = true
                }
                if (col_blocked(rock_col + 1, rock_row - 1)) {
                    stopped = true
                }
                if (!stopped) {
                    rock_row--
                } else {
                    // console.log("Block " + i + " stopped on row " + rock_row)
                    peaks[rock_col].push(rock_row)
                    peaks[rock_col].push(rock_row + 1)
                    peaks[rock_col + 1].push(rock_row)
                    peaks[rock_col + 1].push(rock_row + 1)
                }
            }


        }
    }
}

function get_answer() {
    let rock_row = -1
    for (let i = 0; i < peaks.length; i++) {
        rock_row = Math.max(rock_row, ...peaks[i])
    }
    let answer = rock_row + 1;
    return answer;
}

// print()
runPart(2022)
let answer = get_answer();
console.log("Part 1 " + answer)

runPart(1000000000000)
answer = get_answer();
console.log("Part 2 " + (answer + additionalAnswer))
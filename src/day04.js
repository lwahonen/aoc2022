import {fetchInputData} from "./libraries.js"

const year = 2022
const day = 4

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
//

let input = file.trim().split("\n").map(d => d.split(",").map(f => f.split("-").map(g => parseInt(g))))


let part1 = 0
let part2 = 0
for (const row of input) {
    if ((row[0][0] >= row[1][0] && row[0][1] <= row[1][1]) || (row[1][0] >= row[0][0] && row[1][1] <= row[0][1])) {
        part1++
    } else if ((row[0][0] < row[1][0] && row[0][1] < row[1][0]) || (row[0][0] > row[1][1] && row[0][1] > row[1][1])) {
        continue
    }
    part2++
}
console.log("Part 1 " + part1 + " part 2 " + part2)
import {fetchInputData, keyCount} from "./libraries.js"

const year = 2022
const day = 15

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

let id=0
let input = file.trim().split("\n").map(f => {
        let res = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/.exec(f)
        let blob= {x: parseInt(res[1]), y: parseInt(res[2]), closest_x: parseInt(res[3]), closest_y: parseInt(res[4]), id:id++}
        blob.range = manhattan(blob.x, blob.y, blob.closest_x, blob.closest_y)
        return blob
    }
)

function manhattan(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

// Part 1
let selected_y=2000000
let covered = {}
for (let blob of input) {
    let rowsToCount = blob.range - Math.abs(selected_y - blob.y)
    if (rowsToCount <= 0)
        continue
    for (let x = 0; x <= rowsToCount; x++) {
        covered[blob.x + x] = true
        covered[blob.x - x] = true
    }
}

let beacons={}
for (let blob of input) {
    if (blob.closest_y == selected_y)
        beacons[blob.closest_x] = true
}

console.log("Part 1 "+(keyCount(covered)-keyCount(beacons)))

// Part 2
let max_coord=4000000

for (let y = 0; y <= 4000000; y++) {
    let ranges = []
    for (let blob of input) {
        let rowsToCount = blob.range - Math.abs(y - blob.y)
        if (rowsToCount <= 0)
            continue
        let width = rowsToCount;
        ranges.push([blob.x - width, blob.x + width])
    }
    ranges = ranges.sort((a, b) => a[0] - b[0])
    let x = 0;
    for (let range of ranges) {
        if (x >= range[0] && x <= range[1])
            x = range[1] + 1
    }
    if (x < 4000000) {
        console.log("Found the spot at " + x + " part 2 is " + (x * 4000000 + y))
        break
    }
}
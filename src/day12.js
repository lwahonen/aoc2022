import {fetchInputData} from "./libraries.js"

const year = 2022
const day = 12

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
let coords = {}

let starts = [];
let start;
let end;

let map = file.trim().split("\n").map(f => f.split(""))

for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
        coords[getKey(row, col)] = [row, col]
        let c = map[row][col];
        if (c == "S") {
            let s = {coords: getKey(row, col), cost: 0, letter: "S", path: "START"};
            starts.push(s)
            start = s
            map[row][col] = "a"
        }
        if (c == "a") {
            starts.push({coords: getKey(row, col), cost: 0, letter: "S", path: "START"})
        }

        if (c == "E") {
            end = {coords: getKey(row, col), letter: "E", path: "END", cost: 0}
            map[row][col] = "z"
        }
    }
}

function testLetters(here, letter) {
    let nElement = letter.charCodeAt(0)
    let HElement = here.charCodeAt(0)
    let stepSize = HElement - nElement;
    return stepSize >= -1;
}

function getNeighbours(pos) {
    let row = pos[0]
    let col = pos[1]
    let n = []
    let here = map[row][col];
    if (row > 0) {
        let r = row - 1
        let c = col
        let letter = map[r][c];
        if (testLetters(here, letter)) n.push([r, c])
    }
    if (row < map.length - 1) {
        let r = row + 1
        let c = col
        let letter = map[r][c];
        if (testLetters(here, letter)) n.push([r, c])
    }
    if (col > 0) {
        let r = row
        let c = col - 1
        let letter = map[r][c];
        if (testLetters(here, letter)) n.push([r, c])
    }
    if (col < map[0].length - 1) {
        let r = row
        let c = col + 1
        let letter = map[r][c];
        if (testLetters(here, letter)) n.push([r, c])
    }
    return n
}

console.log("Part 1 " + findPath(start))

let min = 999999
while (starts.length > 0)
    min = Math.min(findPath(starts.shift()), min)
console.log("Part 2 " + min)

function findPath(points) {
    let costs = {}
    let seen = {}
    let potential = [points]
    while (potential.length > 0) {
        potential = potential.sort(function (a, b) {
            return a.cost - b.cost;
        });
        let here = potential.shift()
        seen[here.coords] = here
        if (here.coords == end.coords) {
            // console.log("Reached the end at " + (here.cost))
            return here.cost
        }
        let coord = coords[here.coords];
        let neighbours = getNeighbours(coord);
        for (const nElement of neighbours) {
            let key = getKey(nElement[0], nElement[1]);
            if (!seen.hasOwnProperty(key)) {
                let l = map[nElement[0]][nElement[1]];
                let cost = here.cost + 1;
                if (!costs.hasOwnProperty(key) || costs[key] > cost) {
                    potential.push({
                        coords: key,
                        cost: cost,
                        letter: l,
                        path: here.path + " -> (" + l + ") " + key
                    })
                    costs[key] = cost
                }
            }
        }
    }
    return 9999999
}
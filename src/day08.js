import {columns, fetchInputData, keyCount} from "./libraries.js"

const year = 2022
const day = 8

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
// 30373
// 25512
// 65332
// 33549
// 35390
// `

let map = file.trim().split("\n").map(f => f.split("").map(g => parseInt(g)))

let seen = {}

function getKey(row, col) {
    return "" + row + "," + col
}

// Left visible
let maxcol = map[0].length;
for (let row = 1; row < maxcol - 1; row++) {
    for (let col = 1; col < maxcol - 1; col++) {
        let visible = true
        for (let i = 0; i < col; i++) {
            if (map[row][i] >= map[row][col]) {
                visible = false
                break
            }
        }
        if (visible) {
            console.log("Visible from left " + map[row][col] + " at " + row + ", " + col)
            seen[getKey(row, col)] = map[row][col]
        }
    }
}

// Right visible
for (let row = 1; row < maxcol - 1; row++) {
    for (let col = maxcol - 2; col >= 1; col--) {
        let visible = true
        for (let i = col+1; i < maxcol; i++) {
            if (map[row][i] >= map[row][col]) {
                visible = false
                break
            }
        }
        if (visible) {
            console.log("Visible from right " + map[row][col] + " at " + row + ", " + col)
            seen[getKey(row, col)] = map[row][col]
        }
    }
}

// Top visible
for (let col = 1; col < maxcol - 1; col++) {
    for (let row = 1; row < map.length - 1; row++) {
        let visible = true
        for (let i = 0; i < row; i++) {
            if (map[i][col] >= map[row][col]) {
                visible = false
                break
            }
        }
        if (visible) {
            console.log("Visible from top " + map[row][col] + " at " + row + ", " + col)
            seen[getKey(row, col)] = map[row][col]
        }
    }
}

// Bottom visible
for (let col = 1; col < maxcol - 1; col++) {
    for (let row = maxcol - 2; row >= 1; row--) {
        let visible = true
        for (let i = row+1; i < maxcol; i++) {
            if (map[i][col] >= map[row][col]) {
                visible = false
                break
            }
        }
        if (visible) {
            console.log("Visible from bottom " + map[row][col] + " at " + row + ", " + col)
            seen[getKey(row, col)] = map[row][col]
        }
    }
}


for (let col = 0; col < maxcol; col++) {
    seen[getKey(0, col)] = map[0][col]
    seen[getKey(maxcol - 1, col)] = map[maxcol - 1][col]
}

for (let row = 0; row < maxcol; row++) {
    seen[getKey(row, 0)] = map[row][0]
    seen[getKey(row, maxcol - 1)] = map[row][maxcol - 1]
}

console.log(keyCount(seen))

let score=0
for (const key of Object.keys(seen)) {
    let r=parseInt(key.split(",")[0])
    let c=parseInt(key.split(",")[1])
    score=Math.max(score, getScore(r,c))
}

console.log(score)

function getScore(row, col) {
    let top = 0;
    let tree = map[row][col];
    for (let r = row-1; r >= 0; r--) {
        let here = map[r][col];
        if (here >= tree) {
            top++
            break
        }
        else
            top++
    }
    let down = 0;
    for (let r = row+1; r < maxcol; r++) {
        let here = map[r][col];
        if (here >= tree) {
            down++
            break
        }
        else
            down++
    }


    let left=0
    for (let c = col-1; c >= 0; c--) {
        let here = map[row][c];
        if (here >= tree) {
            left++
            break
        }
        else
            left++
    }
    let right = 0;
    for (let c = col+1; c < maxcol; c++) {
        let here = map[row][c];
        if (here >= tree) {
            right++
            break
        }
        else
            right++
    }
    return top*down*left*right
}
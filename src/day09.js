import {columns, fetchInputData, keyCount} from "./libraries.js"

const year = 2022
const day = 9

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
// //
// file = `
// R 5
// U 8
// L 8
// D 3
// R 17
// D 10
// L 25
// U 20
// `

function print() {
    console.log("\n\n\n")
    for (let row = -10; row < 10; row++) {
        let output = ""
        for (let col = -10; col < 10; col++) {
            let c = "."
            if(col == 0 && row == 0)
                c="s"
            for (let i = 0; i < rope.length; i++) {
                if (rope[i][0] == row && rope[i][1] == col)
                    c = i
            }
            output+=c
        }
        console.log(output)
    }
}

let input = file.trim().split("\n").map(f => f.split(" "))

let seen = {}
let rope=[]
for (let i = 0; i < 2; i++) {
    rope[i]=[0,0]
}

runRope()
let score = keyCount(seen);
console.log("Part 1 "+ score)

seen = {}
rope=[]
for (let i = 0; i < 10; i++) {
    rope[i]=[0,0]
}
runRope()
console.log("Par 2 "+keyCount(seen))


seen[getKey(0, 0)] = true

function getFollowerPosition(leadrow , leadcol , followrow , followcol) {
    let rowDiff = Math.abs(leadrow - followrow);
    let colDiff = Math.abs(leadcol - followcol);
    if (rowDiff + colDiff > 2) {
        if (leadcol > followcol) {
            followcol++
        } else {
            followcol--
        }
        if (leadrow != followrow) {
            if (leadrow > followrow) {
                followrow++
            } else {
                followrow--
            }
        }
    } else {
        if (rowDiff > 1) {
            if (leadrow > followrow) {
                followrow++
            } else {
                followrow--
            }
        }
        if (colDiff > 1) {
            if (leadcol > followcol) {
                followcol++
            } else {
                followcol--
            }
        }
    }
    return {row:followrow, col:followcol}
}

function runRope() {
    for (const r of input) {
        // print()

        let c = r[0]
        let amount = parseInt(r[1])
        let newr = rope[0][0]
        let newc = rope[0][1]
        for (let i = 0; i < amount; i++) {
            if (c == "U") {
                newr--
            }
            if (c == "D") {
                newr++
            }
            if (c == "L") {
                newc--
            }
            if (c == "R") {
                newc++
            }
            rope[0][0] = newr
            rope[0][1] = newc
            for (let j = 1; j < rope.length; j++) {
                let prev = rope[j - 1];
                let here = rope[j];
                let pos = getFollowerPosition(prev[0], prev[1], here[0], here[1])
                here[0] = pos.row
                here[1] = pos.col
            }
            let tail = rope[rope.length - 1]
            // console.log("Head at " + getKey(rope[0][1], rope[0][1]) + " tail at " + getKey(tail[0], tail[1]))
            seen[getKey(tail[0], tail[1])] = true
        }
    }
}

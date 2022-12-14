import {fetchInputData} from "./libraries.js"

const year = 2022
const day = 13

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
//
// file =
//     `
//     [1,1,3,1,1]
// [1,1,5,1,1]
//
// [[1],[2,3,4]]
// [[1],4]
//
// [9]
// [[8,7,6]]
//
// [[4,4],4,4]
// [[4,4],4,4,4]
//
// [7,7,7,7]
// [7,7,7]
//
// []
// [3]
//
// [[[]]]
// [[]]
//
// [1,[2,[3,[4,[5,6,7]]]],8,9]
// [1,[2,[3,[4,[5,6,0]]]],8,9]
// `

let input = file.trim().split("\n\n").map(f => {
        return f.split("\n").map(g => JSON.parse(g))
    }
)

function compare(f, s) {
    // console.log("Compare " + JSON.stringify(f) + ", " + JSON.stringify(s))
    if (!Array.isArray(f) && !Array.isArray(s)) {
        let valid = f < s;
        if (valid) {
            // console.log("Left side is smaller, so inputs are in the right order")
            return 1
        } else {
            let invalid = f > s;
            if (invalid) {
                // console.log("Right side is smaller, so inputs are not in the right order")
                return -1
            }
        }
        return 0;
    }
    if (Array.isArray(f) && Array.isArray(s)) {
        for (let i = 0; i < f.length && i < s.length; i++) {
            let cmp = compare(f[i], s[i])
            if (cmp !== 0) {
                // console.log("Items in array are not ok, so array is not ok")
                return cmp
            }
        }
        if (f.length < s.length) {
            // console.log("Left side ran out of items, so inputs are in the right order")
            return 1
        }
        if (f.length > s.length) {
            // console.log("Right side ran out of items, so inputs are not in the right order")
            return -1
        }
        return 0;
    }
    if (!Array.isArray(f)) {
        // console.log("Mixed types; convert left to "+JSON.stringify([f])+" and retry comparison")
        return compare([f], s)
    }
    if (!Array.isArray(s)) {
        // console.log("Mixed types; convert right to "+JSON.stringify([s])+" and retry comparison")
        return compare(f, [s])
    }
}

let score = 0
for (let i = 0; i < input.length; i++) {
    console.log("\n\n\n")
    let ok = compare(input[i][0], input[i][1])
    if (ok == 1) {
        // console.log("Packet " + i + " is ok")
        score += i + 1
    }
}
console.log("Part 1 " + score)

let allinputs = []
for (const inputElement of input) {
    allinputs.push(inputElement[0])
    allinputs.push(inputElement[1])
}
allinputs.push([[2]])
allinputs.push([[6]])

allinputs = allinputs.sort(function (a, b) {
    return compare(b, a)
});

let prod = 1
for (let i = 0; i < allinputs.length; i++) {
    let packet = allinputs[i];
    let s = JSON.stringify(packet);
    if (s == "[[2]]" || s == "[[6]]") {
        prod *= i+1
    }
}
console.log("Part 2 "+prod)
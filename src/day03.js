import {fetchInputData} from "./libraries.js"

const year = 2022
const day = 3

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

let input = file.trim().split("\n").map(f => {
    return {first: f.substring(0, f.length / 2), second: f.substring(f.length / 2)}
})


function scoreLetter(l) {
    let asciiValue = l.charCodeAt(0);
    if (asciiValue < 97) {
        let add = asciiValue - 64 + 26;
        return add
    } else {
        let add = asciiValue - 96;
        return add
    }
}

function getScore(row) {
    for (const firstletter of [...row.first]) {
        for (const secondletter of [...row.second]) {
            if (firstletter == secondletter) {
                return scoreLetter(firstletter)
            }
        }
    }
}

let part1 = 0
for (const row of input) {
    part1 += getScore(row);
}
console.log(part1)

let part2 = 0
input = file.trim().split("\n")
for (let i = 0; i < input.length; i += 3) {
    let first = input[i];
    let second = input[i + 1];
    let third = input[i + 2];
    for (const letter of [...first]) {
        if (second.includes(letter) && third.includes(letter)) {
            let add = scoreLetter(letter);
            part2 += add
            break
        }
    }
}
console.log(part2)
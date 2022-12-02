import {fetchInputData} from "./libraries.js"

const year = 2022
const day = 2

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


let input = file.trim().split("\n").map(f => f.split(" "))

let score = 0
let wins = 0
let losses = 0
let draws = 0

function part2(round) {
    // Rock
    if (round[0] == "A") {
        // Scissors
        if (round[1] == "X") {
            score += 3
            losses++
        }
        // Rock
        if (round[1] == "Y") {
            score += 1
            draws++
        }
        // Paper
        if (round[1] == "Z") {
            score += 2
            wins++
        }
    }

    // Paper
    if (round[0] == "B") {
        // Rock
        if (round[1] == "X") {
            score += 1
            losses++
        }
        // Paper
        if (round[1] == "Y") {
            score += 2
            draws++
        }
        // Scissors
        if (round[1] == "Z") {
            score += 3
            wins++
        }
    }

    // Scissors
    if (round[0] == "C") {
        // Paper
        if (round[1] == "X") {
            score += 2
            losses++
        }
        // Scissors
        if (round[1] == "Y") {
            score += 3
            draws++
        }
        // Rock
        if (round[1] == "Z") {
            score += 1
            wins++
        }
    }
}

for (const round of input) {
    part2(round)
}

score = score + (3 * draws) + (6 * wins)
console.log(score)
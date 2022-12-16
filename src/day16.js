import {fetchInputData, keyCount} from "./libraries.js"

const year = 2022
const day = 16

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
//     Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
// Valve BB has flow rate=13; tunnels lead to valves CC, AA
// Valve CC has flow rate=2; tunnels lead to valves DD, BB
// Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
// Valve EE has flow rate=3; tunnels lead to valves FF, DD
// Valve FF has flow rate=0; tunnels lead to valves EE, GG
// Valve GG has flow rate=0; tunnels lead to valves FF, HH
// Valve HH has flow rate=22; tunnel leads to valve GG
// Valve II has flow rate=0; tunnels lead to valves AA, JJ
// Valve JJ has flow rate=21; tunnel leads to valve II
//     `

let valves = {}
let input = file.trim().split("\n").map(f => {
    let res = /Valve (\w+) has flow rate=(\d+); tunnel(s?) lead(s?) to valve(s?) (.*)/.exec(f)
    if (res == null) {
        console.log(asd)
    }
    let targets = res[6].split(",").map(f => f.trim())
    let blob = {name: res[1], flow: parseInt(res[2]), targets: targets}
    valves[blob.name] = blob
    return blob
})


function getValveKey(potential) {
    return "" + potential.here + ":" + potential.open.sort().join("")
}

function runmaze() {
    while (potential.length > 0) {
        potential = potential.sort((a, b) => b.score - a.score)
        let nextmove = potential.shift()
        // console.log("I'm at " + JSON.stringify(nextmove)+" key "+getValveKey(nextmove))
        let node = valves[nextmove.here]
        if (nextmove.open.length == keyCount(valves)) {
            if (nextmove.score > topscore.score) {
                topscore = nextmove
            }
            continue
        }
        if (nextmove.time <= 0) {
            if (nextmove.score > topscore.score) {
                topscore = nextmove
            }
            continue
        }

        if (!nextmove.open.includes(nextmove.here)) {
            let openCopy = JSON.parse(JSON.stringify(nextmove.open))
            openCopy.push(nextmove.here)
            let next = {
                here: nextmove.here,
                score: nextmove.score,
                time: nextmove.time - 1,
                open: openCopy,
                order: nextmove.order + "," + nextmove.here
            };
            let newscore = valves[nextmove.here].flow * (next.time)
            next.score = nextmove.score + newscore
            // console.log("Opening valve " + nextmove.here + " on minute " + (nextmove.time - 1) + " increases score by " + newscore)
            let valveKey = getValveKey(next);
            if (!seen.hasOwnProperty(valveKey) || seen[valveKey] < next.score) {
                potential.push(next)
                seen[valveKey] = next.score
            }
        }


        for (const target of node.targets) {
            let openCopy = JSON.parse(JSON.stringify(nextmove.open))
            let next = {
                here: target,
                score: nextmove.score,
                time: nextmove.time - 1,
                open: openCopy,
                order: nextmove.order
            };
            let valveKey = getValveKey(next);
            if (!seen.hasOwnProperty(valveKey) || seen[valveKey] < next.score) {
                potential.push(next)
                seen[valveKey] = next.score
            }
        }

    }
}

// Part 1: Working alone, but a little more time
let start = {here: "AA", score: 0, time: 30, open: [], order: ""};
for (const valve of Object.values(valves)) {
    if (valve.flow == 0) {
        start.open.push(valve.name)
    }
}
let potential = [start]
let seen = {}
seen[getValveKey(start)] = true

let topscore = {score: 0}
runmaze()
console.log("Part 1 " + topscore.score)

// I'll do the best work I can
start = {here: "AA", score: 0, time: 26, open: [], order: ""};
for (const valve of Object.values(valves)) {
    if (valve.flow == 0) {
        start.open.push(valve.name)
    }
}
potential = [start]
seen = {}
seen[getValveKey(start)] = true

topscore = {score: 0}
runmaze()
let myscore = topscore.score

// And the damn elephant can try to impress me by opening as many valves as it can
start = {here: "AA", score: 0, time: 26, open: topscore.open, order: ""};
potential = [start]
seen = {}
seen[getValveKey(start)] = true

topscore = {score: 0}
runmaze()

let elephantscore = topscore.score
console.log("Part 2 " + (elephantscore + myscore))


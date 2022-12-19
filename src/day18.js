import {fetchInputData, keyCount} from "./libraries.js"

const year = 2022
const day = 18

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
// file = `
// 2,2,2
// 1,2,2
// 3,2,2
// 2,1,2
// 2,3,2
// 2,2,1
// 2,2,3
// 2,2,4
// 2,2,6
// 1,2,5
// 3,2,5
// 2,1,5
// 2,3,5
// `
let input = file.trim().split("\n").map(f => f.split(",").map(g => parseInt(g)))

let cubes = {}

for (const blob of input) {
    cubes[waterKey(blob[0], blob[1], blob[2])] = true
}


let score = 0

function connectsTo(first, second) {
    let x1_free = true
    let x2_free = true

    let y1_free = true
    let y2_free = true

    let z1_free = true
    let z2_free = true

    if (first[0] == second[0] && first[1] == second[1] && first[2] == second[2]) {
        return {x1_free, x2_free, y1_free, y2_free, z1_free, z2_free};
    }


    /////
    if (first[0] == second[0] - 1 && first[1] == second[1] && first[2] == second[2]) {
        x1_free = false
    }

    if (first[0] == second[0] + 1 && first[1] == second[1] && first[2] == second[2]) {
        x2_free = false
    }

    if (first[1] == second[1] + 1 && first[0] == second[0] && first[2] == second[2]) {
        y1_free = false
    }

    if (first[1] == second[1] + 1 && first[0] == second[0] && first[2] == second[2]) {
        y2_free = false
    }
    if (first[2] == second[2] + 1 && first[1] == second[1] && first[0] == second[0]) {
        z1_free = false
    }

    if (first[2] == second[2] + 1 && first[1] == second[1] && first[0] == second[0]) {
        z2_free = false
    }
    return {x1_free, x2_free, y1_free, y2_free, z1_free, z2_free};
}

function checkBounds(second) {
    if (second[0] < -2) {
        return false
    }
    if (second[0] > max_flow_x + 2) {
        return false
    }

    if (second[1] < -2) {
        return false
    }
    if (second[1] > max_flow_y + 2) {
        return false
    }

    if (second[2] < -2) {
        return false
    }
    if (second[2] > max_flow_z + 2) {
        return false
    }
    return true
}

for (const first of input) {
    let x1_free = true
    let x2_free = true

    let y1_free = true
    let y2_free = true

    let z1_free = true
    let z2_free = true

    for (const second of input) {
        const __ret = connectsTo(first, second);
        x1_free = __ret.x1_free && x1_free;
        x2_free = __ret.x2_free && x2_free;
        y1_free = __ret.y1_free && y1_free;
        y2_free = __ret.y2_free && y2_free;
        z1_free = __ret.z1_free && z1_free;
        z2_free = __ret.z2_free && z2_free;
    }
    let free = 0
    if (x1_free) {
        free++
    }
    if (x2_free) {
        free++
    }
    if (y1_free) {
        free++
    }
    if (y2_free) {
        free++
    }
    if (z1_free) {
        free++
    }
    if (z2_free) {
        free++
    }
    // console.log("Block "+JSON.stringify(first)+" has free sides "+free)
    score += free
}

console.log("Part 1 " + score)

function waterKey(x, y, z) {
    return `${x},${y},${z}`
}

let water = {}

let max_flow_x = 0;
let max_flow_y = 0;
let max_flow_z = 0;
input.map(f => max_flow_x = Math.max(max_flow_x, f[0]))
input.map(f => max_flow_y = Math.max(max_flow_y, f[1]))
input.map(f => max_flow_z = Math.max(max_flow_z, f[2]))

let flows = {"0,0,0": [0,0,0]}

function tryFlow(x, y, z, flow, nextflows) {
    let key = waterKey(x, y, z);
    if (!cubes.hasOwnProperty(key)) {
        if (!water.hasOwnProperty(key)) {
            let f = [x, y, z]
            if (checkBounds(f)) {
                nextflows[key] = f
                // console.log("Water flowed to " + key + " from " + flow)
            }
                else{
                // console.log("Water does not flow to " + key + " from " + flow)
            }
        }
    }
}

while (true) {
    let nextflows = {}
    // console.log("Round starts with water count " + keyCount(water))
    for (const flow of Object.values(flows)) {
        let x = flow[0] - 1;
        let y = flow[1];
        let z = flow[2];
        tryFlow(x, y, z, flow, nextflows);

        x = flow[0] + 1;
        y = flow[1];
        z = flow[2];
        tryFlow(x, y, z, flow, nextflows);

        x = flow[0];
        y = flow[1] - 1;
        z = flow[2];
        tryFlow(x, y, z, flow, nextflows);

        x = flow[0];
        y = flow[1] + 1;
        z = flow[2];
        tryFlow(x, y, z, flow, nextflows);

        x = flow[0];
        y = flow[1];
        z = flow[2] - 1;
        tryFlow(x, y, z, flow, nextflows);

        x = flow[0];
        y = flow[1];
        z = flow[2] + 1;
        tryFlow(x, y, z, flow, nextflows);
    }

    if (keyCount(nextflows) == 0) {
        console.log("Did not make any more water!")
        break
    } else {
        for (const flow of Object.keys(nextflows)) {
            water[flow] = nextflows[flow]
        }
        for (const flow of Object.keys(flows)) {
            water[flow] = flows[flow]
        }
        flows = nextflows
    }
}

console.log("Water cubes " + keyCount(water))

let part2 = 0
for (const first of input) {
    let x1_free = true
    let x2_free = true

    let y1_free = true
    let y2_free = true

    let z1_free = true
    let z2_free = true

    for (const second of Object.values(water)) {
        const __ret = connectsTo(first, second);
        x1_free = __ret.x1_free && x1_free;
        x2_free = __ret.x2_free && x2_free;
        y1_free = __ret.y1_free && y1_free;
        y2_free = __ret.y2_free && y2_free;
        z1_free = __ret.z1_free && z1_free;
        z2_free = __ret.z2_free && z2_free;
    }
    let free = 0
    if (!x1_free) {
        free++
    }
    if (!x2_free) {
        free++
    }
    if (!y1_free) {
        free++
    }
    if (!y2_free) {
        free++
    }
    if (!z1_free) {
        free++
    }
    if (!z2_free) {
        free++
    }
    part2 += free
}

console.log("Part 2 " + part2)
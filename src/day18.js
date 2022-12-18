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

function getKey(row, col) {
    return "" + row + "," + col
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
let input = file.trim().split("\n").map(f=>f.split(",").map(g=>parseInt(g)))

let score=0
for (const first of input) {
    let x1_free=true
    let x2_free=true

    let y1_free=true
    let y2_free=true

    let z1_free=true
    let z2_free=true

    for (const second of input) {
        if(first[0] == second[0] && first[1] == second[1] && first[2] == second[2]) {
            continue
        }


        /////
        if(first[0] == second[0]-1 && first[1] == second[1] && first[2] == second[2]){
            x1_free=false
        }

        if(first[0] == second[0]+1 && first[1] == second[1] && first[2] == second[2]){
            x2_free=false
        }

        if(first[1] == second[1]+1 && first[0] == second[0] && first[2] == second[2]){
            y1_free=false
        }

        if(first[1] == second[1]+1 && first[0] == second[0] && first[2] == second[2]){
            y2_free=false
        }
        if(first[2] == second[2]+1 && first[1] == second[1] && first[0] == second[0]){
            z1_free=false
        }

        if(first[2] == second[2]+1 && first[1] == second[1] && first[0] == second[0]){
            z2_free=false
        }
    }
    let free=0
    if(x1_free)
        free++
    if(x2_free)
        free++
    if(y1_free)
        free++
    if(y2_free)
        free++
    if(z1_free)
        free++
    if(z2_free)
        free++
    // console.log("Block "+JSON.stringify(first)+" has free sides "+free)
    score+=free
}

console.log("Part 1 "+score)
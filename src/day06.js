import {fetchInputData} from "./libraries.js"

const year = 2022
const day = 6

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
let input=file.trim().split("")

let roundsize=4
for (let i = 0; i < input.length-roundsize; i++) {
    let found=true
    for (let j = i; j < i+roundsize && found; j++) {
        for (let k = j+1; k < i+roundsize; k++) {
            let first = input[j];
            let second = input[k];
            if (first == second)
            {
                found=false
                break
            }
        }
    }
    if(!found)
        continue
    console.log("For "+roundsize+" the delimiter is at "+(i+roundsize))

    break
}

roundsize=14
for (let i = 0; i < input.length-roundsize; i++) {
    let found=true
    for (let j = i; j < i+roundsize && found; j++) {
        for (let k = j+1; k < i+roundsize; k++) {
            let first = input[j];
            let second = input[k];
            if (first == second)
            {
                found=false
                break
            }
        }
    }
    if(!found)
        continue
    console.log("For "+roundsize+" the delimiter is at "+(i+roundsize))

    break
}
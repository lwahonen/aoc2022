import {columns, fetchInputData, keyCount} from "./libraries.js"

const year = 2022
const day = 10

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

let xvals={}
xvals[1]=1
let cycle=1

function findX(c ) {
    if(c <= 1)
        return 1
    let findLast = c
    let prevVal;
    while (true) {
        if (xvals.hasOwnProperty(findLast)) {
            prevVal = xvals[findLast]
            break
        }
        findLast--
    }
    return prevVal;
}

for (const row of input) {
    if(row[0] == "noop") {
        cycle+=1
    }
    if(row[0] == "addx") {
        let amount = parseInt(row[1])
        let prevVal = findX(cycle);
        xvals[cycle + 2] = prevVal+amount
        cycle+=2
    }
}
console.log("Part 1 "+(findX(20)*20+findX(60)*60+findX(100)*100+findX(140)*140+findX(180)*180+findX(220)*220))
print()

function print()
{
    let crt=[]
    for (let i = 0; i < 6; i++) {
        crt[i]=[]
    }

    for (let pixels = 0; pixels < cycle-1; pixels++) {
        let row = Math.floor(pixels / 40)
        let col = pixels % 40
        row = row % 6
        let middle = findX(pixels+1);
        if (middle == col || middle == col - 1 || middle == col + 1) {
            crt[row][col] = "#"
        } else
            crt[row][col] = " "
    }
    for (let i = 0; i < 6; i++) {
        console.log(crt[i].join(""))
    }
}
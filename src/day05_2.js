import {fetchInputData} from "./libraries.js"

const year = 2022
const day = 5

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

let input = file.trim().split("\n\n")

let stacks=input[0].split("\n").map(d => d.split(""))

let towers=[]
for (let i = 0; i < 9; i++) {
    towers[i+1]=[]
}

for (const stack of stacks.slice(0, stacks.length-1)) {
    for (let i = 0; i < stacks[0].length / 4; i++) {
        let stackElement = stack[1 + i * 4];
        if (stackElement != " ")
            towers[i + 1].push(stackElement)

    }
}

for (const row of input[1].trim().split("\n")) {
    let split = row.split(" ");
    let amount=parseInt(split[1])
    let from=parseInt(split[3])
    let to=parseInt(split[5])
    let fromtower = towers[from];
    let elem=fromtower.slice(0, amount)
    fromtower=fromtower.slice(amount)
    towers[from]=fromtower
    towers[to]=elem.concat(towers[to])
}

let part2=""
for (let i = 1; i < towers.length; i++) {
    part2+=towers[i][0]
}
console.log(part2)
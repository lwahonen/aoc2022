import {fetchInputData, keyCount} from "./libraries.js"

import nerdamer from'nerdamer/nerdamer.core.js'
import 'nerdamer/Algebra.js'
import 'nerdamer/Calculus.js'
import 'nerdamer/Solve.js'

const year = 2022
const day = 21

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
// // //
file = `
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
`

let input = file.trim().split("\n").map(f => f.split(": "))
let have = {}
for (const row of input) {
    have[row[0]] = "(" + row[1] + ")"
}

let solved=have["root"]
while (true) {
    let presolve = solved
    for (const eq of Object.keys(have)) {
        solved = solved.replaceAll(eq, have[eq])
    }
    if (presolve == solved) {
        break
    }
}
console.log("Part 1 "+eval(solved))


have["humn"] = "h"
have["root"] = have["root"].replace("+", "=")
solved = have["root"]

while (true) {
    let presolve = solved
    for (const eq of Object.keys(have)) {
        solved = solved.replaceAll(eq, have[eq])
    }
    if (presolve == solved) {
        break
    }
}
// console.log(solved)

let message = nerdamer.solve(solved, "h").toString();
console.log("Part 2: "+message)
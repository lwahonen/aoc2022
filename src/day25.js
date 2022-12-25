import {fetchInputData} from "./libraries.js"
import 'nerdamer/Algebra.js'
import 'nerdamer/Calculus.js'
import 'nerdamer/Solve.js'

const year = 2022
const day = 25

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

let rows = file.trim().split("\n")

let part1=0

for (const s of rows) {
    console.log("Parse "+s)
    let parsed = parseSnafu(s, 0);
    console.log("Result "+parsed)
    part1+=parsed
}

console.log(snafu(part1))

function snafu(num) {
    if (num == 0)
        return "0"
    if (num == 1)
        return "1"
    if (num == 2)
        return "2"
    if (num == -2)
        return "="
    if (num == -1)
        return "-"
    let nextPow = Math.floor(num / 5)
    let tailbit = num - nextPow * 5;
    if (tailbit > 2)
        nextPow++
    let num1 = num - (nextPow * 5);
    return snafu(nextPow) + snafu(num1)
}

function parseSnafu(num, pot) {
    let mul = Math.pow(5, pot);
    if (num == "0")
        return mul * 0
    if (num == "1")
        return mul * 1
    if (num == "2")
        return mul * 2
    if (num == "=")
        return mul * -2
    if (num == "-")
        return mul * -1
    let parse = num.substring(0, num.length - 1)
    let lastDigit = num.substr(-1);
    let tail = parseSnafu(lastDigit, pot);
    let head = parseSnafu(parse, pot + 1);
    return tail + head
}


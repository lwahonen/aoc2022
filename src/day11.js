import {columns, fetchInputData, keyCount} from "./libraries.js"

const year = 2022
const day = 11

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
let inspected = {}

let alldivs = 1

function parseMonkey(f) {
    let rows = f.split("\n")
    let id = parseInt(rows[0].split(" ")[1])
    let items = rows[1].split(": ")[1].split(",").map(a => parseInt(a))
    let operation = rows[2].split(": ")[1]
    let test = rows[3].split(": ")[1]
    let div = parseInt(test.split("by ")[1])
    alldivs *= div

    let yes = parseInt(rows[4].split("to monkey")[1])
    let no = parseInt(rows[5].split("to monkey")[1])

    let m = {id: id, items: items, operation: operation, test: test, yes: yes, no: no}
    inspected[id] = 0
    monkeys[m.id] = m
    return m
}

let monkeys = {}

function runTest(test, worry) {
    let val = parseInt(test.split("by ")[1])
    let div = worry % val == 0
    if (test.startsWith("Current worry level is not divisible by ")) {
        return !div
    } else {
        return div
    }
}

function runOp(op, worry) {
    if (op == "new = old * old")
        return worry * worry
    if (op.startsWith("new = old * ")) {
        let val = parseInt(op.split("* ")[1])
        return worry * val
    }
    if (op.startsWith("new = old + ")) {
        let val = parseInt(op.split("+ ")[1])
        return worry + val
    }
}

let input = file.trim().split("\n\n").map(f => parseMonkey(f))
runMonkeys(false)
for (const reset of Object.keys(inspected)) {
    inspected[reset]=false
}
alldivs=1
input = file.trim().split("\n\n").map(f => parseMonkey(f))
runMonkeys(true)

function runMonkeys(part2) {
    let rounds = 20
    if (part2)
        rounds = 10000

    for (let i = 1; i <= rounds; i++) {
        for (const monkey of input) {
            // console.log("\nMonkey "+monkey.id)
            for (const item of monkey.items) {
                inspected[monkey.id] += 1
                // console.log("Monkey inspects an item with a worry level of " + item)
                let val = runOp(monkey.operation, item)
                // console.log("Worry level is " + monkey.operation + " to " + val)
                if (!part2)
                    val = Math.floor(val / 3)
                val = val % alldivs
                // console.log("Monkey gets bored with item. Worry level is divided by 3 to " + val)
                let ok = runTest(monkey.test, val)
                // console.log("Current worry level is " + monkey.test + " " + ok)
                if (ok) {
                    monkeys[monkey.yes].items.push(val)
                    // console.log(`Item with worry level ${val} is thrown to monkey ${monkey.yes}.`)
                } else {
                    monkeys[monkey.no].items.push(val)
                    // console.log(`Item with worry level ${val} is thrown to monkey ${monkey.no}.`)
                }

            }
            monkey.items = []
        }
    }

    let numArray = Object.values(inspected);
    let top = numArray.sort(function (a, b) {
        return a - b;
    });
    let big = top[top.length - 1];
    let second = top[top.length - 2];
    console.log("Top 2 are " + big + " and " + second)
    if (!part2)
        console.log("Part 1:  " + big * second)
    else
        console.log("Part 1:  " + big * second)
}
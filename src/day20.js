import {fetchInputData, keyCount} from "./libraries.js"

const year = 2022
const day = 20

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
// //
// file = `
// 1
// 2
// -3
// 3
// -2
// 0
// 4
// `

let input = file.trim().split("\n").map(f => parseInt(f))

let nodes={}
let positions={}

let first={next:null, previous:null, value:input[0]}
let current=first
current.next=first
current.previous=first
positions[0]=first
nodes[input[0]]=first

for (let i = 1; i < input.length; i++) {
    let newnode = {next: current.next, previous:current, value: input[i]};
    current.next.previous=newnode
    current.next = newnode
    current=newnode
    nodes[input[i]]=current
    positions[i]=current
}

for (let i = 0; i < input.length; i++) {
    let currentNode = positions[i]
    if (input[i] > 0) {
        let here = currentNode
        currentNode.previous.next = currentNode.next
        currentNode.next.previous = currentNode.previous
        for (let j = 0; j < input[i]; j++) {
            here = here.next
        }
        currentNode.next = here.next
        currentNode.previous = here
        here.next.previous = currentNode
        here.next = currentNode
    }
    if (input[i] < 0) {
        let here = currentNode
        currentNode.previous.next = currentNode.next
        currentNode.next.previous = currentNode.previous
        for (let j = 0; j >= input[i]; j--) {
            here = here.previous
        }
        here.next.previous = currentNode
        currentNode.next = here.next
        currentNode.previous = here
        here.next = currentNode
    }
}

let here=nodes[0]
let sum=0

for (let i = 1; i <= 3000; i++) {
    here = here.next
    if (i % 1000 == 0)
        sum += here.value
}
console.log(sum)
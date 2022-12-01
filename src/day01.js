import {fetchInputData} from "./libraries.js";

const year = 2022
const day = 1;

let file = "";

const isBrowser = () => typeof window !== `undefined`
const isNode = !isBrowser()

if (isNode) {
    file = fetchInputData(year, day);
} else {
    const sync_fetch = require('sync-fetch')
    file = sync_fetch(`data/day_${day}.txt`).text();
}

///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////


let input = file.trim().split("\n\n").map(f =>   f.split("\n").map(g =>  parseInt(g)))

let totals=[]
for(let elf of input) {
    let sum = elf.reduce((accumulator, value) => {
        return accumulator + value;
    }, 0);
    totals.push(sum)
}

totals.sort(function(a, b) {
    return b - a;
});

console.log("Part 1 "+totals[0]+" part 2 "+(totals[0]+totals[1]+totals[2]))
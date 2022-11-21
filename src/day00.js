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


let ctx = undefined;
let canvas = undefined;
if (!isNode) {
    canvas = document.getElementById('canvas');
    if (canvas instanceof HTMLCanvasElement) {
        ctx = canvas.getContext('2d');
    }
    console.log(canvas);
}
if (canvas != undefined && ctx != undefined) {
    ctx.fillStyle = 'white';
    let height = canvas.height;
    let width = canvas.width;
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'black';
    ctx.font = "30px Arial";
    ctx.fillText("Hello World", 10, 50);
}

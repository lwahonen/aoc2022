import {fetchInputData} from "./libraries.js"

const year = 2022
const day = 7

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

//
// file = `
// $ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k
//     `

let input = file.trim().split("\n")

let dirs = {}
let current = {}
current.path = "/"
current.kids = {}
current.files = {}
current.parent = current

let root = current

for (const row of input) {
    if (row.startsWith("$")) {
        if (row == "$ ls") {
            continue
        }
        if (row == "$ cd ..") {
            current = current.parent;
            continue
        }
        if (row == "$ cd /") {
            current = root
            continue
        }
        if (row.startsWith("$ cd ")) {
            let dirname = row.split(" ")[2]
            if (dirs.hasOwnProperty(dirname)) {
                current = dirs[dirname]
                continue
            }
            let newdir = {}
            newdir.path = current.path + "/" + dirname
            newdir.kids = {}
            newdir.files = {}
            newdir.parent = current
            current = newdir
            dirs[newdir.path] = newdir
            continue
        }
    } else {
        if (row.startsWith("dir ")) {
            current.kids[current.path + "/" + row.substring(4)] = row.substring(4)
        } else {
            let pair = row.split(" ")
            current.files[pair[1]] = parseInt(pair[0])
        }
    }
}

function sizeDir(dir) {
    let total = 0
    for (const kid of Object.keys(dir.kids)) {
        total += sizeDir(dirs[kid])
    }
    for (const name of Object.keys(dir.files)) {
        total += dir.files[name]
    }
    return total
}

let part1=0
for (const dir of Object.keys(dirs)) {
    let size = sizeDir(dirs[dir]);
    if (size <= 100000)
        part1 += size
}

console.log("Part 1 "+part1)

let rootSize = sizeDir(root);
let unused=70000000- rootSize
let needed=30000000-unused
let curmax=70000000
for (const dir of Object.keys(dirs)) {
    let size = sizeDir(dirs[dir]);
    if (size > needed) {
        curmax = Math.min(curmax, size)
    }
}

console.log("Part 2 "+curmax)

import {fetchInputData, keyCount} from "./libraries.js"

const year = 2022
const day = 19

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
// Blueprint 1:  Each ore robot costs 4 ore.  Each clay robot costs 2 ore.  Each obsidian robot costs 3 ore and 14 clay.  Each geode robot costs 2 ore and 7 obsidian.
// Blueprint 2:  Each ore robot costs 2 ore.  Each clay robot costs 3 ore.  Each obsidian robot costs 3 ore and 8 clay.  Each geode robot costs 3 ore and 12 obsidian.
// `

let input = file.trim().split("\n").map(f => f.replaceAll(/\s+/g, " "))

let blueprints={}
for (const row of input) {
    let bp=/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./.exec(row)
    bp=bp.map(f=>parseInt(f))
    blueprints[bp[1]]={ore:bp[2], clay:bp[3], obsidian:[bp[4], bp[5]], geode:[bp[6], bp[7]] }
}

function updateBest(result, best_result) {
    if (result["geode"] > best_result["geode"]) {
        best_result = result
        if (best_result["geode"] > global_best_geode) {
            global_best_geode = best_result["geode"]
            // console.log("New global best result " + global_best_geode + " via " + best_result.story)
        }
    }
    return best_result;
}

let cache={}
function getCacheKey(minute, resources, bots) {
    let nostory = resources.story
    resources.story = ""
    let ret = `${minute},${JSON.stringify(bots)},${JSON.stringify(resources)}`
    resources.story = nostory
    return ret
}

function geodeEveryTurn(minute) {
    let geode_every_minute = (global_time_limit - minute + 1) * ((global_time_limit - minute) / 2)
    return geode_every_minute
}

function runMinute(minute, bp, resources, bots) {
    let turns_remaining = global_time_limit - minute+1;
    let max_from_now=geodeEveryTurn(minute)+resources["geode"]+(turns_remaining*bots["geode"])
    if(max_from_now <= global_best_geode)
        return resources
    let cacheKey = getCacheKey(minute, resources, bots);
    if (cache.hasOwnProperty(cacheKey))
        return cache[cacheKey]
    resources = JSON.parse(JSON.stringify(resources))
    bots = JSON.parse(JSON.stringify(bots))


    let geodeCost = bp["geode"];
    let obsidianCost = bp["obsidian"];
    let can_geode = resources["ore"] >= geodeCost[0] && resources["obsidian"] >= geodeCost[1]
    let can_obsidian = resources["ore"] >= obsidianCost[0] && resources["clay"] >= obsidianCost[1]
    let can_clay = resources["ore"] >= bp["clay"]
    let can_ore = resources["ore"] >= bp["ore"]

    let max_ore_cost = Math.max(bp["ore"], bp["clay"], geodeCost[0], obsidianCost[0])
    let max_clay_cost = obsidianCost[1]
    let max_obsidian_cost = geodeCost[1]

    resources["ore"] += bots["ore"]
    resources["clay"] += bots["clay"]
    resources["obsidian"] += bots["obsidian"]
    resources["geode"] += bots["geode"]

    if (minute == global_time_limit) {
        resources["story"] += minute + ": TIME"
        cache[cacheKey] = resources
        return resources
    }

    if (can_geode) {
        let gresources = JSON.parse(JSON.stringify(resources))
        let gbots = JSON.parse(JSON.stringify(bots))

        gbots["geode"] += 1
        gresources["ore"] -= geodeCost[0]
        gresources["obsidian"] -= geodeCost[1]
        gresources["story"] += minute + ": geode, "

        let result = runMinute(minute + 1, bp, gresources, gbots)
        if (result["geode"] > global_best_geode) {
            global_best_geode = result["geode"]
            // console.log("New global best result " + global_best_geode + " via " + result.story)
        }
        cache[cacheKey] = result
        return result;
    }



    let nop_resources = JSON.parse(JSON.stringify(resources))
    nop_resources["story"]+= minute+": NOP, "


    // NOP?
    let best_result = runMinute(minute + 1, bp, nop_resources, bots)
    if (best_result["geode"] > global_best_geode) {
        global_best_geode = best_result["geode"]
        // console.log("New global best result " + global_best_geode + " via " + best_result.story)
    }



    if (can_obsidian && max_obsidian_cost > bots["obsidian"]) {
        let oresources = JSON.parse(JSON.stringify(resources))
        let obots = JSON.parse(JSON.stringify(bots))

        obots["obsidian"] += 1
        oresources["ore"] -= obsidianCost[0]
        oresources["clay"] -= obsidianCost[1]
        oresources["story"]+= minute+": obsidian, "

        let result = runMinute(minute + 1, bp, oresources, obots)
        best_result = updateBest(result, best_result);
    }

    if (can_clay && max_clay_cost > bots["clay"]) {
        let cresources = JSON.parse(JSON.stringify(resources))
        let cbots = JSON.parse(JSON.stringify(bots))

        cbots["clay"] += 1
        cresources["ore"] -= bp["clay"]
        cresources["story"]+= minute+": clay, "

        let result = runMinute(minute + 1, bp, cresources, cbots )
        best_result = updateBest(result, best_result);
    }

    if (can_ore && max_ore_cost > bots["ore"]) {
        let oreresources = JSON.parse(JSON.stringify(resources))
        let orebots = JSON.parse(JSON.stringify(bots))

        orebots["ore"] += 1
        oreresources["ore"] -= bp["ore"]
        oreresources["story"]+= minute+": ore, "


        let result = runMinute(minute + 1, bp, oreresources, orebots)
        best_result = updateBest(result, best_result);
    }
    cache[cacheKey] = best_result
    return best_result
}

let part1=0
let global_best_geode=0
let global_time_limit=24

let records={}
for (const id of Object.keys(blueprints)) {
    global_best_geode = 0
    cache = {}

    let value = runMinute(1, blueprints[id], {ore: 0, clay: 0, obsidian: 0, geode: 0, story: ""}, {
        ore: 1,
        clay: 0,
        obsidian: 0,
        geode: 0
    });
    let geode = value["geode"];
    part1 += geode * id
    records[id] = geode
    console.log("Geodes for " + id + " " + geode+" reached via "+value.story)
}
console.log("Part 1 "+part1)



let part2=1
global_time_limit=32

for (let id = 1; id <= 3; id++) {
    global_best_geode = records[id]
    cache = {}

    let value = runMinute(1, blueprints[id], {ore: 0, clay: 0, obsidian: 0, geode: 0, story: ""}, {
        ore: 1,
        clay: 0,
        obsidian: 0,
        geode: 0
    });
    part2  *= value["geode"]
    console.log("Geodes for " + id + " " + geode+" reached via "+value.story)
}
console.log("Part 2 "+part2)

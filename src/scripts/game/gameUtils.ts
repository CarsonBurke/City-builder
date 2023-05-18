import { env } from "../env/env"
import { Pos } from "./types"


export function packPos(pos: Pos) {

    return pos.x * env.graphSize + pos.y
}

export function packXY(x: number, y: number) {

    return x * env.graphSize + y
}

export function unpackPos(packedPos: number) {

    return {
        x: Math.floor(packedPos / env.graphSize),
        y: Math.floor(packedPos % env.graphSize),
    }
}

/**
 * Takes a rectange and returns the positions inside of it in an array
 */
export function findPositionsInsideRect(x1: number, y1: number, x2: number, y2: number) {
    const positions = []

    for (let x = x1; x <= x2; x += 1) {
        for (let y = y1; y <= y2; y += 1) {
            // Iterate if the pos doesn't map onto a room

            if (x < 0 || x >= env.graphSize || y < 0 || y >= env.graphSize) continue

            // Otherwise pass the x and y to positions

            positions.push({ x, y })
        }
    }

    return positions
}

export function isXYInGraph(x: number, y: number) {

    return x >= 0 && x < env.graphSize && y >= 0 && y < env.graphSize
}

/**
 * Gets the range between two positions' x and y (Half Manhattan)
 * @param x1 the first position's x
 * @param y1 the first position's y
 * @param x2 the second position's x
 * @param y2 the second position's y
 */
export function getRange(x1: number, x2: number, y1: number, y2: number) {
    // Find the range using Chebyshev's formula

    return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))
}

export function getRangeOfPositions(pos1: Pos, pos2: Pos) {
    return getRange(pos1.x, pos2.x, pos1.y, pos2.y)
}

export function forAdjacentPositions(startPos: Pos, f: (pos: Pos) => void) {
    for (let x = startPos.x - 1; x <= startPos.x + 1; x += 1) {
        for (let y = startPos.y - 1; y <= startPos.y + 1; y += 1) {
            if (x === startPos.x && y === startPos.y) continue
            if (!isXYInGraph(x, y)) continue

            f({ x, y })
        }
    }
}

/**
 * Excludes center around range
 */
export function forPositionsAroundRange(startPos: Pos, range: number, f: (pos: Pos) => void) {
    for (let x = startPos.x - range; x <= startPos.x + range; x += 1) {
        for (let y = startPos.y - range; y <= startPos.y + range; y += 1) {
            if (x == startPos.x && y === startPos.y) continue
            // Iterate if the pos doesn't map onto a room

            if (x < 0 || x >= env.graphLength || y < 0 || y >= env.graphLength) continue

            f({ x, y })
        }
    }
}

/**
 * includes center around range
 */
export function forPositionsInRange(startPos: Pos, range: number, f: (pos: Pos) => void) {
    for (let x = startPos.x - range; x <= startPos.x + range; x += 1) {
        for (let y = startPos.y - range; y <= startPos.y + range; y += 1) {
            // Iterate if the pos doesn't map onto a room

            if (x < 0 || x >= env.graphLength || y < 0 || y >= env.graphLength) continue

            f({ x, y })
        }
    }
}

export function randomBool() {

    return Math.floor(Math.random() * 2)
}

export function randomOnesOffset() {

    return randomBool() ? 1 : -1
}

export function randomOffsetFor(pos: Pos) {

    const offsetPos = {
        x: -1,
        y: -1,
    }

    for (const key in offsetPos) {

        let posVal = offsetPos[key as keyof Pos]

        while (posVal < 0 || posVal > env.graphSize) {

            posVal = pos[key as keyof Pos] + randomOnesOffset()
        }

        offsetPos[key as keyof Pos] = posVal
    }

    return offsetPos
}
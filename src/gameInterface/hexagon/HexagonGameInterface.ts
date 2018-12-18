/*
BSD 3-Clause License

Copyright (c) 2018, Benny Jacobs
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import * as PIXI from 'pixi.js'
import HexagonGame from '../../game/hexagon/HexagonGame'
import PixiGameInterface from '../PixiGameInterface'
import HexagonTile from '../../game/hexagon/HexagonTile'

const horizontalSpace = 50
const verticalSpace = 58

const recursiveAddTiles = (position: PIXI.Point,
                            t: HexagonTile,
                            stage: PIXI.Container,
                            set: Set<HexagonTile>) => {
    set.add(t)

    const ctx = new PIXI.Graphics()
    ctx.lineStyle(1, 0x000000, 1)
    if(t.owner) {
        ctx.beginFill(t.owner.color.rgbNumber())
    } else {
        ctx.beginFill(0x666666)
    }
	ctx.lineWidth = 1
    ctx.moveTo(-15, -26)
    ctx.lineTo(15, -26)
    ctx.lineTo(30, 0)
    ctx.lineTo(15, 26)
    ctx.lineTo(-15, 26)
    ctx.lineTo(-30, 0)
    ctx.lineTo(-15, -26)
    ctx.endFill()
    ctx.position = position
    stage.addChild(ctx)

    if(t.north && !set.has(t.north)) {
        recursiveAddTiles(new PIXI.Point(position.x, position.y - verticalSpace), t.north, stage, set)
    }

    if(t.northEast && !set.has(t.northEast)) {
        recursiveAddTiles(new PIXI.Point(position.x + horizontalSpace, position.y - verticalSpace/2), t.northEast, stage, set)
    }

    if(t.southEast && !set.has(t.southEast)) {
        recursiveAddTiles(new PIXI.Point(position.x + horizontalSpace, position.y + verticalSpace/2), t.southEast, stage, set)
    }

    if(t.south && !set.has(t.south)) {
        recursiveAddTiles(new PIXI.Point(position.x, position.y + verticalSpace), t.south, stage, set)
    }

    if(t.southWest && !set.has(t.southWest)) {
        recursiveAddTiles(new PIXI.Point(position.x - horizontalSpace, position.y + verticalSpace/2), t.southWest, stage, set)
    }

    if(t.northWest && !set.has(t.northWest)) {
        recursiveAddTiles(new PIXI.Point(position.x - horizontalSpace, position.y - verticalSpace/2), t.northWest, stage, set)
    }
}

class HexagonGameInterface extends PixiGameInterface<HexagonGame> {

    constructor(game: HexagonGame, stage: PIXI.Container) {
        super(game, stage)

        const set = new Set<HexagonTile>()
        let gotFirst = false
        for(let tuple of this.game.tiles) {
            const tile = tuple[1]
            if(set.has(tile)) {
                console.assert(false, "No code to handle multiple unconnected islands has been written")
                // On should also wonder if this is something we want to play. A map which can't be conquered
            } else {
                if(!gotFirst) {
                    recursiveAddTiles(new PIXI.Point(100, 100), tile, stage, set)
                    gotFirst = true
                }
            }
        }
    }
}

export default HexagonGameInterface

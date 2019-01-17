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
                            map: Map<HexagonTile, PIXI.Container>) => {
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

    map.set(t, ctx)

    if(t.north && !map.has(t.north)) {
        recursiveAddTiles(new PIXI.Point(position.x, position.y - verticalSpace), t.north, stage, map)
    }

    if(t.northEast && !map.has(t.northEast)) {
        recursiveAddTiles(new PIXI.Point(position.x + horizontalSpace, position.y - verticalSpace/2), t.northEast, stage, map)
    }

    if(t.southEast && !map.has(t.southEast)) {
        recursiveAddTiles(new PIXI.Point(position.x + horizontalSpace, position.y + verticalSpace/2), t.southEast, stage, map)
    }

    if(t.south && !map.has(t.south)) {
        recursiveAddTiles(new PIXI.Point(position.x, position.y + verticalSpace), t.south, stage, map)
    }

    if(t.southWest && !map.has(t.southWest)) {
        recursiveAddTiles(new PIXI.Point(position.x - horizontalSpace, position.y + verticalSpace/2), t.southWest, stage, map)
    }

    if(t.northWest && !map.has(t.northWest)) {
        recursiveAddTiles(new PIXI.Point(position.x - horizontalSpace, position.y - verticalSpace/2), t.northWest, stage, map)
    }
}

class HexagonGameInterface extends PixiGameInterface<HexagonGame> {

    constructor(game: HexagonGame, stage: PIXI.Container, textureMap: { [index:string] : PIXI.Texture }) {
        super(game, stage)

        const map = new Map<HexagonTile, PIXI.Container>()
        let gotFirst = false
        for(let tuple of this.game.tiles) {
            const tile = tuple[1]
            if(map.has(tile)) {
                console.assert(false, "No code to handle multiple unconnected islands has been written")
                // On should also wonder if this is something we want to play. A map which can't be conquered
            } else {
                if(!gotFirst) {
                    recursiveAddTiles(new PIXI.Point(100, 100), tile, stage, map)
                    gotFirst = true
                }
            }
        }

        this.game.farms.forEach((farm, id) => {
            const container = map.get(farm.tile)
            if(container) {
                const sprite = new PIXI.Sprite(textureMap.farm1Texture)
                sprite.scale.x = 0.4
                sprite.scale.y = 0.4
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                container.addChild(sprite)
            }
        })

        this.game.graves.forEach((grave, id) => {
            const container = map.get(grave.tile)
            if(container) {
                const sprite = new PIXI.Sprite(textureMap.graveTexture)
                sprite.scale.x = 0.6
                sprite.scale.y = 0.6
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                container.addChild(sprite)
            }
        })

        this.game.towers.forEach((tower, id) => {
            const container = map.get(tower.tile)
            if(container) {
                const sprite = new PIXI.Sprite(tower.power == 2 ? textureMap.strong_towerTexture : textureMap.towerTexture)
                sprite.scale.x = 0.4
                sprite.scale.y = 0.4
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                container.addChild(sprite)
            }
        })

        this.game.townhalls.forEach((townhall, id) => {
            const container = map.get(townhall.tile)
            if(container) {
                const sprite = new PIXI.Sprite(textureMap.castleTexture)
                sprite.scale.x = 0.4
                sprite.scale.y = 0.4
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                container.addChild(sprite)
            }
        })

        this.game.trees.forEach((tree, id) => {
            const container = map.get(tree.tile)
            if(container) {
                const sprite = new PIXI.Sprite(textureMap[tree.name + 'Texture'])
                sprite.scale.x = 0.4
                sprite.scale.y = 0.4
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                container.addChild(sprite)
            }
        })

        this.game.units.forEach((unit, id) => {
            const container = map.get(unit.tile)
            if(container) {
                const power = Math.max(Math.min(unit.power, 4), 0)
                const sprite = new PIXI.Sprite(textureMap['man' + (power - 1) + 'Texture'])
                sprite.scale.x = 0.3
                sprite.scale.y = 0.3
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                container.addChild(sprite)
            }
        })
    }
}

export default HexagonGameInterface

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
import { Grammars } from 'ebnf'
import * as Color from 'color'

import Player from '../Player'
import Game from '../Game'
import Farm from '../Farm'
import Grave from '../Grave'
import HexagonTile from './HexagonTile'
import Tower from '../Tower';
import TownHall from '../TownHall'
import Tree from '../Tree';
import Unit from '../Unit'

const mapGrammer = require('./antiyoy_map.ebnf')
const mapParser = new Grammars.W3C.Parser(mapGrammer, {})

class HexagonGame extends Game<HexagonTile> {

    constructor() {
        super()
    }

    importYoymap(map: string) {
        const hexMap    = new Map<string, HexagonTile>()
        const playerMap = new Map<number, Player>();
        const farms     : Farm<HexagonTile>[]       = []
        const graves    : Grave<HexagonTile>[]      = []
        const towers    : Tower<HexagonTile>[]      = []
        const townhalls : TownHall<HexagonTile>[]   = []
        const trees     : Tree<HexagonTile>[]       = []
        const units     : Unit<HexagonTile>[]       = []
        
        const ast = mapParser.getAST(map)
        let i = 1

        console.assert(ast.type == 'map')
        ast.children.forEach((child) => {
            if(child.type == 'tile') {
                const position = new PIXI.Point()
                let owner: Player | null = null
                const hexagonTile = new HexagonTile("" + i++)
                let objectsInside = 0
                child.children.forEach((child) => {
                    if(child.type == 'index1') {
                        position.y = +child.text
                    } else if(child.type == 'index2') {
                        position.x = +child.text
                    } else if(child.type == 'colorIndex') {
                        const colorIndex = +child.text
                        if(playerMap.has(colorIndex)) {
                            owner = playerMap.get(colorIndex) || null
                        } else {
                            const newPlayer = new Player(child.text)
                            playerMap.set(colorIndex, newPlayer)
                            switch(colorIndex) {
                                case 0:
                                    newPlayer.color = Color('#60b55c')
                                break

                                case 1:
                                    newPlayer.color = Color('#b55c77')
                                break

                                case 2:
                                    newPlayer.color = Color('#735cb5')
                                break

                                case 3:
                                    newPlayer.color = Color('#5cb5b0')
                                break;

                                case 4:
                                    newPlayer.color = Color('#b5bc64')
                                break

                                case 5:
                                    newPlayer.color = Color('#b03900')
                                break

                                case 6:
                                    newPlayer.color = Color('#23701b')
                                break

                                case 7:
                                    newPlayer.color = Color('#666666')
                                break
                            }
                            owner = newPlayer
                        }
                    } else if(child.type == 'objectInside') {
                        console.assert(child.children.length == 1)
                        const objectInside = child.children[0]
                        if(objectsInside >= 1) {
                            console.warn(objectsInside == 1, `Can't have more then 1 unit or object on tile`, hexagonTile)
                        } else {
                            let hasObject = true
                            switch(objectInside.type) {
                                case 'pine':
                                {
                                    const tree = new Tree<HexagonTile>("" + i++, hexagonTile, 'pine')
                                    trees.push(tree)
                                }
                                break;
    
                                case 'palm':
                                {
                                    const tree = new Tree<HexagonTile>("" + i++, hexagonTile, 'palm')
                                    trees.push(tree)
                                }
                                break;
    
                                case 'town':
                                    const townhall = new TownHall<HexagonTile>("" + i++, hexagonTile)
                                    townhalls.push(townhall)
                                break;
    
                                case 'tower':
                                {
                                    const tower = new Tower<HexagonTile>('' + i++, hexagonTile, 1)
                                    towers.push(tower)
                                }
                                break;
    
                                case 'grave':
                                    const grave = new Grave<HexagonTile>('' + i++, hexagonTile)
                                    graves.push(grave)
                                break;
    
                                case 'farm':
                                    const farm = new Farm('' + i++, hexagonTile)
                                    farms.push(farm)
                                break;
    
                                case 'strong_tower':
                                {
                                    const tower = new Tower<HexagonTile>('' + i++, hexagonTile, 2)
                                    towers.push(tower)
                                }
                                break;
    
                                default:
                                    hasObject = false
                                break;
                            }
                            if(hasObject) {
                                objectsInside++
                            }
                        }

                    } else if(child.type == 'unitStrength') {
                        const unitStrength = +child.text
                        if(unitStrength > 0) {
                            if(objectsInside >= 1) {
                                console.warn(objectsInside == 1, `Can't have more then 1 unit or object on tile`, hexagonTile)
                            } else {
                                const unit = new Unit('' + i++, hexagonTile, unitStrength)
                                units.push(unit)
                                objectsInside++
                            }
                        }

                    } else if(child.type == 'unitReadyToMove') {
                        
                    } else if(child.type == 'money') {
                        
                    }
                })
                hexagonTile.owner = owner
                hexagonTile.name = position.x + " " + position.y
                hexMap.set(position.x + " " + position.y, hexagonTile)
                console.assert(hexMap.get(position.x + " " + position.y) == hexagonTile)
            }
        })
    
        this.tiles.clear()
        this.players.clear()

        hexMap.forEach((t, p) => {
            const x = +p.split(" ")[0]
            const y = +p.split(" ")[1]
            t.north    = hexMap.get((x + 0) + " " + (y + 1)) || null
            t.northEast= hexMap.get((x + 1) + " " + (y + 0)) || null
            t.southEast= hexMap.get((x + 1) + " " + (y - 1)) || null
            t.south    = hexMap.get((x + 0) + " " + (y - 1)) || null
            t.southWest= hexMap.get((x - 1) + " " + (y - 0)) || null
            t.northWest= hexMap.get((x - 1) + " " + (y + 1)) || null
        })

        console.assert((() => {
            hexMap.forEach((t, p) => {
                if(t.north) {
                    console.assert(t.north.south == t, "North/south should match")
                }
                if(t.northEast) {
                    console.assert(t.northEast.southWest == t, "Northeast/southwest should match")
                }
                if(t.southEast) {
                    console.assert(t.southEast.northWest == t, "Northwest/southeast should match")
                }
            })
            return true
        })())

        hexMap.forEach((t) => {
            this.addTile(t)
        })
        playerMap.forEach((p) => {
            this.addPlayer(p)
        })

        this.farms.clear()
        farms.forEach((farm) => {
            this.farms.set(farm.id, farm)
        })

        this.graves.clear()
        graves.forEach((grave) => {
            this.graves.set(grave.id, grave)
        })

        this.towers.clear()
        towers.forEach((tower) => {
            this.towers.set(tower.id, tower)
        })

        this.townhalls.clear()
        townhalls.forEach((townhall) => {
            this.townhalls.set(townhall.id, townhall)
        })

        this.trees.clear()
        trees.forEach((tree) => {
            this.trees.set(tree.id, tree)
        })

        this.units.clear()
        units.forEach((unit) => {
            this.units.set(unit.id, unit)
        })
    }
}

export default HexagonGame

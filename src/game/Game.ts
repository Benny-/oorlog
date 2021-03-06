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

import Player from './Player'
import Tile from './Tile'
import Farm from './Farm'
import Grave from './Grave'
import HexagonTile from './hexagon/HexagonTile'
import Tower from './Tower';
import TownHall from './TownHall'
import Tree from './Tree';
import Unit from './Unit'

abstract class Game<T extends Tile> {

    tiles: Map<string, T>
    players: Map<string, Player>
    farms: Map<string, Farm<HexagonTile>>
    graves: Map<string, Grave<HexagonTile>>
    towers: Map<string, Tower<HexagonTile>>
    townhalls: Map<string, TownHall<HexagonTile>>
    trees: Map<string, Tree<HexagonTile>>
    units: Map<string, Unit<HexagonTile>>

    constructor() {
        this.tiles = new Map<string, T>()
        this.players = new Map<string, Player>()
        this.farms = new Map<string, Farm<HexagonTile>>()
        this.graves = new Map<string, Grave<HexagonTile>>()
        this.towers = new Map<string, Tower<HexagonTile>>()
        this.townhalls = new Map<string, TownHall<HexagonTile>>()
        this.trees = new Map<string, Tree<HexagonTile>>()
        this.units = new Map<string, Unit<HexagonTile>>()
    }

    addTile(t: T) {
        console.assert(t.id)
        console.assert(!this.tiles.has(t.id))
        this.tiles.set(t.id, t)
    }

    addPlayer(p: Player) {
        console.assert(p.id)
        console.assert(!this.players.has(p.id))
        this.players.set(p.id, p)
    }
}

export default Game

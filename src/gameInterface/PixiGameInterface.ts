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

import Game from '../game/Game'
import Tile from '../game/Tile'

export abstract class PixiGameInterface<G extends Game<Tile>> {

    game: G;
    stage: PIXI.Container;

    constructor(game: G, stage: PIXI.Container) {
        this.game = game;
        this.stage = stage;
    }

    recenterStage(view: HTMLCanvasElement) {
        let lowestX = Infinity
        let highestX = -Infinity
        let lowestY = Infinity
        let highestY = -Infinity

        this.stage.children.forEach(sprite => {
            lowestY = Math.min(sprite.y, lowestY)
            highestY = Math.max(sprite.y, highestY)
    
            lowestX = Math.min(sprite.x, lowestX)
            highestX = Math.max(sprite.x, highestX)
        })

        const centerX = lowestX + (highestX - lowestX) / 2
        const centerY = lowestY + (highestY - lowestY) / 2

        // Makes sure we are viewing the center of all viewable items
        this.stage.x = -centerX + view.width / 2
        this.stage.y = -centerY + view.height / 2

        return {
            lowestX,
            highestX,
            lowestY,
            highestY,
        }
    }
}

export default PixiGameInterface

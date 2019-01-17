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
import * as Viewport from 'pixi-viewport'
import { Grammars } from 'ebnf'

import HexagonGame from './game/hexagon/HexagonGame'
import HexagonGameInterface from './gameInterface/hexagon/HexagonGameInterface'
import './css/index.css'

const mapTrio = require('./game/hexagon/maps/3tiles.txt') // Just 3 tiles
const southeast_to_northwest = require('./game/hexagon/maps/southeast_to_northwest.txt')
const southwest_to_northeast = require('./game/hexagon/maps/southwest_to_northeast.txt')
const mapHoneycomb = require('./game/hexagon/maps/honeycomb.txt') // A nice small testmap.
const mapCircles = require('./game/hexagon/maps/circles.txt')
const mapSquid = require('./game/hexagon/maps/squid.txt') // A bigger, more complex map.
const mapGrith = require('./game/hexagon/maps/grith.txt')
const mapJust = require('./game/hexagon/maps/Just antijoy map.txt')

const renderArea = document.querySelector(".render-area") as Element
const uiOverlay = document.querySelector(".ui-overlay") as Element

console.assert(renderArea)
console.assert(uiOverlay)

const loadTextures = async (images: Array<String>) => {
    let promise = new Promise((resolve, reject) => {
        let loader =PIXI.loader
            .add(images)
            .load(resolve)
    })
    await promise
    const textures = images.map((elm: string) => PIXI.loader.resources[elm].texture)
    textures.forEach(element => {
        console.assert(element != null)
    });
    return textures
}

document.addEventListener('DOMContentLoaded', async () => {
    const app : PIXI.Application = new PIXI.Application(
        window.innerWidth,
        window.innerHeight,
        {
            antialias: true,
            transparent: false,
            resolution: 1,
            backgroundColor: 0x061639
        })
    
    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        interaction: app.renderer.plugins.interaction
    })

    app.stage.addChild(viewport)

    viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate()
    
    window.addEventListener('resize', (e) => {
        app.renderer.resize(window.innerWidth, window.innerHeight)
    })
    
    renderArea.appendChild(app.renderer.view)

    const textures = await loadTextures([
        require('./assets/field_elements/castle.png'),
        require('./assets/field_elements/farm1.png'),
        require('./assets/field_elements/farm2.png'),
        require('./assets/field_elements/farm3.png'),
        require('./assets/field_elements/grave.png'),
        require('./assets/field_elements/man0.png'),
        require('./assets/field_elements/man1.png'),
        require('./assets/field_elements/man2.png'),
        require('./assets/field_elements/man3.png'),
        require('./assets/field_elements/palm.png'),
        require('./assets/field_elements/pine.png'),
        require('./assets/field_elements/strong_tower.png'),
        require('./assets/field_elements/tower.png'),
    ])
    const castleTexture = textures[0]
    const farm1Texture = textures[1]
    const farm2Texture = textures[2]
    const farm3Texture = textures[3]
    const graveTexture = textures[4]
    const man0Texture = textures[5]
    const man1Texture = textures[6]
    const man2Texture = textures[7]
    const man3Texture = textures[8]
    const palmTexture = textures[9]
    const pineTexture = textures[10]
    const strong_towerTexture = textures[11]
    const towerTexture = textures[12]

    const hexagonGame = new HexagonGame()
    hexagonGame.importYoymap(mapJust)
    const hexagonGameInterface = new HexagonGameInterface(hexagonGame, viewport, {
        castleTexture,
        farm1Texture,
        farm2Texture,
        farm3Texture,
        graveTexture,
        man0Texture,
        man1Texture,
        man2Texture,
        man3Texture,
        palmTexture,
        pineTexture,
        strong_towerTexture,
        towerTexture,
    })
    const {lowestX, highestX, lowestY, highestY} = hexagonGameInterface.recenterStage(app.view)

}, false)

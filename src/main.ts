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

import './code/HexagonTile'
import './css/index.css'
import { AssertionError } from 'assert';

const mapGrammer = require('./map_format.ebnf')
const mapParser = new Grammars.W3C.Parser(mapGrammer, {})

const mapHoneycomb = require('./maps/honeycomb.txt') // A nice small testmap
const mapSquid = require('./maps/squid.txt')

const renderArea = document.querySelector(".render-area")
const uiOverlay = document.querySelector(".ui-overlay")

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
    let app : PIXI.Application = new PIXI.Application(
        window.innerWidth,
        window.innerHeight,
        {
            antialias: true,
            transparent: false,
            resolution: 1,
            backgroundColor: 0x061639
        })

    window.addEventListener('resize', (e) => {
        app.renderer.resize(window.innerWidth, window.innerHeight)
    })

    renderArea.appendChild(app.renderer.view)

    const textures = await loadTextures([
        require('./textures/hexagon.png'),
    ])
    const hexagonTexture = textures[0]
    
    const ast = mapParser.getAST(mapSquid)

    console.assert(ast.type == 'map')
    let lowestX = Infinity
    let hihestX = -Infinity
    let lowestY = Infinity
    let hihestY = -Infinity
    ast.children.forEach((child) => {
        if(child.type == 'tile') {
            const sprite = new PIXI.Sprite(hexagonTexture)
            sprite.width = 32
            sprite.height = 32
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            child.children.forEach((child) => {
                if(child.type == 'index1') {
                    sprite.y = 32 * -child.text
                } else if(child.type == 'index2') {
                    sprite.x = 32 * +child.text
                } else if(child.type == 'colorIndex') {
                    
                } else if(child.type == 'objectInside') {
                    
                } else if(child.type == 'unitStrength') {
                    
                } else if(child.type == 'unitReadyToMove') {
                    
                } else if(child.type == 'money') {
                    
                }
            })
            sprite.y = sprite.y - sprite.x / 2
            app.stage.addChild(sprite)
        }
    })

    app.stage.children.forEach(sprite => {
        lowestY = Math.min(sprite.y, lowestY)
        hihestY = Math.max(sprite.y, hihestY)

        lowestX = Math.min(sprite.x, lowestX)
        hihestX = Math.max(sprite.x, hihestX)
    });

    const centerX = lowestX + (hihestX - lowestX) / 2
    const centerY = lowestY + (hihestY - lowestY) / 2

    // Makes sure we are viewing the center of all viewable items
    app.stage.x = -centerX + app.view.width / 2
    app.stage.y = -centerY + app.view.height / 2

}, false)

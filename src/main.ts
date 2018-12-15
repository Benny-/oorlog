import * as PIXI from 'pixi.js'
import { Grammars } from 'ebnf'

import './code/HexagonTile'
import './css/index.css';

const mapGrammer = require('./map_format.ebnf')
let mapParser = new Grammars.W3C.Parser(mapGrammer, {});

const renderArea = document.querySelector(".render-area");
const uiOverlay = document.querySelector(".ui-overlay");

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
    {
        const sprite = new PIXI.Sprite(hexagonTexture)
        sprite.width = 32
        sprite.height = 32
        sprite.x = 0
        sprite.y = 0
        app.stage.addChild(sprite);
    }
    {
        const sprite = new PIXI.Sprite(hexagonTexture)
        sprite.width = 32
        sprite.height = 32
        sprite.x = 32
        sprite.y = 0
        app.stage.addChild(sprite);
    }
    {
        const sprite = new PIXI.Sprite(hexagonTexture)
        sprite.width = 32
        sprite.height = 32
        sprite.x = 32
        sprite.y = 32
        app.stage.addChild(sprite);
    }

}, false)

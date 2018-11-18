import * as PIXI from 'pixi.js'
import './code/HexagonTile'

import './css/index.css';

let body = document.body

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

    body.appendChild(app.renderer.view)

    const textures = await loadTextures([
        require('./textures/hexagon.png'),
    ])

    const hexagonTexture = textures[0]
    console.log(hexagonTexture)
    const sprite = new PIXI.Sprite(hexagonTexture)
    app.stage.addChild(sprite);

}, false)

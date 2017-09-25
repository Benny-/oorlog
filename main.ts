import * as PIXI from 'pixi.js';

document.addEventListener('DOMContentLoaded', () => {
    let renderer = PIXI.autoDetectRenderer(
        600,
        400,
        {antialias: true, transparent: false, resolution: 1, backgroundColor: 0xFFFFFF}
    );
}, false);

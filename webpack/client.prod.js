'use strict';

var webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')

const common = require('./client.common.js')

var distDir = path.resolve(__dirname, 'dist')

module.exports = merge(common, {
    mode: 'production',

    // Configure output folder and file
    output: {
        path: distDir,
        filename: 'main_bundle.js'
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.SOCKET_SERVER': null
        })
    ],
})

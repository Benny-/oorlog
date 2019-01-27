'use strict';

var webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')

const common = require('./client.common.js')

module.exports = merge(common, {
    mode: 'development',

    // Make errors more clear
    devtool: 'inline-source-map',

    devServer: {
        contentBase: './dist',
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.SOCKET_SERVER': JSON.stringify('http://localhost:8081/')
        })
    ],
})

'use strict';

const path = require('path')
var webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

var distDir = path.resolve(__dirname, '..', 'dist', 'server')

module.exports = {
    target: 'node',

    // Entry point : first executed file
    // This may be an array. It will result in many output files.
    entry: './src/server.ts',

    resolve: {
        extensions: [
            '.wasm',
            '.mjs',
            '.js',
            '.json',
            '.ts',
            '.tsx',
        ],
    },

    // Configure output folder and file
    output: {
        path: distDir,
        filename: 'server.js'
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.(txt|ebnf)$/,
                use: 'raw-loader',
            },
        ],
    },

    externals: [nodeExternals({
        modulesFromFile: true
    })],

    plugins: [
        new CleanWebpackPlugin([distDir]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
}

'use strict';

var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')

var distDir = path.resolve(__dirname, '..', 'dist', 'client')

module.exports = {
    target: 'web',

    // Entry point : first executed file
    // This may be an array. It will result in many output files.
    entry: './src/client.ts',

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
        filename: 'main_bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.(txt|ebnf)$/,
                use: 'raw-loader'
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {

                    },
                  },
                ],
            },
        ],
    },

    devServer: {
        contentBase: distDir,
    },

    plugins: [
        new CleanWebpackPlugin([distDir]),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
}

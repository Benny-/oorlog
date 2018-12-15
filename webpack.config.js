'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

var distDir = path.resolve(__dirname, 'dist');

module.exports = {
    // Entry point : first executed file
    // This may be an array. It will result in many output files.
    entry: './src/main.ts',

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

    // Make errors more clear
    devtool: 'inline-source-map',

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
        contentBase: './dist',
    },

    plugins: [
        new CleanWebpackPlugin([distDir]),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
    ],
};
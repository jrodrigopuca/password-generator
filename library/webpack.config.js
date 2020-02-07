const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
    mode:'production',
    module: {
        rules: [
            {
                test: /(\\.jsx|\\.js)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    { loader: "html-loader", options: { minimize: true } }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ],
    entry:{
        generator:'./src/generator.js'
    },

    output: {
        filename: 'generator.bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget:'var',
        library:'PG'
    },
    externals: [
        /an-array-of-*-words/,
    ],
    optimization:{
        splitChunks:{chunks:'all'}, 
        
    }
}
/*

    entry:{
        index:'./src/index.js',
        generator:'./src/generator.js'
    },

    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

*/



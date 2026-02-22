const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
    mode:'production',
    module: {
        rules: [
            {
                test: /(\\.jsx|\\.js)$/,
                exclude: [/node_modules/, /v1/],
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
    entry: './src/index.js',
    output: {
        filename: 'generator.js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget:'var',
        library:'Generator'
    },
    optimization:{
        splitChunks:{chunks:'all'} 
    }
}




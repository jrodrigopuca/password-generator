const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
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
    ]
}

/*
const path = require('path');

module.exports = {
    entry: './src/generator.js',
    output: {
        filename: 'generator.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'var',
        library: 'PG'
    }
}
*/
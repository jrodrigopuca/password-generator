const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    mode:'development',
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
}




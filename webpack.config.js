const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: "./src/app.js"
    },
    output: {
        path: './build',
        publicPath: './',
        filename: 'build.js'
    },
    watch: true,

    debug: true,

    devtool: "source-map",

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules)/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?name=images/[name].[ext]'
                ]
            },
            {
                test: /\.jade$/,
                loader: "jade"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!sass')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css', {allChunks: true})
    ]
}
const webpack = require('webpack');

const config = {

    mode: 'development',
    output: {
        filename: 'main.js'
    },
    entry: './src/index.js',
    devtool: 'source-map',
    devServer: {
        static: {
            directory: __dirname,
            publicPath: '/',
        }
    }
};

module.exports = config;

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env = {}) => {
    const plugins = [];
    const isProd = !!env.prod;
    return {
        target: 'node',
        externals: [nodeExternals()],
        entry: {
            server: './src/server/bin/www', // here may have to be something else.. . 
        },
        output: {
            path: path.join(__dirname, 'dist'),
            publicPath: '/',
            filename: '[name].js'
        },
        node: { 
            // Need this when working with express, otherwise the build fails
            __dirname: true,   // if you don't put this is, __dirname
            __filename: false,  // and __filename return blank or /
        },
    }
};
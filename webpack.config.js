const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}) => {
    const plugins = [];
    const isProd = !!env.prod;
    return {
        target: 'web',
        entry: {
            main: './src/ui/js/app.js'
        },
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, 'dist'),
            publicPath: '/',
            filename: 'app.min.js' // or '[name].[chunkhash].js',
        },
        plugins: [new MiniCssExtractPlugin({
            filename: '[name].css',
            // }),
            // new HtmlWebPackPlugin({
            //     template: './src/ui/html/pages/index.ejs',
            //     filename: './src/index.html',
            //     excludeChunks: ['server']
        })
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.scss$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                }
                // {
                //   // Loads the javacript into html template provided.
                //   // Entry point is set below in HtmlWebPackPlugin in Plugins 
                //   test: /\.html$/,
                //   use: [{loader: 'html-loader'}]
                // },
                // {
                //     test: /\.ejs$/,
                //     loader: 'ejs-html-loader', 
                //     query: {
                //         interpolate: /<\$=([\s\S]+?)\$>/g,
                //         evaluate: /<\$([\s\S]+?)\$>/g,
                //       }
                // }
            ]
        },
        devServer: {
            contentBase: './src'
        }
    };
}
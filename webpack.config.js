/**
 * A collection of popular layouts and patterns made with CSS (https://csslayout.io)
 * (c) 2019 - 2020 Nguyen Huu Phuoc <https://twitter.com/nghuuphuoc>
 */

const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const plugins = [
    new HtmlWebPackPlugin({
        template: './client/index.html',
        filename: './index.html',
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
];
  
if (process.env.NODE_ENV === "analyse") {
    plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
    entry: {
        'vendor-styles': [
            './vendors/normalize.css@8.0.1/normalize.css',
            './vendors/highlight.js@9.12.0/theme.min.css',
        ],
        // The CSS for client should come after `vendor-styles`
        client: './client/index.tsx',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        // It's very important
        // All the chunk generated by webpack then will be loaded such as
        // <script charset="utf-8" src="/[chunk-name].bundle.js"></script>
        // The script is accessible from any page that exported by a 3rd party such as react-snap
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                // The order of loaders are very important
                // It will make the @loadable/component work
                use: ['babel-loader', 'ts-loader'],
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: 'source-map-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    devtool: 'cheap-module-eavl-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true,
        port: 1234,
    },
    plugins,
    // See https://webpack.js.org/guides/caching/
    optimization: {
        runtimeChunk: 'single',
        moduleIds: 'hashed',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    // sync + async chunks
                    chunks: 'all',
                    name: 'vendors',
                    // import file path containing node_modules
                    test: /[\\/]node_modules[\\/]/,
                    priority: 20,
                },
                /*
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'all',
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true,
                },
                */
            },
        },
    }, 
};

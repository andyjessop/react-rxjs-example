var path = require('path');
var webpack = require('webpack');
require('es6-promise').polyfill();

var config = {
    devtool: 'source-map',

    entry: [
        './src/js/index.jsx' // appʼs entry point
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: path.join(__dirname, 'dist/src'),
        filename: 'build.js',
        publicPath: '/src/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.less$/,
                loader: "style!css!less"
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=100000"
            },
            {
                test: /\.jpg$/,
                loader: "file-loader"
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            }
        ]
    }
};

if (process.env.NODE_ENV !== 'production') {
    config.module.loaders[0].loaders.unshift('react-hot');
    config.plugins = [
        new webpack.HotModuleReplacementPlugin()
    ];
    config.entry.unshift(
        'webpack-dev-server/client?http://0.0.0.0:3000',// WebpackDevServer host and port
        'webpack/hot/only-dev-server'// "only" prevents reload on syntax errors
    );
} else {
    // Bizarre you have to do this because it would seem that if
    // process.env.NODE_ENV is production, the code below would merely
    // be a reinstatement of that, but in fact it is not.
    config.plugins = [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ];
}

module.exports = config;

const path = require('path');

module.exports = {
    devtool: 'source-map',
    mode: 'development',
    entry: [
        'webpack-dev-server/client?http://127.0.0.1:3000',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    resolve: {
        modules: [
            path.resolve(__dirname + '/src'),
            path.resolve(__dirname + '/node_modules')
        ],
        alias: {
            'long-press-event':
                path.resolve(__dirname + '/node_modules/long-press-event/src/long-press-event.js')
        },
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader",
            include: path.join(__dirname, 'src')
        }, {
            test: /\.styl$/,
            use: [
                'style-loader',
                'css-loader?modules',
                'stylus-loader'
            ]
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
            ]
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        }]
    }
};

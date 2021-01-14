const { mergeWithCustomize } = require('webpack-merge');
const common = require('./webpack.config.js');


module.exports = mergeWithCustomize(
    {
        customizeArray(a, b, key) {
            if (key === 'entry') {
                return b
            }
        }
    }
)(common, {
    devtool: 'none',
    mode: 'production',
    entry: [
        './src/index'
    ]
});
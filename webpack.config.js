//////////////////////////////////////////////////////////////////////
// Webpack Config for UMD packaging (release)
// -----
// Copyright (c) Kiruse 2021. Licensed under MIT License.
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/miniquery.esm.js',
    output: {
        path: path.resolve(__dirname, 'src'),
        filename: 'miniquery.js',
        library: {
            type: 'var',
            name: 'miniquery',
            export: 'default',
        }
    },
    devtool: 'source-map',
    target: 'web',
};

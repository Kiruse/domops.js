//////////////////////////////////////////////////////////////////////
// Webpack Config for UMD packaging (release)
// -----
// Copyright (c) Kiruse 2021. Licensed under MIT License.
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/domops.esm.js',
    output: {
        path: path.resolve(__dirname, 'src'),
        filename: 'domops.js',
        library: {
            type: 'var',
            name: 'domops',
            export: 'default',
        }
    },
    devtool: 'source-map',
    target: 'web',
};

//////////////////////////////////////////////////////////////////////
// Webpack Config for UMD packaging (release)
// -----
// Copyright (c) Kiruse 2021. Licensed under MIT License.
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './dist/domops.esm.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
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

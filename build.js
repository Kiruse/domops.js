//////////////////////////////////////////////////////////////////////
// Simple build script
// -----
// Copyright (c) Kiruse 2021. Licensed under MIT License
const {execSync} = require('child_process');
const {copyFileSync, unlinkSync, rmSync, mkdirSync} = require('fs');
const path = require('path');
const distdir = path.resolve(__dirname, 'dist');

rmSync(distdir, {recursive: true, force: true});
mkdirSync('dist');

execSync('npx tsc -m commonjs -t esnext -d true src/index.ts');
execSync(`npx tsc -m esnext -t esnext -d true src/index.ts -outDir ${distdir}`);
moveSync(path.resolve(distdir, 'index.js'), path.resolve(distdir, 'domops.esm.js'));
moveSync(path.resolve(distdir, 'index.d.ts'), path.resolve(distdir, 'domops.esm.d.ts'));
execSync('npx webpack')

function moveSync(from, to) {
  copyFileSync(from, to);
  unlinkSync(from);
}

#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const ignoredRoots = new Set(['.git', '.github', 'dist', 'node_modules', 'scripts', 'api']);
const ignoredFiles = new Set(['.DS_Store', 'package.json', 'package-lock.json', 'server.js']);

function shouldIgnore(relativePath) {
  const [root] = relativePath.split(path.sep);
  if (ignoredRoots.has(root)) {
    return true;
  }
  const base = path.basename(relativePath);
  if (ignoredFiles.has(base)) {
    return true;
  }
  return false;
}

function copyRecursive(src, dest, relativePath) {
  if (shouldIgnore(relativePath)) {
    return;
  }
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((entry) => {
      const childSrc = path.join(src, entry);
      const childDest = path.join(dest, entry);
      const childRelative = path.join(relativePath, entry);
      copyRecursive(childSrc, childDest, childRelative);
    });
  } else if (stats.isFile()) {
    fs.copyFileSync(src, dest);
  }
}

function build() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
  fs.readdirSync(rootDir).forEach((entry) => {
    const src = path.join(rootDir, entry);
    const dest = path.join(distDir, entry);
    copyRecursive(src, dest, entry);
  });
  console.log('Static assets written to dist/.');
}

build();

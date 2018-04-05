#!/usr/bin/env node

'use strict';

const pkg = require('../package.json');
const DependencyTree = require('dependency-tree');
const path = require('path');
const inspect = require('util').inspect;
const globule = require('globule');
const commonPath = require('common-path-prefix');

const SCOPE = '@node-red';
const ROOT = path.join(__dirname, '..');

const main = args => {
  const pkgsToPaths = pkg.packages;
  const rootDependencies = new Set(
    Object.keys(pkg.dependencies).concat(
      Object.keys(pkg.optionalDependencies || [])
    )
  );
  const pathsToPkgs = Object.keys(pkgsToPaths).reduce((acc, pkg) => {
    acc[pkgsToPaths[pkg]] = pkg;
    return acc;
  }, {});

  Object.keys(pkgsToPaths)
    .map(pkgName => {
      const filepaths = globule.find(pkgsToPaths[pkgName]);
      const basepath = path.join(ROOT, commonPath(filepaths));
      const dependencies = new Set();
      const visited = {};
      filepaths.forEach(filepath => {
        if (!visited[filepath]) {
          DependencyTree.toList({
            filename: filepath,
            visited: visited,
            directory: ROOT,
            filter: (toFilepath, fromFilepath) =>
              fromFilepath.indexOf(basepath) === 0
          }).forEach(filepath => {
            console.error(filepath);
            if (filepath.indexOf(SCOPE) > -1) {
              dependencies.add(
                pathsToPkgs[path.dirname(path.relative(ROOT, filepath))]
              );
            } else if (filepath.indexOf('node_modules') > -1) {          
              const dep = path
                .relative(
                  path.join(ROOT, 'node_modules'),
                  path.dirname(filepath)
                )
                .split(path.sep)
                .shift();
              if (rootDependencies.has(dep)) {
                dependencies.add(dep);
              } else {
                console.error(`unknown dependency: ${dep}`);
              }
            } else {
              console.error(`unknown dependency at path: ${filepath}`);
            }
          });
        }
      });
      return dependencies;
    })
    .forEach(info => {
      console.log(info);
    });
};

if (require.main === module) {
  main(process.argv);
}

module.exports = main;

'use strict';

const path = require('path');

const RUNTIME_PATH = 'packages/runtime';
const CORE_NODES_PATH = 'packages/core-nodes';;

module.exports = wallaby => {
  process.env.NODE_PATH += path.delimiter 
    + path.join(wallaby.localProjectDir, RUNTIME_PATH, 'node_modules') 
    + path.delimiter 
    + path.join(wallaby.localProjectDir, CORE_NODES_PATH, 'node_modules');

  return {
    files: [
      `${CORE_NODES_PATH}/nodes/**/*.js`,
      {pattern: `${CORE_NODES_PATH}/nodes/**/*.html`, instrument: false},
      {pattern: `${CORE_NODES_PATH}/test/resources/**`, instrument: false},
      `${CORE_NODES_PATH}/test/helper.js`,
      `${RUNTIME_PATH}/api/**/*.js`,
      `${RUNTIME_PATH}/runtime/**/*.js`,
      `${RUNTIME_PATH}/red.js`,
      `${RUNTIME_PATH}/package.json`,
    ],

    tests: [
      `${CORE_NODES_PATH}/test/**/*_spec.js`,
      `${RUNTIME_PATH}/test/**/*_spec.js`
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    setup() {
      wallaby.testFramework.timeout(3000);
    },
    
    debug:true
  };
};

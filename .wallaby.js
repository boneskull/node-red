'use strict';

module.exports = wallaby => {
  return {
    files: [
      'packages/core-nodes/nodes/**/*.js',
      'packages/core-nodes/nodes/**/*.html',
      'packages/runtime/api/**/*.js',
      'packages/runtime/runtime/**/*.js',
      'packages/core-nodes/test/helper.js'
    ],

    tests: [
      'packages/core-nodes/test/**/*_spec.js',
      'packages/runtime/test/**/*_spec.js'
    ],

    env: {
      type: 'node'
    },

    setup() {
      wallaby.testFramework.timeout(3000);
    },
    debug:true
  };
};

/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var path = require("path");

module.exports = function(grunt) {

    var nodemonArgs = ["-v"];
    var flowFile = grunt.option('flowFile');
    if (flowFile) {
        nodemonArgs.push(flowFile);
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            dist: ".dist"
        },
        webdriver: {
            all: {
                configFile: 'test/editor/wdio.conf.js'
            }
        },
        mocha_istanbul: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reportFormats: ['lcov','html'],
                print: 'both'
            },
            all: { src: ['test/**/*_spec.js'] },
            core: { src: ["test/_spec.js","test/red/**/*_spec.js"]},
            nodes: { src: ["test/nodes/**/*_spec.js"]}
        },
        jshint: {
            options: {
                jshintrc:true
                // http://www.jshint.com/docs/options/
                //"asi": true,      // allow missing semicolons
                //"curly": true,    // require braces
                //"eqnull": true,   // ignore ==null
                //"forin": true,    // require property filtering in "for in" loops
                //"immed": true,    // require immediate functions to be wrapped in ( )
                //"nonbsp": true,   // warn on unexpected whitespace breaking chars
                ////"strict": true, // commented out for now as it causes 100s of warnings, but want to get there eventually
                //"loopfunc": true, // allow functions to be defined in loops
                //"sub": true       // don't warn that foo['bar'] should be written as foo.bar
            },
            all: [
                'Gruntfile.js',
                'red.js',
                'red/**/*.js',
                'nodes/core/*/*.js',
                'editor/js/**/*.js'
            ],
            core: {
                files: {
                    src: [
                        'Gruntfile.js',
                        'red.js',
                        'red/**/*.js'
                    ]
                }
            },
            nodes: {
                files: {
                    src: [ 'nodes/core/*/*.js' ]
                }
            },
            editor: {
                files: {
                    src: [ 'editor/js/**/*.js' ]
                }
            },
            tests: {
                files: {
                    src: ['test/**/*.js']
                },
                options: {
                    "expr": true
                }
            }
        },
        
        jsonlint: {
            messages: {
                src: [
                    'nodes/core/locales/en-US/messages.json',
                    'red/api/locales/en-US/editor.json',
                    'red/runtime/locales/en-US/runtime.json'
                ]
            },
            keymaps: {
                src: [
                    'editor/js/keymap.json'
                ]
            }
        },
        watch: {
            js: {
                files: [
                    'editor/js/**/*.js'
                ],
                tasks: ['copy:build','concat','uglify','attachCopyright:js']
            },
            sass: {
                files: [
                    'editor/sass/**/*.scss'
                ],
                tasks: ['sass','attachCopyright:css']
            },
            json: {
                files: [
                    'nodes/core/locales/en-US/messages.json',
                    'red/api/locales/en-US/editor.json',
                    'red/runtime/locales/en-US/runtime.json'
                ],
                tasks: ['jsonlint:messages']
            },
            keymaps: {
                files: [
                    'editor/js/keymap.json'
                ],
                tasks: ['jsonlint:keymaps','copy:build']
            },
            misc: {
                files: [
                    'CHANGELOG.md'
                ],
                tasks: ['copy:build']
            }
        },

        nodemon: {
            /* uses .nodemonignore */
            dev: {
                script: 'red.js',
                options: {
                    args: nodemonArgs,
                    ext: 'js,html,json',
                    watch: [
                        'red','nodes'
                    ]
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        chmod: {
            options: {
                mode: '755'
            },
            release: {
                src: [
                    path.resolve('<%= paths.dist %>/node-red-<%= pkg.version %>/nodes/core/hardware/nrgpio*'),
                    path.resolve('<%= paths.dist %>/node-red-<%= pkg.version %>/red/runtime/storage/localfilesystem/projects/git/node-red-*sh')
                ]
            }
        },
        compress: {
            release: {
                options: {
                    archive: '<%= paths.dist %>/node-red-<%= pkg.version %>.zip'
                },
                expand: true,
                cwd: '<%= paths.dist %>/',
                src: ['node-red-<%= pkg.version %>/**']
            }
        },
        release: {
            files: [
              {
                mode: true,
                expand: true,
                src: [
                  '*.md',
                  'LICENSE',
                  'package.json',
                  'settings.js',
                  'red.js',
                  'lib/.gitignore',
                  'nodes/*.demo',
                  'nodes/core/**',
                  'red/**',
                  'public/**',
                  'templates/**',
                  'bin/**'
                ],
                dest: path.resolve('<%= paths.dist %>/node-red-<%= pkg.version %>')
              }
            ]
          }
    
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-chmod');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-webdriver');

    grunt.registerTask('default',
        'Builds editor content then runs code style checks and unit tests on all components',
        ['build','test-core','test-editor','test-nodes']);

    grunt.registerTask('test-core',
        'Runs code style check and unit tests on core runtime code',
        ['build','mocha_istanbul:core']);

    grunt.registerTask('test-editor',
        'Runs code style check on editor code',
        ['jshint:editor']);

    grunt.registerTask('test-ui',
        'Builds editor content then runs unit tests on editor ui',
        ['build','jshint:editor','webdriver:all']);

    grunt.registerTask('test-nodes',
        'Runs unit tests on core nodes',
        ['build','mocha_istanbul:nodes']);

    grunt.registerTask('release',
        'Create distribution zip file',
        ['build','clean:release','copy:release','chmod:release','compress:release']);

    grunt.registerTask('coverage',
        'Run Istanbul code test coverage task',
        ['build','mocha_istanbul:all']);
};

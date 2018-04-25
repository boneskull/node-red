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

const PACKAGES_PATH = path.join(__dirname, 'packages');
const EDITOR_PATH = path.join(PACKAGES_PATH, 'editor');
const RUNTIME_PATH = path.join(PACKAGES_PATH, 'runtime');
const CORE_NODES_PATH = path.join(PACKAGES_PATH, 'core-nodes');
const BUILD_PATH = path.join(__dirname, 'public');
const CLI_PATH = path.join(PACKAGES_PATH, 'cli');

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
                configFile: path.join(EDITOR_PATH, 'test', 'wdio.conf.js')
            }
        },
        mocha_istanbul: {
            options: {
                timeout: 3000,
                ignoreLeaks: false,
                reportFormats: ['lcov','html'],
                print: 'both'
            },
            all: { src: [`${PACKAGES_PATH}/**/test/**/*_spec.js`]  },
            runtime: { src: [`"${RUNTIME_PATH}/test/**/*_spec.js`] },
            nodes: { src: [`${CORE_NODES_PATH}/test/**/*_spec.js`] }
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
                `${RUNTIME_PATH}/red.js`,
                `${RUNTIME_PATH}/@(api|runtime)/**/*.js`,
                `${CORE_NODES_PATH}/nodes/**/*.js`,
                `${EDITOR_PATH}/js/**/*.js`
            ],
            root: {
                files: {
                    src: ['Gruntfile.js']
                }
            },
            runtime: {
                files: {
                    src: [
                        `${RUNTIME_PATH}/red.js`,
                        `${RUNTIME_PATH}/@(api|runtime)/**/*.js`,
                    ]
                }
            },
            nodes: {
                files: {
                    src: [ `${CORE_NODES_PATH}/nodes/**/*.js` ]
                }
            },
            editor: {
                files: {
                    src: [ `${EDITOR_PATH}/js/**/*.js` ]
                }
            },
            tests: {
                files: {
                    src: [ `${PACKAGES_PATH}/*/test/**/*.js` ]
                },
                options: {
                    "expr": true
                }
            }
        },
        
        concat: {
            options: {
                separator: ";",
            },
            build: {
                src: [
                    // Ensure editor source files are concatenated in
                    // the right order
                    `${EDITOR_PATH}/js/red.js`,
                    `${EDITOR_PATH}/js/events.js`,
                    `${EDITOR_PATH}/js/i18n.js`,
                    `${EDITOR_PATH}/js/settings.js`,
                    `${EDITOR_PATH}/js/user.js`,
                    `${EDITOR_PATH}/js/comms.js`,
                    `${EDITOR_PATH}/js/text/bidi.js`,
                    `${EDITOR_PATH}/js/text/format.js`,
                    `${EDITOR_PATH}/js/ui/state.js`,
                    `${EDITOR_PATH}/js/nodes.js`,
                    `${EDITOR_PATH}/js/history.js`,
                    `${EDITOR_PATH}/js/validators.js`,
                    `${EDITOR_PATH}/js/ui/utils.js`,
                    `${EDITOR_PATH}/js/ui/common/editableList.js`,
                    `${EDITOR_PATH}/js/ui/common/checkboxSet.js`,
                    `${EDITOR_PATH}/js/ui/common/menu.js`,
                    `${EDITOR_PATH}/js/ui/common/panels.js`,
                    `${EDITOR_PATH}/js/ui/common/popover.js`,
                    `${EDITOR_PATH}/js/ui/common/searchBox.js`,
                    `${EDITOR_PATH}/js/ui/common/tabs.js`,
                    `${EDITOR_PATH}/js/ui/common/stack.js`,
                    `${EDITOR_PATH}/js/ui/common/typedInput.js`,
                    `${EDITOR_PATH}/js/ui/actions.js`,
                    `${EDITOR_PATH}/js/ui/deploy.js`,
                    `${EDITOR_PATH}/js/ui/diff.js`,
                    `${EDITOR_PATH}/js/ui/keyboard.js`,
                    `${EDITOR_PATH}/js/ui/workspaces.js`,
                    `${EDITOR_PATH}/js/ui/view.js`,
                    `${EDITOR_PATH}/js/ui/sidebar.js`,
                    `${EDITOR_PATH}/js/ui/palette.js`,
                    `${EDITOR_PATH}/js/ui/tab-info.js`,
                    `${EDITOR_PATH}/js/ui/tab-config.js`,
                    `${EDITOR_PATH}/js/ui/palette-editor.js`,
                    `${EDITOR_PATH}/js/ui/editor.js`,
                    `${EDITOR_PATH}/js/ui/tray.js`,
                    `${EDITOR_PATH}/js/ui/clipboard.js`,
                    `${EDITOR_PATH}/js/ui/library.js`,
                    `${EDITOR_PATH}/js/ui/notifications.js`,
                    `${EDITOR_PATH}/js/ui/search.js`,
                    `${EDITOR_PATH}/js/ui/typeSearch.js`,
                    `${EDITOR_PATH}/js/ui/subflow.js`,
                    `${EDITOR_PATH}/js/ui/userSettings.js`,
                    `${EDITOR_PATH}/js/ui/projects/projects.js`,
                    `${EDITOR_PATH}/js/ui/projects/projectSettings.js`,
                    `${EDITOR_PATH}/js/ui/projects/projectUserSettings.js`,
                    `${EDITOR_PATH}/js/ui/projects/tab-versionControl.js`,
                    `${EDITOR_PATH}/js/ui/touch/radialMenu.js`
                ],
                dest: `${BUILD_PATH}/red/red.js`
            },
            vendor: {
                files: {
                    [`${BUILD_PATH}/vendor/vendor.js`]: [
                        `${EDITOR_PATH}/vendor/jquery/js/jquery-1.11.3.min.js`,
                        `${EDITOR_PATH}/vendor/bootstrap/js/bootstrap.min.js`,
                        `${EDITOR_PATH}/vendor/jquery/js/jquery-ui-1.10.3.custom.min.js`,
                        `${EDITOR_PATH}/vendor/jquery/js/jquery.ui.touch-punch.min.js`,
                        `${EDITOR_PATH}/vendor/marked/marked.min.js`,
                        `${EDITOR_PATH}/vendor/d3/d3.v3.min.js`,
                        `${EDITOR_PATH}/vendor/i18next/i18next.min.js`
                    ],
                    [`${BUILD_PATH}/vendor/vendor.css`]: [
                        // TODO: resolve relative resource paths in
                        //       bootstrap/FA/jquery
                    ],
                    [`${BUILD_PATH}/vendor/jsonata/jsonata.min.js`]: [
                        `${EDITOR_PATH}/node_modules/jsonata/jsonata-es5.min.js`,
                        `${EDITOR_PATH}/vendor/jsonata/formatter.js`
                    ],
                    [`${BUILD_PATH}/vendor/ace/worker-jsonata.js`]: [
                        `${EDITOR_PATH}/node_modules/jsonata/jsonata-es5.min.js`,
                        `${EDITOR_PATH}/vendor/jsonata/worker-jsonata.js`
                    ]
                }
            }
        },

        uglify: {
            build: {
                files: {
                    [`${BUILD_PATH}/red/red.min.js`]: `${BUILD_PATH}/red/red.js`,
                    [`${BUILD_PATH}/red/main.min.js`]: `${BUILD_PATH}/red/main.js`,
                    [`${BUILD_PATH}/vendor/ace/mode-jsonata.js`]: `${EDITOR_PATH}/vendor/jsonata/mode-jsonata.js`,
                    [`${BUILD_PATH}/vendor/ace/snippets/jsonata.js`]: `${EDITOR_PATH}/vendor/jsonata/snippets-jsonata.js`
                }
            }
        },

        sass: {
            build: {
                options: {
                    outputStyle: 'compressed'
                },
                files: [{
                    dest: `${BUILD_PATH}/red/style.min.css`,
                    src: `${EDITOR_PATH}/sass/style.scss`
                },
                {
                    dest: `${BUILD_PATH}/vendor/bootstrap/css/bootstrap.min.css`,
                    src: `${EDITOR_PATH}/vendor/bootstrap/css/bootstrap.css`
                }]
            }
        },

        jsonlint: {
            messages: {
                src: [
                    `${CORE_NODES_PATH}nodes/locales/en-US/messages.json`,
                    `${RUNTIME_PATH}/api/locales/en-US/editor.json`,
                    `${RUNTIME_PATH}/runtime/locales/en-US/runtime.json`
                ]
            },
            keymaps: {
                src: [
                    `${EDITOR_PATH}/js/keymap.json`
                ]
            }
        },

        attachCopyright: {
            js: {
                src: [
                    `${BUILD_PATH}/red/red.min.js`,
                    `${BUILD_PATH}/red/main.min.js`
                ]
            },
            css: {
                src: [
                    `${BUILD_PATH}/red/style.min.css`
                ]
            }
        },
        clean: {
            build: {
                src: [
                    `${BUILD_PATH}/red`,
                    `${BUILD_PATH}/index.html`,
                    `${BUILD_PATH}/favicon.ico`,
                    `${BUILD_PATH}/icons`,
                    `${BUILD_PATH}/vendor`
                ]
            },
            // release: {
            //     src: [
            //         '<%= paths.dist %>'
            //     ]
            // }
        },        

        watch: {
            js: {
                files: [
                    `${EDITOR_PATH}/js/**/*.js`
                ],
                tasks: ['copy:build','concat','uglify','attachCopyright:js']
            },
            sass: {
                files: [
                    `${EDITOR_PATH}/sass/**/*.scss`
                ],
                tasks: ['sass','attachCopyright:css']
            },
            json: {
                files: [
                    `${CORE_NODES_PATH}/nodes/locales/en-US/messages.json`,
                    `${RUNTIME_PATH}/api/locales/en-US/editor.json`,
                    `${RUNTIME_PATH}/runtime/locales/en-US/runtime.json`
                ],
                tasks: ['jsonlint:messages']
            },
            keymaps: {
                files: [
                    `${EDITOR_PATH}/js/keymap.json`
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
                script: `${CLI_PATH}/lib/cli.js`,
                options: {
                    args: nodemonArgs,
                    ext: 'js,html,json',
                    watch: [
                        RUNTIME_PATH,
                        CORE_NODES_PATH                
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

        copy: {
            build: {
                files:[
                    {
                        src: `${EDITOR_PATH}/js/main.js`,
                        dest: `${BUILD_PATH}/red/main.js`
                    },
                    {
                        src: `${EDITOR_PATH}/js/keymap.json`,
                        dest: `${BUILD_PATH}/red/keymap.json`
                    },
                    {
                        cwd: `${EDITOR_PATH}/images`,
                        src: '**',
                        expand: true,
                        dest: `${BUILD_PATH}/red/images/`
                    },
                    {
                        cwd: `${EDITOR_PATH}/vendor`,
                        src: [
                            'ace/**',
                            //'bootstrap/css/**',
                            'bootstrap/img/**',
                            'jquery/css/**',
                            'font-awesome/**'
                        ],
                        expand: true,
                        dest: `${BUILD_PATH}/vendor/`
                    },
                    {
                        cwd: `${EDITOR_PATH}/icons`,
                        src: '**',
                        expand: true,
                        dest: `${BUILD_PATH}/icons/`
                    },
                    {
                        expand: true,
                        src: [`${EDITOR_PATH}/index.html`, `${EDITOR_PATH}/favicon.ico`],
                        dest: `${BUILD_PATH}/`,
                        flatten: true
                    },
                    {
                        src: 'CHANGELOG.md',
                        dest: `${BUILD_PATH}/red/about`
                    }
                ]
            },
            // XXX: fix w/r/t Lerna
            // release: {
            //     files: [{
            //         mode: true,
            //         expand: true,
            //         src: [
            //             '*.md',
            //             'LICENSE',
            //             'package.json',
            //             'settings.js',
            //             'red.js',
            //             'lib/.gitignore',
            //             'nodes/*.demo',
            //             'nodes/core/**',
            //             'red/**',
            //             `${BUILD_PATH}/**`,
            //             `${EDITOR_PATH}/templates/**`,
            //             'bin/**'
            //         ],
            //         dest: path.resolve('<%= paths.dist %>/node-red-<%= pkg.version %>')
            //     }]
            // }
        },

        // chmod: {
        //     options: {
        //         mode: '755'
        //     },
        //     release: {
        //         src: [
        //             path.resolve('<%= paths.dist %>/node-red-<%= pkg.version %>/nodes/core/hardware/nrgpio*'),
        //             path.resolve('<%= paths.dist %>/node-red-<%= pkg.version %>/red/runtime/storage/localfilesystem/projects/git/node-red-*sh')
        //         ]
        //     }
        // },
        // compress: {
        //     release: {
        //         options: {
        //             archive: '<%= paths.dist %>/node-red-<%= pkg.version %>.zip'
        //         },
        //         expand: true,
        //         cwd: '<%= paths.dist %>/',
        //         src: ['node-red-<%= pkg.version %>/**']
        //     }
        // }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-chmod');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-webdriver');

    grunt.registerMultiTask('attachCopyright', function() {
        var files = this.data.src;
        var copyright = "/**\n"+
            " * Copyright JS Foundation and other contributors, http://js.foundation\n"+
            " *\n"+
            " * Licensed under the Apache License, Version 2.0 (the \"License\");\n"+
            " * you may not use this file except in compliance with the License.\n"+
            " * You may obtain a copy of the License at\n"+
            " *\n"+
            " * http://www.apache.org/licenses/LICENSE-2.0\n"+
            " *\n"+
            " * Unless required by applicable law or agreed to in writing, software\n"+
            " * distributed under the License is distributed on an \"AS IS\" BASIS,\n"+
            " * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n"+
            " * See the License for the specific language governing permissions and\n"+
            " * limitations under the License.\n"+
            " **/\n";

        if (files) {
            for (var i=0; i<files.length; i++) {
                var file = files[i];
                if (!grunt.file.exists(file)) {
                    grunt.log.warn('File '+ file + ' not found');
                    return false;
                } else {
                    var content = grunt.file.read(file);
                    if (content.indexOf(copyright) == -1) {
                        content = copyright+content;
                        if (!grunt.file.write(file, content)) {
                            return false;
                        }
                        grunt.log.writeln("Attached copyright to "+file);
                    } else {
                        grunt.log.writeln("Copyright already on "+file);
                    }
                }
            }
        }
    });    

    grunt.registerTask('setDevEnv',
        'Sets NODE_ENV=development so non-minified assets are used',
            function () {
                process.env.NODE_ENV = 'development';
            });

    grunt.registerTask('default',
        'Builds editor content then runs code style checks and unit tests on all components',
        ['build','test-runtime','test-editor','test-nodes']);

    grunt.registerTask('test-runtime',
        'Runs code style check and unit tests on core runtime code',
        ['build','mocha_istanbul:runtime']);

    grunt.registerTask('test-editor',
        'Runs code style check on editor code',
        ['jshint:editor']);

    grunt.registerTask('test-ui',
        'Builds editor content then runs unit tests on editor ui',
        ['build','jshint:editor','webdriver:all']);

    grunt.registerTask('test-nodes',
        'Runs unit tests on core nodes',
        ['build','mocha_istanbul:nodes']);

    grunt.registerTask('build',
        'Builds editor content',
        ['clean:build','jsonlint','concat:build','concat:vendor','copy:build','uglify:build','sass:build','attachCopyright']);

    grunt.registerTask('dev',
        'Developer mode: run node-red, watch for source changes and build/restart',
        ['build','setDevEnv','concurrent:dev']);

    // grunt.registerTask('release',
    //     'Create distribution zip file',
    //     ['build','clean:release','copy:release','chmod:release','compress:release']);

    grunt.registerTask('coverage',
        'Run Istanbul code test coverage task',
        ['build','mocha_istanbul:all']);
};

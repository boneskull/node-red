module.exports = grunt => {
  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      build: {
        src: [
          // Ensure editor source files are concatenated in
          // the right order
          'js/red.js',
          'js/events.js',
          'js/i18n.js',
          'js/settings.js',
          'js/user.js',
          'js/comms.js',
          'js/text/bidi.js',
          'js/text/format.js',
          'js/ui/state.js',
          'js/nodes.js',
          'js/history.js',
          'js/validators.js',
          'js/ui/utils.js',
          'js/ui/common/editableList.js',
          'js/ui/common/checkboxSet.js',
          'js/ui/common/menu.js',
          'js/ui/common/panels.js',
          'js/ui/common/popover.js',
          'js/ui/common/searchBox.js',
          'js/ui/common/tabs.js',
          'js/ui/common/stack.js',
          'js/ui/common/typedInput.js',
          'js/ui/actions.js',
          'js/ui/deploy.js',
          'js/ui/diff.js',
          'js/ui/keyboard.js',
          'js/ui/workspaces.js',
          'js/ui/view.js',
          'js/ui/sidebar.js',
          'js/ui/palette.js',
          'js/ui/tab-info.js',
          'js/ui/tab-config.js',
          'js/ui/palette-editor.js',
          'js/ui/editor.js',
          'js/ui/tray.js',
          'js/ui/clipboard.js',
          'js/ui/library.js',
          'js/ui/notifications.js',
          'js/ui/search.js',
          'js/ui/typeSearch.js',
          'js/ui/subflow.js',
          'js/ui/userSettings.js',
          'js/ui/projects/projects.js',
          'js/ui/projects/projectSettings.js',
          'js/ui/projects/projectUserSettings.js',
          'js/ui/projects/tab-versionControl.js',
          'js/ui/touch/radialMenu.js'
        ],
        dest: 'public/red/red.js'
      },
      vendor: {
        files: {
          'public/vendor/vendor.js': [
            'vendor/jquery/js/jquery-1.11.3.min.js',
            'vendor/bootstrap/js/bootstrap.min.js',
            'vendor/jquery/js/jquery-ui-1.10.3.custom.min.js',
            'vendor/jquery/js/jquery.ui.touch-punch.min.js',
            'vendor/marked/marked.min.js',
            'vendor/d3/d3.v3.min.js',
            'vendor/i18next/i18next.min.js'
          ],
          'public/vendor/vendor.css': [
            // TODO: resolve relative resource paths in
            //       bootstrap/FA/jquery
          ],
          'public/vendor/jsonata/jsonata.min.js': [
            'node_modules/jsonata/jsonata-es5.min.js',
            'vendor/jsonata/formatter.js'
          ],
          'public/vendor/ace/worker-jsonata.js': [
            'node_modules/jsonata/jsonata-es5.min.js',
            'vendor/jsonata/worker-jsonata.js'
          ]
        }
      }
    },
    uglify: {
      build: {
        files: {
          'public/red/red.min.js': 'public/red/red.js',
          'public/red/main.min.js': 'public/red/main.js',
          'public/vendor/ace/mode-jsonata.js': 'vendor/jsonata/mode-jsonata.js',
          'public/vendor/ace/snippets/jsonata.js':
            'vendor/jsonata/snippets-jsonata.js'
        }
      }
    },
    sass: {
      build: {
        options: {
          outputStyle: 'compressed'
        },
        files: [
          {
            dest: 'public/red/style.min.css',
            src: 'sass/style.scss'
          },
          {
            dest: 'public/vendor/bootstrap/css/bootstrap.min.css',
            src: 'vendor/bootstrap/css/bootstrap.css'
          }
        ]
      }
    },
    attachCopyright: {
      js: {
        src: ['public/red/red.min.js', 'public/red/main.min.js']
      },
      css: {
        src: ['public/red/style.min.css']
      }
    },
    clean: {
      build: {
        src: [
          'public/red',
          'public/favicon.ico',
          'public/icons',
          'public/vendor'
        ]
      },
      release: {
        src: ['<%= paths.dist %>']
      }
    },
    copy: {
      build: {
        files: [
          {
            src: 'js/main.js',
            dest: 'public/red/main.js'
          },
          {
            src: 'js/keymap.json',
            dest: 'public/red/keymap.json'
          },
          {
            cwd: 'images',
            src: '**',
            expand: true,
            dest: 'public/red/images/'
          },
          {
            cwd: 'vendor',
            src: [
              'ace/**',
              'bootstrap/img/**',
              'jquery/css/**',
              'font-awesome/**'
            ],
            expand: true,
            dest: 'public/vendor/'
          },
          {
            cwd: 'icons',
            src: '**',
            expand: true,
            dest: 'public/icons/'
          },
          {
            expand: true,
            src: ['favicon.ico'],
            dest: 'public/',
            flatten: true
          },
          {
            src: 'CHANGELOG.md',
            dest: 'public/red/about'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerMultiTask('attachCopyright', function() {
    var files = this.data.src;
    var copyright =
      '/**\n' +
      ' * Copyright JS Foundation and other contributors, http://js.foundation\n' +
      ' *\n' +
      ' * Licensed under the Apache License, Version 2.0 (the "License");\n' +
      ' * you may not use this file except in compliance with the License.\n' +
      ' * You may obtain a copy of the License at\n' +
      ' *\n' +
      ' * http://www.apache.org/licenses/LICENSE-2.0\n' +
      ' *\n' +
      ' * Unless required by applicable law or agreed to in writing, software\n' +
      ' * distributed under the License is distributed on an "AS IS" BASIS,\n' +
      ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n' +
      ' * See the License for the specific language governing permissions and\n' +
      ' * limitations under the License.\n' +
      ' **/\n';

    if (files) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!grunt.file.exists(file)) {
          grunt.log.warn('File ' + file + ' not found');
          return false;
        } else {
          var content = grunt.file.read(file);
          if (content.indexOf(copyright) == -1) {
            content = copyright + content;
            if (!grunt.file.write(file, content)) {
              return false;
            }
            grunt.log.writeln('Attached copyright to ' + file);
          } else {
            grunt.log.writeln('Copyright already on ' + file);
          }
        }
      }
    }
  });

  grunt.registerTask('build',
  'Builds editor content',
  ['clean:build','concat:build','concat:vendor','copy:build','uglify:build','sass:build','attachCopyright']);

  grunt.registerTask('dev',
  'Developer mode: run node-red, watch for source changes and build/restart',
  ['build','setDevEnv','concurrent:dev']);

  grunt.registerTask('setDevEnv',
  'Sets NODE_ENV=development so non-minified assets are used',
      function () {
          process.env.NODE_ENV = 'development';
      });

};

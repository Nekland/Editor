module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
          files: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js'],
          options: {
            // options here to override JSHint defaults
            globals: {
              jQuery: true,
              console: true,
              module: true,
              document: true
            }
          }
        },
        concat: {
            dist: {
                src: [
                    'src/setup.js',
                    'src/main.js',
                    'src/execute.js',
                    'src/templates.js',
                    'src/modules.js',
                    'src/events.js',
                    'src/dom-selection.js',
                    'src/translation.js',
                    'src/string-tools.js',
                    'src/compatibility.js',
                    'src/utils.js',
                    'src/jquery-plugin.js',
                    'src/lang/en.js',
                    'src/modules/basic-module.js',
                    'src/modules/link-module.js',
                    'src/modules/align-module.js',
                    'src/modules/format-module.js',
                    'src/modules/list-module.js',
                    'src/modules/table-module.js',
                    'src/modules/image-module.js'
                ],
                dest: 'release/nekland-editor.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                  'release/nekland-editor.min.js': ['<%= concat.dist.dest %>']
                }
            }
        }
    });

    //grunt.registerTask('default', ['concat']);
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'tests/jasmine/spec/**/*.js']
        },
        jscs: {
            src: ["src/**/*.js", 'tests/jasmine/spec/**/*.js'],
            options: {
                config: ".jscs.json"
            }
        },
        jasmine: {
            src: 'dist/F.js',
            options: {
                specs: 'tests/jasmine/spec/*Spec.js',
                vendor: [
                    'libs/jquery/jquery.min.js',
                    'libs/underscore/underscore-min.js'
                ]
            }
        },
        concat: {
            dist: {
                src: ['src/F.js',
                    'src/F.evt.js',
                    'src/F.str.js',
                    'src/plugins/*.js'],
                dest: 'dist/F.js'
            }
        },
        watch: {
            dist: {
                files: ['src/**/*.js'],
                tasks: ['jshint', 'jscs', 'concat', 'uglify:dist', 'jasmine']
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/F.min.js': ['dist/F.js']
                },
                options: {
                    compress: {
                        drop_console: true
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks("grunt-jscs-checker");

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('build', ['jshint', 'jscs', 'concat', 'uglify:dist', 'jasmine']);
    grunt.registerTask('test', ['jasmine']);

};
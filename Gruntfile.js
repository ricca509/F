module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'tests/*.js']
        },
        jasmine: {
            pivotal: {
                src: 'F.js',
                options: {
                    specs: 'tests/jasmine/spec/*Spec.js'
                }
            }
        },
        concat: {
            dist: {
                src: ['src/F.js',
                    'src/plugins/F.plugins.defaultModule.js',
                    'src/plugins/F.plugins.pageModule.js'],
                dest: 'dist/F.js',
            },
        },
        watch: {
            dist: {
                files: ['src/**/*.js'],
                tasks: ['jshint', 'concat', 'strip']
            }
        },
        uglify: {
            my_target: {
                files: {
                    'dist/F.min.js': ['dist/F.js']
                }
            }
        },
        strip : {
            main : {
                src : 'dist/F.js',
                options : {
                    inline : true
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-strip');

    grunt.registerTask('default', ['jshint']);

};
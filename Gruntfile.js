module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', '*.js', 'tests/*.js']
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
                src: ['F.js', 'F.plugins.defaultModule.js', 'F.plugins.pageModule.js'],
                dest: 'dist/F.js',
            },
        },
        watch: {
            dist: {
                files: '*.js',
                tasks: ['concat']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint']);

};
/*
 # grunt-phonegapsplash
 # https://github.com/PEM/grunt-phonegapsplash
 #
 # Copyright (c) 2013 Pierre-Eric Marchandet (PEM-- <pemarchandet@gmail.com>)
 # Licensed under the MIT license.
 */
'use strict';
module.exports = function(grunt) {
    ((require('matchdep')).filterDev('grunt-*')).forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        "cordova-gen": {
            default_options: {
                src: 'test/fixtures/splash.png',
                dest: 'tmp/default_options'
            },
            reduced_mobile_set: {
                src: 'test/fixtures/splash.png',
                dest: 'tmp/reduced_mobile_set',
                options: {
                    profiles: ['blackberry']
                }
            },
            reduced_layout_set: {
                src: 'test/fixtures/splash.png',
                dest: 'tmp/reduced_layout_set',
                options: {
                    layouts: ['landscape']
                }
            }
        }
    });

    grunt.loadTasks("tasks");

    return grunt.registerTask('default', ['cordova-gen']);
};
/*
 # grunt-phonegapsplash
 # https://github.com/PEM--/grunt-phonegapsplash
 #
 # Copyright (c) 2013 Pierre-Eric Marchandet (PEM-- <pemarchandet@gmail.com>)
 # Licensed under the MIT licence.
 */
'use strict';
var NONE_RESOLUTION, OFFSET, RESOLUTION, async, gm, path;
gm = require('gm');
async = require('async');
path = require('path');
RESOLUTION = 2048;
OFFSET = 384;
NONE_RESOLUTION = 1280;
module.exports = function(grunt) {
    return grunt.registerMultiTask('cordova-gen', 'Create cordova splashscreens from a single PNG file.', function() {
        var DEST, PROFILES, SRC, done, options;
        done = this.async();
        options = this.options({
            prjName: 'Test',
            layouts: ['portrait', 'landscape', 'none'],
            profiles: ['android', 'bada', 'blackberry', 'ios', 'webos', 'windows-phone']
        });

        PROFILES = (require('../lib/profiles'))(options);
        if (this.files.length !== 1 || this.files[0].orig.src.length !== 1) {
            return done(new Error("Only one source file is allowed: " + this.files));
        }
        SRC = this.files[0].orig.src[0];
        if (!grunt.file.exists(SRC)) {
            return done(new Error("Source file '" + SRC + "' not found: " + this.files));
        }
        DEST = this.files[0].dest;
        return async.each(options.profiles, function(optProfile, nextProfile) {
            var curProfile;
            grunt.log.debug("Profile: " + optProfile);
            curProfile = PROFILES[optProfile];
            if (curProfile === void 0) {
                return nextProfile();
            }
            return async.each(options.layouts, function(optLayout, nextLayout) {
                var curLayout;
                grunt.log.debug("Layout: " + optLayout);
                curLayout = curProfile.layout[optLayout];
                if (curLayout === void 0) {
                    return nextLayout();
                }
                return async.each(curLayout.splashs, function(splash, nextSplash) {
                    var cropHeight, cropWidth, cropX, cropY, targetFile;
                    targetFile = path.join(DEST, curProfile.dir, splash.name);
                    grunt.log.debug("Creating " + targetFile);
                    cropX = cropY = cropWidth = cropHeight = 0;
                    switch (optLayout) {
                        case 'landscape':
                            cropX = 0;
                            cropWidth = RESOLUTION;
                            cropHeight = Math.floor(splash.height * RESOLUTION / splash.width);
                            cropY = Math.floor((RESOLUTION - cropHeight) / 2);
                            break;
                        case 'portrait':
                            cropY = 0;
                            cropHeight = RESOLUTION;
                            cropWidth = Math.floor(splash.width * RESOLUTION / splash.height);
                            cropX = Math.floor((RESOLUTION - cropWidth) / 2);
                            break;
                        default:
                            cropX = cropY = OFFSET;
                            cropWidth = cropHeight = NONE_RESOLUTION;
                    }
                    grunt.file.mkdir(path.dirname(targetFile));
                    grunt.log.debug("gm convert " + ("-crop " + cropWidth + "x" + cropHeight + "+" + cropX + "+" + cropY + " ") + ("-resize " + splash.width + "x" + splash.height + "! ") + ("" + SRC + " " + targetFile));
                    return gm(SRC).crop(cropWidth, cropHeight, cropX, cropY).resize(splash.width, splash.height, '!').write(targetFile, function(err) {
                        grunt.log.ok("Splashcreen " + targetFile + " created.");
                        if (err) {
                            return nextSplash(err);
                        }
                        return nextSplash();
                    });
                }, nextLayout);
            }, nextProfile);
        }, function(err) {
            if (err) {
                grunt.log.error(err.message);
                done(false);
            }
            return done();
        });
    });
};
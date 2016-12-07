var colors     = require('colors');
var watch      = require('node-watch');
var yargs      = require('yargs');
var processes  = [];
var timer      = null;
var isKillings = [];
var languages  = require('./languages');
var fs         = require('fs');
var join       = require('path').join;
var dirSep     = require('path').sep;
var Generator  = require('./generator');
var path       = yargs
    .argv
    ._[0]
;

if (!path) {
    path = process.cwd();
}

console.log(`Starting tagsgen at ${path}`.green.bold);

var generators = (function () {
    var cache = {};
    for (var i in languages) {
        cache[i] = (new Generator(path, i, languages[i]));
    }

    return cache;
})();

for (var i in generators) {
    generators[i].generate();
}

for (var i in languages) {
    var definition = languages[i];
    var watchPath  = definition.path ? join(path, definition.path) : path;

    watch(watchPath, (changedFile) => {
        let extension = changedFile.split('.').pop();
        let basePath = changedFile.split(dirSep).shift();

        for (let i in generators) {
            if (extension !== generators[i].definition.extension) {
                continue;
            }

            if (-1 === generators[i].definition.path.indexOf(basePath)) {
                continue;
            }

            generators[i].generate();
        }
    });
}

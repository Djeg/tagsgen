var colors     = require('colors');
var watch      = require('node-watch');
var yargs      = require('yargs');
var processes  = [];
var timer      = null;
var isKillings = [];
var languages  = require('./languages');
var fs         = require('fs');
var join       = require('path').join;
var Generator  = require('./generator');
var path       = yargs
    .demand(1)
    .argv
    ._[0]
;

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

    watch(watchPath, generators[i].notify.bind(generators[i]));
}

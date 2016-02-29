var defaultLanguages = require('./default-languages.json');
var fs               = require('fs');
var merge            = require('merge');
var customLanguages  = (function () {
    if (fs.existsSync(`${process.cwd()}/.tagsgen.json`)) {
        return require(`${process.cwd()}/.tagsgen.json`);
    }

    var home = process.env.HOME || process.env.USERPROFILE;
    if (fs.existsSync(`${home}/.tagsgen.json`)) {
        return require(`${home}/.tagsgen.json`);
    }

    return;
})();
var languages = null !== customLanguages ?
    merge.recursive(defaultLanguages, customLanguages) :
    defaultLanguages
;

module.exports = languages;

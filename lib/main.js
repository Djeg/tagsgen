var colors     = require('colors');
var watch      = require('node-watch');
var yargs      = require('yargs');
var spawn      = require('child_process').spawn;
var processes  = [];
var timer      = null;
var isKillings = [];
var languages  = require('./languages');
var fs         = require('fs');
var path       = yargs
    .demand(1)
    .argv
    ._[0]
;

function filter (fn) {
    return function (filename) {
        if ('tags' === filename || null !== filename.match('[^.].tags')) {
            return;
        }

        var extensions = [];

        for (var i in languages) {
            extensions.push(`\\.${languages[i].extension}`);
        }

        extensions = extensions.join('|');
        var re = new RegExp(`(${extensions})$`);

        if (null === filename.match(re)) {
            return;
        }

        fn(filename);
    }
}

function generateTagFile (path, language, file, exclusions, done) {
    if ('.' === path) {
        path = process.cwd();
    }

    args = ['-R', '--tag-relative'];

    if (exclusions) {
        for (var i in exclusions) {
            args.push(`--exclude=${exclusions[i]}`);
        }
    }

    args.push(`--languages=${language}`);
    args.push(`-f ${file}`);
    args.push(path);

    if (processes[language]) {
        isKillings[language] = true;
        processes[language].kill();
    }

    if (fs.existsSync(`${path}/${file}`)) {
        console.log(`Removing existing ${file}`.grey);
        fs.unlinkSync(`${path}/${file}`);
    }

    console.log(`generating ${language} tags ...`.yellow);

    processes[language] = spawn('ctags', args);

    processes[language].on('close', function () {
        processes[language] = null;

        if (isKillings[language]) {
            console.log(`killed ${language} tags.`.grey);
            isKillings[language] = false;
        } else {
            console.log(`finished ${language} tags.`.green);
        }

        if (done) {
            done();
        }
    });
};

function generateTags (path, changedFile, done) {
    if (timer) {
        clearTimeout(timer);
    }

    timer = setTimeout(function () {
        if (!changedFile) {
            for (var i in languages) {
                generateTagFile(path, languages[i].language, languages[i].file, languages[i].excludes, done);
            }

            return;
        }

        extension = changedFile.split('.').pop();

        for (var i in languages) {
            if (languages[i].extension === extension) {
                generateTagFile(path, languages[i].language, languages[i].file, languages[i].excludes, done);
            }
        }
    }, 1000);
}

console.log('Starting tags generator at %s.'.replace('%s', path).yellow.bold);

generateTags(path, null, function () {
    watch(path, filter(function (filename) {
        generateTags(path, filename);
    }));
});


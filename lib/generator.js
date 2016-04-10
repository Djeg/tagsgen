var fs               = require('fs');
var path             = require('path');
var processes        = {};
var killingProcesses = {};
var spawn            = require('child_process').spawn;

function Generator (basePath, name, definition) {
    this.basePath   = basePath;
    this.name       = name;
    this.definition = definition;
};

Generator.prototype.generate = function () {
    if (undefined !== processes[this.name] && processes[this.name].pid) {
        console.log(`[${this.name}] Killing old process.`.grey);

        processes[this.name].kill('SIGKILL');
        killingProcesses[this.name] = true;
    }

    var filePath = path.join(this.basePath, this.definition.file);

    if (fs.existsSync(filePath)) {
        console.log(`[${this.name}] Removing ${this.definition.file}.`.grey);
        fs.unlinkSync(filePath);
    }

    args = ['-R'];

    for (var i in this.definition.args) {
        args.push(this.definition.args[i]);
    }

    args.push(`-f ${filePath}`);
    args.push(this.definition.path ? path.join(this.basePath, this.definition.path) : this.basePath);

    console.log(`[${this.name}] Generating ${this.definition.file} ...`.yellow);

    processes[this.name] = spawn('ctags', args);

    var self = this;
    processes[this.name].on('close', function () {
        if (killingProcesses[this.name]) {
            console.log(`[${self.name}] Killed!`.green);
            killingProcesses[this.name] = false;

            return;
        }

        console.log(`[${self.name}] Done!`.green);
    });
};

Generator.prototype.notify = function (changedFile) {
    var extension = changedFile.split('.').pop();

    if (extension !== this.definition.extension) {
        return;
    }

    this.generate()
};

module.exports = Generator;

/**
 * @file log
 * @author zhangwentao
 */

const chalk = require('chalk');
const readline = require('readline');

const WRITE_MAGIC_CODE = '\u001b[0m\u001b[0m\u001b[0m ...';

// hook stdout to get last line write
// const util = require('util');
// util.debug('stdout: ' + util.inspect(string));
let lastLineStr = '';
hookStdout(string => {
    lastLineStr = /\n$/.test(string) ? string : lastLineStr;
}, () => {
    // when stderr reset lastLineStr
    lastLineStr = '';
});

// hookStdout from https://gist.github.com/pguillory/729616
function hookStdout(callback, callbackErr = callback) {
    const oldWrite = process.stdout.write;
    const oldWriteErr = process.stderr.write;
    process.stdout.write = (function hookStdoutWrite(write) {
        return function hookedStdoutWrite(...args) {
            write.apply(process.stdout, args);
            callback.apply(null, args);
        };
    })(process.stdout.write);

    // hook stderr
    process.stderr.write = (function hookStderrWrite(write) {
        return function hookedStderrWrite(...args) {
            write.apply(process.stdout, args);
            callbackErr.apply(null, args);
        };
    })(process.stderr.write);

    return function unhook() {
        process.stdout.write = oldWrite;
        process.stderr.write = oldWriteErr;
    };
}

// clear last line
function clearLine() {
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearScreenDown(process.stdout);
}

function print(args, level, labelColor) {
    const [label, info = '', ...rest] = args;
    const target = process.env.MARS_ENV_TARGET;
    if (info instanceof Error) {
        console[level](chalk.yellow(`[${target}]`), labelColor(label), labelColor(info.stack));
    }
    else {
        console[level](chalk.yellow(`[${target}]`), labelColor(label), [info].concat(rest || []).join(''));
    }
}

module.exports = {
    verbose: undefined,
    error(...args) {
        print(args, 'error', chalk.red);
    },
    info(...args) {
        print(args, 'info', chalk.green);
    },
    warn(...args) {
        print(args, 'warn', chalk.yellow);
    },
    // write method clear last line if it's written by this method
    // use invisible WRITE_MAGIC_CODE to identify lines
    write(...args) {
        if (
            lastLineStr.lastIndexOf(WRITE_MAGIC_CODE) > -1
            && !(args[1] && args[1] instanceof Error)
        ) {
            clearLine();
        }
        args.push(WRITE_MAGIC_CODE);
        print(args, 'info', chalk.green);
    }
};

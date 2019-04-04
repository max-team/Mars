/**
 * @file log
 * @author wukaifang
 */
const chalk = require('chalk');

function print(args, level, labelColor) {
    const [label, info = ''] = args;
    if (info instanceof Error) {
        console[level](labelColor(label), labelColor(info.stack));
    }
    else {
        console[level](labelColor(label), info);
    }
}

module.exports = {
    error(...args) {
        print(args, 'error', chalk.red);
    },
    info(...args) {
        print(args, 'info', chalk.green);
    },
    warn(...args) {
        print(args, 'warn', chalk.yellow);
    }
};
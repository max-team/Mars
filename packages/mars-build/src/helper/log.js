/**
 * @file log
 * @author wukaifang
 */
const chalk = require('chalk');

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

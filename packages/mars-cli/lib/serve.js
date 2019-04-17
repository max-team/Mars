/**
 * @file 开发脚本
 * @author meixuguang
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-console */

const {error, stopSpinner} = require('@vue/cli-shared-utils');
const execa = require('execa');
const {getConfig} = require('./scripts/getConfig');

async function start(cmd) {
    const {target, buildPath} = getConfig(cmd);

    const {
        watch,
        clean
    } = require(buildPath);

    const options = {
        target
    };
    process.env.NODE_ENV = 'development';
    process.env.MARS_CLI_OPTIONS = JSON.stringify(options);
    process.env.MARS_CLI_TARGET = target;

    clean(options).once('stop', () => {
        watch(options).once('stop', () => {
            if (target === 'h5') {
                const child = execa('npm', ['run', 'serve-dist-h5']);
                child.stdout.pipe(process.stdout);
                child.stderr.pipe(process.stderr);
            }
        });
    });
}

module.exports = (...args) =>
    start(...args).catch(err => {
        stopSpinner(false); // do not persist
        error(err);
        if (!process.env.VUE_CLI_TEST) {
            process.exit(1);
        }
    });

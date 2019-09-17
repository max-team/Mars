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
    const {target, buildPath, env} = getConfig(cmd);

    const {
        watch,
        clean,
        getConfig: getBuildConfig
    } = require(buildPath);

    const options = {
        target,
        env
    };
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development';
    }
    process.env.MARS_CLI_OPTIONS = JSON.stringify(options);
    process.env.MARS_CLI_TARGET = target;
    process.env.MARS_CLI_ENV = env;
    // process.env.MARS_CLI_DEST = env ? `./dist-${env}` : './dist-h5';
    process.env.MARS_ENV_TARGET = `${target}${env ? `:${env}` : ''}`;

    const {dest, h5: h5Config} = getBuildConfig(options);
    const servePath = dest.servePath;
    // for mars-cli-service
    process.env.MARS_PWA = !!(h5Config && h5Config.supportPWA);

    function serveH5() {
        // const child = execa('npm', ['run', 'serve-dist-h5']);
        const args = ['mars-cli-service', 'serve', '--path', servePath];
        console.log('[serve h5]', args.join(' '));
        const child = execa('npx', args);
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    }

    if (target === 'h5' && cmd.h5skip === 'mars') {
        return serveH5();
    }

    clean(options).once('stop', () => {
        watch(options).once('stop', () => {
            console.log(`[serve ${target}]`, 'watching...');
            if (target === 'h5' && cmd.h5skip !== 'vue') {
                serveH5();
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

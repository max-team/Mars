/**
 * @file info
 * @author meixuguang
 */
/* eslint-disable fecs-no-require */
/* eslint-disable no-console */

const {error, stopSpinner} = require('@vue/cli-shared-utils');
const {
    getCliVersion,
    isH5Project,
    dependencyList,
    dependencyListH5
} = require('./helper/utils');
const envinfo = require('envinfo');

const npmPackages = isH5Project() ? dependencyList.concat(dependencyListH5) : dependencyList;

async function info(options = {}) {
    let info = await envinfo.run(Object.assign({}, {
        System: ['OS', 'Shell'],
        Binaries: ['Node', 'Yarn', 'npm'],
        npmPackages,
        npmGlobalPackages: ['typescript']
    }, options), {
        title: `Mars CLI ${getCliVersion()} environment info`
    });
    console.log(
        info
        + '\n'
        + (isH5Project() ? '  Current project support H5' : '  Current project does not support H5')
        + '\n'
    );
}

module.exports = (...args) =>
    info(...args).catch(err => {
        stopSpinner(false);
        error(err);
        if (!process.env.VUE_CLI_TEST) {
            process.exit(1);
        }
    });

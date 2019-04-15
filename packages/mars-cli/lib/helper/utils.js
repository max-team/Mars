/**
 * @file utils
 * @author meixuguang
 */

/* eslint-disable fecs-no-require */
const fs = require('fs-extra');

let isH5;
let version;

const dependencyList = [
    '@marsjs/build',
    '@marsjs/core'
];
const dependencyListH5 = [
    '@marsjs/components',
    '@marsjs/api',
    'atom-web-compiler',
    'atom2vue-loader',
    '@marsjs/vue-cli-plugin-mars-web'
];

function getCliVersion() {
    return version !== undefined ? version : version = require('../../package').version;
}

function isH5Project() {
    return isH5 !== undefined ? isH5 : isH5 = fs.existsSync(process.cwd() + '/vue.config.js');
}

module.exports = {
    dependencyList,
    dependencyListH5,
    getCliVersion,
    isH5Project
};

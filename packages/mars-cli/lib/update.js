/**
 * @file 升级依赖
 * @author meixuguang
 */

const {error, stopSpinner} = require('@vue/cli-shared-utils');
const execa = require('execa');
const fs = require('fs-extra');

function executeCommand(command, args, targetDir) {
    return new Promise((resolve, reject) => {

        const child = execa(command, args, {
            cwd: targetDir,
            stdio: ['inherit', 'inherit', 'inherit']
        });

        child.on('close', code => {
            if (code !== 0) {
                reject(`command failed: ${command} ${args.join(' ')}`);
                return;
            }
            resolve();
        });
    });
}

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

function getDependencyList() {
    if (fs.existsSync(process.cwd() + '/vue.config.js')) {
        return [...dependencyList, ...dependencyListH5];
    }
    return dependencyList;
}

async function update(cmd) {
    if (cmd.force) {
        forceUpdate(cmd.registry);
    }
    else {
        compatibleUpdate(cmd.registry);
    }
}

async function compatibleUpdate(registry) {
    const dep = getDependencyList();
    const args = [
        'update',
        ...dep,
        `--registry=${registry}`
    ];

    return executeCommand('npm', args, process.cwd());
}

async function forceUpdate(registry) {
    const args = [
        'install'
    ];
    const dep = getDependencyList();

    for (let i = 0; i < dep.length; i++) {
        const id = dep[i];
        args.push(`${id}@latest`);
    }
    args.push(`--registry=${registry}`);

    return executeCommand('npm', args, process.cwd());
}



module.exports = (...args) =>
    update(...args).catch(err => {
        stopSpinner(false); // do not persist
        error(err);
        if (!process.env.VUE_CLI_TEST) {
            process.exit(1);
        }
    });

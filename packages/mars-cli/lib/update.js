/**
 * @file 升级依赖
 * @author meixuguang
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-console */

const {stopSpinner} = require('@vue/cli-shared-utils');
const logger = require('@vue/cli-shared-utils/lib/logger');
const execa = require('execa');
const fs = require('fs-extra');

async function executeCommand(command, args, targetDir) {
    const child = execa(command, args, {
        cwd: targetDir
    });

    child.stdout.pipe(process.stdout);

    const res = await child;

    if (res.code !== 0) {
        logger.error(`command failed: ${command} ${args.join(' ')}\n`);
    }

    return res;
}

const {
    dependencyList,
    dependencyListH5
} = require('./helper/utils');

// const dependencyList = [
//     '@marsjs/build',
//     '@marsjs/core',
//     '@marsjs/cli-template'
// ];
// const dependencyListH5 = [
//     '@marsjs/components',
//     '@marsjs/api',
//     'atom-web-compiler',
//     'atom2vue-loader',
//     '@marsjs/vue-cli-plugin-mars-web'
// ];

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
        const res = await compatibleUpdate(cmd.registry);

        if (!res.stdout && !res.stderr) {
            logger.info('所有依赖已是最新。');
        }
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
        logger.error(err);
        if (!process.env.VUE_CLI_TEST) {
            process.exit(1);
        }
    });

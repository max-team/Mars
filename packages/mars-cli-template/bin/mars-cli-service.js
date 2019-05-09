#!/usr/bin/env node

/**
 * @file cli-service
 * @author meixuguang
 */
/* eslint-disable fecs-no-require */
/* eslint-disable no-console */

const Service = require('@vue/cli-service/lib/Service');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

const rawArgv = process.argv.slice(2);
const args = require('minimist')(rawArgv, {
    'string': [
        'path'
    ],
    'default': {
        path: './path-h5'
    },
    'boolean': [
        // build
        'modern',
        'report',
        'report-json',
        'watch',
        // serve
        'open',
        'copy',
        'https',
        // inspect
        'verbose'
    ]
});
const command = args._[0];

const dest = process.env.MARS_CLI_DEST || './path-h5';
const context = path.resolve(process.cwd(), dest);
// default MARS_CLI_OPTIONS when run mars-cli-service directly
process.env.MARS_CLI_TARGET = process.env.MARS_CLI_TARGET || 'h5';
process.env.MARS_CLI_OPTIONS = process.env.MARS_CLI_OPTIONS || JSON.stringify({
    target: 'h5'
});

(async () => {
    // 需要初始化
    if (!fs.existsSync(context + '/vue.config.js')) {
        const source = path.resolve(__dirname, '../generator/dist-h5');
        const globby = require('globby');

        const files = await globby(['**/*'], {cwd: source});
        for (const rawPath of files) {
            const targetPath = context + '/' + rawPath.split('/').map(filename => {
                // dotfiles are ignored when published to npm, therefore in templates
                // we need to use underscore instead (e.g. "_gitignore")
                if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
                    return `.${filename.slice(1)}`;
                }
                if (filename.charAt(0) === '_' && filename.charAt(1) === '_') {
                    return `${filename.slice(1)}`;
                }
                return filename;
            }).join('/');

            const sourcePath = path.resolve(source, rawPath);

            await fs.copy(sourcePath, targetPath);
        }
    }

    if (!fs.existsSync(process.cwd() + '/vue.config.js')) {
        console.error(chalk.red('vue.config.js 文件未找到，请确认当前所在工程支持编译到 h5。'));
    }
    await fs.copy(process.cwd() + '/vue.config.js', context + '/vue.config.js');

    const plugins = [
        idToPlugin('@marsjs/vue-cli-plugin-mars-web'),
        idToPlugin('@vue/cli-plugin-babel')
    ];
    const service = new Service(context, {
        plugins
    });

    service.run(command, args, rawArgv).catch(err => {
        process.exit(1);
    });
})();


function idToPlugin(id) {
    return {
        id: id.replace(/^.\//, 'built-in:'),
        apply: require(id)
    };
}

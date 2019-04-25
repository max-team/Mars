#!/usr/bin/env node

/**
 * @file mars-cli
 * @author meixuguang
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-console */

// Check node version before requiring/doing anything else
// The user may be on a very old node version

const chalk = require('chalk');
const semver = require('semver');
const requiredVersion = require('../package.json').engines.node;
const fs = require('fs-extra');
const path = require('path');
const slash = require('slash');
const minimist = require('minimist');
const {getCliVersion, cleanArgs, defaultConfig} = require('../lib/helper/utils');
const execa = require('execa');

function checkNodeVersion(wanted, id) {
    if (!semver.satisfies(process.version, wanted)) {
        console.log(chalk.red(
            'You are using Node ' + process.version + ', but this version of ' + id
            + ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
        ));
        process.exit(1);
    }
}

checkNodeVersion(requiredVersion, 'mars-cli');

if (semver.satisfies(process.version, '9.x')) {
    console.log(chalk.red(
        'You are using Node ${process.version}.\n'
        + 'Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n'
        + 'It\'s strongly recommended to use an active LTS version instead.'
    ));
}

// enter debug mode when creating test repo
if (
    slash(process.cwd()).indexOf('/packages/test') > 0 && (
        fs.existsSync(path.resolve(process.cwd(), '../@vue'))
        || fs.existsSync(path.resolve(process.cwd(), '../../@vue'))
    )
) {
    process.env.VUE_CLI_DEBUG = true;
}

const program = require('commander');

program
    .version(getCliVersion())
    .usage('<command> [options]');

program
    .command('create <app-name>')
    .description('create a new project')
    // .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
    // .option('-d, --default', 'Skip prompts and use default preset')
    // .option('-i, --inlinePreset <json>', 'Skip prompts and use inline JSON string as preset')
    // .option('-m, --packageManager <command>', 'Use specified npm client when installing dependencies')
    .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
    // .option('-g, --git [message]', 'Force git initialization with initial commit message')
    // .option('-n, --no-git', 'Skip git initialization')
    .option('-f, --force', 'Overwrite target directory if it exists')
    // .option('-c, --clone', 'Use git clone when fetching remote preset')
    // .option('-x, --proxy', 'Use specified proxy when creating project')
    // .option('-b, --bare', 'Scaffold project without beginner instructions')
    .action(async (name, cmd) => {
        const options = cleanArgs(cmd);

        if (minimist(process.argv.slice(3))._.length > 1) {
            console.log(chalk.yellow('\n Info: You provided more than one argument. '
            + 'The first one will be used as the app\'s name, the rest are ignored.'));
        }

        const inquirer = require('inquirer');
        const {target} = await inquirer.prompt([
            {
                name: 'target',
                type: 'list',
                message: '选择创建项目类型：',
                choices: [
                    {
                        name: '小程序和 H5',
                        value: 'h5'
                    },
                    {
                        name: '仅小程序',
                        value: 'noH5'
                    }
                ]
            }
        ]);

        /* eslint-disable fecs-camelcase */
        options.inlinePreset = JSON.stringify({
            useConfigFiles: false,
            router: false,
            useEslint: false,
            _isPreset: true,
            plugins: {
                '@marsjs/cli-template': {
                    version: '~0.1.0',
                    noH5: target === 'noH5'
                }
            }
        });
        /* eslint-enable fecs-camelcase */

        if (!options.registry) {
            options.registry = defaultConfig.registry;
        }

        const create = require('@vue/cli/lib/create');

        await create(name, options);

        // 把 @vue/cli-service 生成的文件都删除
        const basePath = path.resolve(process.cwd(), './' + name);
        const globby = require('globby');
        let files = await globby([
            '**/*',
            '!node_modules',
            '!mars',
            '!package.json',
            '!package-lock.json'
        ], {cwd: basePath, deep: false, onlyFiles: false});
        for (const rawPath of files) {
            await fs.remove(basePath + '/' + rawPath);
        }

        files = await globby(['**/*'], {cwd: basePath + '/mars', deep: false, onlyFiles: false});
        for (const rawPath of files) {
            await fs.move(basePath + '/mars' + '/' + rawPath, basePath + '/' + rawPath);
        }
        fs.remove(basePath + '/mars');
    });


program
    .command('build')
    .description('build project in production mode')
    .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
    .option('-t, --target <target>', 'Build target (swan | h5 | wx, default: swan)')
    .option('-w, --watch', 'Open watch mode')
    .action(cmd => {
        const options = cleanArgs(cmd);
        const buildPath = path.resolve(__dirname, './mars-build.js');

        const targets = (options.target || 'swan').split(',');
        targets.forEach(t => {
            const args = [buildPath, '-t', t];
            Object.keys(options).forEach(op => {
                if (op === 'target') {
                    return;
                }

                if (options[op] !== false) {
                    args.push('--' + op);
                    if (options[op] !== true) {
                        args.push(options.op);
                    }
                }
            });
            execa('node', args, {
                stdout: 'inherit',
                stderr: 'inherit'
            });
        });
    });

program
    .command('serve')
    .description('serve project in development mode')
    .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
    .option('-t, --target <target>', 'Build target (swan | h5 | wx, default: swan)')
    .action(cmd => {
        const options = cleanArgs(cmd);
        const buildPath = path.resolve(__dirname, './mars-serve.js');

        const targets = (options.target || 'swan').split(',');
        targets.forEach(t => {
            const args = [buildPath, '-t', t];
            Object.keys(options).forEach(op => {
                if (op === 'target') {
                    return;
                }

                if (options[op] !== false) {
                    args.push('--' + op);
                    if (options[op] !== true) {
                        args.push(options.op);
                    }
                }
            });
            execa('node', args, {
                stdout: 'inherit',
                stderr: 'inherit'
            });
        });
    });

program
    .command('update')
    .description('update all mars dependences')
    .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
    .option('-f, --force', 'Force update all denpenences to latest version')
    .action(cmd => {
        const update = require('../lib/update');
        const options = cleanArgs(cmd);

        if (!options.registry) {
            options.registry = defaultConfig.registry;
        }

        update(options);
    });

program
    .command('info')
    .description('Diagnostics Mars env info')
    .action(cmd => {
        const info = require('../lib/info');

        info();
    });

// output help information on unknown commands
program
    .arguments('<command>')
    .action(cmd => {
        program.outputHelp();
        console.log('  ' + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
        console.log();
    });

// add some useful info on help
program.on('--help', () => {
    console.log();
    console.log(`  Run ${chalk.cyan('vue <command> --help')} for detailed usage of given command.`);
    console.log();
});

program.commands.forEach(c => c.on('--help', () => console.log()));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

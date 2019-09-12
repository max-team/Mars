/**
 * @file mars build
 * @author meixuguang
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-console */

const program = require('commander');
const {defaultConfig, cleanArgs} = require('../lib/helper/utils');

program
    .description('build project in production mode')
    .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
    .option('-t, --target <target>', 'Build target (swan | h5 | wx, default: swan)')
    .option('-w, --watch', 'Open watch mode')
    .option('--h5skip <process>', 'Skip h5 compile process (mars | vue)')
    .action(cmd => {
        const build = require('../lib/build');
        const options = cleanArgs(cmd);

        if (!options.registry) {
            options.registry = defaultConfig.registry;
        }

        build(options);
    })
    .parse(process.argv);

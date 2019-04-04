/**
 * @file 获取 config
 * @author meixuguang
 */

const path = require('path');
const fs = require('fs-extra');
const merge = require('lodash.merge');

function getConfig(cmd) {
    const target = cmd.target || 'swan';
    const dest = (cmd && cmd.dist) || 'dist-' + target;

    let projectConfig = {};
    const configPath = path.resolve(process.cwd(), './mars.config.js');
    if (fs.existsSync(configPath)) {
        projectConfig = require(configPath)(target);
    }

    const config = merge({}, {
        dest: target === 'h5' ? dest + '/src' : dest
    }, projectConfig, target === 'h5' ? {
        source: {
            runtime: [],
            assets: [
                'src/**/*.!(vue)'
            ]
        }
    } : {});

    const buildPath = (config.devConfig && config.devConfig.buildPath)
        || path.resolve(process.cwd(), 'node_modules/@marsjs/build');

    return {
        config,
        target,
        buildPath
    };
}

module.exports = {
    getConfig
};

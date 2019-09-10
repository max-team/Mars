/**
 * @file 获取 config
 * @author meixuguang
 */

const path = require('path');
const fs = require('fs-extra');
// const merge = require('lodash.merge');
const merge = require('../helper/util').merge;
const getDefaultConf = require('./defaultConfig');

function getProjectConfig(target) {
    let projectConfig = {};
    const configPath = path.resolve(process.cwd(), './mars.config.js');
    if (fs.existsSync(configPath)) {
        projectConfig = require(configPath)(target);
    }

    return projectConfig;
}

// 兼容原 Task 的配置格式
function formatConfig(options) {
    const target = options.target;
    const targetEnv = process.env.MARS_ENV_TARGET || target;
    let config = getProjectConfig(targetEnv);

    config = merge(getDefaultConf(targetEnv), config);
    const destPath = config.dest;
    config.dest = {
        path: destPath,
        coreDir: 'mars-core'
    };

    if (target === 'h5') {
        const servePath = destPath.replace(':', '-').replace(/\/src$/, '');
        config.dest.path = servePath + '/src';
        config.dest.servePath = servePath;
    }

    config.source = {
        sfc: config.source,
        assets: config.assets
    };
    config.options = {
        sfc: config.options
    };
    config = merge(config, getRuntimeConfig(config.devConfig || {}));

    // init px2units.options.multiple
    // 规定 H5 中 1rem = 100px
    const {designWidth, modules} = config;
    if (designWidth && modules.postcss.px2units) {
        const multiple = target === 'h5' ? .5 / 100 : 1;
        modules.postcss.px2units = Object.assign({
            targetUnits: target === 'h5' ? 'rem' : 'rpx',
            multiple: multiple * 750 / designWidth
        }, modules.postcss.px2units);
    }
    return config;
}

function getRuntimeConfig({
    corePath = './node_modules/@marsjs/core'
}) {
    return {
        source: {
            runtime: corePath + '/src/**/*.js',
            h5Template: path.resolve(__dirname, '../h5/template/**/*.@(vue|js|css)')
        },
        options: {
            sfc: {}
        }
    };
}

/**
 * getConfig
 *
 * @param {mars.options} options options
 * @return {mars.config}
 */
function getConfig(options) {
    if (!options && process.env.MARS_CLI_OPTIONS) {
        try {
            options = JSON.parse(process.env.MARS_CLI_OPTIONS);
        }
        catch (e) {}
    }
    if (!options) {
        throw new Error('pass options to @marsjs/build or use @marsjs/cli');
    }
    return formatConfig(options);
}

module.exports = getConfig;

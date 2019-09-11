/**
 * @file 编译外部依赖模块，原因：
 *       1. 有些模块中有 process.env.NODE_ENV 判断。
 *       2. 微信小程序不识别项目文件夹之外的依赖
 * @author meixuguang
 */

/* eslint-disable fecs-no-require */
/* globals Set */

const fs = require('fs-extra');
const webpack = require('webpack');
const log = require('../../helper/log');
const {getPathToCWD, getModuleName} = require('../../helper/path');
const path = require('path');

const modules = {
    '@marsjs/core': {
        needCompile: false,
        path: './mars-core/index.js'
    },
    'vuex': {
        needCompile: true,
        path: './mars_modules/vuex/index.js'
    }
};

const H5Modules = {
    '@marsjs/core': {
        needCompile: false,
        path: './index'
    }
};

const inProcessingModules = new Set();

function getModulePath(modulePath, modules) {
    const modName = getModuleName(modulePath);
    if (modules[modName] && modules[modName].path) {
        return modules[modName].path;
    }
    const entry = require.resolve(modulePath, {
        paths: [process.cwd()]
    });

    modulePath = './mars_modules' + entry.slice(entry.lastIndexOf('node_modules')).replace('node_modules', '');
    return modulePath;
}

function resolveComponentsPath(components, modules) {
    Object.keys(components).forEach(key => {
        const name = components[key];
        components[key] = (modules[name] && modules[name].resolvedPath) || name;
    });
}

function getUIModules(components, target) {
    const modules = {};
    Object.keys(components).forEach(key => {
        const mod = components[key];
        if (mod[0] !== '.') {
            const name = getModuleName(mod);
            const path = `./mars_modules/${name}/dist/${target}`;
            const realName = `${name}/dist/${target}`;
            modules[name] = {
                path,
                realName,
                type: 'ui'
            };
        }
    });
    return modules;
}

/**
 * compile
 *
 * @param {string} key module key
 * @param {string} val module output path
 * @param {string} destPath dest dir path
 * @return {Promise}
 */
function compile(key, val, destPath) {
    // const {modName, path, resolvedPath} = info;
    if (modules[key] && !modules[key].needCompile) {
        return Promise.resolve();
    }

    const entry = require.resolve(key, {
        paths: [process.cwd()]
    });

    let modulePath = val.replace(/\.js$/, '') + '.js';
    if (fs.existsSync(path.resolve(destPath, modulePath)) || inProcessingModules.has(entry)) {
        return Promise.resolve();
    }

    log.info('[compile:module]:', getPathToCWD(entry), ' => ', modulePath);

    inProcessingModules.add(entry);
    return new Promise((resolve, reject) => {
        webpack({
            entry: [entry],
            output: {
                path: destPath,
                filename: modulePath,
                libraryTarget: 'commonjs'
            },
            devtool: false,
            mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
        }, (err, stats) => {
            if (err) {
                log.error(err.stack || err);
                if (err.details) {
                    log.error(err.details);
                }
                return resolve();
            }

            const info = stats.toJson();

            if (stats.hasErrors()) {
                log.error(info.errors);
            }

            if (stats.hasWarnings()) {
                log.warn(info.warnings);
            }
            inProcessingModules.delete(entry);
            resolve();
            // Done processing
        });
    });

}


async function compileUIModules(uiModules, destPath) {
    for (const key of Object.keys(uiModules)) {
        const {path: modPath, realName} = uiModules[key];
        const coreEntry = require.resolve(realName + '/mars-core', {
            paths: [process.cwd()]
        });
        const entry = coreEntry.replace('mars-core/index.js', '');
        const dest = path.resolve(destPath, modPath);
        const coreDestPath = path.resolve(destPath, 'mars-core');
        const uiCoreDestPath = path.resolve(dest, 'mars-core');
        const coreRelativePath = path.relative(
            uiCoreDestPath,
            coreDestPath
        );
        if (fs.existsSync(uiCoreDestPath + '/index.js')) {
            return;
        }
        log.info('[compile:ui-module]:', getPathToCWD(entry), ' => ', getPathToCWD(dest));
        await fs.copy(entry, dest);
        fs.outputFileSync(uiCoreDestPath + '/index.js', `export * from '${coreRelativePath}';`);
    }
}

module.exports = {
    compile,
    modules,
    H5Modules,
    compileUIModules,
    resolveComponentsPath,
    getUIModules,
    getModulePath
};

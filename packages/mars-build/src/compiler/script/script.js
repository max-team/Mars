/**
 * @file gulp plugin
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-native-reassign */
/* eslint-disable fecs-min-vars-per-destructure */

const path = require('path');
const {transformSync} = require('@babel/core');

const {getModuleName} = require('../../helper/path');
const transformPlugin = require('./babel-plugin-script');
const compileModules = require('../file/compileModules');
const modules = compileModules.modules;

/**
 * compile script
 *
 * @param {string} source source
 * @param {mars.options} options options
 * @return {mars.script.compileScriptResult}
 */
async function compile(source, options) {
    const {
        isApp,
        renderStr,
        coreRelativePath,
        target,
        dest
    } = options;

    let ret = {};
    source = source.replace(
        /process\.env\.MARS_ENV/g,
        JSON.stringify(target)
    ).replace(
        /process\.env\.NODE_ENV/g,
        JSON.stringify(process.env.NODE_ENV || 'development')
    );
    const scriptRet = transformSync(source, {
        plugins: [
            transformPlugin({
                file: ret,
                coreRelativePath,
                isApp,
                renderStr,
                target
            })
        ]
    });
    // 处理完再进行minify，发现minify和定制的插件会有坑
    let code = scriptRet.code;

    let usedModules = {};
    const minifyScriptRet = transformSync(code, {
        plugins: [
            [
                path.resolve(__dirname, '../file/babel-plugin-relative-import.js'),
                {
                    filePath: options.path,
                    cwd: path.resolve(process.cwd(), dest.path),
                    modules,
                    usedModules
                }
            ],
            'minify-guarded-expressions',
            'minify-dead-code-elimination'
        ]
    });

    const destPath = path.resolve(dest.path);
    const usedModuleKeys = Object.keys(usedModules);
    for (let i = 0; i < usedModuleKeys.length; i++) {
        const item = usedModuleKeys[i];
        await compileModules.compile(item, usedModules[item], destPath);
    }

    code = minifyScriptRet.code;
    const {
        config = {},
        components = {},
        computedKeys = [],
        moduleType = 'esm'
    } = ret;

    const uiModules = getUIModules(components, target);
    let resolvedPaths = {};
    code = transformSync(code, {
        plugins: [
            [
                path.resolve(__dirname, '../file/babel-plugin-relative-import.js'),
                {
                    filePath: options.path,
                    cwd: path.resolve(process.cwd(), dest.path),
                    modules: uiModules,
                    resolvedPaths
                }
            ]
        ]
    }).code;

    resolveComponentsPath(components, resolvedPaths);
    await compileModules.compileUIModules(uiModules, destPath);

    return {code, config, components, computedKeys, moduleType};
}

function resolveComponentsPath(components, resolvedPaths) {
    Object.keys(components).forEach(key => {
        const name = components[key];
        components[key] = resolvedPaths[name] || name;
    });
}

function getUIModules(components, target) {
    const modules = {};
    Object.keys(components).forEach(key => {
        const mod = components[key];
        if (mod[0] !== '.') {
            const name = getModuleName(mod);
            const path = `mars_modules/${name}/dist/${target}`;
            const realName = `${name}/dist/${target}`;
            modules[name] = {
                path,
                realName
            };
        }
    });
    return modules;
}

module.exports = {
    compile,
    getUIModules,
    resolveComponentsPath
};

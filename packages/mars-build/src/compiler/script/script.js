/**
 * @file gulp plugin
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-native-reassign */
/* eslint-disable fecs-min-vars-per-destructure */

const path = require('path');
const {transformSync, transformFromAstSync} = require('../../helper/babel');

// const {getModuleName} = require('../../helper/path');
const transformPlugin = require('./babel-plugin-script');
const postTransformPlugin = require('./babel-plugin-script-post');
const compileModules = require('../file/compileModules');
const {resolveComponentsPath, getUIModules, modules} = compileModules;

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
        mpConfig,
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
    const scriptAST = transformSync(source, {
        ast: true,
        code: false,
        plugins: [
            transformPlugin({
                file: ret,
                coreRelativePath,
                isApp,
                mpConfig,
                renderStr,
                target
            })
        ]
    }).ast;
    // let code = scriptRet.code;
    const {
        config = {},
        components = {},
        computedKeys = [],
        moduleType = 'esm'
    } = ret;

    const uiModules = getUIModules(components, target);
    // 处理完再进行minify，发现minify和定制的插件会有坑
    const destPath = path.resolve(dest.path);
    const rPath = path.relative(path.dirname(options.path), destPath);
    let usedModules = {};
    const minifyScriptRet = transformFromAstSync(scriptAST, source, {
        plugins: [
            [
                path.resolve(__dirname, '../file/babel-plugin-relative-import.js'),
                {
                    rPath,
                    modules: Object.assign({}, modules, uiModules),
                    usedModules,
                    compileNPM: process.env.MARS_ENV_TARGET === 'wx'
                }
            ],
            'minify-guarded-expressions',
            'minify-dead-code-elimination'
        ]
    });
    const code = minifyScriptRet.code;

    const usedModuleKeys = Object.keys(usedModules);
    for (let i = 0; i < usedModuleKeys.length; i++) {
        const key = usedModuleKeys[i];
        const info = usedModules[key];
        const {modName, path} = info;
        if (!uiModules[modName]) {
            await compileModules.compile(key, path, destPath);
        }
    }

    resolveComponentsPath(components, usedModules);
    await compileModules.compileUIModules(uiModules, destPath);

    return {code, config, components, computedKeys, moduleType};
}

/**
 * postcompile script
 *
 * @param {string} source source
 * @param {mars.options} options options
 * @return {mars.script.compileScriptResult}
 */
async function postCompile(source, options) {
    const {componentsInUsed} = options;
    const scriptRet = transformSync(source, {
        plugins: [
            postTransformPlugin({
                componentsInUsed
            })
        ]
    });
    return {code: scriptRet.code};
}

module.exports = {
    compile,
    postCompile
};

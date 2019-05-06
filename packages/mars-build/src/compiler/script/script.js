/**
 * @file gulp plugin
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */

/* eslint-disable no-native-reassign */

/* eslint-disable fecs-min-vars-per-destructure */

const {transformSync, transformFromAst} = require('@babel/core');
const transformPlugin = require('./babel-plugin-script');
const path = require('path');
const {getDestDir} = require('../../helper/path');
const compileModules = require('../file/compileModules');

exports.compile = async function compile(source, options) {
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
                    usedModules
                }
            ],
            'minify-guarded-expressions',
            'minify-dead-code-elimination'
        ]
    });

    const destPath = path.resolve(getDestDir(dest, target));
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
    return {code, config, components, computedKeys, moduleType};
};

/**
 * @file gulp plugin
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */

/* eslint-disable no-native-reassign */

/* eslint-disable fecs-min-vars-per-destructure */

const {transformSync, transformFromAst} = require('@babel/core');
const transformPlugin = require('./babel-plugin-script');

exports.compile = function compile(source, options) {
    const {
        isApp,
        renderStr,
        coreRelativePath,
        target
    } = options;
    let ret = {};
    source = source.replace(
        /process\.env\.MARS_ENV/g,
        JSON.stringify(target)
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
    const minifyScriptRet = transformSync(code, {
        plugins: [
            'minify-guarded-expressions',
            'minify-dead-code-elimination'
        ]
    });
    code = minifyScriptRet.code;
    const {
        config = {},
        components = {},
        computedKeys = [],
        moduleType = 'esm'
    } = ret;
    return {code, config, components, computedKeys, moduleType};
};

/**
 * @file babel helper
 * @author zhangwentao
 */

const {transformSync, transformFromAstSync} = require('@babel/core');
const DEFAULT_OPTIONS = {
    configFile: false,
    babelrc: false
};

exports.transformSync = function (code, opts = {}) {
    return transformSync(code, Object.assign(opts, DEFAULT_OPTIONS));
};

exports.transformFromAstSync = function (ast, code, opts = {}) {
    return transformFromAstSync(ast, code, Object.assign(opts, DEFAULT_OPTIONS));
};

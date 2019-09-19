/**
 * @file buildin processors
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

const {transformSync} = require('../../helper/babel');
const post = require('postcss');
const accord = require('accord');

exports.less = function less(source, options) {
    return accord.load('less').render(source, options).then(res => res.result).catch(e => {
        throw new Error(e);
    });
};

exports.stylus = function stylus(source, options) {
    return accord.load('stylus').render(source, options).then(res => res.result).catch(e => {
        throw new Error(e);
    });
};

exports.sass = function sass(source, options) {
    return accord.load('scss').render(source, options).then(res => res.result).catch(e => {
        throw new Error(e);
    });
};

exports.babel = function babel(source, options) {
    return transformSync(source, options).code;
};

exports.typescript = function (source, options) {
    return transformSync(source, Object.assign({
        plugins: ['@babel/plugin-transform-typescript']
    }, options)).code;
};

exports.postcss = function postcss(source, options = {}) {
    const {plugins = [], ...rest} = options;
    const processor = post(plugins);
    options.from = undefined;
    return processor.process(source, options)
        .then(res => res.css)
        .catch(e => {
            throw new Error(e);
        });
};

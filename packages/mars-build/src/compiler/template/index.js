/**
 * @file template compiler
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */

/* eslint-disable no-native-reassign */

/* eslint-disable fecs-min-vars-per-destructure */

function defaultTransformer(ast, options) {
    return {ast};
}

exports.getCompiler = function getCompiler(marker, transformer, generater, target) {
    return function compiler(source, options) {
        let {ast, render, componentsInUsed} = marker(source, options);
        let {ast: myAst} = transformer(ast, options);
        options = Object.assign(options, {
            target
        });
        let code = generater(myAst, options);

        return {render, code, componentsInUsed};
    };
};

exports.transform = function defaultTransform(ast, options) {
    return {ast};
};
exports.generate = require('./generate');
exports.mark = require('./mark-component');
exports.markH5 = require('./mark-component').markH5;

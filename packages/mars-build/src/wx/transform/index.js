/**
 * @file build
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

const transformAST = require('./transform');
// import generate from './generate';

exports.transform = function transform(ast, options) {
    return transformAST(ast, options);
};
// export function compileToWx(compiled, options) {
//     const {ast} = compiled;

//     const {ast: swanAst} = transform(ast, options);
//     const code = generate(swanAst);
//     // console.log(swanAst, code);
//     return {code};
// }

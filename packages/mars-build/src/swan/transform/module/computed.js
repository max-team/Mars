/**
 * @file build
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

const {transformSync} = require('../../../helper/babel');
const transformPlugin = require('./babel-plugin-computed');

// test cases
// @see examples/features/src/components/features/computed.vue
function compile(source, options) {
    let isObj = false;
    if (/^\{[\s\S]*\}$/.test(source)) {
        isObj = true;
        source = `(${source})`;
    }

    const {computedKeys} = options;
    let code = transformSync(source, {
        plugins: [transformPlugin({
            computedKeys
        })]
    }).code;
    // let code = transformFromAst(ast).code;
    code = code.replace(/\;$/, '');
    if (isObj) {
        code = code.replace(/^\(|\)$/g, '');
    }

    return code;
}

function getComputedModifier(computedKeys) {
    const KEYS_REG = new RegExp(`${computedKeys.join('|')}`);
    return function modifier(val) {
        // quick test
        if (val && KEYS_REG.test(val)) {
            // try {
            return val = compile(val, {
                computedKeys
            });
            // }
            // catch (e) {
            //     throw new Error(`[transpile fail] computedKeys: [${computedKeys.join(', ')}], val: ${val}`);
            // }
        }

        return val;
    };
}

exports.compile = compile;
exports.getComputedModifier = getComputedModifier;

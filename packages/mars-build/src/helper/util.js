/**
 * @file util
 * @author zhangwentao
 */

const mergeWith = require('lodash.mergewith');

function customizerReplaceArray(objValue, srcValue) {
    if (Array.isArray(objValue)) {
        return srcValue;
    }
}

function getMerge(customizer) {
    return (object, sources) => mergeWith(object, sources, customizer);
}

exports.merge = getMerge(customizerReplaceArray);

/**
 * Create a cached version of a pure function.
 */

function cached(fn) {
    const cache = Object.create(null);
    return function cachedFn(str) {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
}

/**
 * Camelize a hyphen-delimited string.
 */

const camelizeRE = /-(\w)/g;
const camelize = cached(str => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
});

/**
 * Capitalize a string.
 */
const capitalize = cached(str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
});

/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cached(str => {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
});

exports.camelize = camelize;
exports.capitalize = capitalize;
exports.hyphenate = hyphenate;

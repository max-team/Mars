/**
 * @file util.js
 * @author winty2013@gmail.com
 */

const toString = Object.prototype.toString;

export function isObject(obj) {
    return toString.call(obj) === '[object Object]';
}

export function isArray(obj) {
    return toString.call(obj) === '[object Array]';
}

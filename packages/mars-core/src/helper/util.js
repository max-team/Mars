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


const reLeadingDot = /^\./;
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
const reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @param {string} string The string to convert.
 * @return {Array} Returns the property path array.
*/
export function stringToPath(string) {
    let result = [];

    if (reLeadingDot.test(string)) {
        result.push('');
    }
    string.replace(rePropName, (match, number, quote, string) => {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
}

export function setObjectData(target, model, value) {
    const modelArr = stringToPath(model);
    let parent = target;
    let key;
    while (parent[key = modelArr.shift()] !== undefined) {
        if (modelArr.length > 0) {
            parent = parent[key];
        }
        else {
            parent[key] = value;
        }
    }
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}

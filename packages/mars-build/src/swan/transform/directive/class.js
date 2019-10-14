/**
 * @file transform class
 * @author mars
 *
 * TODO 改成用 babel 实现
 * eg
 * 1. :class={ active: isActive }   ->    class={{[isActive ? 'active' : '']}}
 * 2. class="static" :class="{ active: isActive, 'text-danger': hasError }"  ->  class="static {{[isActive ? 'active' : '', hasError ? 'text-danger' : '']}}"
 * 3. class="static" :class="[activeClass, errorClass]" -> class="static {{[activeClass, errorClass]}}
 * 4. class="static" :class="[isActive ? activeClass : '', errorClass]"  ->  class="static {{[isActive ? activeClass : '', errorClass]}}"
 * 5. class="static" :class="[{ active: isActive }, errorClass]" -> class="static {{[isActive ? 'active' : '', errorClass]}}
 *
 */

const PLAIN_OBJECT_REGEXP = /^{[\s\S]*}$/;
const SQUARE_BRACKETS_REGEXP = /^\[[\s\S]*\]$/;

module.exports = function (name, value, attrs, node) {
    // let value = attrs[name];
    // let arrToStr = opts && opts.arrToStr;
    let {staticClass = ''} = node;
    staticClass = staticClass.replace(/\"/g, '');

    let arrToStr = false;
    if (typeof value === 'string') {
        value = value.trim();
    }
    else {
        value = '';
    }

    if (PLAIN_OBJECT_REGEXP.test(value)) {
        value = transformObjClass(value, arrToStr);
        if (!arrToStr) {
            value = `[${value}]`;
        }
    }
    else if (SQUARE_BRACKETS_REGEXP.test(value)) {
        value = transformArrayClass(value, arrToStr);
        if (!arrToStr) {
            value = `[${value}]`;
        }
    }

    value = `{{${value}}}`;

    // add up static class and dynamic class when there is class attribute
    attrs.class = staticClass ? `${staticClass} ${value}` : value;
    delete node.attrsMap.class;
};


/**
 * transform object syntax class
 * eg: { active: isActive } -> [isActive ? 'active' : '']
 *
 * @param {string} value   string to be transformed
 * @param {boolean=} objToStr whether convert object syntax to string, by default false
 * @return {string} transformed result
 */
function transformObjClass(value, objToStr) {
    value = value.replace(/[\n{}]/g, '').split(',').map(item => {
        item = item.trim();
        // const arr = item.split(':');
        const index = item.indexOf(':');
        const arr = [item.slice(0, index), item.slice(index + 1)];
        let [name, value] = arr;

        name = name.trim();
        value = value.trim();
        if (name.indexOf('\"') < 0 && name.indexOf('\'') < 0) {
            name = `'${name}'`;
        }
        let result = `(${value}) ? ${name} : ''`;

        return objToStr ? `(${result})` : result;
    });
    return value.join(objToStr ? ' + \' \' + ' : ', ');
}

/**
 * transform array syntax class
 * eg: [{ active: isActive }, errorClass] -> [[isActive ? 'active' : ''], errorClass]
 *
 * @param {string} value string to be transformed
 * @param {boolean=} arrToStr whether convert array syntax to string, by default false
 * @return {string} transformed result
 */
function transformArrayClass(value, arrToStr) {
    return value.replace(/[\n[\]]/g, '').split(',').map(item => {
        item = item.trim();
        if (/^{.*}$/.test(item)) {
            return transformObjClass(item, arrToStr);
        }
        else if (arrToStr && /^.+\?.+:.+$/.test(item)) {
            return `(${item})`;
        }

        return item;
    }).join(arrToStr ? ' + \' \' + ' : ', ');
}

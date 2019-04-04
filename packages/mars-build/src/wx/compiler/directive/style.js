/**
 * @file transform style
 * @description
 * 仅支持以下语法，不支持styleObject
 * eg
 * 1. :style="{ color: activeColor, fontSize: fontSize + 'px' }"
 * 2. :style="[{ color: activeColor, fontSize: fontSize + 'px' }]"
 *
 * @author sharonzd
 */

const CURLY_BRACE_HAS_REGEXP = /{[\s\S]*}/;

module.exports = function (name, value, attrs, node) {
    let {staticStyle = ''} = node;
    staticStyle = staticStyle.replace(/[\"\{\}]/g, '');

    if (typeof value === 'string') {
        value = value.trim();
    }
    else {
        value = '';
    }

    if (CURLY_BRACE_HAS_REGEXP.test(value)) {
        value = transformObjStyle(value);
    }
    else {
        value = `{{${value}}}`;
    }

    attrs.style = staticStyle ? `${staticStyle};${value}` : value;
    delete node.attrsMap.style;
};

/**
 * transform object syntax class
 * eg: { color: activeColor, fontSize: fontSize + 'px' } -> color: activeColor, font-size: {{fontSize + 'px'}}
 *  [{ color: activeColor,fontWeight: 'bold', textAlign: center ? 'center' : 'left'}, {fontSize: fontSize + 'px' }] -> color: activeColor, font-size: {{fontSize + 'px'}}
 *
 * @param {string} value   string to be transformed
 * @return {string} transformed result
 */
function transformObjStyle(value) {
    // 去掉首尾空格、去掉首尾方括号、去掉花括号，以`,`为分隔。将字符串重组为style的字面量语法
    value = value
        .trim()
        .replace(/^\[|]$/g, '')
        .replace(/[{}]/g, '')
        .split(',')
        .map(item => {
            const index = item.indexOf(':');
            const arr = [item.slice(0, index), item.slice(index + 1)];
            arr[0] = arr[0].trim().replace(/([A-Z])/g, '-$1').toLowerCase();
            arr[0] = arr[0].replace(/\'/g, '');
            return `${arr[0]}:{{${arr[1].trim()}}}`;
        }).join(';');
    return value;
}

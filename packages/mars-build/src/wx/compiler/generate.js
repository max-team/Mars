/**
 * @file build
 * @author zhangwentao <winty2013@gmail.com>
 */

module.exports = function generate(obj, options = {}, index = 0) {
    const {
        tag,
        attrsMap = {},
        children,
        text,
        ifConditions
    } = obj;
    if (!tag) {
        return text;
    }

    let child = '';
    if (children && children.length) {
        // 递归子节点
        child = children.map(v => {
            return generate(v, options, index + 1);
        }).join('');
    }

    // v-if 指令
    const ifConditionsArr = [];
    if (ifConditions) {
        const length = ifConditions.length;
        for (let i = 1; i < length; i++) {
            ifConditionsArr.push(generate(ifConditions[i].block, options, index));
        }
    }

    const attrs = Object.keys(attrsMap).map(k => convertAttr(k, attrsMap[k])).join(' ');
    const ifText = ifConditionsArr.length > 0 ? (ifConditionsArr.join('') + '\n') : '';

    const tags = ['progress', 'checkbox', 'switch', 'input', 'radio', 'slider', 'textarea'];
    if (tags.indexOf(tag) > -1) {
        return `<${tag}${attrs ? ' ' + attrs : ''} />
${ifText}`;
    }

    if (!child) {
        return `<${tag}${attrs ? ' ' + attrs : ''}></${tag}>
${ifText}`;
    }

    return `<${tag}${attrs ? ' ' + attrs : ''}>
${child || ''}
</${tag}>
${ifText}`;
};

function convertAttr(key, val) {
    return (val === '' || typeof val === 'undefined') ? key : `${key}="${val}"`;
}

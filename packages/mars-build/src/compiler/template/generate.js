/**
 * @file base generater
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */

/* eslint-disable no-native-reassign */

/* eslint-disable fecs-min-vars-per-destructure */
const customTemplate = 'template-mars';

module.exports = function generate(obj, options = {}) {
    const {
        attrsMap = {},
        children,
        text,
        scopedSlots,
        ifConditions
    } = obj;
    let tag = obj.tag;
    if (!tag) {
        return text;
    }

    if (tag === customTemplate && (process.env.MARS_ENV_TARGET || options.target) !== attrsMap.target) {
        return;
    }
    else if (tag === customTemplate) {
        tag = 'block';
        delete attrsMap.target;
    }

    let child = '';
    if (children && children.length > 0) {
        child = children.map(v => generate(v, options)).join('');
    }

    let slots = '';
    if (scopedSlots) {
        slots = Object.keys(scopedSlots).map(k => generate(scopedSlots[k], options)).join('');
    }

    let ifConditionsArr = [];
    if (ifConditions && ifConditions.length > 0) {
        ifConditionsArr = ifConditions.slice(1).map(item => generate(item.block, options));
    }

    const attrs = Object.keys(attrsMap).map(k => convertAttr(k, attrsMap[k])).join(' ');
    const ifText = ifConditionsArr.join('');

    let spaceLine = process.env.NODE_ENV === 'dev' ? '\n' : '';
    const tags = ['progress', 'checkbox', 'switch', 'input', 'radio', 'slider', 'textarea'];
    if (tags.indexOf(tag) > -1) {
        return `${spaceLine}<${tag}${attrs ? ' ' + attrs : ''} />${ifText}`;
    }

    return `${spaceLine}<${tag}${attrs ? ' ' + attrs : ''}>${child || ''}${slots || ''}</${tag}>${ifText}`;
};

function convertAttr(key, val) {
    return (val === '' || typeof val === 'undefined') ? key : `${key}="${val.replace(/\"/g, '\\"')}"`;
}

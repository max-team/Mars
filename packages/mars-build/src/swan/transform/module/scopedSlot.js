/**
 * @file scoped slot 相关代码
 * @author meixuguang
 */
/* eslint-disable fecs-min-vars-per-destructure */

const {modifyBind} = require('./helper');

exports.processAttrs = function processAttrs(attrsMap, node) {
    let attrs = {};
    const slotProps = {};
    Object.keys(attrsMap).forEach(key => {
        const val = attrsMap[key];
        if (!directive(key, val, slotProps)) {
            attrs[key] = val;
        }
    });

    if (Object.keys(slotProps).length > 0) {
        const attrName = 'var-slotProps';
        attrs[attrName] = `{{ ${
            '{'
            +  Object.keys(slotProps).map(k => {
                const v = slotProps[k];
                return k + ': ' + v;
            }).join(',')
            + '}'
        } }}`;
    }

    return attrs;

    function directive(key, val, slotProps) {
        const [dir, param] = key.split(':');

        if (dir === 'v-bind') {
            if (param === 'name') {
                return false;
            }

            slotProps[param] = val;
            return true;
        }
    }
};

exports.changeSlotPropsBind = function changeSlotPropsBind(node, options) {
    if (!options.slotScope) {
        return;
    }

    modifyBind(node, val =>
        val.replace(new RegExp(options.slotScope, 'g'), 'slotProps')
    );
};

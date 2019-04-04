/**
 * @file build
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

const directive = require('./directive');
const {getComputedModifier} = require('./module/computed');
const {modifyBind} = require('./module/helper');

function attrsFormat(attrs = {}) {
    const obj = {};

    Object.keys(attrs).forEach(key => {
        const val = attrs[key];
        key = key.replace(/^@/, 'v-on:').replace(/^:/, 'v-bind:');

        obj[key] = val;
    });

    return obj;
}

function transAttrs(node, options) {
    const {attrsMap} = node;

    let attrs = {};

    // 特殊处理v-show，等style处理完最后处理v
    let showAttr = null;
    if ('v-show' in attrsMap) {
        showAttr = attrsMap['v-show'];
        delete attrsMap['v-show'];
    }

    Object.keys(attrsMap).forEach(key => {
        if (attrsMap.hasOwnProperty(key)) {
            const val = attrsMap[key];
            if (!directive(key, val, attrs, node)) {
                attrs[key] = val;
            }
        }

    });

    if (null !== showAttr) {
        // 最后处理 v-show
        directive('v-show', showAttr, attrs, node);
    }

    return attrs;
}

function transform(node, options) {
    const {
        children,
        ifConditions,
        attrsMap,
        tag
    } = node;

    const isComp = options && options.components && options.components[tag];
    node.isComp = isComp;
    // const ast = Object.assign({}, node);
    node.attrsMap = attrsFormat(attrsMap);

    const computedKeys = (options && options.computedKeys) || [];
    if (isComp) {
        node.attrsMap['v-bind:rootComputed'] = 'compComputed || rootComputed';
        node.attrsMap['v-bind:rootUID'] = 'rootUID';
    }

    if (computedKeys.length > 0) {
        node = modifyBind(node, getComputedModifier(computedKeys));
    }

    node.attrsMap = transAttrs(node, options);

    if (children) {
        node.children = children.map((k, index) => transform(k, options));
    }

    if (ifConditions) {
        ifConditions.forEach((c, i) => {
            if (c.block !== node) {
                node.ifConditions[i].block = transform(c.block, options);
            }

        });
    }

    return node;
}

module.exports = function transformAST(node, options) {
    const ret = transform(node, options);
    return {
        ast: ret
    };
};

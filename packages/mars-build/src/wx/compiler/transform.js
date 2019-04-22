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

function transFilters(node, options) {
    // filters 的处理
    /* eslint-disable fecs-camelcase */
    const {_fid: fid, _filters: filters} = node;
    /* eslint-enable fecs-camelcase */
    if (fid !== undefined) {
        filters.p.forEach(name => {
            const val = `_f_[${fid}]._p.${name}`;
            node.attrsMap['v-bind:' + name] = val;
        });

        filters.t.forEach((item, index) => {
            if (item && node.children && node.children[index]) {
                let child = node.children[index];
                let token = `_f_[${fid}]._t[${index}]`;
                child.tokens = [{'@binding': token}];
                child.text = `{{ ${token} }}`;
            }
        });

        if (filters.vfor) {
            node.for = `_f_[${fid}]._for`;
        }

        if (filters.vif) {
            node.attrsMap['v-if'] = `_f_[${fid}]._if`;
        }

        if (filters.velseif) {
            node.attrsMap['v-else-if'] = `_f_[${fid}]._if`;
        }
    }

    return node;
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

    node = transFilters(node, options);
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

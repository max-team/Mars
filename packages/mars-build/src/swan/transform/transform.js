/**
 * @file build
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

const directive = require('./directive');
const {getComputedModifier} = require('./module/computed');
const {modifyBind} = require('./module/helper');
const {judgeNodeType, NODE_TYPES} = require('./nodeTypes');
const {
    processAttrs: processScopedSlotAttrs,
    changeSlotPropsBind
} = require('./module/scopedSlot');

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
        // directive 遍历时，有的值可能已被删除
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

function processChildren(node, options) {
    if (!node.children) {
        return;
    }

    node.children = node.children.map((k, index) => transform(k, options));
}

function processIfConditions(node, options) {
    if (!node.ifConditions) {
        return;
    }

    node.ifConditions.forEach((c, i) => {
        if (c.block !== node) {
            node.ifConditions[i].block = transform(c.block, options);
        }

    });
}

function processScopedSlots(node, options) {
    if (!node.scopedSlots) {
        return;
    }

    Object.keys(node.scopedSlots).map(k => {
        node.scopedSlots[k] = transform(node.scopedSlots[k], options);
    });
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

const nodeProcesser = {
    preProcess(nodeType, node, options) {
        // 格式化 attrsMap
        node.attrsMap = attrsFormat(node.attrsMap);

        switch (nodeType) {
            // 声明了 slot-scope 变量，内部都要进行替换
            case NODE_TYPES.SLOT_SCOPE:
            case NODE_TYPES.SLOT_SCOPE | NODE_TYPES.COMPONENTS:
                if (options.slotScope) {
                    // TODO：报错，暂不支持 scoped slot 嵌套
                }

                options.slotScope = node.slotScope;
                break;

                // slot 标签，需要记录并修改 bind 值
            case NODE_TYPES.SLOT:
                node.attrsMap = processScopedSlotAttrs(node.attrsMap);
                break;
        }

        if (nodeType & NODE_TYPES.COMPONENTS) {
            node.isComp = true;
        }

    },
    process(nodeType, node, options) {
        // computed
        const computedKeys = (options && options.computedKeys) || [];
        if (node.isComp) {
            node.attrsMap['v-bind:rootComputed'] = 'compComputed || rootComputed';
            node.attrsMap['v-bind:rootUID'] = 'rootUID';
        }

        if (computedKeys.length > 0) {
            node = modifyBind(node, getComputedModifier(computedKeys));
        }

        // scoped slots 变量替换
        if (options.slotScope) {
            changeSlotPropsBind(node, options);
        }

        node = transFilters(node, options);
        node.attrsMap = transAttrs(node, options);
        processChildren(node, options);

        // 声明了 scopedSlots 的子元素
        processScopedSlots(node, options);

        processIfConditions(node, options);
    },
    afterProcess(nodeType, node, options) {
        switch (nodeType) {
            // 声明了 slot-scope 变量，内部都要进行替换
            case NODE_TYPES.SLOT_SCOPE:
            case NODE_TYPES.SLOT_SCOPE | NODE_TYPES.COMPONENTS:
                options.slotScope = '';
                break;
            case NODE_TYPES.SLOT:
                break;
        }
    }
};

/**
 * 转换 ast 节点
 *
 * @param {Object} node ast 节点
 * @param {Object} options 选项
 * @return {Object}
 */
function transform(node, options) {
    const nodeType = judgeNodeType(node, options);

    nodeProcesser.preProcess(nodeType, node, options);

    nodeProcesser.process(nodeType, node, options);

    nodeProcesser.afterProcess(nodeType, node, options);

    return node;
}

module.exports = function transformAST(node, options) {
    const ret = transform(node, options);
    return {
        ast: ret
    };
};

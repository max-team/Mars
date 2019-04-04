/**
 * @file 需要特殊处理的节点类型定义
 * @author meixuguang
 */

/**
 * 节点类型定义，采用二进制标志位方式用特性来进行组合表示
 * 特性从上到下，分别表示 低位 -> 高位
 *
 * 1 tag 为 slot
 * 2 声明了 slot-scope 变量
 * 4 组件
 */

const SLOT = 1;
const SLOT_SCOPE = 2;
const COMPONENTS = 4;

const NODE_TYPES = {
    SLOT,
    SLOT_SCOPE,
    COMPONENTS
};

exports.NODE_TYPES = NODE_TYPES;
exports.judgeNodeType = function judgeNodeType(node, options) {
    return (node.slotScope ? SLOT_SCOPE : 0)
        | (node.tag === 'slot' ? SLOT : 0)
        | (options && options.components && options.components[node.tag] ? COMPONENTS : 0);
};

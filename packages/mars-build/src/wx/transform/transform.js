/**
 * @file build
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

const directive = require('./directive');
// const {getComputedModifier} = require('./module/computed');
const {modifyBind, transformExpression} = require('./module/helper');

function attrsFormat(node, attrs = {}) {
    const obj = {};

    Object.keys(attrs).forEach(key => {
        let val = attrs[key];
        key = key.replace(/^@/, 'v-on:').replace(/^:/, 'v-bind:');

        // 支持函数调用带参数 预处理
        if (key.indexOf('v-on:') === 0) {
            const [dir, param] = key.split(':');
            const [eventName] = param.split('.');
            if (val.indexOf('(') > -1) {
                const matches = val.match(/([^(]+)\(([^)]+)\)/);
                if (matches) {
                    const handlerName = matches[1].trim();
                    let args = matches[2];
                    // mark $event to special string
                    args = args.split(',').map(a => {
                        a = a.trim();
                        return a === '$event' ? '\'_$event_\'' : a;
                    });
                    args = `[ ${args.join(',')} ]`;

                    // modify handlerName and gen args bind
                    val = handlerName;
                    obj[`v-bind:data-${eventName}ArgumentsProxy`.toLowerCase()] = args;
                }
            }
        }

        obj[key] = val;
    });

    if (node.isComp) {
        // node.attrsMap['v-bind:rootComputed'] = 'compComputed || rootComputed';
        node.attrsMap['v-bind:rootUID'] = 'rootUID';
    }

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

// function transFilters(node, options) {
//     // filters 的处理
//     /* eslint-disable fecs-camelcase */
//     const {_fid: fid, _filters: filters} = node;
//     /* eslint-enable fecs-camelcase */
//     if (fid !== undefined) {
//         filters.p.forEach(name => {
//             const val = `_f_[${fid}]._p.${name}`;
//             node.attrsMap['v-bind:' + name] = val;
//         });

//         filters.t.forEach((item, index) => {
//             if (item && node.children && node.children[index]) {
//                 let child = node.children[index];
//                 let token = `_f_[${fid}]._t[${index}]`;
//                 child.tokens = [{'@binding': token}];
//                 child.text = `{{ ${token} }}`;
//             }
//         });

//         if (filters.vfor) {
//             node.for = `_f_[${fid}]._for`;
//         }

//         if (filters.vif) {
//             node.attrsMap['v-if'] = `_f_[${fid}]._if`;
//         }

//         if (filters.velseif) {
//             node.attrsMap['v-else-if'] = `_f_[${fid}]._if`;
//         }
//     }

//     return node;
// }

function transFilters(node, options) {
    // filters 的处理
    /* eslint-disable fecs-camelcase */
    const filtersList = node._filters;
    /* eslint-enable fecs-camelcase */
    if (!filtersList) {
        return node;
    }

    Object.keys(filtersList).forEach(fid => {
        const filters = filtersList[fid];
        const fidStr = filters.vfori
                ? `'${fid}__' + ${filters.vfori.join('+ \'_\' +')}`
                : `'${fid}'`;
        let fPrefix = `_f_[${fidStr}]`;

        if (filters.vfor) {
            // node.for = `_f_['${fid}_0']._for`;
            node.for = `${fPrefix}._for`;
        }

        filters.p && filters.p.forEach(name => {
            const val = `${fPrefix}._p.${name}`;
            node.attrsMap['v-bind:' + name] = val;
        });

        if (filters.t) {
            let token = `${fPrefix}._t`;
            node.tokens = [{'@binding': token}];
            node.text = `{{ ${token} }}`;
        }

        if (filters.vif) {
            node.attrsMap['v-if'] = `${fPrefix}._if`;
        }

        if (filters.velseif) {
            node.attrsMap['v-else-if'] = `${fPrefix}._if`;
        }
    });

    return node;
}

function transform(node, options) {
    const {
        children,
        ifConditions,
        attrsMap,
        tag
    } = node;

    // const isComp = options && options.components && options.components[tag];
    // node.isComp = isComp;
    // const ast = Object.assign({}, node);
    node.attrsMap = attrsFormat(node, attrsMap);
    node = modifyBind(node, val => {
        // quick test
        if (!/`[\s\S]*`/.test(val)) {
            return val;
        }
        return transformExpression(val, {
            plugins: [
                ['@babel/plugin-transform-template-literals', {
                    loose: true
                }]
            ]
        });
    });

    // const computedKeys = (options && options.computedKeys) || [];


    // if (computedKeys.length > 0) {
    //    node = modifyBind(node, getComputedModifier(computedKeys));
    // }

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

/**
 * @file base marker
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-native-reassign */
/* eslint-disable fecs-min-vars-per-destructure */

const {compile: compileTemplate} = require('vue-template-compiler/build');
const transpile = require('vue-template-es2015-compiler');
const customTemplate = 'template-mars';
const {generate} = require('./render');

function getIterator(node) {
    if (!node) {
        return 'index';
    }

    return node.iterator1 || getIterator(node.parent);
}

function isInFor(el) {
    if (!el) {
        return false;
    }

    if (el.for) {
        return true;
    }

    return isInFor(el.parent);
}

// 判断租先节点是否含有 template-mars target当前环境，如果含有，则收集ast tag
function checkCurrentEnvComponent(ast, target) {
    let parent = ast.parent;
    if (parent) {
        if (parent.tag === customTemplate && parent.attrsMap && parent.attrsMap.target !== target) {
            return false;
        }
        else {
            return checkCurrentEnvComponent(parent, target);
        }
    }
    return true;
}

function updateComponents(components, componentsInUsed) {
    Object.keys(componentsInUsed).forEach(comp => {
        if (!componentsInUsed[comp].using) {
            delete components[comp];
        }
    });
}

function getMarkNode(options, componentsInUsed = {}) {
    let {components, target} = options;
    let compIdCounter = 0;
    return function markNode(el, options) {
        const tag = el.tag;
        const isComp = components && components[tag];
        el.isComp = isComp;

        if (isComp && checkCurrentEnvComponent(el, target || process.env.MARS_ENV_TARGET)) {
            componentsInUsed[tag].using = true;
        }

        if (el.attrsMap['v-for'] && !el.iterator1) {
            el.iterator1 = 'index';
        }

        if (isComp) {
            // TODO：如果用户自己设置了 comId，报 warning
            let value;
            if (isInFor(el)) {
                const iterator = getIterator(el);
                value = '(compId ? compId : \'$root\') + ' + '\',' + compIdCounter + '-\' + ' + iterator;
            }
            else {
                value = '(compId ? compId : \'$root\') + ' + '\',' + compIdCounter + '\'';
            }
            el.attrsList.push({
                name: ':compId',
                value
            });
            el.attrsMap[':compId'] = value;
            compIdCounter++;
        }

        ['v-show', 'v-model'].forEach(dir => {
            if (el.attrsMap[dir]) {
                const value = el.attrsMap[dir];
                el.attrsList.push({
                    name: `:${dir}`,
                    value
                });
                el.attrsMap[`:${dir}`] = value;
            }
        });

        // plain el will skip genData
        // mark el with ComplexExp not plain to make filters data generated
        if (el.attrsList.length === 0
            && (isComplexExp(el.for) || isComplexExp(el.if) || isComplexExp(el.elseif))
        ) {
            el.plain = false;
        }
    };
}

function isComplexExp(exp) {
    return typeof exp === 'string' ? /^\(.+\)$/.test(exp) : false;
}

function isFilter(value) {
    return value.indexOf('_f(') >= 0;
}

function getFilters(node) {
    const props = '{' + Object.keys(node.attrsMap).reduce((res, name) => {
        const value = node.attrsMap[name];
        if (name.indexOf(':') >= 0 && (isFilter(value) || isComplexExp(value))) {
            const nName = name.replace(/^(v-bind)?:/, '');
            res += `${nName}: ${value},`;
        }
        return res;
    }, '').slice(0, -1) + '}';

    let vfor = isComplexExp(node.for) ? node.for : undefined;
    let vif = isComplexExp(node.if) ? node.if : undefined;
    let velseif = isComplexExp(node.elseif) ? node.elseif : undefined;

    const hasFilter = props !== '{}';
    return (hasFilter || vfor || vif || velseif)
        ? {
            p: props,
            vfor,
            vif,
            velseif
        }
        : null;
}

function getGenData(options) {
    let filterIdCounter = 0;
    return function markNode(value, type, el) {
        if (type === 'if') {
            // if 里面不会有 filter
            if (!isComplexExp(value)) {
                return value;
            }

            const fid = filterIdCounter++;
            const data = [
                `fid: ${fid}`,
                `value: ${value}`
            ];
            const kind = el.if ? 'vif' : (el.elseif ? 'velseif' : '');
            if (kind) {
                el._filters = el._filters || {};
                el._filters[fid] = {
                    [kind]: true
                };
            }
            return `_ff({${data.join(',')}}, '${type}')`;
        }

        if (type === 'p') {
            const fid = filterIdCounter++;
            const data = [
                `fid: ${fid}`,
                `value: {${value.map(item => `${item[0]}: ${item[1]}`).join(',')}}`
            ];

            el._filters = el._filters || {};
            el._filters[fid] = {
                p: value.map(item => item[0])
            };

            return `_ff({${data.join(',')}}, '${type}')`;
        }

        if (type === 't') {
            const isComplex = value.tokens.some(token => typeof token === 'object' && isComplexExp(token['@binding']));
            const isFilter = value.expression.indexOf('_s(_f(') >= 0;
            const expression = value.expression.replace('_s', '');
            if (isComplex || isFilter) {
                const fid = filterIdCounter++;
                const data = [
                    `fid: ${fid}`,
                    `value: ${expression}`
                ];

                el._filters = el._filters || {};
                el._filters[fid] = {
                    t: true
                };

                return `_ff({${data.join(',')}}, '${type}')`;
            }
            return expression;
        }

        if (type === 'for') {
            if (!isComplexExp(value)) {
                return value;
            }
            const fid = filterIdCounter++;
            const data = [
                `fid: ${fid}`,
                `value: ${value}`
            ];

            el._filters = el._filters || {};
            el._filters[fid] = {
                vfor: true
            };

            return `_ff({${data.join(',')}}, '${type}')`;
        }

        return '';
    };
}


function getPostTrans(options) {
    const {
        target
    } = options;
    return function postTrans(el) {
        const children = el.children;
        // remove all directives
        if (el.directives) {
            delete el.directives;
        }
        children.forEach((child, index) => {
            if (child.tag === customTemplate
                && child.attrsMap
                && child.attrsMap.target !== target) {
                children.splice(index, 1);
            }
        });
    };
}

module.exports = function mark(source, options) {
    const {
        components = {}
    } = options;

    let componentsInUsed = {};
    Object.keys(components).forEach(name => {
        if (!componentsInUsed[name]) {
            componentsInUsed[name] = {
                using: false,
                declaration: components[name]
            };
        }
    });

    const {
        ast,
        staticRenderFns,
        errors
    } = compileTemplate(source, {
        preserveWhitespace: false,
        modules: [
            {
                transformNode: getMarkNode(options, componentsInUsed),
                postTransformNode: getPostTrans(options)
            }
        ]
    });

    const render = generate(ast, {
        processFilterData: getGenData(),
        isComplexExp,
        isFilter
    });

    updateComponents(components, componentsInUsed);
    let code = `({ render: function() {${render.render}}, staticRenderFns: [\
${staticRenderFns.map(fn => `function() { ${fn} },)}`)}\
] })`;
    code = transpile(code);

    return {ast, render: code, errors, componentsInUsed};
};

module.exports.getGenData = getGenData;
module.exports.isComplexExp = isComplexExp;
module.exports.isFilter = isFilter;

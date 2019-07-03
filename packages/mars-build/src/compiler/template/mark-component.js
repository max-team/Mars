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

function getFilters(node) {
    let props = node.attrsMap
        ? Object.keys(node.attrsMap).filter(name => {
            const value = node.attrsMap[name];
            return name.indexOf(':') >= 0 && (/[^|]+\|[^|]+/.test(value) || isComplexExp(value));
        })
        : [];
    props = props.map(name => name.replace(/^(v-bind)?:/, ''));

    let texts = node.children
        ? node.children.map(c => {
            if (c.type !== 2) {
                return null;
            }
            const isComplex = c.tokens.some(token => typeof token === 'object' && isComplexExp(token['@binding']));
            const isFilter = c.expression.indexOf('_s(_f(') >= 0;
            return (isComplex || isFilter) ? c.expression : null;
        })
        : [];

    let vfor = isComplexExp(node.for) ? node.for : undefined;
    let vif = isComplexExp(node.if) ? node.if : undefined;
    let velseif = isComplexExp(node.elseif) ? node.elseif : undefined;

    const hasFilter = (props.length + texts.filter(t => t).length) > 0;
    return (hasFilter || vfor || vif || velseif)
        ? {
            p: props,
            t: texts,
            vfor,
            vif,
            velseif
        }
        : null;
}

function getGenData(options) {
    let filterIdCounter = 0;
    return function markNode(el, options) {
        let filters = getFilters(el);
        if (filters) {
            const fid = filterIdCounter++;
            el._fid = fid;
            el._filters = filters;
            let data = [
                `fid: ${fid}`,
                `t: [${filters.t.join(',')}]`,
                `p: ${JSON.stringify(filters.p)}`
            ];
            filters.vfor && data.push(`for: ${filters.vfor}`);
            filters.velseif && data.push('if: true');
            filters.vif && data.push('if: true');
            const dataStr = `f: { ${data.join(', ')} },`;
            return dataStr;
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
        render,
        staticRenderFns,
        errors
    } = compileTemplate(source, {
        preserveWhitespace: false,
        modules: [
            {
                transformNode: getMarkNode(options, componentsInUsed),
                postTransformNode: getPostTrans(options),
                genData: getGenData(options)
            }
        ]
    });

    updateComponents(components, componentsInUsed);
    let code = `({ render: function() { ${render} }, staticRenderFns: [\
${staticRenderFns.map(fn => `function() { ${fn} },)}`)}\
] })`;
    code = transpile(code);

    return {ast, render: code, errors, componentsInUsed};
};

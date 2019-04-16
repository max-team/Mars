/**
 * @file base marker
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-native-reassign */
/* eslint-disable fecs-min-vars-per-destructure */

const {compile: compileTemplate} = require('vue-template-compiler');
const transpile = require('vue-template-es2015-compiler');

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

function getMarkNode(options) {
    let {components} = options;
    let compIdCounter = 0;
    return function markNode(el, options) {

        const tag = el.tag;
        const isComp = components && components[tag];

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
    };
}

function getPostTrans(options) {
    return function postTrans(node) {
        // remove all directives
        if (node.directives) {
            delete node.directives;
        }
    };
}

module.exports = function mark(source, options) {
    const {
        ast,
        render,
        staticRenderFns,
        errors
    } = compileTemplate(source, {
        preserveWhitespace: false,
        modules: [
            {
                transformNode: getMarkNode(options),
                postTransformNode: getPostTrans(options)
            }
        ]
    });

    let code = `({ render: function() { ${render} }, staticRenderFns: [\
${staticRenderFns.map(fn => `function() { ${fn} },)}`)}\
] })`;
    code = transpile(code);

    return {ast, render: code, errors};
};

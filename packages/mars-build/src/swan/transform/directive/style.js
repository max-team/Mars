/**
 * @file transform style
 * @author zhangwentao
 *
 * 不支持styleObject
 * eg
 * 1. :style="{ transform: "translate(10px, 10px)", fontSize: fontSize + "px", color: isRed ? "red" : "blue" }"
 * 2. :style="[{ transform: "translate(10px, 10px)" }, fontSize: fontSize + "px", {color: isRed ? "red" : "blue"}]"
 *
 */
/* eslint-disable fecs-camelcase */
/* eslint-disable babel/new-cap */

const {transformSync, transformFromAstSync} = require('../../../helper/babel');

const CURLY_BRACE_HAS_REGEXP = /{[\s\S]*}/;

module.exports = function (name, value, attrs, node) {

    let {staticStyle = ''} = node;
    staticStyle = staticStyle.replace(/[\"\{\}]/g, '');
    value = value.trim();

    if (CURLY_BRACE_HAS_REGEXP.test(value)) {
        value = transformStyle(value);
    }
    else {
        value = `{{${value}}}`;
    }

    attrs.style = staticStyle ? `${staticStyle};${value}` : value;
    delete node.attrsMap.style;
};

function transformStyle(value) {
    let source = `(${value})`;
    let code = transformSync(source, {
        plugins: [transformPlugin()]
    }).code;
    code = code.replace(/\;$/, '');
    code = code.replace(/^\(|\)$/g, '');
    return code;
}

function transformPlugin(options = {}) {
    return ({types: t}) => {
        return {
            visitor: {
                ArrayExpression: {
                    exit(path, state) {
                        let str = path.node.elements.map(i => i.name).join(';');
                        path.replaceWith(t.Identifier(str));
                    }
                },
                ObjectExpression(path, state) {
                    const properties = path.node.properties;
                    let pairs = properties.map(p => {
                        let {key, value} = p;
                        key = t.isLiteral(key)
                            ? key.value
                            : key.name.replace(/([A-Z])/g, '-$1').toLowerCase();

                        value = transformFromAstSync({
                            type: 'Program',
                            body: [value]
                        }).code;
                        return `${key}:{{${value}}}`;
                    });
                    const ret = pairs.join(';');
                    path.replaceWith(t.Identifier(ret));
                }
            }
        };
    };
}

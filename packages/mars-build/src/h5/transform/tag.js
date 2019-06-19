/**
 * @file build
 * @author zhangjingyuan02
 */

/* eslint-disable fecs-no-require */

// import component from './component';
const tagMap = require('./vueComponentTagMap');
const customTemplate = 'template-mars';

const nativeEvent = {
    '@touchstart': '@touchstart',
    '@touchmove': '@touchmove',
    '@touchend': '@touchend',
    '@touchcancel': '@touchcancel',
    '@tap': '@click',
    'v-on:touchstart': 'v-on:touchstart',
    'v-on:touchmove': 'v-on:touchmove',
    'v-on:touchend': 'v-on:touchend',
    'v-on:touchcancel': 'v-on:touchcancel',
    'v-on:tap': 'v-on:click'
};

const directiveMap = {
    ':animation': 'v-animation',
    'v-bind:animation': 'v-animation'
};

// page-home-index -> PageHomeIndex
function toCamel(name) {
    let camelName = name.replace(/^\-/, '').replace(/\-(\w)(\w+)/g, function (a, b, c) {
        return b.toUpperCase() + c.toLowerCase();
    });
    return camelName.substring(0, 1).toUpperCase() + camelName.substring(1);
}

// 判断租先节点是否含有 template-mars target=swan|wx，如果含有，则不收集该ast tag
function checkScopedTemplateIsH5(ast) {
    let parent = ast.parent;
    if (parent) {
        if (parent.tag === 'template-mars' && parent.attrsMap && parent.attrsMap.target !== 'h5') {
            return false;
        }
        else {
            return checkScopedTemplateIsH5(parent);
        }
    }
    return true;
}

module.exports = function (ast, options) {
    const {
        basicCompMap,
        componentsInUsed
    } = options;
    let tag = ast.tag;

    const isH5Component = checkScopedTemplateIsH5(ast);
    if (componentsInUsed[tag] && isH5Component) {
        componentsInUsed[tag].using = true;
    }

    if (!tag) {
        return ast;
    }

    if (
        tag === customTemplate
        && ast.attrsMap.target === (process.env.MARS_ENV_TARGET || 'h5')
    ) {
        tag = 'template';
        delete ast.attrsMap.target;
    }

    Object.keys(ast.attrsMap).forEach(key => {
        let keyArr = key.split('.');
        if (nativeEvent[keyArr[0]]) {
            keyArr[0] = `${nativeEvent[keyArr[0]]}.native`;
            const newKey = keyArr.join('.');
            ast.attrsMap[newKey] = ast.attrsMap[`${key}`];
            delete ast.attrsMap[`${key}`];
        }
        if (directiveMap[key]) {
            ast.attrsMap[directiveMap[key]] = ast.attrsMap[key];
            delete ast.attrsMap[key];
        }
    });
    ast.tag = tagMap[tag] || tag;
    if (
        tagMap[tag]
        && !basicCompMap[tagMap[tag]]
        && tagMap[tag] !== 'template'
        && isH5Component
    ) {
        basicCompMap[`${tagMap[tag]}`] = toCamel(tagMap[tag]);
    }
    return ast;
};

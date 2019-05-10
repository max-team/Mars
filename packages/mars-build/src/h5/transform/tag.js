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

module.exports = function (ast, compMap) {
    let tag = ast.tag;
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
        && !compMap[tagMap[tag]]
        && tagMap[tag] !== 'template'
    ) {
        compMap[`${tagMap[tag]}`] = toCamel(tagMap[tag]);
    }
    return ast;
};

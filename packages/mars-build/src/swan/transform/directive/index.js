/**
 * @file build
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

// type：
// 0, 默认值, 拼接 ${key}={{ ${val} }}
// 1, 拼接 ${key}
// 2, 拼接 ${map[key]}={{ '${val}' }}
// 3, 拼接 ${param}={{ ${val} }}
// 4, 拼接为空字符串
// 5, 不需要在wxml上表现出来，可直接清除

const dirFor = require('./for');
const dirShow = require('./show');
const dirModel = require('./model');
const dirEvents = require('./events');
const bindClass = require('./class');
const bindStyle = require('./style');

const noSupport = {
    type: 4,
    check: (k, v, errors) => {
        errors(`不支持此指令: ${k}="${v}"`);
        return false;
    }
};

let dirMap = {
    'v-if': {
        name: 's-if',
        type: 0
    },
    'v-else-if': {
        name: 's-elif',
        type: 0
    },
    'v-else': {
        name: 's-else',
        type: 1
    },
    'v-bind': {
        name: '',
        map: {
            style: bindStyle,
            class: bindClass,
            compId: {
                name: 'compId',
                type: 0
            }
        },
        type: 3
    },
    'v-show': dirShow,
    'v-model': dirModel,
    'v-on': dirEvents,
    'v-for': dirFor,
    'v-text': noSupport,
    'v-html': noSupport,
    'v-pre': noSupport,
    'v-cloak': noSupport,
    'v-once': noSupport,
    'slot-scope': {
        type: 5
    }
};

module.exports = function (key, value, attrs, node) {
    const {isComp} = node;
    const [dir, param] = key.split(':');
    let dirConf = dirMap[dir];

    if (!dirConf) {
        return;
    }

    if (dirConf.map && dirConf.map[param]) {
        dirConf = dirConf.map[param];
    }

    if (typeof dirConf === 'function') {
        dirConf(param, value, attrs, node);
        return true;
    }

    if (dirConf) {
        const {
            type,
            name,
            check
        } = dirConf;

        if (type === 0) {
            attrs[name] = `{{ ${value} }}`;
        }

        if (type === 1) {
            attrs[name] = undefined;
        }

        if (type === 2) {
            attrs[name] = value;
        }

        // component's props will be replaced with Vue vm's data
        // so only bind values when is not components
        // if (type === 3 && !isComp) {
        if (type === 3) {
            attrs[param] = `{{ ${value} }}`;
        }

        return true;
    }

};

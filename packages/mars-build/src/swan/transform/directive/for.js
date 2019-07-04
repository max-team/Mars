/**
 * @file swan build
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable dot-notation */

/* eslint-disable fecs-min-vars-per-destructure */

const {MAP_FOR} = require('../config/config');

module.exports = function dirFor(param, value, attrs, node) {
    const {
        iterator1,
        for: forText,
        key,
        alias
    } = node;

    if (forText) {
        attrs[MAP_FOR['v-for']] = `${alias || 'item'}, ${iterator1 || 'index'} in ${forText}`;

        if (iterator1) {
            attrs[MAP_FOR.iterator1] = iterator1;
        }

        if (key) {
            attrs[MAP_FOR.key] = key;
        }

        if (alias) {
            attrs[MAP_FOR.alias] = alias;
        }
    }

};

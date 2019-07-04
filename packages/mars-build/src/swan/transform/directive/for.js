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
        alias,
        attrsMap
    } = node;

    if (forText) {
        let forExp = `${alias || 'item'}, ${iterator1 || 'index'} in ${forText}`;

        if (key && attrsMap && attrsMap.hasOwnProperty('use-trackby')) {
            forExp += ` trackBy ${key}`;
        }

        attrs[MAP_FOR['v-for']] = forExp;

        if (iterator1) {
            attrs[MAP_FOR.iterator1] = iterator1;
        }

        if (alias) {
            attrs[MAP_FOR.alias] = alias;
        }
    }

};

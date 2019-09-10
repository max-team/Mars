/**
 * @file render codegen test
 * @author meixuguang
 */

/* globals test*/

import {generate} from '../../../../src/compiler/template/render';
import {getGenData, isComplexExp, isFilter, isInFor, getIterators} from '../../../../src/compiler/template/mark-component';
import {compile} from 'vue-template-compiler/build';

function gen(template) {
    const {
        ast
    } = compile(template, {
        preserveWhitespace: false
    });
    return generate(ast, {
        processFilterData: getGenData(),
        isComplexExp,
        isFilter,
        isInFor,
        getIterators
    });
}

describe('render codegen test', () => {
    test('basic', () => {
        const template = `<template :key="'123'" @click="clickHandler" class="hello">
            <view>
            </view>
        </template>`;

        const res = gen(template);
        expect(res.render).toBe('with(this){return []}');
    });

    test('v-if', () => {
        const template = `<template>
            <view v-if="aaa">
            </view>
        </template>`;

        const res = gen(template);
        expect(res.render).toBe('with(this){return [[(aaa)?[]:[]]]}');
    });

    test('v-if compute', () => {
        const template = `<template>
            <view v-if="(someFnA(aaa))"></view>
            <view v-else-if="(someFnC(ccc))"></view>
            <view v-else></view>
        </template>`;

        const res = gen(template);
        expect(res.render).toBe('with(this){return [[(_ff({fid: \'0\',value: (someFnA(aaa))}, \'if\'))?[]:[(_ff({fid: \'1\',value: (someFnC(ccc))}, \'if\'))?[]:[]]]]}');
    });

    test('slot', () => {
        const template = `<template>
            <slot name="slot-name" v-bind="{
                pp: slotBindB
            }" :ppp="slotBind"></slot>
        </template>`;

        const res = gen(template);
        expect(res.render).toBe(`with(this){return [[[,JSON.stringify([slotBind]),JSON.stringify({
                pp: slotBindB
            })]]]}`);
    });

    test('scoped-slot', () => {
        const template = `<template>
            <name>
                <view slot="slot-name-a" slot-scope="slotProps"></view>
            </name>
        </template>`;

        const res = gen(template);
        expect(res.render).toBe('with(this){return []}');
    });

    test('v-for', () => {
        const template = `<template>
            <view v-for="item in list">
                <view>{{ item }}</view>
            </view>
        </template>`;

        const res = gen(template);
        expect(res.render).toBe('with(this){return [_l((list),function(item){[,[,[(item)]]]})]}');
    });

    test('props compute', () => {
        const template = `<template>
            <view :b="aaa" :a="(someFnB(bbb))"></view>
        </template>`;

        const res = gen(template);
        expect(res.render).toBe('with(this){return [[,[[{\'b\':aaa,_p:_ff({fid: \'0\',value: {a: (someFnB(bbb))}}, \'p\')}]]]]}');
    });
});

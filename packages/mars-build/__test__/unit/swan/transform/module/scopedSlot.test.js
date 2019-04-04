/**
 * @file swan build unit test
 * @author meixuguang
 */

/* globals test*/

import {processAttrs, changeSlotPropsBind} from '../../../../../src/swan/transform/module/scopedSlot';

describe('[swan]scopedSlot', () => {
    test('processAttrs', () => {
        const attrsMap = {
            'v-bind:aaa': 'bbb',
            'v-if': 'ccc',
            'v-bind:ccc': 'ddd'
        };

        const expectAttrsMap = {
            'v-if': 'ccc',
            'var-slotProps': '{{ {aaa: bbb,ccc: ddd} }}'
        };

        const res = processAttrs(attrsMap);

        expect(res).toEqual(expectAttrsMap);

    });

    test('changeSlotPropsBind none slot scope', () => {
        const node = {
            type: 1,
            tag: 'view',
            attrsList: [{name: ':aaa', value: 'some.aaa'}],
            attrsMap: {'slot-scope': 'some', 'v-bind:aaa': 'some.aaa'},
            parent: {},
            children: [],
            ns: 'svg',
            plain: false,
            hasBindings: true,
            attrs: [{name: 'aaa', value: 'some.aaa'}]
        };

        const expectNode = {
            type: 1,
            tag: 'view',
            attrsList: [{name: ':aaa', value: 'some.aaa'}],
            attrsMap: {'slot-scope': 'some', 'v-bind:aaa': 'some.aaa'},
            parent: {},
            children: [],
            ns: 'svg',
            plain: false,
            hasBindings: true,
            attrs: [{name: 'aaa', value: 'some.aaa'}]
        };

        changeSlotPropsBind(node, {});
        expect(node).toEqual(expectNode);
    });

    test('changeSlotPropsBind type 1', () => {
        const node = {
            type: 1,
            tag: 'view',
            attrsList: [{name: ':aaa', value: 'some.aaa'}],
            attrsMap: {'slot-scope': 'some', 'v-bind:aaa': 'some.aaa'},
            parent: {},
            children: [],
            ns: 'svg',
            plain: false,
            hasBindings: true,
            attrs: [{name: 'aaa', value: 'some.aaa'}]
        };

        const expectNode = {
            type: 1,
            tag: 'view',
            attrsList: [{name: ':aaa', value: 'some.aaa'}],
            attrsMap: {'slot-scope': 'some', 'v-bind:aaa': 'slotProps.aaa'},
            parent: {},
            children: [],
            ns: 'svg',
            plain: false,
            hasBindings: true,
            attrs: [{name: 'aaa', value: 'some.aaa'}]
        };

        changeSlotPropsBind(node, {slotScope: 'some'});
        expect(node).toEqual(expectNode);
    });

    test('changeSlotPropsBind type 2', () => {
        const node = {
            type: 2,
            expression: '_s(some.aaa)',
            tokens: [{'@binding': 'some.aaa'}],
            text: '{{ some.aaa }}',
            attrsMap: {}
        };
        const expectNode = {
            type: 2,
            expression: '_s(some.aaa)',
            tokens: [{'@binding': 'some.aaa'}],
            text: '{{slotProps.aaa}}',
            attrsMap: {}
        };

        changeSlotPropsBind(node, {slotScope: 'some'});
        expect(node).toEqual(expectNode);
    });
});

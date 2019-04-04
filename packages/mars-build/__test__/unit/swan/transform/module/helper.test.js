/**
 * @file swan build unit test
 * @author meixugaung
 */

/* globals test*/

import {modifyBind} from '../../../../../src/swan/transform/module/helper';

describe('swan module helper', () => {
    test('modifyBind v-for', () => {
        const node = {
            'type': 1,
            'tag': 'view',
            'attrsList': [{name: ':aaa', value: 'some.aaa'}],
            'attrsMap': {
                'slot-scope': 'some',
                'v-bind:key': 'item',
                'v-for': 'item in some.bbb',
                'v-bind:aaa': ''
            },
            'parent': {},
            'children': [{
                type: 2,
                expression: '_s(some.aaa)',
                tokens: [{'@binding': 'some.aaa'}],
                text: '{{ some.aaa }}'
            }],
            'ns': 'svg',
            'for': 'some.bbb',
            'alias': 'item',
            'key': 'item',
            'plain': false,
            'slotScope': 'some',
            'iterator1': 'index',
            'hasBindings': true,
            'attrs': [{name: 'aaa', value: 'some.aaa'}],
            'forProcessed': true
        };

        const expectNode = {
            'type': 1,
            'tag': 'view',
            'attrsList': [{name: ':aaa', value: 'some.aaa'}],
            'attrsMap': {
                'slot-scope': 'some',
                'v-bind:key': 'item123123',
                'v-for': 'item in some.bbb123123',
                'v-bind:aaa': ''
            },
            'parent': {},
            'children': [{
                type: 2,
                expression: '_s(some.aaa)',
                tokens: [{'@binding': 'some.aaa'}],
                text: '{{ some.aaa }}'
            }],
            'ns': 'svg',
            'for': '(some.bbb123123)',
            'alias': 'item',
            'key': 'item',
            'plain': false,
            'slotScope': 'some',
            'iterator1': 'index',
            'hasBindings': true,
            'attrs': [{name: 'aaa', value: 'some.aaa'}],
            'forProcessed': true
        };

        modifyBind(node, val => {
            return val + '123123';
        });
        expect(node).toEqual(expectNode);
    });
});


/**
 * @file swan build unit test
 * @author zhangwentao <winty2013@gmail.com>
 */
/* eslint-disable */
import directive from '../../../../../src/swan/transform/directive';
import bindStyle from '../../../../../src/swan/transform/directive/style';

describe('[swan]directive', () => {
    test('directive:bindStyle exists', () => {
        expect(bindStyle).not.toBe(undefined);
        expect(bindStyle).not.toBe(null);
    });

    test('directive:bindStyle', () => {
        const key = 'v-bind:style';
        const value = `{ color: activeColor, 'literal': 'literal', fontSize: fontSize + 'px' }`;
        const attrs = { other: 'other' };
        const node = {
            type: 1,
            tag: 'view',
            attrsList: [],
            attrsMap: { 
                style: 'static'
            },
            parent: null
        };

        expect(directive(key, value, attrs, node)).toBeTruthy();
        expect(node.attrsMap.style).toBe(undefined);
        expect(attrs).toEqual({
            other: 'other',
            style: `color:{{activeColor}};literal:{{'literal'}};font-size:{{fontSize + 'px'}}`
        });
    });
});

describe('[swan]directive:bindStyle', () => {

    test('v-bind:style', () => {
        const value = 'someBindVar';
        let attrs = {};
        const node = {
            staticStyle: 'static',
            attrsMap: { 
                style: 'static'
            }
        };
        bindStyle(undefined, value, attrs, node);
        expect(attrs).toEqual({ 
            style: 'static;{{someBindVar}}'
        });
        expect(node.attrsMap.style).toBe(undefined);
    });

    test('v-bind:style object literal', () => {
        const value = `{ color: activeColor, 'literal': 'literal', fontSize: fontSize + 'px' }`;
        let attrs = {};
        const node = {
            attrsMap: {}
        };
        bindStyle(undefined, value, attrs, node);
        expect(attrs).toEqual({ 
            style: `color:{{activeColor}};literal:{{'literal'}};font-size:{{fontSize + 'px'}}`
        });
        expect(node.attrsMap.style).toBe(undefined);
    });

    test('v-bind:style with comma', () => {
        const value = `{ transform: 'translate(10px, 10px)' }`;
        let attrs = {};
        const node = {
            staticStyle: 'static',
            attrsMap: { 
                style: 'static'
            }
        };
        bindStyle(undefined, value, attrs, node);
        expect(attrs).toEqual({ 
            style: `static;transform:{{'translate(10px, 10px)'}}`
        });
        expect(node.attrsMap.style).toBe(undefined);
    });

    test('v-bind:style array with comma and ternary', () => {
        const value = `[{ transform: 'translate(10px, 10px)' }, {color: isRed ? 'red' : 'blue'}]`;
        let attrs = {};
        const node = {
            staticStyle: 'static',
            attrsMap: { 
                style: 'static'
            }
        };
        bindStyle(undefined, value, attrs, node);
        expect(attrs).toEqual({ 
            style: `static;transform:{{'translate(10px, 10px)'}};color:{{isRed ? 'red' : 'blue'}}`
        });
        expect(node.attrsMap.style).toBe(undefined);
    });
});
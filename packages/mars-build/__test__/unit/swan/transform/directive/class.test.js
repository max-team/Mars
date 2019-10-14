
/**
 * @file swan build unit test
 * @author zhangwentao <winty2013@gmail.com>
 */
/* eslint-disable */
import directive from '../../../../../src/swan/transform/directive';
import bindClass from '../../../../../src/swan/transform/directive/class';

/**
 * eg
 * 1. :class={ active: isActive }   ->    class={{[isActive ? 'active' : '']}}
 * 2. class="static" :class="{ active: isActive, 'text-danger': hasError }"  ->  class="static {{[isActive ? 'active' : '', hasError ? 'text-danger' : '']}}"
 * 3. class="static" :class="[activeClass, errorClass]" -> class="static {{[activeClass, errorClass]}}
 * 4. class="static" :class="[isActive ? activeClass : '', errorClass]"  ->  class="static {{[isActive ? activeClass : '', errorClass]}}"
 * 5. class="static" :class="[{ active: isActive }, errorClass]" -> class="static {{[isActive ? 'active' : '', errorClass]}}
 *
 */

describe('[swan]directive', () => {
    test('directive:bindClass exists', () => {
        expect(bindClass).not.toBe(undefined);
        expect(bindClass).not.toBe(null);
    });

    test('directive:bindClass', () => {
        const key = 'v-bind:class';
        const value = `{ active: isActive }`;
        const attrs = { other: 'other' };
        const node = {
            type: 1,
            tag: 'view',
            attrsList: [],
            attrsMap: { 
                class: 'static'
            },
            parent: null
        };

        expect(directive(key, value, attrs, node)).toBeTruthy();
        expect(node.attrsMap.class).toBe(undefined);
        expect(attrs).toEqual({
            other: 'other',
            class: `{{[(isActive) ? 'active' : '']}}`
        });
    });
});

describe('[swan]directive:bindClass', () => {

    test('v-bind:class static', () => {
        const value = 'someBindVar';
        let attrs = {};
        const node = {
            staticClass: 'static',
            attrsMap: { 
                class: 'static'
            }
        };
        bindClass(undefined, value, attrs, node);
        expect(attrs).toEqual({ 
            class: 'static {{someBindVar}}'
        });
        expect(node.attrsMap.class).toBe(undefined);
    });

    test('v-bind:class Ternary in Array', () => {
        const value = `[(isActive) ? activeClass : 'a b', errorClass]`;
        let attrs = {};
        const node = {
            attrsMap: {}
        };
        bindClass(undefined, value, attrs, node);
        expect(attrs).toEqual({ 
            class: `{{[(isActive) ? activeClass : 'a b', errorClass]}}`
        });
        expect(node.attrsMap.class).toBe(undefined);
    });

    test('v-bind:class Object in Array', () => {
        const value = `[{ active: isActive }, errorClass]`;
        let attrs = {};
        const node = {
            staticClass: 'static',
            attrsMap: { 
                class: 'static'
            }
        };
        bindClass(undefined, value, attrs, node);
        expect(attrs).toEqual({ 
            class: `static {{[(isActive) ? 'active' : '', errorClass]}}`
        });
        expect(node.attrsMap.class).toBe(undefined);
    });

    test('v-bind:class with \\n', () => {
        const value = `[
            { active: isActive },
            errorClass,
            'a b'
        ]`;
        let attrs = {};
        const node = {
            staticClass: 'static',
            attrsMap: { 
                class: 'static'
            }
        };
        bindClass(undefined, value, attrs, node);
        expect(attrs).toEqual({ 
            class: `static {{[(isActive) ? 'active' : '', errorClass, 'a b']}}`
        });
        expect(node.attrsMap.class).toBe(undefined);
    });
});
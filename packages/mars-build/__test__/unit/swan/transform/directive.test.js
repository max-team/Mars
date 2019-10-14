
/**
 * @file swan build unit test
 * @author zhangwentao <winty2013@gmail.com>
 */
/* eslint-disable */
import directive from '../../../../src/swan/transform/directive';
import dirEvents from '../../../../src/swan/transform/directive/events';
import dirFor from '../../../../src/swan/transform/directive/for';
import bindClass from '../../../../src/swan/transform/directive/class';
// import bindStyle from '../../../../src/swan/transform/directive/style';
import vShow from '../../../../src/swan/transform/directive/show';
import vModel from '../../../../src/swan/transform/directive/model';

describe('[swan]directive', () => {
    test('directive function exists', () => {
        expect(directive).not.toBe(undefined);
        expect(directive).not.toBe(null);
    });

    test('directive:events', () => {
        const key = 'v-on:tap';
        const value = 'tap';
        const attrs = { class: 'world-wrap' };
        const node = { 
            type: 1,
            tag: 'view',
            attrsList: [ { name: '@tap', value: 'tap2' } ],
            attrsMap: { class: 'world-wrap', 'v-on:tap': 'tap1' },
            parent: undefined,
            children: []
        };

        expect(directive(key, value, attrs, node)).toBeTruthy();
    });

    test('directive:bindClass', () => {
        const key = 'v-bind:class';
        const value = `{ active: isActive, 'text-danger': hasError }`;
        const attrs = { class: 'static' };
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
        expect(attrs).toEqual({ class: `{{[(isActive) ? 'active' : '', (hasError) ? 'text-danger' : '']}}`});
    });
});


describe('[swan]directive:events', () => {
    test('directive function exists', () => {
        expect(dirEvents).not.toBe(undefined);
        expect(dirEvents).not.toBe(null);
    });

    test('v-on:tap="onTap"', () => {
        // const key = 'v-on:tap';
        const param = 'tap';
        const value = 'onTap';
        let attrs = {};
        dirEvents(param, value, attrs);

        expect(attrs).toEqual({
            datatapeventproxy: 'onTap',
            bindtap: 'handleProxy'
        });
    });

    test('v-on:tap.prevent.stop="onTap"', () => {
        // const key = 'v-on:tap';
        const param = 'tap.prevent.stop';
        const value = 'onTap';
        let attrs = {};
        dirEvents(param, value, attrs);

        expect(attrs).toEqual({
            datatapeventproxy: 'onTap',
            catchtap: 'handleProxy'
        });
    });

    // test('v-on:tap="onTap(a, b, $event, c)"', () => {
    //     // const key = 'v-on:tap';
    //     const param = 'tap';
    //     const value = 'onTap(a, b, $event, c)';
    //     let attrs = {};
    //     dirEvents(param, value, attrs);

    //     expect(attrs).toEqual({
    //         datatapeventproxy: 'onTap',
    //         bindtap: 'handleProxy',
    //         datatapargumentsproxy: `{{ [ a,b,'_$event_',c ] }}`
    //     });
    // });
});

describe('[swan]directive:for', () => {
    test('directive function exists', () => {
        expect(dirFor).not.toBe(undefined);
        expect(dirFor).not.toBe(null);
    });

    test('v-for="(item, index) in items"', () => {
        // const key = 'v-on:tap';
        const node = {
            iterator1: 'index',
            for: 'items',
            key: 'item.id',
            alias: 'item',
        };
        let attrs = {};
        dirFor(undefined, undefined, attrs, node);

        expect(attrs).toEqual({
            's-for': 'item, index in items',
            's-for-index': 'index',
            's-for-item': 'item',
            // 's-for-key': 'item.id'
        });
    });

    test('v-for="(item, index) in items trackBy item.id"', () => {
        // const key = 'v-on:tap';
        const node = {
            iterator1: 'index',
            for: 'items',
            key: 'item.id',
            alias: 'item',
            attrsMap: {
                'use-trackby': ''
            }
        };
        let attrs = {};
        dirFor(undefined, undefined, attrs, node);

        expect(attrs).toEqual({
            's-for': 'item, index in items trackBy item.id',
            's-for-index': 'index',
            's-for-item': 'item',
            // 's-for-key': 'item.id'
        });
    });

    test('v-for="item in items"', () => {
        // const key = 'v-on:tap';
        const node = {
            for: 'items',
            alias: 'item'
        };
        let attrs = {};
        dirFor(undefined, undefined, attrs, node);

        expect(attrs).toEqual({
            's-for': 'item, index in items',
            's-for-item': 'item'
        });
    });
});

describe('[swan]directive:vShow', () => {
    test('directive function exists', () => {
        expect(vShow).not.toBe(undefined);
        expect(vShow).not.toBe(null);
    });

    test('only v-show', () => {
        const param = 'v-show';
        const value = 'flag';
        let attrs = {};
        const node = {
            attrsMap: { 
                'v-show': 'flag'
            }
        };
        vShow(param, value, attrs, node);
        expect(attrs).toEqual({ 
            style: `;display: {{${value} ? \' \' : \'none\'}};`
        });
    });

    test('v-show and style', () => {
        const param = 'v-show';
        const value = 'flag';
        let attrs = {
            'style': 'font-size: {{fontSize}}'
        };
        const node = {
            attrsMap: { 
                'v-show': 'flag',
                'style': 'font-size: {{fontSize}}'
            }
        };
        vShow(param, value, attrs, node);
        expect(attrs).toEqual({ 
            style: `font-size: {{fontSize}};display: {{${value} ? \' \' : \'none\'}};`
        });
    });
});

describe('[swan]directive:vModel', () => {
    test('directive function exists', () => {
        expect(vModel).not.toBe(undefined);
        expect(vModel).not.toBe(null);
    });

    test('input v-model', () => {
        const param = 'v-model';
        const value = 'val';
        let attrs = {};
        const node = { 
            tag: 'input'
        };
        vModel(param, value, attrs, node);

        expect(attrs).toEqual({
            value: `{{${value}}}`,
            bindinput: 'handleModel',
            'data-model': value,
            'data-tag': 'input'
        });
    });

    test('picker v-model', () => {
        const param = 'v-model';
        const value = 'val';
        let attrs = {};
        const node = { 
            tag: 'picker'
        };
        vModel(param, value, attrs, node);

        expect(attrs).toEqual({
            value: `{{${value}}}`,
            bindchange: 'handleModel',
            'data-model': value,
            'data-tag': 'picker'
        });
    });

    test('switch v-model', () => {
        const param = 'v-model';
        const value = 'val';
        let attrs = {};
        const node = { 
            tag: 'switch'
        };
        vModel(param, value, attrs, node);

        expect(attrs).toEqual({
            checked: `{{${value}}}`,
            bindchange: 'handleModel',
            'data-model': value,
            'data-tag': 'switch'
        });
    });

    test('radio-group v-model', () => {
        const param = 'v-model';
        const value = 'val';
        let attrs = {};
        const node = { 
            tag: 'radio-group'
        };
        vModel(param, value, attrs, node);

        expect(attrs).toEqual({
            bindchange: 'handleModel',
            'data-model': value,
            'data-tag': 'radio'
        });
    });
});

/**
 * @file swan build unit test
 * @author zhangwentao <winty2013@gmail.com>
 */

/* globals test*/

import {transform} from '../../../../src/swan/transform';
import {getCompiler, generate, mark} from '../../../../src/compiler/template/index';

const templateCompiler = getCompiler(mark, transform, generate);

// describe('directive 基本功能', () => {
//     test('directive 导出包', () => {
//         expect(directive).not.toBe(undefined);
//     });
// });

describe('[swan]template basic', () => {
    test('v-on/v-bind', () => {
        const source = '<view @tap="tap" :prop="prop">{{text}}</view>';
        const expectRet = {
            code: '<view bindtap="handleProxy" datatapeventproxy="tap" prop="{{ prop }}">{{text}}</view>',
            render: '({ render: function() { '
                + 'var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;'
                + 'return _c(\'view\',{attrs:{"prop":_vm.prop},on:{"tap":_vm.tap}},[_vm._v(_vm._s(_vm.text))]) }, '
                + 'staticRenderFns: [] })'
        };
        const {render, code} = templateCompiler(source, {});
        // console.log(render, code);

        expect(code).toBe(expectRet.code);
        expect(render).toBe(expectRet.render);
    });

    test('define slot', () => {
        const source = `
            <view>
                <slot name="aaa" :bbb="bbb" :ccc="ccc"></slot>
                <slot></slot>
            </view>
        `;

        const {render, code} = templateCompiler(source, {});

        const expectRet = {
            code: '<view><slot name="aaa" var-slotProps="{{ {bbb: bbb,ccc: ccc} }}"></slot><slot></slot></view>',
            render: '({ render: function() { var _vm=this;var _h=_vm.$createElement;'
                + 'var _c=_vm._self._c||_h;return _c(\'view\',[_vm._t("aaa",null,'
                + '{"bbb":_vm.bbb,"ccc":_vm.ccc}),_vm._t("default")],2) }, staticRenderFns: [] })'
        };

        expect(code).toBe(expectRet.code);
        expect(render).toBe(expectRet.render);
    });

    test('use scoped slot', () => {
        const source = `
            <test>
                <view slot="aaa" slot-scope="someSlotProps" :aaa="someSlotProps['ccc']">
                    {{someSlotProps.bbb}}
                    <view>{{someSlotProps.ccc}}</view>
                </view>
                <div>{{ text.text }}</div>
            </test>
        `;

        const {render, code} = templateCompiler(source, {});

        const expectRet = {
            code: `<test><div>{{ text.text }}</div><view slot=\"aaa\" aaa=\"{{ slotProps['ccc'] }}\">
                    {{slotProps.bbb}}
                    <view>{{slotProps.ccc}}</view></view></test>`,
            render: '({ render: function() { var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;'
                + 'return _c(\'test\',{scopedSlots:_vm._u([{key:\"aaa\",fn:function(someSlotProps){'
                + 'return _c(\'view\',{attrs:{\"aaa\":someSlotProps[\'ccc\']}},[_vm._v(\"\\n                    '
                + '\"+_vm._s(someSlotProps.bbb)+\"\\n                    \"),_c(\'view\','
                + '[_vm._v(_vm._s(someSlotProps.ccc))])])}}])},[_c(\'div\','
                + '[_vm._v(_vm._s(_vm.text.text))])]) }, staticRenderFns: [] })'
        };

        expect(code).toBe(expectRet.code);
        expect(render).toBe(expectRet.render);
    });
});

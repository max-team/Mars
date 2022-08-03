/**
 * @file swan build unit test
 * @author
 */

/* eslint-disable fecs-min-vars-per-destructure */
/* eslint-disable fecs-camelcase */
/* globals test */
/* globals jest */
/* globals getApp */
/* globals swan */

global.swan = {};
const {
    createApp,
    createPage,
    createComponent,
    vueCompCreator
} = require('../../../src/swan');

const {handleProxy} = require('../../../src/swan/mixins');

describe('[swan]createApp', () => {
    test('createApp exists', () => {
        const appOptions = {
            onLaunch() {},
            globalData: 'globalData'
        };
        const app = createApp(appOptions);
        expect(app.$api).not.toBe(undefined);
        expect(app.__pages__).toEqual({
            uid: -1
        });

        global.getApp = () => app;
    });
});

describe('[swan]createPage', () => {
    test('createPage exists', () => {
        expect(createPage).not.toBe(undefined);
        expect(createPage).not.toBe(null);
        const app = getApp();
        const onLoad = jest.fn();
        const created = jest.fn();
        const mounted = jest.fn();
        const setData = jest.fn();
        const pageOptions = {
            data() {
                return {
                    a: 1
                };
            },
            onLoad,
            mounted,
            created,
            render() {
                let _vm = this;
                let _h = _vm.$createElement;
                let _c = _vm._self._c || _h;
                return [, [_vm._s(_vm.a)]];
            }
        };
        const query = {a: 1};
        const page = createPage(pageOptions);
        expect(page.handleProxy).toBe(handleProxy);

        page.setData = setData;
        page.onLoad.call(page, query);

        expect(app.__pages__.uid).toBe(0);
        expect(app.__pages__[0]).toBe(page);

        expect(onLoad).toHaveBeenCalledWith(query);
        expect(onLoad).toHaveBeenCalledTimes(1);
        expect(created).toHaveBeenCalledTimes(1);
        expect(mounted).toHaveBeenCalledTimes(1);
        expect(setData).toHaveBeenCalledTimes(1);

        expect(page.$vue).not.toBe(undefined);
        expect(page.$vue.a).toBe(1);
        page.$vue.a = 2;
        page.$vue.$nextTick(_ => {
            expect(setData).toHaveBeenCalledTimes(2);
        });
    });
});

describe('[swan]createComponent', () => {
    test('createComponent exists', () => {
        expect(createComponent).not.toBe(undefined);
        expect(createComponent).not.toBe(null);

        const app = getApp();
        const created = jest.fn();
        const mounted = jest.fn();
        const setData = jest.fn();
        const compOptions = {
            data() {
                return {
                    a: 1
                };
            },
            props: {
                text: String,
                b: {
                    type: Number,
                    default: 0
                }
            },
            created,
            mounted,
            render() {
                let _vm = this;
                let _h = _vm.$createElement;
                let _c = _vm._self._c || _h;
                return [, [_vm._s(_vm.text)]];
            }
        };
        const comp = vueCompCreator(compOptions);
        const pageOptions = {
            components: {
                comp
            },
            render() {
                let _vm = this;
                let _h = _vm.$createElement;
                let _c = _vm._self._c || _h;
                return [, [_vm._pp({
                    'compId': '$root,0',
                    'text': 'text'
                })]];
            }
        };

        const page = createPage(pageOptions);
        expect(page.handleProxy).toBe(handleProxy);

        page.setData = setData;
        page.onLoad();
        expect(app.__pages__.uid).toBe(1);
        expect(app.__pages__[1]).toBe(page);

        // expect(created).toBeCalledTimes(1);
        // expect(mounted).toBeCalledTimes(1);
        expect(setData).toHaveBeenCalledTimes(1);

        const component = createComponent(comp);
        component.properties.compId = '$root,0';
        expect(component.methods.handleProxy).toBe(handleProxy);
        // mock init method and data
        component.setData = setData;
        component.data.rootUID = 1;
        component.data.compId = '$root,0';

        // mock call methods
        component.lifetimes.created.call(component);
        expect(component.$vue).not.toBe(undefined);

        component.lifetimes.attached.call(component);
        // component intial setData omited
        expect(setData).toHaveBeenCalledTimes(1);
        component.$vue.a = 2;
        component.$vue.$nextTick(() => {
            // expect(setData).toHaveBeenCalledTimes(2);
            expect(setData).toHaveBeenCalledTimes(1);
        });

        component.lifetimes.ready.call(component);
    });
});

describe('[swan]vueCompCreator', () => {
    test('vueCompCreator exists', () => {
        expect(vueCompCreator).not.toBe(undefined);
        expect(vueCompCreator).not.toBe(null);
    });
});

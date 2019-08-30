/**
 * @file swan Page wrapper
 * @author zhangwentao <winty2013@gmail.com>
 */

/* global Page, getApp */
/* eslint-disable babel/new-cap */
/* eslint-disable fecs-camelcase */

import Vue from './vue/index';
import {mark, measure} from '../helper/perf';
import config from '../config';
import {state} from './state';

export function createVue(options, args, {setData}) {
    const pages = getApp().__pages__;
    const uid = this.__uid__ !== undefined ? this.__uid__ : ++pages.uid;
    pages[uid] = this;
    this.__uid__ = uid;

    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        const perfTagStart = `${this.route}-start`;
        // const perfTagEnd = `${this.route}-end`;
        mark(perfTagStart);
    }

    if (state.store && !options.store) {
        options.store = state.store;
    }

    const vm = new Vue(options);
    vm.__vms__ = {};
    this.$vue = vm;
    vm.$mp = {
        scope: this,
        query: args[0],
        options: args[0]
    };

    vm.$on('vm.mounted', _ => {
        setData(vm, this, true);
    });

    vm.$on('vm.updated', _ => {
        setData(vm, this, true);
    });

    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        const perfTagStart = `${this.route}-start`;
        const perfTagEnd = `${this.route}-end`;
        mark(perfTagEnd);
        measure(`${this.route}:new`, perfTagStart, perfTagEnd);
    }

    return vm;
}

export function mountVue(vm) {
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        const perfTagStart = `${this.route}-start`;
        const perfTagEnd = `${this.route}-end`;
        mark(perfTagStart);
        vm.$mount();
        mark(perfTagEnd);
        measure(`${this.route}:mount`, perfTagStart, perfTagEnd);
    }
    else {
        vm.$mount();
    }
}

export function makeCreatePage(pageMixin, {handleProxy, handleModel}, setData, callHook) {
    return function (options) {
        options.mixins = [pageMixin];

        return {
            $$__createVue__() {
                const vm = createVue.call(this, options, [], {setData});
                mountVue.call(this, vm);
            },
            data: {},
            handleProxy,
            handleModel,
            onLoad(...args) {
                let vm = this.$vue;
                let ret;
                if (!vm) {
                    vm = createVue.call(this, options, args, {setData});
                    ret = callHook.call(this, this.$vue, 'page', 'onLoad', args);
                    mountVue.call(this, vm);
                }
                else {
                    const query = args[0];
                    vm.$mp.query = query;
                    vm.$mp.options = query;
                    ret = callHook.call(this, this.$vue, 'page', 'onLoad', args);
                }
                if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                    console.log('[debug: mp pageHooks] onLoad', this.__uid__);
                }
                return ret;
            },
            onUnload(...args) {
                if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                    console.log('[debug: mp pageHooks] onUnload', this.__uid__);
                }
                const ret = callHook.call(this, this.$vue, 'page', 'onUnload', args);
                if (this.$vue) {
                    this.$vue.$destroy();
                }

                // on wx page unload will be triggered before component detached
                setTimeout(_ => {
                    const pages = getApp().__pages__;
                    const uid = this.__uid__;
                    if (pages[uid]) {
                        pages[uid] = null;
                        delete pages[uid];
                    }

                });
                delete this.$vue;
                delete this.$$__createVue__;
                return ret;
            },
            onReady(...args) {
                if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                    console.log('[debug: mp pageHooks] onReady', this.__uid__);
                }
                return callHook.call(this, this.$vue, 'page', 'onReady', args);
            },
            onShow(...args) {
                if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                    console.log('[debug: mp pageHooks] onShow', this.__uid__);
                }
                return callHook.call(this, this.$vue, 'page', 'onShow', args);
            },
            onHide(...args) {
                if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                    console.log('[debug: mp pageHooks] onHide', this.__uid__);
                }
                return callHook.call(this, this.$vue, 'page', 'onHide', args);
            },
            onPullDownRefresh(...args) {
                return callHook.call(this, this.$vue, 'page', 'onPullDownRefresh', args);
            },
            onReachBottom(...args) {
                return callHook.call(this, this.$vue, 'page', 'onReachBottom', args);
            },
            onShareAppMessage(...args) {
                return callHook.call(this, this.$vue, 'page', 'onShareAppMessage', args);
            },
            onPageScroll(...args) {
                return callHook.call(this, this.$vue, 'page', 'onPageScroll', args);
            },
            onTabItemTap(...args) {
                return callHook.call(this, this.$vue, 'page', 'onTabItemTap', args);
            }
        };
    };
}

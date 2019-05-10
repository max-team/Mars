/**
 * @file swan Page wrapper
 * @author zhangwentao <winty2013@gmail.com>
 */

/* global Page */

/* global getApp */

/* eslint-disable babel/new-cap */
import Vue from './vue/index';
import {mark, measure} from '../helper/perf';
import config from '../config';
import {state} from './state';

export function makeCreatePage(pageMixin, {handleProxy, handleModel}, setData, callHook) {
    return function (options) {
        options.mixins = [pageMixin];

        return {
            data: {},
            handleProxy,
            handleModel,
            onLoad(...args) {
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
                vm.$on('vm.updated', _ => {
                    setData(vm, this, true);
                });
                vm.$on('vm.mounted', _ => {
                    setData(vm, this, true);
                });

                if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
                    const perfTagStart = `${this.route}-start`;
                    const perfTagEnd = `${this.route}-end`;
                    mark(perfTagEnd);
                    measure(`${this.route}:new`, perfTagStart, perfTagEnd);
                }

                // 先 callHook 保证数据可以初始化
                const ret = callHook.call(this, this.$vue, 'page', 'onLoad', args);
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
                return ret;
            },
            onUnload(...args) {
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
                return ret;
            },
            onReady(...args) {
                // console.log('[pref] onReady');
                return callHook.call(this, this.$vue, 'page', 'onReady', args);
            },
            onShow(...args) {
                return callHook.call(this, this.$vue, 'page', 'onShow', args);
            },
            onHide(...args) {
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

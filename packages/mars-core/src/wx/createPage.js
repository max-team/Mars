/**
 * @file swan Page wrapper
 * @author zhangwentao <winty2013@gmail.com>
 */

/* global Page */
/* global getApp */
/* eslint-disable babel/new-cap */
import pageMixin, {handleProxy, handleModel} from './mixins';
import {setData} from './data';
import {callHook} from './lifecycle';
import $api from './nativeAPI';

import Vue from '../base/vue/index';
import {state} from '../base/state';
import {mark, measure} from '../helper/perf';
import config from '../config';
import {createVue, mountVue} from '../base/createPage';

function makeCreatePage(pageMixin, {handleProxy, handleModel}, setData, callHook) {
    return function (options) {
        options.mixins = [pageMixin];

        let initData = typeof options.data === 'function' ? options.data.call({
            $api
        }) : (options.data || {});

        return {
            data: initData,
            lifetimes: {
                attached(...args) {
                    createVue.call(this, options, args, {setData});

                    if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                        console.log('[debug: mp pageHooks] attached', this.__uid__);
                    }
                }
            },
            methods: {
                handleProxy,
                handleModel,
                onLoad(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                        console.log('[debug: mp pageHooks] onLoad', this.__uid__);
                    }
                    // 先 callHook 保证数据可以初始化
                    const ret = callHook.call(this, this.$vue, 'page', 'onLoad', args);
                    mountVue.call(this, this.$vue);
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
            }
        };
    };
}

export default makeCreatePage(pageMixin, {
    handleProxy,
    handleModel
}, setData, callHook);

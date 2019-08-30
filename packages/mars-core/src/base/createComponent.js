/**
 * @file swan Component wrapper
 * @author zhangwentao <winty2013@gmail.com>
 */

import {normalizeProps} from '../helper/props';
import {getPageInstance} from '../helper/instance';
import config from '../config';

export function makeVueCompCreator(getCompMixin) {
    return function vueCompCreator(options) {
        options.mixins = [getCompMixin(options)];
        return options;
    };
}

export function makeMarkComponent(setData) {
    return function markComponent(callback) {
        const page = getPageInstance(this);

        if (!page.$vue && page.$$__createVue__) {
            page.$$__createVue__.call(page);
            delete page.$$__createVue__;
        }

        const vms = page.$vue.__vms__;
        const vmData = vms[this.data.compId];
        if (vmData) {
            // make sure curSwan <= cur
            const curSwanIndex = vmData.curSwan < vmData.cur ? ++vmData.curSwan : vmData.curSwan;
            const vm = vmData[curSwanIndex];
            this.__curSwan__ = curSwanIndex;
            if (vm) {
                this.$vue = vm;
                vm.$mp = {
                    scope: this
                };
                vm.$off('vm.updated');
                vm.$on('vm.updated', _ => {
                    setData(vm, this);
                });
                // vue 实例会在根实例 mount 时就创建，比 swan 更早
                // 需要在 swan created 后同步一下 vue 实例的数据
                setData(vm, this);
                callback();
                return;
            }
        }

        // console.warn('[swan instance mismatch]', this.data.compId, this, vms);
        callback();
    };
}

export function makeCreateComponent(handleProxy, handleModel, callHook, hooks = {}) {
    return function (options) {
        // TODO initData 包括 vue 实例的 data defaultProps 和 computed
        let initData = typeof options.data === 'function' ? options.data() : (options.data || {});
        initData = Object.assign({
            __inited__: false
        }, initData);

        let props = normalizeProps(options.props);
        props = Object.assign(props, {
            compId: String,
            rootComputed: Object,
            rootUID: {
                type: Number,
                value: -1
            }
        });

        return {
            __isComponent__: true,
            properties: props,
            data: initData,
            externalClasses: options.externalClasses || [],
            options: options.options || {},
            methods: {
                handleProxy,
                handleModel
            },
            pageLifetimes: {
                show(...args) {
                    return callHook.call(this, this.$vue, 'comp', 'show', args);
                },
                hide(...args) {
                    return callHook.call(this, this.$vue, 'comp', 'hide', args);
                }
            },
            lifetimes: {
                created(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                        console.log('[debug: mp lifetimes] created', this.data.compId);
                    }
                    if (hooks.created) {
                        hooks.created.call(this, () => {
                            this.__created__ = true;
                            if (this.__cbs__ && this.__cbs__.length > 0) {
                                this.__cbs__.forEach(([handleName, args]) => {
                                    this.$vue[handleName] && this.$vue[handleName].apply(this.$vue, args);
                                });
                            }
                            callHook.call(this, this.$vue, 'comp', 'created', args);
                        });
                    }
                    else {
                        callHook.call(this, this.$vue, 'comp', 'created', args);
                    }
                },
                attached(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                        console.log('[debug: mp lifetimes] attached', this.data.compId);
                    }
                    callHook.call(this, this.$vue, 'comp', 'attached', args);
                },
                ready(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                        console.log('[debug: mp lifetimes] ready', this.data.compId);
                    }
                    if (hooks.ready) {
                        hooks.ready.call(this, () => {
                            callHook.call(this, this.$vue, 'comp', 'ready', args);
                        });
                    }
                    else {
                        callHook.call(this, this.$vue, 'comp', 'ready', args);
                    }
                },
                detached(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                        console.log('[debug: mp lifetimes] detached', this.data.compId);
                    }
                    callHook.call(this, this.$vue, 'comp', 'detached', args);
                    this.$vue && this.$vue.$destroy();
                    // remove swan binded vue instance from root __vms__
                    const page = getPageInstance(this);
                    const vms = page.$vue.__vms__;
                    const vmData = vms[this.data.compId];
                    const curSwan = this.__curSwan__;
                    if (vms && vmData && vmData[curSwan]) {
                        vmData[curSwan] = null;
                        delete vmData[curSwan];
                    }

                }
            }
        };
    };
}

/**
 * @file swan Component wrapper
 * @author zhangwentao <winty2013@gmail.com>
 */

import {normalizeProps} from '../helper/props';
import {getPageInstance} from '../helper/instance';
import Vue from './vue/index';
import config from '../config';

export function makeVueCompCreator(getCompMixin) {
    return function vueCompCreator(options) {
        options.mixins = [getCompMixin(options)];
        return options;
    };
}

export function makeCreateComponent(handleProxy, handleModel, setData, callHook, hooks = {}) {
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
            rootUID: Number
        });

        let [VueComponent, vueOptions] = initVueComponent(Vue, options);

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
                    // if (process.env.NODE_ENV !== 'production' && config.debug) {
                    //     console.log('[debug: swan pageLifetimes] show', this.data.compId);
                    // }
                    return callHook.call(this, this.$vue, 'comp', 'show', args);
                },
                hide(...args) {
                    // if (process.env.NODE_ENV !== 'production' && config.debug) {
                    //     console.log('[debug: swan pageLifetimes] hide', this.data.compId);
                    // }
                    return callHook.call(this, this.$vue, 'comp', 'hide', args);
                }
            },
            lifetimes: {
                created(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug) {
                        console.log('[debug: swan lifetimes] created', this.data.compId);
                    }
                    const properties = this.properties;
                    // 处理父子关系
                    // 根据 rootUID 找到根元素，进而找到 page 中的 __vms__
                    // 根据 compId 算出父实例的 comId
                    // const rootUID = this.data.rootUID;
                    // const rootMp = getApp().__pages__[rootUID];
                    const rootMp = getPageInstance(this);
                    const currentCompId = properties.compId;
                    const parentCompid = currentCompId.slice(0, currentCompId.lastIndexOf(','));
                    let parent;
                    if (parentCompid === '$root') {
                        parent = rootMp.$vue;
                    }
                    else {
                        const vmList = rootMp.$vue.__vms__[parentCompid];
                        parent = vmList[vmList.cur];
                    }

                    const options = {
                        mpType: 'component',
                        mpInstance: this,
                        propsData: properties,
                        parent
                    };

                    // 初始化 vue 实例
                    this.$vue = new VueComponent(options);
                    this.$vue.$mp = {
                        scope: this
                    };

                    this.$vue.$on('vm.updated', _ => {
                        setData(this.$vue, this);
                    });
                    this.$vue.$on('vm.mounted', _ => {
                        setData(this.$vue, this);
                    });

                    // 触发首次 setData
                    this.$vue.$mount();
                    // if (hooks.created) {
                    //     hooks.created.call(this, () => {
                    this.__created__ = true;
                    if (this.__cbs__ && this.__cbs__.length > 0) {
                        this.__cbs__.forEach(([handleName, args]) => {
                            this.$vue[handleName] && this.$vue[handleName].apply(this.$vue, args);
                        });
                    }
                    //         callHook.call(this, this.$vue, 'comp', 'created', args);
                    //     });
                    // }
                    // else {
                    callHook.call(this, this.$vue, 'comp', 'created', args);
                    // }
                },
                attached(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug) {
                        console.log('[debug: swan lifetimes] attached', this.data.compId);
                    }
                    callHook.call(this, this.$vue, 'comp', 'attached', args);
                },
                ready(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug) {
                        console.log('[debug: swan lifetimes] ready', this.data.compId);
                    }
                    // if (hooks.ready) {
                    //     hooks.ready.call(this, () => {
                    //         callHook.call(this, this.$vue, 'comp', 'ready', args);
                    //     });
                    // }
                    // else {
                    callHook.call(this, this.$vue, 'comp', 'ready', args);
                    // }
                },
                detached(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug) {
                        console.log('[debug: swan lifetimes] detached', this.data.compId);
                    }
                    callHook.call(this, this.$vue, 'comp', 'dettached', args);
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

export function initVueComponent(Vue, vueOptions) {
    vueOptions = vueOptions.default || vueOptions;
    let VueComponent;
    if (typeof vueOptions === 'function') {
        VueComponent = vueOptions;
        vueOptions = VueComponent.extendOptions;
    }
    else {
        VueComponent = Vue.extend(vueOptions);
    }
    return [VueComponent, vueOptions];
}

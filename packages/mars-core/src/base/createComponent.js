/**
 * @file swan Component wrapper
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-camelcase */
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

function mountVue(VueComponent, setData) {
    const properties = this.properties;
    // 处理父子关系
    // 根据 rootUID 找到根元素，进而找到 page 中的 __vms__
    // 根据 compId 算出父实例的 comId
    // const rootUID = this.data.rootUID;
    // const rootMp = getApp().__pages__[rootUID];
    // const rootMp = getPageInstance(this);
    const rootMp = this.$$__page__;

    // for swan new lifecycle-2-0
    // will create page vm before component vm
    if (config.$platform === 'swan' && rootMp && !rootMp.$vue) {
        rootMp.$$__createVue__ && rootMp.$$__createVue__.call(rootMp);
        delete rootMp.$$__createVue__;
    }

    const currentCompId = properties.compId;
    const parentCompid = currentCompId.slice(0, currentCompId.lastIndexOf(','));
    let parent;
    if (parentCompid === '$root') {
        parent = rootMp.$vue;
    }
    else {
        parent = rootMp.$vue.__vms__[parentCompid];
        if (!parent) {
            console.warn('cannot find Vue parent component for: ', this);
        }
    }

    const options = {
        mpType: 'component',
        mpInstance: this,
        propsData: properties,
        parent,
        compId: currentCompId
    };

    // TODO: check if is ok when swan instance reused with trackBy
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
    this.__created__ = true;
    if (this.__cbs__ && this.__cbs__.length > 0) {
        this.__cbs__.forEach(([handleName, args]) => {
            this.$vue[handleName] && this.$vue[handleName].apply(this.$vue, args);
        });
    }
}

export function makeCreateComponent(handleProxy, handleModel, setData, callHook, {
    $api
}) {
    return function (options) {
        // TODO initData 包括 vue 实例的 data defaultProps 和 computed
        let initData = typeof options.data === 'function' ? options.data() : (options.data || {});
        initData = Object.assign({
            __inited__: false
        }, initData);

        let props = normalizeProps(options.props);
        props = Object.assign(props, {
            compId: String,
            ref: String,
            rootComputed: Object,
            rootUID: {
                type: Number,
                value: -1
            }
        });

        let [VueComponent, vueOptions] = initVueComponent(Vue, options);

        return {
            __isComponent__: true,
            // for lifetimes before Vue mount
            $vue: {
                $api,
                $options: options
            },
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
                    // if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                    //     console.log('[debug: swan pageLifetimes] show', this.data.compId);
                    // }
                    return callHook.call(this, this.$vue, 'comp', 'show', args);
                },
                hide(...args) {
                    // if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                    //     console.log('[debug: swan pageLifetimes] hide', this.data.compId);
                    // }
                    return callHook.call(this, this.$vue, 'comp', 'hide', args);
                }
            },
            lifetimes: {
                created(...args) {
                    // console.log(this.$vue);
                    if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                        console.log('[debug: mp lifetimes] created', this.data.compId);
                    }
                    if (this.$vue) {
                        this.$vue.$mp = {
                            scope: this
                        };
                    }
                    callHook.call(this, this.$vue, 'comp', 'created', args);
                },
                attached(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                        console.log('[debug: mp lifetimes] attached', this.data.compId);
                    }
                    const page = getPageInstance(this);
                    this.$$__page__ = page;
                    // if (config.$platform === 'wx') {
                    mountVue.call(this, VueComponent, setData);
                    // }
                    callHook.call(this, this.$vue, 'comp', 'attached', args);
                },
                ready(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                        console.log('[debug: mp lifetimes] ready', this.data.compId);
                    }
                    callHook.call(this, this.$vue, 'comp', 'ready', args);
                },
                detached(...args) {
                    if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                        console.log('[debug: mp lifetimes] detached', this.data.compId);
                    }
                    callHook.call(this, this.$vue, 'comp', 'detached', args);
                    try {
                        this.$vue && this.$vue.$destroy();
                        // remove swan binded vue instance from root __vms__
                        const page = this.$$__page__;
                        const vms = page.$vue.__vms__;
                        vms[this.data.compId] = null;
                        delete this.$vue;
                        delete this.$$__page__;
                    }
                    catch (e) {
                        console.warn('component detached error', e, this);
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

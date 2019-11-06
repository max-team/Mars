/**
 * @file mixins
 * @author zhangwentao <winty2013@gmail.com>
 */

import {getPageInstance} from '../helper/instance';
import {setObjectData, remove} from '../helper/util';
import config from '../config';

export function makePageMixin($api) {
    return {
        beforeCreate() {
            this.$api = $api;
        },
        created() {
            if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                console.log('[debug: Vue] created', this.compId);
            }
        },
        updated() {
            this.$emit('vm.updated');
        },
        mounted() {
            if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                console.log('[debug: Vue] mounted', this.compId);
            }
            this.$emit('vm.mounted');
        }
    };
}

export function makeGetCompMixin($api) {
    return function getCompMixin(options) {
        return {
            props: {
                compId: String,
                ref: String
            },
            beforeCreate() {
                this.$api = $api;
                this.$options = Object.assign(this.$options, {
                    pageLifetimes: options.pageLifetimes,
                    lifetimes: options.lifetimes
                });
            },
            created() {
                if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                    console.log('[debug: Vue] created', this.compId);
                }

                const vms = this.$root.__vms__;
                vms[this.compId] = this;
                // vms[this.compId] = vms[this.compId] || {cur: -1, curSwan: -1};
                // const curIndex = ++vms[this.compId].cur;
                // vms[this.compId][curIndex] = this;

                // 此时还没有 .$mp
                // this.$options.mpInstance.__curSwan__ = curIndex;

                registerRef(this, this.ref);
            },
            destroyed() {
                registerRef(this, this.ref, true);
            },
            watch: {
                ref(newVal, val) {
                    if (val !== newVal) {
                        registerRef(this, val, true);
                        registerRef(this, newVal);
                        return;
                    }
                }
            },
            updated() {
                this.$emit('vm.updated');
            },
            mounted() {
                if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.lifetimes) {
                    console.log('[debug: Vue] mounted', this.compId);
                }
                this.$emit('vm.mounted');
            }
        };
    };
}

export function handleProxy(event) {
    if (process.env.NODE_ENV !== 'production' && config.debug && config.debug.events) {
        console.log('[debug: handleProxy]', this.data.compId, event);
    }
    // get event dataSet
    const data = event.currentTarget.dataset;
    const eventType = event.type;

    if (event.target.id !== event.currentTarget.id && data[`${eventType}ModifierSelf`]) {
        return;
    }

    const realHandler = data[`${eventType}eventproxy`.toLowerCase()];
    if (eventType && realHandler) {
        const detail = event.detail || {};
        let {trigger, args = []} = detail;
        if (trigger !== '$emit') {
            args = [event];
        }
        // args via argumentsproxy
        let argumentsproxy = data[`${eventType}argumentsproxy`.toLowerCase()];
        if (argumentsproxy) {
            // inline $event can pass only 1 parameter, won't support `...arguments`
            // see https://github.com/vuejs/vue/issues/5527
            args = argumentsproxy.map(a => a === '_$event_' ? args[0] : a);
        }

        // swan 组件的事件可能在其 created 生命周期前触发，此时 this.$vue 还没有绑定上
        if (this.__isComponent__ && !this.__created__) {
            this.__cbs__ = this.__cbs__ || [];
            this.__cbs__.push([realHandler, args]);
            return;
        }

        if (!this.$vue) {
            const page = getPageInstance(this);
            const vms = page.$vue.__vms__;
            console.warn('[swan instance mismatch]', this.data.compId, this, vms);
            return;
        }

        if (this.$vue[realHandler]) {
            this.$vue[realHandler].apply(this.$vue, args);
        }
    }
}

export function handleModel(event) {
    const type = event.type;
    let ct = event.currentTarget;
    let {
        dataset: {
            model,
            tag
        }
    } = ct;

    if (!model) {
        return;
    }

    if (
        type === 'input'
        || (type === 'change' && tag === 'picker')
        || (type === 'change' && tag === 'radio')
    ) {
        setObjectData(this.$vue, model, event.detail.value);
    }
    else if (type === 'change' && tag === 'switch') {
        setObjectData(this.$vue, model, event.detail.checked);
    }
}

function registerRef(vm, key, isRemoval) {
    if (!key) {
        return;
    }

    const refs = vm.$parent.$refs;
    const ref = vm;

    if (isRemoval) {
        if (Array.isArray(refs[key])) {
            remove(refs[key], ref);
        }
        else if (refs[key] === ref) {
            refs[key] = undefined;
        }
    }
    else {
        if (vm.compId && vm.compId.split(',').pop().indexOf('-') !== -1) {
            if (!Array.isArray(refs[key])) {
                refs[key] = [ref];
            }
            else if (refs[key].indexOf(ref) < 0) {
                refs[key].push(ref);
            }
        }
        else {
            refs[key] = ref;
        }
    }
}

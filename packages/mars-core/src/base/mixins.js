/**
 * @file mixins
 * @author zhangwentao <winty2013@gmail.com>
 */

import {getPageInstance} from '../helper/instance';
import {setObjectData} from '../helper/util';

export function makePageMixin($api) {
    return {
        beforeCreate() {
            this.$api = $api;
        },
        updated() {
            this.$emit('vm.updated');
        },
        mounted() {
            this.$emit('vm.mounted');
        }
    };
}

// function markComponentInVue(pms, vms) {
//     let pm = this.$mp;
//     if (!pm) {
//         pm = pms.find((item, index) => {
//             if (item[0].data.compId === this.compId) {
//                 pms.splice(index, 1);
//                 return true;
//             }
//             return false;
//         });
//     }

//     if (!pm) {
//         vms.push(this);
//     }
//     else {
//         pm[0].$vue = this;
//         pm[1]();
//     }
// }

export function makeGetCompMixin($api) {
    return function getCompMixin(options) {
        return {
            props: {
                compId: String
            },
            beforeCreate() {
                this.$api = $api;
                this.$options = Object.assign(this.$options, {
                    pageLifetimes: options.pageLifetimes,
                    lifetimes: options.lifetimes
                });
            },
            created() {
                // console.log('===vue created', this.compId);
                // markComponentInVue.call(this, pms, vms);
                const vms = this.$root.__vms__;
                vms[this.compId] = vms[this.compId] || {cur: -1, curSwan: -1};
                const curIndex = ++vms[this.compId].cur;
                vms[this.compId][curIndex] = this;
            },
            updated() {
                this.$emit('vm.updated');
            }
        };
    };
}

export function handleProxy(event) {
    // get event dataSet
    // console.log('===handleProxy:', this.data.compId, event);
    const data = event.currentTarget.dataset;
    const eventType = event.type;

    if (event.target.id !== event.currentTarget.id && data[`${eventType}ModifierSelf`]) {
        return;
    }

    const realHandler = data[`${eventType}eventproxy`.toLowerCase()];

    if (eventType && realHandler) {
        let args = data[`${eventType}argumentsproxy`.toLowerCase()] || [event];
        args = args.map(a => a === '_$event_' ? event : a);

        // swan 组件的事件可能在其 created 生命周期前触发，此时 this.$vue 还没有绑定上
        if (this.__isComponent__ && !this.__created__) {
            // console.log('====!this.__created__', this.__isComponent__, this);
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

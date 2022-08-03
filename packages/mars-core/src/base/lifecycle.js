/**
 * @file lifecycle
 * @author zhangjingyuan02
 */

// 小程序page生命周期
const PAGE_LIFECYCLE_HOOKS = {
    'onLoad': true,
    'onReady': true,
    'onShow': true,
    'onHide': true,
    'onUnload': true,
    'onForceRelaunch': true,
    'onPullDownRefresh': true,
    'onReachBottom': true,
    'onShareAppMessage': true,
    'onPageScroll': true,
    'onTabItemTap': true,
    'onBeforePageBack': true
};

// 小程序component生命周期
const COMP_LIFECYCLE_HOOKS = {
    pageLifetimes: {
        'show': true,
        'hide': true
    },
    lifetimes: {
        'created': true,
        'attached': true,
        'ready': true,
        'detached': true
    }
};

/**
 * 吊起小程序生命周期函数
 *
 * @param {Object} vm - vue实例
 * @param {string} type - 实例类型 页面、组件：枚举值 page | comp
 * @param {string} hook - 生命周期钩子
 * @param {Object} args - 参数
 * @return {Object} 返回参数
 */
export function callHook(vm, type, hook, args) {
    if (!vm) {
        // const vms = this.pageinstance && this.pageinstance.$vue.__vms__;
        // console.warn('[swan instance mismatch]', this, vms);
        return;
    }
    let handler = null;
    if (type === 'comp') {
        handler = COMP_LIFECYCLE_HOOKS.pageLifetimes[hook]
            ? vm.$options.pageLifetimes && vm.$options.pageLifetimes[hook]
            : vm.$options.lifetimes && vm.$options.lifetimes[hook];
    }
    else {
        handler = vm.$options[hook];
    }
    if (handler) {
        return handler.apply(vm, args);
    }
}

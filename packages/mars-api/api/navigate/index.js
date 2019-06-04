/**
 * @file export navigate api
 */

import {callback} from '../../lib/utils';

function guid() {
    return Math.random().toString(36).substr(2, 12);
}

/**
 * 保留当前页面，跳转到应用内的某个页面，但是不能跳转到 tabbar 页面
 * @param {Object} options 跳转参数
 * @param {string} options.url 需要跳转的应用内非 tabBar 的页面的路径
 * @param {Function} options.success 接口调用成功的回调函数
 * @param {Function} options.fail 接口调用失败的回调函数
 * @param {Function} options.complete 接口调用结束的回调函数（调用成功、失败都会执行）
 */
function navigateTo(options) {
    let {
        url,
        success,
        fail,
        complete
    } = options;
    /* eslint-disable fecs-camelcase */
    this.$router && this.$router.push({
        path: url,
        query: {
            '_': guid()
        }
    }, function (res) {
        callback(success, res);
        callback(complete, res);
    }, function (res) {
        callback(fail, res);
        callback(complete, res);
    });
    /* eslint-enabel fecs-camelcase */
}

/**
 * 关闭当前页面，跳转到应用内的某个页面
 * @param {Object} options 跳转参数
 * @param {string} options.url 需要跳转的应用内非 tabBar 的页面的路径
 * @param {Function} options.success 接口调用成功的回调函数
 * @param {Function} options.fail 接口调用失败的回调函数
 * @param {Function} options.complete 接口调用结束的回调函数（调用成功、失败都会执行）
 */
function redirectTo(options) {
    let {
        url,
        success,
        fail,
        complete
    } = options;
    this.$router && this.$router.replace(url, function (res) {
        callback(success, res);
        callback(complete, res);
    }, function (res) {
        callback(fail, res);
        callback(complete, res);
    });
}

/**
 * 关闭当前页面，返回上一页面或多级页面
 * @param {Object} options 跳转参数
 * @param {number} options.delta 返回的页面数，如果 delta 大于现有页面数，则返回到首页，默认为 1
 * @param {Function} options.success 接口调用成功的回调函数
 * @param {Function} options.fail 接口调用失败的回调函数
 * @param {Function} options.complete 接口调用结束的回调函数（调用成功、失败都会执行）
 */
function navigateBack(options) {
    let {
        delta = 1,
        success,
        fail,
        complete
    } = options;
    let navigateBackSuccess = true;
    try {
        if (!this.$router) {
            return;
        }
        delta = parseInt(delta || 1, 10);
        let routes = this.$router.options.routes;
        delta > routes.length
            ? this.$router.push(routes[0].path)
            : this.$router.go(-delta);
    }
    catch (e) {
        navigateBackSuccess = false;
        callback(fail, e);
    }
    navigateBackSuccess && callback(success);
    callback(complete);
}


/**
 * 跳转到 tabBar 页面
 * @param {Object} options 跳转参数
 * @param {string} options.url 需要跳转的 tabBar 页面的路径
 * @param {Function} options.success 接口调用成功的回调函数
 * @param {Function} options.fail 接口调用失败的回调函数
 * @param {Function} options.complete 接口调用结束的回调函数（调用成功、失败都会执行）
 */
function switchTab(options) {
    let {
        url,
        success,
        fail,
        complete
    } = options;

    this.$router && this.$router.push({
        path: url
    }, function (res) {
        callback(success, res);
        callback(complete, res);
    }, function (res) {
        callback(fail, res);
        callback(complete, res);
    });
}

/**
 * 需要跳转的应用内页面路径 , 路径后可以带参数。参数与路径之间使用 ? 分隔，参数键与参数值用=相连，不同参数用 & 分隔；如 ‘path?key=value&key2=value2’，如果跳转的页面路径是 tabBar 页面则不能带参数。不支持回调。
 * @param {Object} options 跳转参数
 * @param {string} options.url 需要跳转的应用内页面的路径
 */
function reLaunch(options) {
    // ts解决path相同不刷新问题
    let url = options.url + (options.url.indexOf('?') > -1 ? '&' : '?') + 'ts=' + Date.now();
    location.href = location.href.replace(/\/pages\/(.*)/, url);
}

/* eslint-disable fecs-export-on-declare */
export {
    navigateTo,
    redirectTo,
    navigateBack,
    reLaunch,
    switchTab
};

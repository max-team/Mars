/**
 * @file interactive
 * @author zhangjingyuan02
 */

import {shouleBeObject, getParameterError, callback} from '../../lib/utils';
import {create as createToast, remove as removeToast} from './toast';
import {create as createLoading, remove as removeLoading} from './loading';
import {create as createModal} from './modal';
import {create as createActionSheet} from './actionSheet';

function judgeOptionType(opt, apiName) {
    const res = shouleBeObject(opt);
    if (!res.res) {
        console.error(getParameterError({
            name: apiName,
            para: null,
            correct: 'Object',
            wrong: typeof opt
        }));
    }
}


function createAnimationStyle() {
    const toastLoadingStyle = document.createElement('style');
    toastLoadingStyle.textContent = `
    @-webkit-keyframes marsCustomLoadingAnimation {
        0% {
            -webkit-transform: rotate3d(0, 0, 1, 0deg);
        }
        100% {
            -webkit-transform: rotate3d(0, 0, 1, 360deg);
            transform: rotate3d(0, 0, 1, 360deg);
        }
    }
    @keyframes marsCustomLoadingAnimation {
        0% {
            -webkit-transform: rotate3d(0, 0, 1, 0deg);
        }
        100% {
            -webkit-transform: rotate3d(0, 0, 1, 360deg);
            transform: rotate3d(0, 0, 1, 360deg);
        }
    }
    @keyframes marsCustomZoominAnimation {
        0% {
            transform:scale(0.7, 0.7);
            opacity: 0.7;
        }
        100% {
            transform: scale(1, 1);
            opacity: 1;
        }
    }
    @-webkit-keyframes marsCustomZoominAnimation {
        0% {
            -webkit-transform: scale(0.7, 0.7);
            opacity: 0.7;
        }
        100% {
            -webkit-transform: scale(1, 1);
            opacity: 1;
        }
    }
    @keyframes marsCustomShowMaskAnimation {
        0% {
            opacity: 0.7;
        }
        100% {
            opacity: 1;
        }
    }
    @-webkit-keyframes marsCustomShowMaskAnimation {
        0% {
            opacity: 0.7;
        }
        100% {
            opacity: 1;
        }
    }
    `;
    document.querySelector('head').appendChild(toastLoadingStyle);
}

createAnimationStyle();

export function showLoading(options = {}) {
    judgeOptionType(options, 'showLoading');
    const {title, mask = false, success, fail, complete} = options;
    let resInfo = {errMsg: 'showLoading:ok'};
    if (typeof mask !== 'boolean') {
        resInfo.errMsg = getParameterError({
            name: 'showLoading',
            para: 'mask',
            correct: 'boolean',
            wrong: mask
        });
        console.error(resInfo.errMsg);
        callback(fail, resInfo);
        callback(complete, resInfo);
        return Promise.reject(resInfo);
    }
    createLoading({title, mask});
    callback(success, resInfo);
    callback(complete, resInfo);
    return Promise.resolve(resInfo);
}

export function showToast(options = {}) {
    judgeOptionType(options, 'showToast');
    const {title, icon = 'success', image = null, mask = false, duration = 2000, success, fail, complete} = options;
    let resInfo = {errMsg: 'showToast:ok'};
    if (icon !== 'success' && icon !== 'loading' && icon !== 'none') {
        resInfo.errMsg = getParameterError({
            name: 'showToast',
            para: 'icon',
            correct: 'success|laoding|none',
            wrong: icon
        });
        console.error(resInfo.errMsg);
        callback(fail, resInfo);
        callback(complete, resInfo);
        return Promise.reject(resInfo);
    }
    if (typeof mask !== 'boolean') {
        resInfo.errMsg = getParameterError({
            name: 'showToast',
            para: 'mask',
            correct: 'boolean',
            wrong: mask
        });
        console.error(resInfo.errMsg);
        callback(fail, resInfo);
        callback(complete, resInfo);
        return Promise.reject(resInfo);
    }
    if (typeof duration !== 'number') {
        resInfo.errMsg = getParameterError({
            name: 'showToast',
            para: 'duration',
            correct: 'number',
            wrong: duration
        });
        console.error(resInfo.errMsg);
        callback(fail, resInfo);
        callback(complete, resInfo);
        return Promise.reject(resInfo);
    }
    createToast({title, icon, image, mask, duration});
    callback(success, resInfo);
    callback(complete, resInfo);
    return Promise.resolve(resInfo);
}

export function hideLoading() {
    removeLoading();
}

export function hideToast() {
    removeToast();
}

export function showModal(options = {}) {
    judgeOptionType(options, 'showModal');
    const {
        title,
        content,
        showCancel = true,
        cancelText = '取消',
        cancelColor = '#000000',
        confirmText = '确定',
        confirmColor = '#3c76ff',
        success,
        fail,
        complete
    } = options;
    let resInfo = {errMsg: 'showModal:ok'};

    if (title && typeof title !== 'string' || title === undefined) {
        resInfo.errMsg = getParameterError({
            name: 'showModal',
            para: 'title',
            correct: 'string',
            wrong: title
        });
        console.error(resInfo.errMsg);
        callback(fail, resInfo);
        callback(complete, resInfo);
        return Promise.reject(resInfo);
    }

    if (content && typeof content !== 'string' || content === undefined) {
        resInfo.errMsg = getParameterError({
            name: 'showModal',
            para: 'content',
            correct: 'string',
            wrong: content
        });
        console.error(resInfo.errMsg);
        callback(fail, resInfo);
        callback(complete, resInfo);
        return Promise.reject(resInfo);
    }

    createModal({
        title,
        content,
        showCancel,
        cancelText,
        cancelColor,
        confirmText,
        confirmColor,
        success,
        fail,
        complete
    });
}

export function showActionSheet(options = {}) {
    judgeOptionType(options, 'showActionSheet');
    let {itemList = [], itemColor = '#3c76ff', success, fail, complete} = options;
    let resInfo = {errMsg: 'showActionSheet:ok'};
    if (itemList && !(itemList instanceof Array) || itemList === undefined) {
        resInfo.errMsg = getParameterError({
            name: 'showActionSheet',
            para: 'itemList',
            correct: 'array',
            wrong: itemList
        });
        console.error(resInfo.errMsg);
        callback(fail, resInfo);
        callback(complete, resInfo);
        return Promise.reject(resInfo);
    }
    if (itemColor && typeof itemColor !== 'string') {
        resInfo.errMsg = getParameterError({
            name: 'showActionSheet',
            para: 'itemColor',
            correct: 'string',
            wrong: itemColor
        });
        console.error(resInfo.errMsg);
        callback(fail, resInfo);
        callback(complete, resInfo);
        return Promise.reject(resInfo);
    }
    itemList.length > 6 && (itemList = itemList.slice(0, 6));
    createActionSheet({itemList, itemColor, success, fail, complete});
}

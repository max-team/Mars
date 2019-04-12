/**
 * @file storage api
 * @author zhaolongfei
 */

import {callback} from '../../lib/utils';

const cookieCache = [];

function setCookie(cname, cvalue, exdays = 10) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + '; ' + expires;

    // 缓存cookie
    cookieCache.push(cname);
}

function getCookie(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();

        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }

    return '';
}

function getCookieKeys() {
    let keys = [];
    let ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let pair = ca[i].trim();

        keys.push(pair.split('=')[0]);
    }

    return keys;
}

function removeCookie(cname) {
    setCookie(cname, '', -1);
}

function clearCookie() {
    for (let cname of cookieCache) {
        removeCookie(cname);
    }
}

export function setStorageSync(key, data) {
    const dataStr = JSON.stringify(data || '');

    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, dataStr);
    } else {
        setCookie(key, dataStr);
    }
}

export function setStorage(options = {}) {
    const {key, data, success, fail, complete} = options;

    return new Promise((resolve, reject) => {
        let info = {status: 0, message: 'success'};

        try {
            setStorageSync(key, data);
        } catch (e) {
            info = {status: -1, message: e};
        }

        if (info.status === 0) {
            callback(success, info);
            callback(complete, info);
            resolve(info);
        } else {
            callback(fail, info);
            callback(complete, info);
            reject(info);
        }
    });
}

export function getStorageSync(key) {
    let info = null;

    if (typeof localStorage !== 'undefined') {
        info = localStorage.getItem(key);
    } else {
        info = getCookie(key);
    }

    return JSON.parse(info);
}

export function getStorage(options = {}) {
    const {key, success, fail, complete} = options;

    return new Promise((resolve, reject) => {
        let info = {status: 0, message: 'success'};

        try {
            info.data = getStorageSync(key);
        } catch (e) {
            info = {status: -1, message: e};
        }

        if (info.status === 0) {
            callback(success, info);
            callback(complete, info);
            resolve(info);
        } else {
            callback(fail, info);
            callback(complete, info);
            reject(info);
        }
    });
}

export function getStorageInfoSync() {
    let info = {
        currentSize: 0,
        keys: [],
        limitSize: NaN
    };

    if (typeof localStorage !== 'undefined') {
        for (let key in localStorage) {
            info.keys.push(key);
            info.currentSize += localStorage.getItem(key).length * 2; // 一个字符占2个字节
        }
    } else {
        info.currentSize = document.cookie.length * 2;
        info.keys = getCookieKeys();
        info.limitSize = 4 * 1024; // 4K
    }

    return info;
}

export function getStorageInfo(options) {
    const {success, fail, complete} = options;

    return new Promise((resolve, reject) => {
        let info = null;

        try {
            info = getStorageInfoSync();
        } catch (e) {
            info = e;
            info.status = -1;
        }

        if (info.status === -1) {
            callback(fail, info);
            callback(complete, info);
            reject(info);
        } else {
            callback(success, info);
            callback(complete, info);
            resolve(info);
        }
    });
}
export function removeStorageSync(key) {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
    } else {
        removeCookie(key);
    }

    return true;
}

export function removeStorage(options = {}) {
    const {
        key,
        success,
        fail,
        complete
    } = options;

    removeStorageSync(key);

    callback(success);
    callback(complete);

    return Promise.resolve();
}

export function clearStorageSync() {
    if (typeof localStorage !== 'undefined') {
        localStorage.clear();
    } else {
        clearCookie();
    }
    return true;
}

export function clearStorage(options = {}) {
    const {
        success,
        fail,
        complete
    } = options;

    clearStorageSync();

    callback(success);
    callback(complete);

    return Promise.resolve();
}

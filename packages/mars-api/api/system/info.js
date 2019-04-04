/**
 * @file system info api
 * @author zhangjingyuan02
 */

import {callback} from '../utils';

function getSystemInfoSync() {

    const info = {
        system: navigator.userAgent,
        screenWidth: document.body.clientWidth,
        windowWidth: document.body.clientWidth
    };

    return info;
}

function getSystemInfo(options = {}) {
    const {success, complete} = options;
    return new Promise(resolve => {
        const info = getSystemInfoSync();
        callback(success, info);
        callback(complete, info);
        resolve(info);
    });
}

export {
    getSystemInfoSync,
    getSystemInfo
};

/**
 * @file unsupport
 * @author mars
 */

import {callback} from '../../lib/utils';

function handleAndGetMsg(name, options = {}) {
    const {success, fail, complete} = options;
    const errMsg = `api [${name}] not supported in H5`;
    callback(fail, errMsg);
    callback(complete, errMsg);
    return errMsg;
}

export function getSwanId(options = {}) {
    return Promise.reject(handleAndGetMsg('getSwanId', options));
}

export function getUserInfo(options = {}) {
    return Promise.reject(handleAndGetMsg('getUserInfo', options));
}

export function getLocation(options = {}) {
    return Promise.reject(handleAndGetMsg('getLocation', options));
}

export function login(options = {}) {
    return Promise.reject(handleAndGetMsg('login', options));
}

export function isLoginSync(options = {}) {
    return Promise.reject(handleAndGetMsg('isLoginSync', options));
}

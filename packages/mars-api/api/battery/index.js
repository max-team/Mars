/**
 * @file battery api
 * @author zhaolongfei
 */

import {callback} from '../../lib/utils';

export function getBatteryInfo(options = {}) {
    const {success, fail, complete} = options;

    if (navigator.getBattery) {
        return new Promise((resolve, reject) => {
            navigator.getBattery().then(battery => {
                const res = {
                    isCharging: battery.charging,
                    level: battery.level
                };
                callback(success, res);
                callback(complete, res);
                resolve(res);
            }).catch(e => {
                const err = {
                    errMsg: e
                };
                callback(fail, err);
                callback(complete, err);
                reject(err);
            });
        });
    } else {
        const err = {
            errMsg: 'getBatteryInfo is not supported by browser'
        };
        callback(fail, err);
        callback(complete, err);
        return Promise.reject(err);
    }
}

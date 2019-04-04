/**
 * @file nativeAPI
 * @author huxiaohui02 <644393769@qq.com>
 */

/* global wx */

/* global swan */
import {otherApis} from '../native-apis.js';

function promisify(fn, api) {

    return function (options, ...args) {
        options = options || {};
        let task = null;
        let obj = Object.assign({}, options);

        let pro = new Promise((resolve, reject) => {
            ['fail', 'success', 'complete'].forEach(k => {
                obj[k] = res => {
                    options[k] && options[k](res);
                    if (k === 'success') {
                        if (api === 'connectSocket') {
                            resolve(Promise.resolve().then(() => Object.assign(task, res)));
                        }
                        else {
                            resolve(res);
                        }
                    }
                    else if (k === 'fail') {
                        reject(res);
                    }

                };
            });

            task = fn(obj);
        });

        if (api === 'uploadFile' || api === 'downloadFile') {
            pro.progress = cb => {
                if (task) {
                    task.onProgressUpdate(cb);
                }

                return pro;
            };
            pro.abort = cb => {
                cb && cb();
                if (task) {
                    task.abort();
                }

                return pro;
            };
        }

        return pro;
    };
}

export function makeNativeAPI(pm, pmName) {
    let $api = Object.assign({}, pm);

    Object.keys(otherApis).forEach(api => {
        if (!(api in pm)) {
            $api[api] = () => {
                console.warn(`${pmName}暂不支持 ${api}`);
            };
            return;
        }

        $api[api] = promisify(pm[api], api);
    });

    return $api;
}

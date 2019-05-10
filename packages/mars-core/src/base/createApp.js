/**
 * @file swan Component wrapper
 * @author zhangwentao <winty2013@gmail.com>
 */

import {state} from './state';

export function makeCreateApp($api) {
    return function (options) {

        if (options.store) {
            state.store = options.store;
        }

        options = Object.assign(options, {
            $api,
            __pages__: {
                uid: -1
            }
        });

        return options;
    };
}

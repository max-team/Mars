/**
 * @file swan Component wrapper
 * @author zhangwentao <winty2013@gmail.com>
 */

export function makeCreateApp($api) {
    return function (options) {

        options = Object.assign(options, {
            $api,
            __pages__: {
                uid: -1
            }
        });

        return options;
    };
}

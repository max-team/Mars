/**
 * @file mpNextTick api
 * @author meixuguang
 */

/* globals Map */

const callbacks = new Map();

function copyAndResetCb(key) {
    let cbs = callbacks.get(key) || [];

    if (cbs.length > 0) {
        const copies = cbs.slice(0);
        cbs.length = 0;
        return copies;
    }

    return [];
}

export function getMpUpdatedCallbacks(vm) {
    const copies = copyAndResetCb(vm);
    const globalCopies = copyAndResetCb('__global');

    return function () {
        for (let i = 0; i < copies.length; i++) {
            copies[i]();
        }
        for (let i = 0; i < globalCopies.length; i++) {
            globalCopies[i]();
        }
    };
}

export function mpUpdated(cb, ctx) {
    let key = (ctx && ctx._isVue === true) ? ctx : '__global';

    let cbs = callbacks.get(key) || [];

    /* eslint-disable fecs-camelcase */
    let _resolve;
    cbs.push(() => {
        if (cb) {
            try {
                cb.call(ctx);
            }
            catch (e) {
                throw new Error(e);
            }
        }
        else if (_resolve) {
            _resolve(ctx);
        }
    });

    callbacks.set(key, cbs);

    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve;
        });
    }
    /* eslint-enable fecs-camelcase */
}

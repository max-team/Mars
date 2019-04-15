/**
 * @file export other api
 * @author huxiaohui02
 */
import {shouleBeObject, getParameterError, callback} from '../../lib/utils';

export * from './unsupport';

export function makePhoneCall(options) {
    const isObject = shouleBeObject(options);
    if (!isObject.res) {
        const res = {errMsg: `makePhoneCall${isObject.msg}`};
        console.error(res.errMsg);
        return Promise.reject(res);
    }

    const {phoneNumber, success, fail, complete} = options;
    const res = {};

    if (typeof phoneNumber !== 'string') {
        res.errMsg = getParameterError({
            name: 'makePhoneCall',
            para: 'phoneNumber',
            correct: 'String',
            wrong: phoneNumber
        });
        console.error(res.errMsg);
        callback(fail, res);
        callback(complete, res);
        return Promise.reject(res);
    }

    window.location.href = `tel:${phoneNumber}`;

    res.cancel = false;
    res.confirm = true;
    callback(success, res);
    callback(complete, res);

    return Promise.resolve(res);
}

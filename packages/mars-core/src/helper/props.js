/**
 * @file  props helper
 * @author zhangwentao
 */

import {isObject, isArray} from './util';

export function normalizeProps(props) {
    if (!props) {
        return {};
    }

    if (isArray(props)) {
        let result = {};
        props.forEach(key => {
            result[key] = {type: null};
        });
        return result;
    }

    if (isObject(props)) {
        let result = {};
        Object.keys(props).forEach(k => {
            let propValue = props[k];

            if (typeof propValue === 'function' || propValue === null) {
                result[k] = {type: propValue};
            }
            else {
                if (!isObject(propValue)) {
                    throw new Error(`[component props] prop ${k} value require plain object or supported data type`);
                }
                let {type, default: value} = propValue;
                if (typeof value === 'function') {
                    value = value();
                }
                let item = {type};
                value !== undefined && (item.value = value);
                result[k] = item;
            }
        });
        return result;
    }

    return {};
}

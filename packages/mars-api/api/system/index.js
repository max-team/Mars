/**
 * @file export system api
 * @author zhangjingyuan02
 */

import {
    getSystemInfo,
    getSystemInfoSync
} from './info';
import {
    getNetworkType,
    onNetworkStatusChange
} from './network';

export {
    getSystemInfo,
    getSystemInfoSync,
    getNetworkType,
    onNetworkStatusChange
};

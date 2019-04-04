/**
 * @file 在这个文件中加载 Vue 插件等内容
 * @author meixuguang
 */

import Vue from './vue.runtime.esm';
import {mpUpdated} from '../api/mpNextTick';

Vue.prototype.$mpUpdated = function (fn) {
    return mpUpdated(fn, this);
};

export default Vue;

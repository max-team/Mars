/**
 * @file swan Component wrapper
 * @author zhangwentao <winty2013@gmail.com>
 */

/* global Component */

/* eslint-disable babel/new-cap */
import {
    getCompMixin,
    handleProxy,
    handleModel
} from './mixins';
import {setData} from './data';
import {callHook} from './lifecycle';
import $api from './nativeAPI';

import {
    makeCreateComponent,
    makeVueCompCreator
} from '../base/createComponent';

export const vueCompCreator = makeVueCompCreator(getCompMixin);
export default makeCreateComponent(
    handleProxy,
    handleModel,
    setData,
    callHook,
    {$api}
);

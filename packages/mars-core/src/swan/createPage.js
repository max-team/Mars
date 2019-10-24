/**
 * @file swan Page wrapper
 * @author zhangwentao <winty2013@gmail.com>
 */

/* global Page */

/* eslint-disable babel/new-cap */
import pageMixin, {handleProxy, handleModel} from './mixins';
import {makeCreatePage} from '../base/createPage';
import {setData} from './data';
import {callHook} from './lifecycle';
import $api from './nativeAPI';

export default makeCreatePage(
    pageMixin,
    {
        handleProxy,
        handleModel
    },
    setData,
    callHook,
    {
        $api
    }
);

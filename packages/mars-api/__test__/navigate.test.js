/**
 * @file navigate api unit test
 * @author huxiaohui02 <644393769@qq.com>
 */

import * as NavigateApi from '../api/navigate/index';

/* global jest, test */
describe('[api]navigate', () => {
    test('api:reLaunch', () => {
        NavigateApi.reLaunch({url: '/pages/api/request/index?param=111'});
    });
});

/**
 * @file other api unit test
 * @author huxiaohui02 <644393769@qq.com>
 */

import * as OtherApi from '../api/other/index';

/* global jest, test */
describe('[api]others', () => {
    test('api:makePhoneCall', () => {
        const success = jest.fn();
        const fail = jest.fn();
        const complete = jest.fn();

        // OtherApi.makePhoneCall({
        //     phoneNumber: '152xxxx4234',
        //     success,
        //     fail,
        //     complete
        // }).then(res => {
        //     expect(success.mock.calls.length).toBe(1);
        //     expect(fail.mock.calls.length).toBe(0);
        //     expect(complete.mock.calls.length).toBe(1);
        // });
    });
});

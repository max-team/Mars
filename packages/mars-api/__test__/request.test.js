/**
 * @file other api unit test
 * @author huxiaohui02 <644393769@qq.com>
 */

import request from '../api/request/index';

global.fetch = require('jest-fetch-mock');

/* global jest, test */
describe('request', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    test('should return fetch data', () => {
        const success = jest.fn();
        const fail = jest.fn();
        const complete = jest.fn();

        fetch.once(JSON.stringify({data: 'test'}));

        expect.assertions(6);
        return request({
            url: 'http://localhost:8080/sockjs-node/info',
            data: {
                key: 'value'
            },
            success,
            fail,
            complete
        })
        .then(res => {
            expect(fetch.mock.calls[0][0]).toBe('http://localhost:8080/sockjs-node/info?key=value');
            expect(res.statusCode).toBe(200);
            expect(res.data).toEqual({data: 'test'});
            expect(success.mock.calls.length).toBe(1);
            expect(fail.mock.calls.length).toBe(0);
            expect(complete.mock.calls.length).toBe(1);
        });
    });


    test('should set correct params', () => {
        fetch.once(JSON.stringify({data: 'test'}));

        expect.assertions(3);
        return request({
            url: 'http://localhost:8080/sockjs-node/info',
            method: 'POST',
            data: {
                key: 'value'
            },
            cache: 'no-cache',
            credentials: 'include'
        })
        .then(res => {
            expect(fetch.mock.calls[0][0]).toBe('http://localhost:8080/sockjs-node/info');
            expect(fetch.mock.calls[0][1]).toEqual({
                method: 'POST',
                body: {
                    key: 'value'
                },
                cache: 'no-cache',
                credentials: 'include'
            });
            expect(res.data).toEqual({data: 'test'});
        });
    });

    test('should catch error', () => {
        const success = jest.fn();
        const fail = jest.fn();
        const complete = jest.fn();

        fetch.mockReject(new Error('fake error message'));

        expect.assertions(5);
        return request({
            url: 'http://localhost:8080/sockjs-node/info',
            data: {
                key: 'value'
            },
            success,
            fail,
            complete
        })
        .catch(err => {
            expect(fetch.mock.calls[0][0]).toBe('http://localhost:8080/sockjs-node/info?key=value');
            expect(err.message).toBe('fake error message');
            expect(success.mock.calls.length).toBe(0);
            expect(fail.mock.calls.length).toBe(1);
            expect(complete.mock.calls.length).toBe(1);
        });
    });
});

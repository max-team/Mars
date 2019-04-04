/**
 * @file storage api unit test
 * @author zhaolognfei <izhaolongfei@gmail.com>
 */

import 'jest-localstorage-mock';
import * as StorageApi from '../api/storage/index';

/* global jest, test */
describe('[api]storage', () => {
    // beforeEach(() => {
    //     localStorage.clear();
    // });

    test('api:setStorageSync', () => {
        const key = 'user';
        const value = {
            name: 'zhaolongfei'
        };

        StorageApi.setStorageSync(key, value);

        const valueSaved = JSON.stringify(value);

        expect(localStorage.setItem).toHaveBeenCalledWith(key, valueSaved);
        expect(localStorage.__STORE__[key]).toBe(valueSaved);
        expect(Object.keys(localStorage.__STORE__).length).toBe(1);
    });

    test('api:setStorage', () => {
        const key = 'dancer';
        const value = {
            no: 'B01'
        };
        const response = {
            status: 0,
            message: 'success'
        };
        expect(StorageApi.setStorage(key, value)).resolves.toEqual(response);
        expect(StorageApi.setStorage(key)).resolves.toEqual(response);
        expect(localStorage.__STORE__[key]).toBe(undefined);
    });

    test('api:getStorageSync', () => {
        const val = StorageApi.getStorageSync('user');
        expect(localStorage.getItem).toHaveBeenCalledWith('user');
    });

    test('api:getStorage', () => {
        const key = 'user';
        const data = StorageApi.getStorageSync(key);
        const response = {
            data: data,
            message: 'success',
            status: 0
        };
        const success = jest.fn();
        const complete = jest.fn();
        expect(StorageApi.getStorage({key})).resolves.toEqual(response);
        return StorageApi.getStorageInfo({
            success,
            complete
        }).then(res => {
            expect(success.mock.calls[0][0]).toEqual(res);
            expect(complete.mock.calls[0][0]).toEqual(res);
        });
    });

    test('api:getStorageInfoSync', () => {
        const size = StorageApi.getStorageInfoSync();
        expect(size).toHaveProperty('keys');
    });

    test('api:getStorageInfo', () => {
        const success = jest.fn();
        const complete = jest.fn();
        return StorageApi.getStorageInfo({
            success,
            complete
        }).then(res => {
            expect(res.keys).toContain('user');
            expect(res.limitSize).toBeNaN();
            expect(res.currentSize).toBeGreaterThan(0);
            expect(success.mock.calls.length).toBe(1);
            expect(success.mock.calls[0][0]).toEqual(res);
            expect(complete.mock.calls.length).toBe(1);
            expect(complete.mock.calls[0][0]).toEqual(res);
        });
    });

    test('api:removeStorageSync', () => {
        const res = StorageApi.removeStorageSync('dancer');
        expect(res).toBe(true);
        expect(StorageApi.getStorageSync('dancer')).toBeFalsy();
    });

    test('api:removeStorage', () => {
        const success = jest.fn();
        const complete = jest.fn();

        return StorageApi.removeStorage({
            key: 'user',
            success,
            complete
        }).then(res => {
            expect(success.mock.calls[0][0]).toEqual(res);
            expect(complete.mock.calls[0][0]).toEqual(res);
        });
    });

    test('api:clearStorageSync', () => {
        const res = StorageApi.clearStorageSync();
        expect(res).toBe(true);
        expect(StorageApi.getStorageSync('dancer')).toBeFalsy();
    });

    test('api:clearStorage', () => {
        const success = jest.fn();
        const complete = jest.fn();

        return StorageApi.clearStorage({
            success,
            complete
        }).then(res => {
            expect(success.mock.calls[0][0]).toEqual(res);
            expect(complete.mock.calls[0][0]).toEqual(res);
            expect(StorageApi.getStorageSync('user')).toBeFalsy();
        });
    });
});

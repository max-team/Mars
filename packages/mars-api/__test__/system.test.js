/**
 * @file system api unit test
 * @author zhangjingyuan02
 */

import * as System from '../api/system/index';

/* global jest, test */
describe('[api]System', () => {
    test('api:getSystemInfoSync', () => {
        const {
            system,
            platform,
            model,
            screenWidth,
            screenHeight,
            windowWidth,
            windowHeight,
            pixelRatio,
            language
        } = System.getSystemInfoSync();
        expect(system).toBe('Android 7.1.1');
        expect(platform).toBe('android');
        expect(language).toBe('en-US');
        expect(model).toBe('Nexus 6');
    });

    test('api:getSystemInfo', () => {
        const success = jest.fn();
        const complete = jest.fn();
        System.getSystemInfo({
            success,
            complete
        }).then(res => {
            const {
                system,
                platform,
                model,
                screenWidth,
                screenHeight,
                windowWidth,
                windowHeight,
                pixelRatio,
                language
            } = res;
            expect(system).toBe('Android 7.1.1');
            expect(platform).toBe('android');
            expect(language).toBe('en-US');
            expect(model).toBe('Nexus 6');
            expect(success).toHaveBeenCalled();
            expect(complete).toHaveBeenCalled();
        });
    });

    test('api:getNetworkType', () => {
        const success = jest.fn();
        const complete = jest.fn();
        System.getNetworkType({
            success,
            complete
        }).then(res => {
            const networkType = res.networkType;
            expect(networkType).toBe('unknown');
            expect(success).toHaveBeenCalled();
            expect(complete).toHaveBeenCalled();
        });
    });
});

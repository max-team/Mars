/**
 * @file system info api
 * @author zhangjingyuan02
 */

import {callback} from '../../lib/utils';

const NAVIGATION_BAR_HEIGHT = 38;

function getSystemInfoSync() {
    const userAgent = window.navigator.userAgent;
    const ua = userAgent.toLowerCase();
    let isIos = false;
    let isAndroid = false;
    let system = undefined;
    let platform = undefined;
    let model = undefined;
    const screenHeight = document.documentElement.clientHeight;
    const screenWidth = document.documentElement.clientWidth;
    const windowWidth = screenWidth;
    const windowHeight = screenHeight - NAVIGATION_BAR_HEIGHT;

    if (userAgent.indexOf('Mac OS') > -1 || userAgent.indexOf('iPhone OS') > -1) {
        isIos = true;
    }
    else if (userAgent.indexOf('Android') > -1) {
        isAndroid = true;
    }

    if (isIos) {
        let match = userAgent.match('iPhone OS ([0-9,_]*) ');
        system = match && match[1] && `iOS ${match[1].replace(/_/g, '.')}` || undefined;
        platform = 'ios';

        if (screenHeight === 736 && screenWidth === 414) {
            model = 'iPhone6P, iPhone7P, iPhone8P';
        }
        else if (screenHeight === 812 && screenWidth === 375) {
            model = 'iPhoneX';
        }
        else if (screenHeight === 667 && screenWidth === 375) {
            model = 'iPhone6, iPhone7, iPhone8';
        }
        else if (screenWidth > 320) {
            model = 'iPhone';
        }
        else if (screenHeight === 568 && screenWidth === 320) {
            model = 'iPhone5, iPhoneSE, iPhone5s';
        }
        else {
            model = 'iPhone4s, iPhone4';
        }
    }
    else if (isAndroid) {
        let match = userAgent.match('Android ([0-9,.]*)');
        system = match && match[0] || undefined;
        platform = 'android';
        const buildIndex = ua.indexOf('build');
        const fullResult = userAgent.substring(0, buildIndex);
        const fullArr = fullResult.split(';');
        model = fullArr[fullArr.length - 1].trim();
    }

    const info = {
        system,
        platform,
        model,
        screenWidth,
        screenHeight,
        windowWidth,
        windowHeight,
        pixelRatio: window.devicePixelRatio,
        language: navigator.language
    };

    return info;
}

function getSystemInfo(options = {}) {
    const {success, complete} = options;
    return new Promise(resolve => {
        const info = getSystemInfoSync();
        callback(success, info);
        callback(complete, info);
        resolve(info);
    });
}

/* eslint-disable fecs-export-on-declare */
export {
    getSystemInfoSync,
    getSystemInfo
};

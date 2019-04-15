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
    let system = '';
    let platform = '';
    let model = '';
    const screenHeight = window.screen.height;
    const screenWidth = window.screen.width;
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight - NAVIGATION_BAR_HEIGHT;

    if (userAgent.indexOf('Mac OS') > -1 || userAgent.indexOf('iPhone OS') > -1) {
        isIos = true;
    }
    else if (userAgent.indexOf('Android') > -1) {
        isAndroid = true;
    }
    // 兼容UC浏览器 UA
    else if (userAgent.indexOf('iPhone') === -1 && userAgent.indexOf('UCBrowser') > -1) {
        isAndroid = true;
    }

    if (isIos) {
        let match = userAgent.match('iPhone OS ([0-9,_]*) ');
        system = match && match[1] && `iOS ${match[1].replace(/_/g, '.')}` || undefined;
        platform = 'ios';

        if (screenHeight === 736 && screenWidth === 414) {
            model = 'iPhone 6 Plus, iPhone 7 Plus, iPhone 8 Plus';
        }
        else if (screenHeight === 667 && screenWidth === 375) {
            model = 'iPhone 6, iPhone 7, iPhone 8';
        }
        else if (screenHeight >= 812 && screenWidth >= 375) {
            model = 'iPhone X';
        }
        else if (screenWidth > 320) {
            model = 'iPhone';
        }
        else if (screenHeight === 568 && screenWidth === 320) {
            model = 'iPhone 5, iPhone SE, iPhone 5s';
        }
        else {
            model = 'iPhone 4s, iPhone 4';
        }
    }
    else if (isAndroid) {
        let match = userAgent.match('Android ([0-9,.]*)');
        system = match && match[0] || 'Android';
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

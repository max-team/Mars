/**
 * @file device motion api
 * @author zhaolongfei
 */

import {callback} from '../../lib/utils';

class MotionMonitor {
    constructor() {
        this.interval = 200;
    }

    on(event, cb) {
        if (typeof cb === 'function') {
            this['on' + event] = cb;
        }
        return this;
    }

    start(interval = 'normal') {
        const intervalMap = {
            game: 20,
            ui: 60,
            normal: 200
        };
        this.interval = intervalMap[interval];
        window.addEventListener('devicemotion', this.eventHandler, false);
    }

    stop() {
        window.removeEventListener('devicemotion', this.eventHandler, false);
    }

    eventHandler(e) {
        const motion = {
            alpha: e.rotationRate.alpha || 0, // alpha: rotation around z-axis
            gamma: e.rotationRate.gamma || 0, // gamma: left to right
            beta: e.rotationRate.beta || 0 // beta: front back motion
        };
        const now = Date.now();
        if (!this.lastEmit) {
            this.lastEmit = now;
            this.onMotionChange && this.onMotionChange(motion);
        } else if (now - this.lastEmit >= this.interval) {
            this.onMotionChange && this.onMotionChange(motion);
            this.lastEmit = now;
        }
    }
}

const motionMonitor = new MotionMonitor();

// 不提供 Promise 写法
export function onDeviceMotionChange(options = {}) {
    const {success, fail, complete} = options;

    if (window.DeviceMotionEvent) {
        motionMonitor.on('MotionChange', motion => {
            callback(success, motion);
            callback(complete, motion);
        });
    } else {
        const err = {
            errCode: 904,
            errMsg: 'onDeviceMotionChange is not supported by browser'
        };
        callback(fail, err);
        callback(complete, err);
    }
}

export function startDeviceMotionListening(options = {}) {
    const {interval = 'normal', success, fail, complete} = options;

    if (window.DeviceMotionEvent) {
        motionMonitor.start(interval);
        callback(success);
        callback(complete);
        return Promise.resolve();
    } else {
        const err = {
            errCode: 904,
            errMsg: 'startDeviceMotionListening is not supported by browser'
        };
        callback(fail, err);
        callback(complete, err);
        return Promise.reject(err);
    }
}

export function stopDeviceMotionListening(options = {}) {
    const {success, fail, complete} = options;

    if (window.DeviceMotionEvent) {
        motionMonitor.stop();
        callback(success);
        callback(complete);
        return Promise.resolve();
    } else {
        const err = {
            errCode: 904,
            errMsg: 'stopDeviceMotionListening is not supported by browser'
        };
        callback(fail, err);
        callback(complete, err);
        return Promise.reject(err);
    }
}

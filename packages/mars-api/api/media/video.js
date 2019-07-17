/**
 * @file video
 * @author zhaolongfei
 */

import {uploader} from '../file/upload';
import {callback} from '../../lib/utils';

export function chooseVideo(options = {}) {
    const {sourceType = ['album', 'camera'], compressed = true, maxDuration = 60, success, fail, complete} = options;

    return uploader('video', 1, sourceType).then(data => {
        callback(success, data);
        callback(complete, data);
        return data;
    }).catch(e => {
        // 如果是接口异常，执行失败回调；否则抛出异常（用户回调函数内部执行错误）
        if (e.__errType === 0) {
            callback(fail, e);
            callback(complete, e);
            return e;
        }
        throw e;
    });
}

export function saveVideoToPhotosAlbum() {
    // TODO
}
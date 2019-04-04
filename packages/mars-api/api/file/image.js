/**
 * @file image
 * @Date 2019/2/21
 * @author zhaolongfei(izhaolongfei@gmail.com)
 */

import {uploader} from './upload';
import {callback} from '../utils';

export function chooseImage(options) {
    const {
        count = 9,
        success,
        fail,
        complete
    } = options;

    return uploader('image', count, 'image').then(data => {
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

export function getImageInfo() {
    // TODO
}

export function previewImage() {
    // TODO
}

export function saveImageToPhotosAlbum() {
    // TODO
}

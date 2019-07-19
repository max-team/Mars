/**
 * @file uploader
 * @Date 2019/2/21
 * @author zhaolongfei(izhaolongfei@gmail.com)
 */

import {callback, isIOS} from '../../lib/utils';

export function uploader(type = 'image', count = 1, sourceType) {
    return new Promise((resolve, reject) => {
        const input = document.getElementById('mars-uploader') || document.createElement('input');
        input.id = 'mars-uploader';
        input.type = 'file';
        input.multiple = count > 1;
        input.accept = type + '/*';
        input.style.width = 0;
        input.style.height = 0;
        // iOS 下存在 capture 属性时，默认打开相机
        if (type === 'image' && isIOS() && !sourceType.includes('album')) {
            input.capture = 'camera';
        }

        document.body.appendChild(input);

        input.click();

        input.addEventListener('change', e => {
            resolve({
                status: 0,
                fileType: type,
                tempFilePaths: e.target.files,
                tempFiles: e.target.files
            });
            input.remove();
        }, false);

        input.addEventListener('error', e => {
            e.__errType = 0;
            reject(e);
        });
    });
}

function upload(url, header = null, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', url, true);

        xhr.setRequestHeader('Content-type', 'multipart/form-data');

        for (let key in header) {
            xhr.setRequestHeader(key, header[key]);
        }

        xhr.send(data);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.response);
            }
        };

        xhr.onerror = e => {
            e.__errType = 0;
            reject(e);
        };
    });
}

export function uploadFile(options) {
    const {url, filePath, name, header = null, formData = null, success, fail, complete} = options;

    const rformData = new FormData();

    rformData.append(name, filePath);

    for (let key in formData) {
        rformData.append(key, formData[key]);
    }

    return upload(url, header, rformData).then(res => {
        callback(success, res);
        callback(complete, res);
        return res;
    }).catch(e => {
        if (e.__errType === 0) {
            callback(fail, e);
            callback(complete, e);
            return e;
        }
        throw e;
    });
}

/**
 * @file clipboard api
 * @author zhaolongfei
 */

import {callback, isIOS} from '../../lib/utils';
import {showToast} from '../interactive';

class FakeClipboard {
    constructor() {
        this.textArea = document.createElement('textarea');
        this.textArea.id = 'mars-clipboard';
        this.textArea.style.position = 'absolute';
        this.textArea.style.left = '-9999px';
        this.textArea.setAttribute('readonly', 'readonly');
        document.body.appendChild(this.textArea);
    }

    setData(data) {
        this.textArea.value = data;
    }

    getData() {
        return this.textArea.value;
    }

    select() {
        if (isIOS()) {
            const range = document.createRange();
            range.selectNodeContents(this.textArea);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            this.textArea.setSelectionRange(0, 999999);
        } else {
            this.textArea.select();
        }
    }

    copy(cb) {
        try {
            if (document.execCommand('Copy')) {
                cb(true);
            } else {
                cb(false);
            }
        } catch (e) {
            cb(false);
        }
    }
}

const clipboard = new FakeClipboard();

export function setClipboardData(options = {}) {
    const {data = '', success, fail, complete} = options;

    return new Promise((resolve, reject) => {
        clipboard.setData(data);
        clipboard.select();
        clipboard.copy(flag => {
            if (flag) {
                showToast({
                    title: '复制成功'
                });
                callback(success);
                callback(complete);
                resolve();
            } else {
                showToast({
                    title: '复制失败'
                });
                callback(fail);
                callback(complete);
                reject();
            }
        });
    });
}

export function getClipboardData(options = {}) {
    const {success, fail, complete} = options;
    const res = {
        data: clipboard.getData()
    };
    callback(success, res);
    callback(complete, res);
    return Promise.resolve(res);
}

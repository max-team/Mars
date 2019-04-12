/**
 * @file export request api
 * @author huxiaohui02
 */
import 'whatwg-fetch';
import {callback} from '../../lib/utils';

function serializeParams(params) {
    if (!params) {
        return '';
    }
    return Object.keys(params).map(key => (`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)).join('&');
}

function generateRequestUrlWithParams(url, params) {
    params = typeof params === 'string' ? params : serializeParams(params);
    if (params) {
        url += (~url.indexOf('?') ? '&' : '?') + params;
    }
    url = url.replace('?&', '?');
    return url;
}

export default function request(options) {
    options = options || {};
    if (typeof options === 'string') {
        options = {
            url: options
        };
    }
    const {success, complete, fail} = options;
    let url = options.url;
    const params = {};
    const res = {};
    params.method = options.method || 'GET';
    const methodUpper = params.method.toUpperCase();
    params.cache = options.cache || 'default';
    // data处理参见小程序文档 request - data数据说明
    if (methodUpper === 'GET' || methodUpper === 'HEAD') {
        url = generateRequestUrlWithParams(url, options.data);
    }
    else if (options.data) {
        let contentType = options.header && (options.header['Content-Type'] || options.header['content-type']);
        if (contentType && contentType.indexOf('application/json') >= 0) {
            params.body = JSON.stringify(options.data);
        }
        else if (contentType && contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
            params.body = serializeParams(options.data);
        }
        else {
            params.body = options.data;
        }
    }
    if (options.header) {
        params.headers = options.header;
    }
    if (options.mode) {
        params.mode = options.mode;
    }
    params.credentials = options.credentials || 'include';
    return fetch(url, params)
    .then(response => {
        res.statusCode = response.status;
        res.header = {};
        response.headers.forEach((val, key) => {
            res.header[key] = val;
        });
        if (options.responseType === 'arraybuffer') {
            return response.arrayBuffer();
        }
        if (options.dataType === 'json' || typeof options.dataType === 'undefined') {
            return response.json();
        }
        if (options.responseType === 'text') {
            return response.text();
        }
        return Promise.resolve(null);
    })
    .then(data => {
        res.data = data;
        callback(success, res);
        callback(complete, res);
        return res;
    })
    .catch(err => {
        if (!res.data) {
            callback(fail, err);
            callback(complete, res);
            return Promise.reject(err);
        }
        throw err;
    });
}
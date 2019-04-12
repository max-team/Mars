/**
 * @file export navigate api
 */

import {callback} from '../../lib/utils';

/**
 * 创建seo meta 信息
 * @param {string} type meta类别：keywords|description
 * @param {string} content 内容
 */
function createMeta(type, content) {
    let meta = document.querySelector(`meta[name="${type}"]`);
    if (meta) {
        meta.setAttribute('content', content);
    }
    else {
        meta = document.createElement('meta');
        meta.setAttribute('name', type);
        meta.content = content;
        document.querySelector('head').appendChild(meta);
    }
}

/**
 * 设置页面 seo 信息
 * @param {Object} options 页面信息
 * @param {string} options.title 页面标题
 * @param {Function} options.keywords 页面关键字
 * @param {Function} options.description 页面描述信息
 * @param {Function} options.success 接口调用成功的回调函数
 * @param {Function} options.fail 接口调用失败的回调函数
 * @param {Function} options.complete 接口调用结束的回调函数（调用成功、失败都会执行）
 */
function setPageInfo(options) {
    let {
        title,
        keywords,
        description,
        success,
        fail,
        complete
    } = options;

    if (!title || !keywords || !description) {
        let errMsg = `lack of ${!title ? 'title' : !keywords ? 'keywords' : 'description'}`;
        callback(fail, errMsg);
        callback(complete, errMsg);
        return;
    }

    document.title = title;
    createMeta('keywords', keywords);
    createMeta('description', description);
    callback(success, 'setPageInfo success');
    callback(complete, 'setPageInfo success');
}

/**
 * 设置页面 seo description
 * @param {Object} options 页面信息
 * @param {Function} options.content 页面描述信息
 * @param {Function} options.success 接口调用成功的回调函数
 * @param {Function} options.fail 接口调用失败的回调函数
 * @param {Function} options.complete 接口调用结束的回调函数（调用成功、失败都会执行）
 */
function setMetaDescription(options) {
    let {
        content,
        success,
        fail,
        complete
    } = options;
    if (!content) {
        let errMsg = 'lack of description content';
        callback(fail, errMsg);
        callback(complete, errMsg);
        return;
    }
    createMeta('description', content);
    callback(success, 'setMetaDescription success');
    callback(complete, 'setMetaDescription success');
}

/**
 * 设置页面 seo keywords
 * @param {Object} options 页面信息
 * @param {Function} options.content 页面关键词信息
 * @param {Function} options.success 接口调用成功的回调函数
 * @param {Function} options.fail 接口调用失败的回调函数
 * @param {Function} options.complete 接口调用结束的回调函数（调用成功、失败都会执行）
 */
function setMetaKeywords(options) {
    let {
        content,
        success,
        fail,
        complete
    } = options;
    if (!content) {
        let errMsg = 'lack of keywords content';
        callback(fail, errMsg);
        callback(complete, errMsg);
        return;
    }
    createMeta('keywords', content);
    callback(success, 'setMetaKeywords success');
    callback(complete, 'setMetaKeywords success');
}

/**
 * 设置页面 title
 * @param {Object} options 页面信息
 * @param {Function} options.title 页面title
 * @param {Function} options.success 接口调用成功的回调函数
 * @param {Function} options.fail 接口调用失败的回调函数
 * @param {Function} options.complete 接口调用结束的回调函数（调用成功、失败都会执行）
 */
function setDocumentTitle(options) {
    let {
        title,
        success,
        fail,
        complete
    } = options;
    if (!title) {
        let errMsg = 'lack of title';
        callback(fail, errMsg);
        callback(complete, errMsg);
        return;
    }
    document.title = title;
    callback(success, 'setDocumentTitle success');
    callback(complete, 'setDocumentTitle success');
}

/* eslint-disable fecs-export-on-declare */
export {
    setPageInfo,
    setMetaDescription,
    setMetaKeywords,
    setDocumentTitle
};

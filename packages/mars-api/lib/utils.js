/**
 * @file utils
 * @author  zhaolongfei(izhaolongfei@gmail.com)、huxiaohui02
 */

/**
 * 动态加载js
 *
 * @param {string} url 预加载URL
 * @return {Promise} Promise 对象
 */
function loadScript(url) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.type = 'text/javascript';

        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    resolve();
                }
            };
        }
        else {
            script.onload = function () {
                resolve();
            };
        }

        script.onerror = function (e) {
            reject(e);
        };

        script.src = url;
        document.body.appendChild(script);
    });
}

/**
 * 判断变量是否为对象
 *
 * @param {Object} target 判断目标
 * @return {Object} object 变量是否为对象
 */
function shouleBeObject(target) {
    if (target && target instanceof Object) {
        return {res: true};
    }
    return {
        res: false,
        msg: getParameterError({
            correct: 'Object',
            wrong: target
        })
    };
}

/**
 * 格式化返回错误信息
 *
 * @param {string} name 说明
 * @param {string} para 错误类型字段名
 * @param {string} correct 正确类型
 * @param {string} wrong 错误类型字段内容
 * @return {string} string 错误信息
 */
function getParameterError({name = '', para, correct, wrong}) {
    const parameter = para ? `parameter.${para}` : 'parameter';
    const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong);
    return `${name}:fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`;
}

/**
 * 转化大写
 *
 * @param {string} string 转换字符串
 * @return {string} string 转换字符串
 */
function upperCaseFirstLetter(string) {
    if (typeof string !== 'string') {
        return string;
    }
    string = string.replace(/^./, match => match.toUpperCase());
    return string;
}

/**
 * 执行回调
 *
 * @param {Function} fn 回调函数
 * @param {Object} data 参数
 */
function callback(fn, data) {
    typeof fn === 'function' && fn(data);
}

function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

function isIOS() {
    return /iPhone|iPad/.test(navigator.userAgent);
}

/* eslint-disable fecs-export-on-declare */
export {
    loadScript,
    callback,
    shouleBeObject,
    getParameterError,
    isAndroid,
    isIOS
};

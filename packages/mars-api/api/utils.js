/**
 * @file utils
 * @author huxiaohui02
 */

/**
 * 判断变量是否为对象
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
 * @param {Object} args args
 * @param {string} args.name 说明
 * @param {string} args.parameter 错误类型字段名
 * @param {string} args.correct 正确类型
 * @param {string} args.wrong 错误类型字段内容
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

/* eslint-disable fecs-export-on-declare */
export {
    callback,
    shouleBeObject,
    getParameterError
};

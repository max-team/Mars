/**
 * @file swan build
 * @author zhangwentao <winty2013@gmail.com>
 */

module.exports = function dirEvents(param, val, attrs) {
    // const val =
    // 小程序能力所致，bind 和 catch 事件同时绑定时候，只会触发 bind ,catch 不会被触发。
    // .stop 的使用会阻止冒泡，但是同时绑定了一个非冒泡事件，会导致该元素上的 catchEventName 失效！
    // .prevent 可以直接干掉，因为小程序里没有什么默认事件，比如submit并不会跳转页面
    // .capture 不能做，因为小程序没有捕获类型的事件
    // .self 没有可以判断的标识
    // .once 也不能做，因为小程序没有 removeEventListener, 虽然可以直接在 handleProxy 中处理，但非常的不优雅，违背了原意，暂不考虑
    const name = param.replace(/\.prevent/i, '');
    let [eventName, ...eventNameMap] = name.split('.');
    let eventNameKey = (eventNameMap.includes('stop') ? 'catch' : 'bind') + eventName;
    attrs[eventNameKey] = 'handleProxy';
    // 支持函数调用带参数
    // if (val.indexOf('(') > -1) {
    //     const matches = val.match(/([^(]+)\(([^)]+)\)/);
    //     if (matches) {
    //         val = matches[1].trim();
    //         let args = matches[2];
    //         // mark $event to special string
    //         args = args.split(',').map(a => {
    //             a = a.trim();
    //             return a === '$event' ? '\'_$event_\'' : a;
    //         });
    //         args = `[ ${args.join(',')} ]`;

    //         attrs[`data${eventName}ArgumentsProxy`.toLowerCase()] = `{{ ${args} }}`;
    //     }
    // }

    attrs[`data-${eventName}EventProxy`.toLowerCase()] = val;
    // return attrs;
};

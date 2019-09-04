/**
 * @file 注册service worker
 * @author mars
 */

function register(file) {
    // ，service worker脚本文件为sw.js
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(`${process.env.BASE_URL}${file}`).then(function () {
            console.log('Service Worker 注册成功');
        });
    }
}
/* eslint-disable fecs-export-on-declare */
export default register;


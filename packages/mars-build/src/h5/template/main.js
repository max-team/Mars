/**
 * @file main
 * @author mars
 */

/* globals Vue */

import App from './App.vue';
import router from './router.js';
import initGlobalApi from './globalApi';
import './mars-base.css'; // 引入公共样式
Vue.config.productionTip = false;

let marsAppData = {};
window.getApp = function () {
    return marsAppData;
};
Vue.prototype.currentRoute = [];

Vue.prototype.$mpUpdated = function (fn) {
    return this.$nextTick(fn);
};

window.getCurrentPages = function () {
    return Vue.prototype.currentRoute;
};
const vm = new Vue({
    router,
    data: {
        pageTitleMap: {}
    },
    render: h => h(App)
}).$mount('#app');

// 初始化 $api
initGlobalApi(Vue, vm);

// 将初始化后的$api赋值给getApp
marsAppData['$api'] = vm.$api;

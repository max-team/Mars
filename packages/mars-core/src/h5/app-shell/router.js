/**
 * @file router
 * @author mars
 */

// import {} from 'vue';
import {config as appConfig, Vue} from '../index';
import VueRouter from 'vue-router';
import browserHistory from './browserHistory';
import {routes, mode} from './export';
Vue.use(VueRouter);

const {router: routerConfig = {}} = appConfig;
const {base, mode: runtimeMode} = routerConfig;

routes.push({
    path: '*',
    redirect: routes[0].path
});

const router = new VueRouter({
    mode: runtimeMode || mode || 'history',
    base: base || '/',
    routes
});

function guid() {
    return Math.random().toString(36).substr(2, 12);
}

Vue.prototype.isBack = false;
Vue.prototype.fromRouterPosY = 0;
router.beforeEach(function (to, from, next) {
    if (!to.query._) {
        to.query._ = guid();
    }

    let toPath = decodeURI(to.fullPath); // 兼容 vue-router 浏览器前进/返回时的 decodeURI操作
    let fromPath = decodeURI(from.fullPath);
    const browserHistoryArr = browserHistory.list;
    const browserHistoryArrLength = browserHistoryArr.length;
    const isBack = browserHistoryArrLength > 1
        && browserHistoryArr[browserHistoryArrLength - 1].path === fromPath
        && browserHistoryArr[browserHistoryArrLength - 2].path === toPath;
    Vue.prototype.isBack = isBack;
    if (!isBack) {
        const query = to.query;
        if (query._) {
            delete query._;
        }
    }

    toPath = decodeURI(to.fullPath);
    fromPath = decodeURI(from.fullPath);
    // 记录浏览历史
    const browserHistoryLength = browserHistory.length;
    let browserHistoryIndex = -1;
    for (let i = browserHistoryLength; i >= 0; i--) {
        if (browserHistoryArr[i] && browserHistoryArr[i].path === toPath) {
            browserHistoryIndex = i;
        }

    }

    for (let i = browserHistoryLength; i >= 0; i--) {
        if (browserHistoryArr[i] && browserHistoryArr[i].path === fromPath) {
            browserHistoryArr[i].pos = window.pageYOffset;
        }

    }

    if (browserHistoryLength > 1
        && browserHistoryIndex <= browserHistoryLength - 2 && browserHistoryIndex >= 0
    ) {
        browserHistoryArr.splice(
            browserHistoryIndex + 1,
            browserHistoryLength - browserHistoryIndex - 1
        );
    }
    else {
        // 进入无网络页后返回前一页面 会使得前一页面再次被push进browserHistoryArr, 需要避免这次重复push
        if (browserHistory.length === 0
            || -1 === browserHistoryIndex
            || browserHistoryIndex !== browserHistoryLength - 1) {
            browserHistoryArr.push({
                path: toPath,
                route: to.path.replace(/^\//, ''),
                uri: to.path.replace(/^\//, ''),
                options: to.query
            });
        }
    }
    // // 没有from.name 且 browserHistory.length !== 0，表示从畅听跳转到其他页面又跳转回畅听
    // else {
    //     browserHistoryArr = [];
    //     browserHistoryArr.push({path: to.fullPath});
    // }
    Vue.prototype.currentRoute = browserHistoryArr;
    browserHistory.set(browserHistoryArr);
    router.app.$nextTick(() => {
        const browserHistoryArr = browserHistory.list;
        const browserHistoryLength = browserHistory.length;
        const browserHistoryLast = browserHistoryArr[browserHistoryLength - 1];
        if (toPath === browserHistoryLast.path
            && browserHistoryLast.pos) {
            Vue.prototype.fromRouterPosY = browserHistoryLast.pos;
        }
        else {
            Vue.prototype.fromRouterPosY = 0;
        }
    });
    next();
});
export default router;

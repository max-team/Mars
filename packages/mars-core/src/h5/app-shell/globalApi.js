/**
 * @file global api
 * @author mars
 */

import {Mars, directives} from './export';

/**
 * 判断变量是否为对象
 *
 * @param {Object} target 判断目标
 * @return {Object} object 变量是否为对象
 */
function shouleBeObject(target) {
    return target && typeof target === 'object'
    ? {
        res: true
    }
    : {
        res: false
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
    const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : wrong);
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


function sendTypeErrorMsg(res, apiName, paramName, paramType, rightType, fail, complete) {
    res.errMsg = getParameterError({
        name: apiName,
        para: paramName,
        correct: rightType,
        wrong: paramType
    });
    console.error(res.errMsg);
    typeof fail === 'function' && fail(res);
    typeof complete === 'function' && complete(res);
}

/**
 * 判断是否是object，并发送信息
 *
 * @param {Object} opt 判断对象
 * @param {string} apiName 方法参数名
 */
function judgeOptionType(opt, apiName) {
    const res = shouleBeObject(opt);
    if (!res.res) {
        console.error(getParameterError({
            name: apiName,
            para: null,
            correct: 'Object',
            wrong: typeof opt
        }));
    }
}

/**
 * 平滑滚动
 *
 * @param {node} el 需要滚动的容器dom
 * @param {number} top 滚动的scrollTop值
 * @param {number} duration 滚动时长
 * @param {Function} success 成功回调
 * @param {Function} complete 完成回调
 */
function animateScroll(el, top, duration, success, complete) {
    let requestId = null;
    let currentTop = el.pageYOffset;
    if (currentTop === top) {
        return;
    }
    const stepCount = duration / 16;
    const Type = currentTop > top ? 'UP' : 'DOWN';
    const stepDistance = Type === 'UP'
        ? (currentTop - top) / stepCount
        : (top - currentTop) / stepCount;
    // 采用requestAnimationFrame，平滑动画
    function step() {
        if (Type === 'UP') {
            currentTop -= stepDistance;
            window.scrollTo(0, currentTop);
            if (currentTop > top) {
                el.scrollTop = currentTop;
                requestId = window.requestAnimationFrame(step);
            }
            else {
                // el.scrollTop = top;
                window.scrollTo(0, top);
                window.cancelAnimationFrame(requestId);
                typeof success === 'function' && success();
                typeof complete === 'function' && complete();
            }
        }
        else if (Type === 'DOWN') {
            currentTop += stepDistance;
            if (currentTop < top) {
                window.scrollTo(0, currentTop);
                requestId = window.requestAnimationFrame(step);
            }
            else {
                // el.scrollTop = top;
                window.scrollTo(0, top);
                window.cancelAnimationFrame(requestId);
                typeof success === 'function' && success();
                typeof complete === 'function' && complete();
            }
        }
    }
    window.requestAnimationFrame(step);
}

function initDirectives(Vue, directives = {}) {
    Object.keys(directives).forEach(key => {
        Vue.directive(key, directives[key]);
    });
}

function initGlobalApi(Vue, vm) {
    /* globals directives */
    initDirectives(Vue, directives);
    const marsAppInstance = vm.$root.$children[0];
    /* globals Mars */
    Vue.prototype.$api = Object.assign(Mars, {
        '$router': vm.$router,
        stopPullDownRefresh: marsAppInstance.$refs.refresherHandler.stopPullDownRefresh,
        setNavigationBarTitle: opt => {
            judgeOptionType(opt, 'setNavigationBarTitle');
            const {title, success, fail, complete} = opt;
            let resInfo = {errMsg: 'setNavigationBarTitle:ok'};
            if (title && typeof title !== 'string' || title === undefined) {
                return sendTypeErrorMsg(
                    resInfo, 'setNavigationBarTitle', 'title',
                    typeof title, 'string', fail, complete);
            }
            marsAppInstance.currentTitle = opt.title;
            typeof success === 'function' && success(resInfo);
            typeof complete === 'function' && complete(resInfo);

        },
        setNavigationBarColor: opt => {
            judgeOptionType(opt, 'setNavigationBarColor');
            const {frontColor, backgroundColor, animation, success, fail, complete} = opt;
            let resInfo = {errMsg: 'setNavigationBarColor:ok'};
            if (frontColor !== '#ffffff' && frontColor !== '#000000') {
                return sendTypeErrorMsg(
                    resInfo, 'setNavigationBarColor', 'frontColor',
                    frontColor, '#000000|#ffffff', fail, complete);
            }
            if (backgroundColor && typeof backgroundColor !== 'string' || backgroundColor === undefined) {
                return sendTypeErrorMsg(
                    resInfo, 'setNavigationBarColor', 'backgroundColor',
                    typeof backgroundColor, 'string', fail, complete);
            }
            let transitionDuration = 0;
            let transitionTimingFunc = 'linear';
            if (animation) {
                const animationRes = shouleBeObject(animation);
                if (!animationRes.res) {
                    return sendTypeErrorMsg(
                        resInfo, 'setNavigationBarColor', 'animation',
                        typeof animation, 'object', fail, complete);
                }
                const {
                    duration,
                    timingFunc
                } = animation;
                if (duration && typeof duration !== 'number') {
                    return sendTypeErrorMsg(
                        resInfo, 'setNavigationBarColor', 'animation.duration',
                        typeof duration, 'number', fail, complete);
                }
                transitionDuration = duration;
                if (['linear', 'easeIn', 'easeOut', 'easeInOut'].indexOf(timingFunc) === -1) {
                    return sendTypeErrorMsg(
                        resInfo, 'setNavigationBarColor', 'animation.timingFunc', timingFunc,
                        'linear|easeIn|easeOut|easeInOut', fail, complete);
                }
                transitionTimingFunc = timingFunc;
            }

            marsAppInstance.currentNavigationBarTextStyle = frontColor;
            marsAppInstance.currentNavigationBarBackgroundColor = backgroundColor;
            marsAppInstance.transitionDuration = transitionDuration
                && (transitionDuration / 1000 + 's')
                || 0;
            marsAppInstance.transitionTimingFunc = transitionTimingFunc;
            typeof success === 'function' && success(resInfo);
            typeof complete === 'function' && complete(resInfo);
        },
        setTabBarBadge: opt => {
            judgeOptionType(opt, 'setTabBarBadge');
            let {index, text, success, fail, complete} = opt;
            let resInfo = {errMsg: 'setTabBarBadge:ok'};
            if (index && typeof index !== 'number') {
                return sendTypeErrorMsg(
                    resInfo, 'setTabBarBadge', 'index',
                    typeof index, 'number', fail, complete);
            }
            if (text && typeof text !== 'string') {
                return sendTypeErrorMsg(
                    resInfo, 'setTabBarBadge', 'text',
                    typeof text, 'string', fail, complete);
            }
            text.length > 4 && (text = text.substring(0, 4) + '...');
            marsAppInstance.tabList[index] && (marsAppInstance.tabList[index].badge = text);
            typeof success === 'function' && success(resInfo);
            typeof complete === 'function' && complete(resInfo);
        },
        removeTabBarBadge: opt => {
            judgeOptionType(opt, 'removeTabBarBadge');
            let {index, success, fail, complete} = opt;
            let resInfo = {errMsg: 'removeTabBarBadge:ok'};
            if (index && typeof index !== 'number') {
                return sendTypeErrorMsg(
                    resInfo, 'removeTabBarBadge', 'index',
                    typeof index, 'number', fail, complete);
            }
            marsAppInstance.tabList[index] && (marsAppInstance.tabList[index].badge = '');
            typeof success === 'function' && success(resInfo);
            typeof complete === 'function' && complete(resInfo);
        },
        showTabBarRedDot: opt => {
            judgeOptionType(opt, 'showTabBarRedDot');
            let {index, success, fail, complete} = opt;
            let resInfo = {errMsg: 'showTabBarRedDot:ok'};
            if (index && typeof index !== 'number') {
                return sendTypeErrorMsg(
                    resInfo, 'showTabBarRedDot', 'index',
                    typeof index, 'number', fail, complete);
            }
            marsAppInstance.tabList[index] && (marsAppInstance.tabList[index].showRedDot = true);
            typeof success === 'function' && success(resInfo);
            typeof complete === 'function' && complete(resInfo);
        },
        hideTabBarRedDot: opt => {
            judgeOptionType(opt, 'hideTabBarRedDot');
            let {index, success, fail, complete} = opt;
            let resInfo = {errMsg: 'hideTabBarRedDot:ok'};
            if (index && typeof index !== 'number') {
                return sendTypeErrorMsg(
                    resInfo, 'hideTabBarRedDot', 'index',
                    typeof index, 'number', fail, complete);
            }
            marsAppInstance.tabList[index] && (marsAppInstance.tabList[index].showRedDot = false);
            typeof success === 'function' && success(resInfo);
            typeof complete === 'function' && complete(resInfo);
        },
        setTabBarStyle: opt => {
            judgeOptionType(opt, 'setTabBarStyle');
            const {color, selectedColor, backgroundColor, borderStyle, success, fail, complete} = opt;
            let resInfo = {errMsg: 'setTabBarStyle:ok'};
            if (color && typeof color !== 'string') {
                return sendTypeErrorMsg(
                    resInfo, 'setTabBarStyle', 'color',
                    typeof color, 'string', fail, complete);
            }
            if (selectedColor && typeof selectedColor !== 'string') {
                return sendTypeErrorMsg(
                    resInfo, 'setTabBarStyle', 'selectedColor',
                    typeof selectedColor, 'string', fail, complete);
            }
            if (backgroundColor && typeof backgroundColor !== 'string') {
                return sendTypeErrorMsg(
                    resInfo, 'setTabBarStyle', 'backgroundColor',
                    typeof backgroundColor, 'string', fail, complete);
            }
            if (borderStyle && (borderStyle !== 'white' && borderStyle !== 'black')) {
                return sendTypeErrorMsg(
                    resInfo, 'setTabBarStyle', 'borderStyle',
                    borderStyle, 'black|white', fail, complete);
            }
            marsAppInstance.tabBarSelectedColor = selectedColor;
            marsAppInstance.tabBarColor = color;
            marsAppInstance.tabBarBackgroundColor = backgroundColor;
            marsAppInstance.tabBarBorderStyle = borderStyle;
            typeof success === 'function' && success(resInfo);
            typeof complete === 'function' && complete(resInfo);
        },
        setTabBarItem: opt => {
            judgeOptionType(opt, 'setTabBarItem');
            const {index, text, iconPath, selectedIconPath, success, fail, complete} = opt;
            let resInfo = {errMsg: 'setTabBarItem:ok'};
            if (index && typeof index !== 'number') {
                return sendTypeErrorMsg(
                    resInfo, 'setTabBarItem', 'index',
                    typeof index, 'number', fail, complete);
            }
            if (text && typeof text !== 'string') {
                return sendTypeErrorMsg(
                    resInfo, 'setTabBarItem', 'text',
                    typeof text, 'string', fail, complete);
            }
            if (iconPath && typeof iconPath !== 'string') {
                return sendTypeErrorMsg(
                    resInfo, 'setTabBarItem', 'iconPath',
                    typeof iconPath, 'string', fail, complete);
            }
            if (selectedIconPath && typeof selectedIconPath !== 'string') {
                return sendTypeErrorMsg(
                    resInfo, 'setTabBarItem', 'selectedIconPath',
                    typeof selectedIconPath, 'string', fail, complete);
            }
            marsAppInstance.tabList[index] && (marsAppInstance.tabList[index].text = text);
            marsAppInstance.tabList[index]
                && iconPath
                && (marsAppInstance.tabList[index].iconPath = iconPath);
            marsAppInstance.tabList[index]
                && selectedIconPath
                && (marsAppInstance.tabList[index].selectedIconPath = selectedIconPath);
            typeof success === 'function' && success(resInfo);
            typeof complete === 'function' && complete(resInfo);
        },
        showTabBar: opt => {
            judgeOptionType(opt, 'showTabBar');
            const {animation, success, fail, complete} = opt;
            let resInfo = {errMsg: 'showTabBar:ok'};
            if (animation && typeof animation !== 'boolean') {
                return sendTypeErrorMsg(
                    resInfo, 'showTabBar', 'animation',
                    typeof animation, 'boolean', fail, complete);
            }
            marsAppInstance.customShowTabBar = true;
            typeof success === 'function' && success(resInfo);
            typeof complete === 'function' && complete(resInfo);
        },
        hideTabBar: opt => {
            judgeOptionType(opt, 'hideTabBar');
            const {animation, success, fail, complete} = opt;
            let resInfo = {errMsg: 'hideTabBa:ok'};
            if (animation && typeof animation !== 'boolean') {
                return sendTypeErrorMsg(
                    resInfo, 'hideTabBar', 'animation',
                    typeof animation, 'boolean', fail, complete);
            }
            marsAppInstance.customShowTabBar = false;
            typeof success === 'function' && success(resInfo);
            typeof complete === 'function' && complete(resInfo);
        },
        pageScrollTo: opt => {
            judgeOptionType(opt, 'pageScrollTo');
            const {scrollTop, duration, success, fail, complete} = opt;
            let resInfo = {errMsg: 'pageScrollTo:ok'};
            if (scrollTop && typeof scrollTop !== 'number') {
                return sendTypeErrorMsg(
                    resInfo, 'pageScrollTo', 'scrollTop',
                    typeof scrollTop, 'number', fail, complete);
            }
            if (duration && typeof duration !== 'number') {
                return sendTypeErrorMsg(
                    resInfo, 'pageScrollTo', 'duration',
                    typeof duration, 'number', fail, complete);
            }
            const scrollContainer = window;
            animateScroll(scrollContainer, scrollTop, duration, success, complete);
        }
    });
}

/* eslint-disable fecs-export-on-declare */
export default initGlobalApi;
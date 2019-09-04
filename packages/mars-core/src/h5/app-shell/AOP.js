/**
 * @file AOP 事件注册
 * @author mars
 */

// MAP: AOP 注册的生命周期方法的映射
const AOP_MAP = {
    App: {
        onLaunch: 'marsAppAfterCreated',
        onShow: 'marsAppAfterMounted',
        onHide: 'marsAppAfterDestroyed'
    },
    Page: {
        onLoad: 'marsPageAfterCreated',
        onReady: 'marsPageAfterMounted',
        onUnload: 'marsPageAfterDestroyed',
        onShow: 'marsPageAfterActivated',
        onHide: 'marsPageAfterDeactivated'
    }
};
const PageAOPEvents = {
    onLoad: [],
    onReady: [],
    onUnload: [],
    onShow: [],
    onHide: []
};

const AppAOPEvents = {
    onLaunch: [],
    onShow: [],
    onHide: []
};

function collectAOPEvents(events, type = 'Page') {
    if (!events) {
        return;
    }
    let eventsCollect = type === 'Page'
        ? PageAOPEvents
        : AppAOPEvents;
    Object.keys(events).forEach(key => {
        if (!eventsCollect[key]) {
            return;
        }
        eventsCollect[key].push(events[key]);
    });
}

window.App = {
    after(option) {
        option.methods && collectAOPEvents(option.methods, 'App');
    }
};
window.Page = {
    after(option) {
        option.methods && collectAOPEvents(option.methods, 'Page');
    }
};

function initAOPEvents(vm = null) {
    if (vm) {
        function bindAOPEvents(type = 'Page') {
            const eventsCollect = type === 'Page'
                ? PageAOPEvents
                : AppAOPEvents;
            Object.keys(eventsCollect).forEach(key => {
                if (eventsCollect[key].length === 0) {
                    return;
                }
                eventsCollect[key].forEach(event => {
                    vm.$on(AOP_MAP[type][key], event);
                });
            });
        }
        bindAOPEvents('Page');
        bindAOPEvents('App');
    }
}

/* eslint-disable fecs-export-on-declare */
export default initAOPEvents;


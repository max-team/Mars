/**
 * @file vue script transform plugin: 处理hook
 * @author zhangjingyuan02
 */

/* eslint-disable fecs-camelcase */

/* eslint-disable babel/new-cap */
// 小程序page生命周期
const PAGE_LIFECYCLE_HOOKS = {
    onLoad: true,
    onReady: true,
    onShow: true,
    onHide: true,
    onUnload: true,
    onForceRelaunch: true,
    onLaunch: true,
    onShareAppMessage: true
    // onPullDownRefresh: true,
    // onReachBottom: true,
    // onPageScroll: true,
    // onTabItemTap: true,

};

const PAGE_LIFE_MAP_VUE = {
    onLoad: 'created',
    onReady: 'mounted',
    onUnload: 'destroyed',
    onShow: 'activated',
    onHide: 'deactivated'
};

// 小程序component生命周期
const COMP_LIFECYCLE_HOOKS = {
    pageLifetimes: true,
    lifetimes: true
};

const COMP_LIFE_MAP_VUE = {
    created: {
        life: 'created',
        type: 'lifetimes'
    },
    attached: {
        life: 'beforeMount',
        type: 'lifetimes'
    },
    ready: {
        life: 'mounted',
        type: 'lifetimes'
    },
    detached: {
        life: 'destroyed',
        type: 'lifetimes'
    },
    show: {
        life: 'activated',
        type: 'pageLifetimes'
    },
    hide: {
        life: 'deactivated',
        type: 'pageLifetimes'
    }
};
const APP_PAOGE_LIFE_MAP_VUE = {
    onLaunch: 'created',
    onShow: 'mounted',
    onHide: 'destroyed'
    // onLoad: true,
    // onReady: true,
    // onUnload: true
};

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

function getPlainObjectNodeValue(node, path, t) {
    let result;
    if (t.isObjectExpression(node)) {
        result = {};

        let props = node.properties || [];
        for (let i = 0, len = props.length; i < len; i++) {
            let subNode = props[i];
            let keyNode = subNode.key;
            let key;
            if (t.isLiteral(keyNode)) {
                key = keyNode.value;
            }
            else if (t.isIdentifier(keyNode)) {
                key = keyNode.name;
            }

            if (!key) {
                continue;
            }

            result[key] = getPlainObjectNodeValue(subNode.value, path, t);
        }
    }
    else if (t.isArrayExpression(node)) {
        result = [];
        node.elements.forEach(item => {
            result.push(getPlainObjectNodeValue(item, path, t));
        });
    }
    else if (t.isLiteral(node)) {
        result = node.value;
    }
    else {
        throw path.buildCodeFrameError('only constant is supported');
    }
    return result;
}

const {hyphenate} = require('../../../helper/util');
/* eslint-disable */
const Property = (t, options) => {
    return {
        Property(path, state) {
            if (PAGE_LIFECYCLE_HOOKS[path.node.key.name]) {
                path.remove();
                return;
            }
            if (!(
                t.isIdentifier(path.node.key, {
                    name: 'config'
                })
                || t.isIdentifier(path.node.key, {
                    name: 'components'
                })
                || COMP_LIFECYCLE_HOOKS[path.node.key.name]
                )) {
                return;
            }

            if (path.node.key.name === 'config' && !options.mpConfig) {
                const configValue = getPlainObjectNodeValue(path.node.value, path, t) || {};
                options.baseOptions && (options.baseOptions.config = configValue);
                path.remove();
            }
            else if (path.node.key.name === 'components') {
                if (t.isObjectExpression(path.node.value)) {
                    // copy properties
                    let props = JSON.parse(JSON.stringify(path.node.value.properties));
                    props.forEach(p => {
                        if (t.isIdentifier(p.value)) {
                            let keyName = t.isLiteral(p.key) ? p.key.value : p.key.name;
                            keyName = hyphenate(keyName);
                            p.key = t.stringLiteral(keyName);

                            const bindPath = path.scope.bindings[p.value.name].path;
                            const bindParentNode = bindPath.parent;
                            const bindVaule = bindParentNode.source;
                            bindParentNode.source = t.stringLiteral(bindVaule.value.replace(/\.vue$/, '') + '.vue');
                            p.value = bindParentNode.source;
                        }
                    });

                    path.node.value.properties.push();
                    const valObj = getPlainObjectNodeValue(t.objectExpression(props), path, t);
                    options.baseOptions && (options.baseOptions.components = valObj);
                }
            }
            else if (COMP_LIFECYCLE_HOOKS[path.node.key.name]) {
                path.remove();
            }

        },
        ObjectMethod(path, state) {
            if (PAGE_LIFECYCLE_HOOKS[path.node.key.name]) {
                path.remove();
            }

        }
    };
};

/* eslint-enable */

/**
 * 判断当前vue sfc 是否是component
 * @param {Object} properties node ast
 * @return {boolean} true | false
 */
function judgeComponent(properties) {
    return properties.some(property => {
        return property.type === 'ObjectProperty'
        && property.key.name === 'config'
        && (function () {
            const value = property.value.properties;
            return value.some(item => {
                return item.key.name === 'component' && item.value.value;
            });
        })();
    });
}

/**
 * Map SWAN Life Time  映射小程序生命周期到vue hook
 * @param {Object} lifeItem 生命周期 node ast
 * @param {Object} t ast plugin param
 * @param {string} key 小程序原生生命周期
 * @param {boolean} isApp 是否是app.vue
 * @return {Object} 处理的lifeItem
 */
function bindAOPEvents(lifeItem, t, key, isApp) {
    const lifeTime = isApp ? APP_PAOGE_LIFE_MAP_VUE[key] : PAGE_LIFE_MAP_VUE[key];
    if (!lifeTime) {
        // 非该页面生命周期则返回
        return;
    }
    // 在生命周期内调用相应AOP事件
    const AOPEventHookExpression = t.expressionStatement(
        t.callExpression(
            t.memberExpression(
                t.memberExpression(
                    t.thisExpression(),
                    t.identifier('$root')
                ),
                t.identifier('$emit')
            ),
            [t.stringLiteral(isApp ? AOP_MAP['App'][key] : AOP_MAP['Page'][key]), t.thisExpression()]
        )
    );
    if (!lifeItem) {
        lifeItem = t.objectMethod(
            'method',
            t.identifier(key),
            [],
            t.blockStatement([
                AOPEventHookExpression
            ])
        );
    }
    else {
        // 获取 lifeItem 不同type下的body
        let lifeItemBody = null;
        lifeItemBody = lifeItem.type === 'ObjectMethod'
        ? lifeItem.body.body
        : lifeItem.type === 'ObjectProperty'
            ? lifeItem.value.body.body
            : null;
        lifeItemBody && lifeItemBody.push(AOPEventHookExpression);
    }
    return lifeItem;
}

/**
 * Map SWAN Life Time  映射小程序生命周期到vue hook
 * @param {Object} properties node ast
 * @param {Object} t ast plugin param
 * @param {string} lifeKey 小程序原有生命周期hook
 * @param {Object} lifeItem 小程序原有生命周期hook ast node
 * @param {string} lifeMapKey 映射的 vue 周期hook
 * @param {Object} options plugin option
 */
function mapSwanLifeTime(properties, t, lifeKey, lifeItem, lifeMapKey, options) {
    if (!lifeItem) {
        return;
    }
    const type = lifeItem.type;
    // 获取 time 函数体
    const timeMethodBlock = type === 'ObjectMethod'
        ? lifeItem.body
        : type === 'ObjectProperty'
            ? lifeItem.value.body
            : null;
    // 获取 time 函数 参数名
    const timeMethodParamName = type === 'ObjectMethod'
        ? lifeItem.params[0] && lifeItem.params[0].name || 'option'
        : type === 'ObjectProperty'
            ? lifeItem.value.params[0] && lifeItem.value.params[0].name || 'option'
            : 'option';
    // 生成匿名函数调用
    const anonymousFuncExpression = t.expressionStatement(
        t.callExpression(
            t.memberExpression(
                t.functionExpression(
                    null,
                    [t.identifier(timeMethodParamName)],
                    timeMethodBlock
                ),
                t.identifier('call')
            ),
            [t.identifier('this'), t.identifier('this.$route.query')]
        )
    );

    // onReady 在mounted中实现，执行晚于onShow
    const lifeHookExpression = lifeKey !== 'onReady'
        ? anonymousFuncExpression
        : t.expressionStatement(
            t.callExpression(
                t.memberExpression(
                    t.thisExpression(),
                    t.identifier('$nextTick'),
                ),
                [t.arrowFunctionExpression(
                    [],
                    t.blockStatement(
                        [anonymousFuncExpression]
                    )
                )]
            )
        );
    let originLifeItem = properties.find(item => item.key.name === lifeMapKey);
    if (originLifeItem) {
        // 获取 originLifeItem 不同type下的body
        let originLifeItemBody = null;
        originLifeItemBody = originLifeItem.type === 'ObjectMethod'
        ? originLifeItem.body.body
        : originLifeItem.type === 'ObjectProperty'
            ? originLifeItem.value.body.body
            : null;

        originLifeItemBody.push(lifeHookExpression);
    }
    else {
        properties.push(t.objectMethod(
            'method',
            t.identifier(lifeMapKey),
            [],
            t.blockStatement([
                lifeHookExpression
            ])
        ));
    }
}

module.exports = function getVisitor(options = {}) {
    return ({types: t}) => {
        const {
            useAOP,
            isApp,
            mpConfig
        } = options;
        return {
            visitor: {
                ExportDefaultDeclaration(path, state) {

                    let declarationPath = path.get('declaration');

                    // 只取 Vue.extend() 的参数部分
                    if (t.isCallExpression(declarationPath)) {
                        const objectExpression = declarationPath.get('arguments')[0];
                        declarationPath.replaceWith(objectExpression);
                    }

                    // if (!t.isObjectExpression(path.node.declaration)) {
                    //     return;
                    // }
                    let properties = declarationPath.node.properties;
                    options.baseOptions && (options.baseOptions.config = {});
                    options.baseOptions && (options.baseOptions.components = {});
                    options.baseOptions && (options.baseOptions.enableConfig = {});

                    // 处理 onPullDownRefresh 到 methods
                    function dealSwanPageApi(apiName) {
                        let apiBody = properties.find(item => item.key.name === apiName);
                        const apiBodyIndex = properties.findIndex(item => item.key.name === apiName);
                        if (apiBody) {
                            apiBody = apiBody.type === 'ObjectMethod'
                                ? apiBody
                                : apiBody.type === 'ObjectProperty'
                                    ? apiBody.value
                                    : apiBody;
                            properties.splice(apiBodyIndex, 1);
                            options.baseOptions && (options.baseOptions.enableConfig[apiName] = true);
                            let methodsObj = properties.find(item => item.key.name === 'methods');
                            // 获取 api 参数
                            let apiParams = [];
                            apiBody.params.forEach(item => {
                                apiParams.push(t.identifier(item.name));
                            });
                            // 获取 onPullDownRefresh/onReachBottom 函数体
                            let apiMethod = t.objectMethod(
                                'method',
                                t.identifier(apiName),
                                apiParams,
                                apiBody.body
                            );
                            if (!methodsObj) {
                                properties.push(t.objectProperty(
                                    t.identifier('methods'),
                                    t.objectExpression([apiMethod])
                                ));
                            }
                            else {
                                methodsObj.value.properties.push(apiMethod);
                            }
                        }
                    }
                    // 处理page api
                    ['onPullDownRefresh', 'onReachBottom', 'onPageScroll', 'onTabItemTap'].forEach(key => {
                        dealSwanPageApi(key);
                    });

                    // 如果有区别级别的 mpConfig 从 mpConfig 获取是否为组件
                    const isComponent = mpConfig ? mpConfig.component : judgeComponent(properties);
                    // 处理swan page 生命周期：onLoad 、onReady 、onUnload、onShow 、onHide
                    // 收集 app.vue 周期：onLaunch 、 onShow 、 onHide
                    ['onLoad', 'onReady', 'onUnload', 'onLaunch', 'onShow', 'onHide'].forEach(key => {
                        let lifeItem = properties.find(item => item.key.name === key);
                        let lifeMapKey = isApp ? APP_PAOGE_LIFE_MAP_VUE[key] : PAGE_LIFE_MAP_VUE[key];
                        // 判断当前 vue sfc 是否是组件component
                        if (isComponent) {
                            return;
                        }
                        // 处理生命周期的AOP
                        if (useAOP) {
                            lifeItem = bindAOPEvents(lifeItem, t, key, isApp);
                        }
                        mapSwanLifeTime(properties, t, key, lifeItem, lifeMapKey, options);
                    });
                    // 处理swan component 生命周期：created、 attached 、ready 、detached、show、hide
                    Object.keys(COMP_LIFE_MAP_VUE).forEach(key => {
                        const {
                            life: lifeMapKey,
                            type: lifeType
                        } = COMP_LIFE_MAP_VUE[key];
                        const lifeTypeItem = properties.find(item => item.key.name === lifeType);
                        if (!lifeTypeItem) {
                            return;
                        }

                        const lifeItem = lifeTypeItem.value.properties.find(item => item.key.name === key);
                        if (!lifeItem) {
                            return;
                        }

                        mapSwanLifeTime(properties, t, key, lifeItem, lifeMapKey, options);
                    });
                    /* eslint-disable */
                    path.traverse(Property(t, options));
                }
            }
        };
    };
};

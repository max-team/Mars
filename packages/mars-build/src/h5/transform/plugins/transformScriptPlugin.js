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
    onLoad: 'beforeMount',
    onReady: 'mounted',
    onUnload: 'destroyed',
    onShow: 'activated',
    onHide: 'deactivated',
    onLaunch: 'beforeMount' // 入口文件 app.vue 生命周期
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
    onLaunch: 'beforeMount',
    onShow: 'mounted',
    onHide: 'destroyed'
    // onLoad: true,
    // onReady: true,
    // onUnload: true
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

            if (path.node.key.name === 'config') {
                const configValue = getPlainObjectNodeValue(path.node.value, path, t) || {};

                if (configValue.pages) {
                    configValue.pages = configValue.pages.filter(item => !/\.(swan|mp)$/.test(item));
                }
                if (configValue.tabBar && configValue.tabBar.list) {
                    configValue.tabBar.list = configValue.tabBar.list.filter(item => !/\.(swan|mp)$/.test(item.pagePath));
                }
                options.baseOptions && (options.baseOptions.config = configValue);
                path.remove();
            }
            else if (path.node.key.name === 'components') {
                if (t.isObjectExpression(path.node.value)) {
                    // copy properties
                    let props = JSON.parse(JSON.stringify(path.node.value.properties));
                    props.forEach(p => {
                        if (t.isIdentifier(p.value)) {
                            const bindPath = path.scope.bindings[p.value.name].path;
                            const bindParentNode = bindPath.parent;
                            const bindVaule = bindParentNode.source;
                            bindParentNode.source = t.stringLiteral(bindVaule.value + '.vue');
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
 * Map SWAN Life Time  映射小程序生命周期到vue hook
 * @param {Object} properties node ast
 * @param {Object} t ast plugin param
 * @param {string} lifeKey 小程序原有生命周期hook
 * @param {Object} lifeItem 小程序原有生命周期hook ast node
 * @param {string} lifeMapKey 映射的 vue 周期hook
 * @param {Object} options plugin option
 */
function mapSwanLifeTime(properties, t, lifeKey, lifeItem, lifeMapKey, options) {
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

        lifeMapKey !== 'beforeMount' // onLoad 在beforeMount之前执行
            ? originLifeItemBody.push(lifeHookExpression)
            : originLifeItemBody.unshift(lifeHookExpression);
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
        const isApp = options.isApp;
        return {
            visitor: {
                ExportDefaultDeclaration(path, state) {
                    if (!t.isObjectExpression(path.node.declaration)) {
                        return;
                    }

                    let properties = path.node.declaration.properties;
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

                    // 处理swan page 生命周期：onLoad 、onReady 、onUnload、onShow 、onHide
                    // 收集 app.vue 周期：onLaunch 、 onShow 、 onHide
                    ['onLoad', 'onReady', 'onUnload', 'onLaunch', 'onShow', 'onHide'].forEach(key => {
                        const lifeItem = properties.find(item => item.key.name === key);
                        if (!lifeItem) {
                            return;
                        }

                        let lifeMapKey = isApp ? APP_PAOGE_LIFE_MAP_VUE[key] : PAGE_LIFE_MAP_VUE[key];
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
                    path.traverse(Property(t, options));
                }
            }
        };
    };
};

/**
 * @file h5 transform plugin
 * @author zhangjingyuan02
 */
/* eslint-disable fecs-camelcase */
/* eslint-disable babel/new-cap */

const APP_LIFE_MAP_VUE = {
    onLaunch: 'beforeMount',
    onShow: 'mounted',
    onHide: 'destroyed'
    // onLoad: 'beforeMount',
    // onReady: 'mounted',
    // onUnload: 'destroyed'
};

/**
 * Map SWAN APP Life Time 映射小程序生命周期到vue hook
 * @param {Object} properties node ast
 * @param {Object} t ast plugin param
 * @param {Object} lifeItemBody 小程序原有生命周期hook函数内容
 * @param {string} lifeMapKey 映射的 vue 周期hook
 */
function mapSwanAppLifeTime(properties, t, lifeItemBody, lifeMapKey) {
    // 获取 time 函数体
    const timeMethodBlock = lifeItemBody;

    // 生成匿名函数调用
    const anonymousFuncExpression = t.expressionStatement(
        t.callExpression(
            t.memberExpression(
                t.functionExpression(
                    null,
                    [],
                    timeMethodBlock
                ),
                t.identifier('call')
            ),
            [t.identifier('this')]
        )
    );
    let originLifeItem = properties.find(item => item.key.name === lifeMapKey);
    if (originLifeItem) {
        originLifeItem.body.body.push(anonymousFuncExpression);
    }
    else {
        properties.push(t.objectMethod(
            'method',
            t.identifier(lifeMapKey),
            [],
            t.BlockStatement([
                anonymousFuncExpression
            ])
        ));
    }
}

module.exports = function getVisitor(options = {}) {
    return ({types: t}) => {
        return {
            visitor: {
                ExportDefaultDeclaration(path) {
                    let properties = path.node.declaration.properties;
                    // 按预订顺序APP_LIFE_MAP_VUE 执行
                    Object.keys(APP_LIFE_MAP_VUE).forEach(key => {
                        let lifeItem = options.appScriptApi.find(item => item.key === key);
                        lifeItem && mapSwanAppLifeTime(properties, t, lifeItem.body, APP_LIFE_MAP_VUE[key]);
                    });
                    return;
                }
            }
        };
    };
}

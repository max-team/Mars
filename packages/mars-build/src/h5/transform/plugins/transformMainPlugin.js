/**
 * @file 生成入口文件main.js 初始化参数：tabBars、pageTitleMap、全局配置config，和使用router、components
 * @author zhangjingyuan02
 */
// /* eslint-disable fecs-camelcase */
// /* eslint-disable babel/new-cap */

// module.exports = function getVisitor(options = {}) {
//     return ({types: t}) => {
//         const {routes, componentSet, pagesInfo, window, mars, tabBarStyle} = options;
//         return {
//             visitor: {
//                 // 处理main.js 里的 render函数参数
//                 ArrowFunctionExpression(path, state) {
//                     let tabBarList = [];
//                     // import component & routes
//                     for (let r of routes) {
//                         tabBarList.push(t.objectExpression([
//                             t.objectProperty(
//                                 t.identifier('pagePath'),
//                                 t.stringLiteral(`/${r.pagePath}`)
//                             ),
//                             t.objectProperty(
//                                 t.identifier('text'),
//                                 t.stringLiteral(r.text)
//                             ),
//                             t.objectProperty(
//                                 t.identifier('iconPath'),
//                                 t.stringLiteral(r.iconPath ? r.iconPath : '')
//                             ),
//                             t.objectProperty(
//                                 t.identifier('selectedIconPath'),
//                                 t.stringLiteral(r.selectedIconPath ? r.selectedIconPath : '')
//                             ),
//                             t.objectProperty(
//                                 t.identifier('badge'),
//                                 t.stringLiteral('')
//                             ),
//                             t.objectProperty(
//                                 t.identifier('showRedDot'),
//                                 t.booleanLiteral(false)
//                             )
//                         ]));
//                     }
//                     let styleArr = [];
//                     Object.keys(tabBarStyle).forEach(key => {
//                         if (tabBarStyle[key]) {
//                             styleArr.push(t.objectProperty(
//                                 t.identifier(key),
//                                 t.stringLiteral(`${tabBarStyle[key]}`)
//                             ));
//                         }
//                     });
//                     let propsAst = [];
//                     propsAst.push(t.objectProperty(
//                         t.identifier('tabBars'),
//                         t.objectExpression([
//                             t.objectProperty(
//                                 t.identifier('list'),
//                                 t.arrayExpression(tabBarList)
//                             ),
//                             t.objectProperty(
//                                 t.identifier('style'),
//                                 t.objectExpression(styleArr)
//                             )
//                         ])
//                     ));
//                     // 配置 全部变量 window
//                     Object.keys(window).forEach(key => {
//                         let value = window[key];
//                         propsAst.push(t.objectProperty(
//                             t.identifier(key),
//                             typeof value === 'string'
//                             ? t.stringLiteral(value)
//                             : typeof value === 'number'
//                                 ? t.numericLiteral(value)
//                                 : t.booleanLiteral(value)
//                         ));
//                     });
//                     mars && Object.keys(mars).forEach(key => {
//                         let value = mars[key];
//                         propsAst.push(t.objectProperty(
//                             t.identifier(key),
//                             typeof value === 'string'
//                             ? t.stringLiteral(value)
//                             : typeof value === 'number'
//                                 ? t.numericLiteral(value)
//                                 : t.booleanLiteral(value)
//                         ));
//                     });
//                     // 添加 props tabBars
//                     path.node.body.arguments.push(t.objectExpression([
//                         t.objectProperty(
//                             t.identifier('props'),
//                             t.objectExpression(propsAst)
//                         )
//                     ]));
//                 },
//                 ObjectExpression(path, state) {
//                     // 生成main 文件，生成pageTitleMap
//                     if (path.node.properties[0]
//                         && path.node.properties[0].key
//                         && path.node.properties[0].key.name === 'pageTitleMap') {
//                         for (let item of pagesInfo) {
//                             path.node.properties[0].value.properties.push(t.objectProperty(
//                                 t.stringLiteral(`/${item.path}`),
//                                 t.objectExpression([
//                                     t.objectProperty(
//                                         t.identifier('title'),
//                                         t.stringLiteral(item.title)
//                                     ),
//                                     t.objectProperty(
//                                         t.identifier('enablePullDownRefresh'),
//                                         t.booleanLiteral(!!item.enablePullDownRefresh)
//                                     ),
//                                     t.objectProperty(
//                                         t.identifier('enableReachBottom'),
//                                         t.booleanLiteral(!!item.enableReachBottom)
//                                     ),
//                                     t.objectProperty(
//                                         t.identifier('navigationBarBackgroundColor'),
//                                         t.stringLiteral(item.navigationBarBackgroundColor
//                                             ? item.navigationBarBackgroundColor
//                                             : '')
//                                     ),
//                                     t.objectProperty(
//                                         t.identifier('navigationBarTextStyle'),
//                                         t.stringLiteral(item.navigationBarTextStyle ? item.navigationBarTextStyle : '')
//                                     ),
//                                     t.objectProperty(
//                                         t.identifier('backgroundColor'),
//                                         t.stringLiteral(item.backgroundColor ? item.backgroundColor : '')
//                                     ),
//                                     t.objectProperty(
//                                         t.identifier('backgroundTextStyle'),
//                                         t.stringLiteral(item.backgroundTextStyle ? item.backgroundTextStyle : '')
//                                     ),
//                                     t.objectProperty(
//                                         t.identifier('navigationStyle'),
//                                         t.stringLiteral(item.navigationStyle ? item.navigationStyle : '')
//                                     )
//                                 ])
//                             ));
//                         }
//                     }
//                 },
//                 Program: {
//                     // 在 exit 时才能拿到 file.config
//                     exit(path) {
//                         // 封装插入 import declaration
//                         function insertImportDeclaration(identifier, route) {
//                             return path.node.body.unshift(
//                                 t.importDeclaration([
//                                     t.importDefaultSpecifier(
//                                         t.identifier(identifier)
//                                     )],
//                                     t.stringLiteral(route)
//                                 )
//                             );
//                         }
//                         if (Object.keys(componentSet).length > 0) {
//                             // 插入 Vue.use(basicComponents);
//                             path.node.body.unshift(t.callExpression(t.memberExpression(
//                                 t.identifier('Vue'),
//                                 t.identifier('use'),
//                             ),
//                             [t.identifier('basicComponents')]));
//                             // 插入 import basicComponents from './components.js';
//                             insertImportDeclaration('basicComponents', './components.js');
//                         }
//                         // 注册 service worker
//                         if (!!mars.supportPWA) {
//                             path.node.body.unshift(t.expressionStatement(t.callExpression(
//                                 t.identifier('registerServiceWorker'),
//                                 [t.stringLiteral('sw.js')]
//                             )));
//                             insertImportDeclaration('registerServiceWorker', './registerServiceWorker.js');
//                         }
//                         // 插入 import Vue from 'vue';
//                         insertImportDeclaration('Vue', 'vue');
//                     }
//                 }
//             }
//         };
//     };
// };

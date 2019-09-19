/**
 * @file h5 transform plugin
 * @author zhangjingyuan02
 */

// /* eslint-disable fecs-camelcase */

// /* eslint-disable babel/new-cap */

// const APP_LIFE_TIME = [
//     'created',
//     'mounted',
//     'destroyed'
// ];

// module.exports = function getVisitor(options = {}) {
//     return ({types: t}) => {
//         return {
//             visitor: {
//                 ExportDefaultDeclaration(path) {
//                     let customApi = {};
//                     let properties = path.node.declaration.properties;
//                     properties.forEach(item => {
//                         // 此时的 life time hook 已经是 映射处理后的
//                         if (APP_LIFE_TIME.indexOf(item.key.name) === -1) {
//                             customApi[item.key.name] = item;
//                         }
//                     });
//                     options.customExp.customApi = customApi;
//                     path.traverse({
//                         Property(path, state) {
//                             APP_LIFE_TIME.indexOf(path.node.key.name) === -1 && path.remove();
//                         },
//                         ObjectMethod(path, state) {
//                             APP_LIFE_TIME.indexOf(path.node.key.name) === -1 && path.remove();
//                         }

//                     });
//                 },
//                 Program: {
//                     // 在 exit 时才能拿到 file.config
//                     exit(path) {
//                         let customExpression = [];
//                         path.node.body.forEach(item => {
//                             if (item.type !== 'ExportDefaultDeclaration') {
//                                 customExpression.push(item);
//                             }
//                         });
//                         options.customExp.customExpression = customExpression;
//                     }
//                 }
//             }
//         };
//     };
// };

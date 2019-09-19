/**
 * @file h5 transform plugin
 * @author zhangjingyuan02
 */

// /* eslint-disable fecs-camelcase */

// /* eslint-disable babel/new-cap */


// module.exports = function getVisitor(options = {}) {
//     const {
//         customApi,
//         customExpression
//     } = options.api;

//     return ({types: t}) => {
//         return {
//             visitor: {
//                 ExportDefaultDeclaration(path) {
//                     let properties = path.node.declaration.properties;
//                     Object.keys(customApi).forEach(key => {
//                         let item = customApi[key];
//                         properties.push(item.type === 'ObjectProperty'
//                             ? t.objectProperty(t.identifier(key), item.value)
//                             : item.type === 'ObjectMethod'
//                                 ? t.objectMethod(
//                                     'method',
//                                     t.identifier(key),
//                                     [],
//                                     item.body
//                                 )
//                                 : null
//                         );
//                     });
//                 },
//                 Program: {
//                     // 在 exit 时才能拿到 file.config
//                     exit(path) {
//                         // 加入 app.vue export default 外的内容
//                         customExpression && customExpression.reverse().forEach(exp => {
//                             path.node.body.unshift(exp);
//                         });
//                     }
//                 }
//             }
//         };
//     };
// };

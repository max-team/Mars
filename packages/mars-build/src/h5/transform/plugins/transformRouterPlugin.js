/**
 * @file 生成路由信息 router.js，注册所有路径
 * @author zhangjingyuan02
 */
/* eslint-disable fecs-camelcase */
/* eslint-disable babel/new-cap */


// page/home/index to PageHomeIndex
function toCamel(name) {
    let camelName = name.replace(/^\//, '').replace(/[\/|-](\w)(\w+)/g, (a, b, c) => b.toUpperCase() + c.toLowerCase());
    return camelName.substring(0, 1).toUpperCase() + camelName.substring(1);
}

const routeExtraType = {
    swan: '.swan',
    wx: '.wxml'
};

module.exports = function getVisitor(options = {}) {
    return ({types: t}) => {
        const {
            routes,
            mode,
            base
        } = options;
        return {
            visitor: {
                NewExpression(path) {
                    if (path.node.callee.name !== 'VueRouter') {
                        return;
                    }
                    let routesArr = [];
                    // import routes
                    for (let r of routes) {
                        if (r.indexOf(routeExtraType.wx) > -1 || r.indexOf(routeExtraType.swan) > -1) {
                            continue;
                        }
                        routesArr.push(t.objectExpression([
                            t.objectProperty(
                                t.identifier('path'),
                                t.stringLiteral(`/${r}`)
                            ),
                            t.objectProperty(
                                t.identifier('component'),
                                t.identifier(toCamel(r))
                            )
                        ]));
                    }
                    // * redirect to routes[0]
                    routesArr.push(t.objectExpression([
                        t.objectProperty(
                            t.identifier('path'),
                            t.stringLiteral('*')
                        ),
                        t.objectProperty(
                            t.identifier('redirect'),
                            t.stringLiteral(`/${routes[0]}`)
                        )
                    ]));

                    let properties = path.node.arguments[0].properties;
                    properties.forEach(({key: {name}}, index) => {
                        if (name === 'mode') {
                            properties[index].value = t.stringLiteral(mode);
                        }
                        else if (name === 'base') {
                            properties[index].value = t.stringLiteral(base);
                        }
                        else if (name === 'routes') {
                            properties[index].value.elements = routesArr;
                        }
                    });
                },
                Program: {
                    // 在 exit 时才能拿到 file.config
                    exit(path) {
                        // 封装插入 import declaration
                        function insertImportDeclaration(identifier, route) {
                            return path.node.body.unshift(
                                t.importDeclaration([
                                    t.importDefaultSpecifier(
                                        t.identifier(identifier)
                                    )],
                                    t.stringLiteral(route)
                                )
                            );
                        }

                        // import routes
                        for (let r of routes) {
                            if (r.indexOf(routeExtraType.wx) > -1 || r.indexOf(routeExtraType.swan) > -1) {
                                continue;
                            }
                            insertImportDeclaration(toCamel(r), `./${r}.vue`);
                        }

                    }
                }
            }
        };
    };
};

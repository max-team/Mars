/**
 * @file build
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-camelcase */
/* eslint-disable babel/new-cap */
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
        throw path.buildCodeFrameError('config field should not contain variables');
    }
    return result;
}

const getPropertyVisitor = (t, options) => {
    return {
        ObjectProperty(path, state) {
            const propName = path.node.key.name;

            if (propName === 'config') {
                const configValue = getPlainObjectNodeValue(path.node.value, path, t) || {};

                if (options.isApp) {
                    if (configValue.pages) {
                        configValue.pages = configValue.pages.map(item => item.replace(/\.(swan|mp)$/, ''));
                    }
                    if (configValue.tabBar && configValue.tabBar.list) {
                        configValue.tabBar.list = configValue.tabBar.list.map(item => {
                            item.pagePath = item.pagePath.replace(/\.(swan|mp)$/, '');
                            return item;
                        });
                    }
                }

                options.file && (options.file.config = configValue);
                path.remove();
            }

            if (propName === 'components') {
                if (t.isObjectExpression(path.node.value)) {
                    let components = {};
                    path.node.value.properties.forEach(p => {
                        if (t.isIdentifier(p.value)) {
                            const name = p.value.name;
                            const binding = path.scope.bindings[name];
                            if (!binding) {
                                throw path.buildCodeFrameError(`cannot find binding for component "${p.value.name}"`);
                            }

                            const keyName = t.isLiteral(p.key) ? p.key.value : p.key.name;
                            const bindPath = binding.path;
                            const bindParentNode = bindPath.parent;
                            const bindNode = bindPath.node;

                            if (t.isImportDeclaration(bindParentNode)) {
                                const bindVaule = bindParentNode.source.value + '.vue';
                                components[keyName] = bindVaule;
                                bindParentNode.source = t.stringLiteral(bindVaule);
                            }
                            else if (t.isVariableDeclaration(bindParentNode)
                                && t.isVariableDeclarator(bindNode)
                                && t.isCallExpression(bindNode.init)
                                && t.isIdentifier(bindNode.init.callee)
                                && bindNode.init.callee.name === 'require'
                                && t.isStringLiteral(bindNode.init.arguments[0])
                            ) {
                                const bindVaule = bindNode.init.arguments[0].value + '.vue';
                                components[keyName] = bindVaule;
                                bindNode.init.arguments[0] = t.stringLiteral(bindVaule);
                            }
                            else {
                                throw path.buildCodeFrameError('binding should in stitic require or import '
                                    + `for component "${p.value.name}"`);
                            }
                        }
                    });
                    options.file && (options.file.components = components);
                }
            }

            if (propName === 'computed') {
                if (t.isObjectExpression(path.node.value)) {
                    const keys = path.node.value.properties.map(p => p.key.name);
                    options.file && (options.file.computedKeys = keys);
                }
            }
            // skip child traverse
            path.skip();
        }
    };
};

function transfromSFCExport(t, declarationPath, options) {
    if (!t.isObjectExpression(declarationPath)) {
        throw declarationPath.buildCodeFrameError('should export plain object in SFC');
    }

    declarationPath.traverse(getPropertyVisitor(t, options));

    if (options.renderStr) {
        declarationPath.node.properties.push(t.objectProperty(
            t.identifier('render'),
            t.identifier(options.renderStr)
        ));
    }
}

function capitalize(s) {
    if (typeof s !== 'string') {
        return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
}

module.exports = function getVisitor(options = {}) {
    return ({types: t}) => {
        let exportPath;
        let declarationPath;
        const {
            file,
            isApp
        } = options;
        return {
            visitor: {
                ExportDefaultDeclaration(path, state) {
                    declarationPath = path.get('declaration');
                    transfromSFCExport(t, declarationPath, options);
                    exportPath = path;
                    file.moduleType = 'esm';
                },
                AssignmentExpression(path, state) {
                    let leftNode = path.node.left;
                    if (t.isMemberExpression(leftNode)) {
                        let objName = leftNode.object.name;
                        let propName = leftNode.property.name;
                        if (objName === 'module' && propName === 'exports') {
                            declarationPath = path.get('right');
                            transfromSFCExport(t, declarationPath, options);
                            exportPath = path;
                            file.moduleType = 'cmd';
                            // skip child traverse
                            path.skip();
                        }
                    }
                },
                Program: {
                    exit(path) {
                        if (!exportPath || !declarationPath) {
                            throw path.buildCodeFrameError('should has export in SFC');
                        }

                        const mpType = isApp
                            ? 'app'
                            : (file.config && file.config.component) ? 'component' : 'page';

                        if (mpType === 'app' || mpType === 'page') {
                            const fnName = capitalize(mpType);
                            const createFnName = `create${fnName}`;
                            exportPath.replaceWith(t.callExpression(
                                t.identifier(fnName),
                                [t.callExpression(
                                    t.identifier(createFnName),
                                    [declarationPath.node]
                                )]
                            ));

                            path.node.body.unshift(
                                t.importDeclaration([
                                    t.importSpecifier(
                                        t.identifier(createFnName),
                                        t.identifier(createFnName)
                                    )
                                ],
                                    t.stringLiteral(options.coreRelativePath)
                                )
                            );
                        }

                        if (mpType === 'component') {
                            declarationPath.replaceWith(
                                t.callExpression(
                                    t.identifier('vueCompCreator'),
                                    [declarationPath.node]
                                )
                            );

                            path.node.body.unshift(
                                t.importDeclaration(
                                    [
                                        // t.importSpecifier(
                                        //     t.identifier('createComponent'),
                                        //     t.identifier('createComponent')
                                        // ),
                                        t.importSpecifier(
                                            t.identifier('vueCompCreator'),
                                            t.identifier('vueCompCreator')
                                        )
                                    ],
                                    t.stringLiteral(options.coreRelativePath)
                                )
                            );
                        }
                    }
                }
            }
        };
    };
};

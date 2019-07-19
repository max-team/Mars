/**
 * @file build
 * @author zhangjingyuan02
 */

/* eslint-disable fecs-camelcase */
/* eslint-disable babel/new-cap */
const {hyphenate} = require('../../helper/util');

module.exports = function getVisitor(options = {}) {
    return ({types: t}) => {
        const {
            componentsInUsed
        } = options;
        return {
            visitor: {
                ImportDeclaration(path, state) {
                    const sourcePath = path.node.source;
                    if (sourcePath) {
                        Object.keys(componentsInUsed).forEach(comp => {
                            componentsInUsed[comp].declaration === sourcePath.value
                            && !componentsInUsed[comp].using
                            && path.remove();
                        });
                    }
                },
                ObjectProperty(path, state) {
                    if (path.node.key.name !== 'components') {
                        return;
                    }
                    path.traverse({
                        ObjectProperty(path, state) {
                            let componentName = path.node.key.type === 'Identifier'
                                ? path.node.key.name
                                : path.node.key.type === 'StringLiteral'
                                    ? path.node.key.value
                                    : null;
                            componentName = hyphenate(componentName);
                            if (componentName && !componentsInUsed[componentName].using) {
                                path.remove();
                            }
                        }

                    });
                }
            }
        };
    };
};

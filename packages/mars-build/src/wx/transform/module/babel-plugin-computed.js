/**
 * @file build
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

function getIdentifier(t, name) {
    let i = t.identifier(name);
    i.__processed__ = true;
    return i;
}

function getComputedDomain(t) {
    return t.memberExpression(
        getIdentifier(t, 'rootComputed'),
        getIdentifier(t, 'compId'),
        true
    );
}

function getComputedMember(t, node) {
    const domain = getComputedDomain(t);
    return t.memberExpression(
        domain,
        node,
        false
    );
}

function getMember(t, node) {
    if (node.type === 'Identifier') {
        return getComputedMember(t, node);
    }

    let nodeClone = Object.assign({}, node);
    let parent;
    node = parent = nodeClone;
    while (node.type === 'MemberExpression') {
        node.object = Object.assign({}, node.object);
        parent = node;
        node = node.object;
    }
    parent.object = getComputedMember(t, node);
    return nodeClone;
}

function getCondition(t, node) {
    return t.conditionalExpression(
        getIdentifier(t, '__inited__'),
        node,
        getMember(t, node)
    );
}

function findObjectMember(path) {
    const node = path.node;
    const parentNode = path.parent;
    if (parentNode && parentNode.type === 'MemberExpression' && parentNode.object === node) {
        return findObjectMember(path.parentPath);
    }

    return path;
}

function getIdentifierVisitor(t, options) {
    const {computedKeys} = options;
    return function Identifier(path, state) {
        if (computedKeys.indexOf(path.node.name) === -1 || path.node.__processed__) {
            return;
        }

        let parent = path.parent;
        let node = path.node;
        node.__processed__ = true;

        // rewrite identifiers inside Vue render function `with` blocks
        if (
            // not a params of a function
            // !(isFunction(parent.type) && parent.params.indexOf(node) > -1) &&
            // not a key of Property
            !(parent.type === 'ObjectProperty' && parent.key === node && !parent.computed)
            // not a property of a MemberExpression
            && !(parent.type === 'MemberExpression' && parent.property === node && !parent.computed)
            // // not in an Array destructure pattern
            // !(parent.type === 'ArrayPattern') &&
            // // not in an Object destructure pattern
            // !(parent.parent && parent.parent.type === 'ObjectPattern')
            // skip globals + commonly used shorthands
            // !globals[node.name] &&
            // // not already in scope
            // !node.findScope(false).contains(node.name)
        ) {
            let objectMemberPath = findObjectMember(path);
            const condition = getCondition(t, objectMemberPath.node);
            objectMemberPath.replaceWith(t.expressionStatement(condition));
        }

    };
}

module.exports = function getVisitor(options = {}) {
    return ({types: t}) => {
        return {
            visitor: {
                Identifier: getIdentifierVisitor(t, options)
            }
        };
    };
};

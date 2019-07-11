/**
 * @file 根据 ast 生成 render 函数
 * @author meixuguang
 */

class CodegenState {
    constructor(options) {
        this.maybeComponent = el => !el.component;
        this.directives = {

            /**
             * bind
             *
             * @param {ASTElement} el el
             * @param {ASTDirective} dir dir
             */
            bind(el, dir) {
                el.wrapData = code => {
                    return `_b(${code},'${el.tag}',${dir.value},${
                        dir.modifiers && dir.modifiers.prop ? 'true' : 'false'
                    }${
                        dir.modifiers && dir.modifiers.sync ? ',true' : ''
                    })`;
                };
            }
        };
        this.processFilterData = options.processFilterData;
        this.isComplexExp = options.isComplexExp;
        this.isFilter = options.isFilter;
    }
}

/**
 * generate
 *
 * @param {ASTElement=} ast ast
 * @param {any} options ast
 * @return {CodegenResult}
 */
function generate(ast, options) {
    const state = new CodegenState(options);
    const code = ast ? genElement(ast, state) : '';
    return {
        render: `with(this){return [${code}]}`
    };
}

/**
 * genElement
 *
 * @param {ASTElement} el el
 * @param {CodegenState} state state
 * @return {string}
 */
function genElement(el, state) {
    if (el.parent) {
        el.pre = el.pre || el.parent.pre;
    }

    if (el.staticRoot && !el._staticProcessed) {
        // static
        return '';
    }
    else if (el.once && !el._onceProcessed) {
        // v-once
        return '';
    }
    else if (el.for && !el._forProcessed) {
        return genFor(el, state);
    }
    else if (el.if && !el._ifProcessed) {
        return genIf(el, state);
    }
    else if (el.tag === 'template' && !el.slotTarget) {
        return genChildren(el, state) || '';
    }
    else if (el.tag === 'slot') {
        return genSlot(el, state);
    }

    // component or element
    let code = '';
    if (el.component) {
        return '';
    }
    else {
        let data;
        if (!el.plain || (el.pre && state.maybeComponent(el))) {
            data = genData(el, state);
        }

        const children = el.inlineTemplate ? null : genChildren(el, state, true);
        code = `${data ? `,${data}` : ''}`
            + `${children ? `,${children}` : ''}`;
    }
    return code;
}

/**
 * gen if
 *
 * @param {any} el el
 * @param {CodegenState} state state
 * @return {string}
 */
function genIf(el, state) {
    el._ifProcessed = true; // avoid recursion
    return genIfConditions(el.ifConditions.slice(), state);
}

/**
 * gen if conditions
 *
 * @param {ASTIfCondition[]} conditions el
 * @param {CodegenState} state state
 * @return {string}
 */
function genIfConditions(conditions, state) {
    if (!conditions.length) {
        return '';
    }

    const condition = conditions.shift();
    if (condition.exp) {
        const value = state.processFilterData(condition.exp, 'if', condition.block);

        return `(${value})?[${
            genTernaryExp(condition.block)
            }]:[${
            genIfConditions(conditions, state)
            }]`;
    }
    return `${genTernaryExp(condition.block)}`;

    // v-if with v-once should generate code like (a)?_m(0):_m(1)
    function genTernaryExp(el) {
        return el.once
                ? ''
                : genElement(el, state);
    }
}

/**
 * v-for
 *
 * @param {ASTElement} el el
 * @param {CodegenState} state state
 * @return {string}
 */
function genFor(el, state) {
    const exp = el.for;
    const alias = el.alias;
    const iterator1 = el.iterator1 ? `,${el.iterator1}` : '';
    const iterator2 = el.iterator2 ? `,${el.iterator2}` : '';

    el._forProcessed = true; // avoid recursion
    return `_l((${state.processFilterData(exp, 'for', el)}),`
        + `function(${alias}${iterator1}${iterator2}){`
        + `[${genElement(el, state)}]`
        + '})';
}

/**
 * gen data
 *
 * @param {ASTElement} el el
 * @param {CodegenState} state state
 * @return {string}
 */
function genData(el, state) {
    let data = '[';

    // directives first.
    // directives may mutate the el's other properties before they are generated.
    const dirs = genDirectives(el, state);
    if (dirs) {
        data += dirs + ',';
    }

    if (el.classBinding) {
        data += `(${el.classBinding}),`;
    }

    if (el.styleBinding) {
        data += `(${el.styleBinding}),`;
    }

    // attributes
    if (el.attrs) {
        data += `[_pp(${genProps(el.attrs, state, el)})],`;
    }

    // DOM props
    if (el.props) {
        data += `[${genProps(el.props, state, el)}],`;
    }

    // slot target
    // only for non-scoped slots
    if (el.slotTarget && !el.slotScope) {
        data += `${el.slotTarget},`;
    }

    // component v-model
    if (el.model) {
        data += `{value:${
            el.model.value
            },callback:${
            el.model.callback
            },expression:${
            el.model.expression
            }},`;
    }

    data = data.replace(/,$/, '') + ']';
    // v-bind data wrap
    if (el.wrapData) {
        data = el.wrapData(data);
    }

    if (data === '[]') {
        return '';
    }
    return data;
}

/**
 * gen directives
 *
 * @param {ASTElement} el el
 * @param {CodegenState} state state
 * @return {string | void}
 */
function genDirectives(el, state) {
    const dirs = el.directives;
    if (!dirs) {
        return;
    }

    let res = '[';
    let hasRuntime = false;
    let i;
    let l;
    let dir;
    let needRuntime;
    for (i = 0, l = dirs.length; i < l; i++) {
        dir = dirs[i];
        needRuntime = true;
        const gen = state.directives[dir.name];
        if (gen) {
            // compile-time directive that manipulates AST.
            // returns true if it also needs a runtime counterpart.
            needRuntime = !!gen(el, dir, state.warn);
        }
        if (needRuntime) {
            hasRuntime = true;
            res += `{name:"${dir.name}",rawName:"${dir.rawName}"${
                dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''
                }${
                dir.arg ? `,arg:"${dir.arg}"` : ''
                }${
                dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
                }},`;
        }
    }
    if (hasRuntime) {
        return res.slice(0, -1) + ']';
    }
}

/**
 * children
 *
 * @param {ASTElement} el el
 * @param {CodegenState} state state
 * @param {boolean=} checkSkip checkSkip
 * @return {string}
 */
function genChildren(el, state, checkSkip) {
    const children = el.children;
    if (children.length) {
        const el = children[0];
        // optimize single v-for
        if (children.length === 1
            && el.for
            && el.tag !== 'template'
            && el.tag !== 'slot'
        ) {
            const normalizationType = checkSkip
                ? state.maybeComponent(el) ? ',1' : ',0'
                : '';
            return `${genElement(el, state)}${normalizationType}`;
        }
        const code = children.map(c => genNode(c, state)).join(',');
        return code ? `[${code}]` : '';
    }
    return '';
}

/**
 * gen node
 *
 * @param {ASTNode} node node
 * @param {CodegenState} state state
 * @return {string}
 */
function genNode(node, state) {
    if (node.type === 1) {
        return genElement(node, state);
    }
    else if (node.type === 3 && node.isComment) {
        return '';
    }

    return genText(node, state);
}

/**
 * genText
 *
 * @param {ASTText | ASTExpression} text text
 * @param {CodegenState} state state
 * @return {string}
 */
function genText(text, state) {
    if (text.type === 2) {
        return state.processFilterData(text, 't', text);
    }
    return '';
}

/**
 * gen slot
 *
 * @param {ASTElement} el el
 * @param {CodegenState} state state
 * @return {string}
 */
function genSlot(el, state) {
    const children = genChildren(el, state);
    let res = `[${children ? children : ''}`;
    const attrs = el.attrs && `[${el.attrs.map(a => a.value).join(',')}]`;
    const bind = el.attrsMap['v-bind'];
    if (attrs) {
        res += `,JSON.stringify(${attrs})`;
    }
    if (bind) {
        res += `,JSON.stringify(${bind})`;
    }
    return res + ']';
}

/**
 * gen props
 *
 * @param {prop[]} props props
 * @param {CodegenState} state state
 * @param {ASTElement} el el
 * @return {string}
 */
function genProps(props, state, el) {
    let res = '{';
    const fData = [];
    for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        const value = transformSpecialNewlines(prop.value);
        const name = prop.name;
        if (!state.isComplexExp(value) && !state.isFilter(value)) {
            res += `'${name}':${value},`;
        }
        else {
            fData.push([prop.name, value]);
        }
    }

    if (fData.length) {
        res += `_p:${state.processFilterData(fData, 'p', el)},`;
    }
    return res.slice(0, -1) + '}';
}

/**
 * #3895, #4268
 *
 * @param {string} text string
 * @return {string}
 */
function transformSpecialNewlines(text) {
    return text
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
}

module.exports = {
    generate
};

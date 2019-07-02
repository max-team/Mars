type ASTNode = ASTElement | ASTText | ASTExpression;

interface ASTElement {
    type: 1;
    tag: string;
    attrsList: Array<{ name: string; value: any }>;
    attrsMap: { [key: string]: any };
    parent: ASTElement | void;
    children: Array<ASTNode>;
  
    processed?: true;
  
    static?: boolean;
    staticRoot?: boolean;
    staticInFor?: boolean;
    staticProcessed?: boolean;
    hasBindings?: boolean;
  
    text?: string;
    attrs?: Array<{ name: string; value: any }>;
    props?: Array<{ name: string; value: string }>;
    plain?: boolean;
    pre?: true;
    ns?: string;
  
    component?: string;
    inlineTemplate?: true;
    transitionMode?: string | null;
    slotName?: ?string;
    slotTarget?: ?string;
    slotScope?: ?string;
    scopedSlots?: { [name: string]: ASTElement };
  
    ref?: string;
    refInFor?: boolean;
  
    if?: string;
    ifProcessed?: boolean;
    elseif?: string;
    else?: true;
    ifConditions?: ASTIfConditions;
  
    for?: string;
    forProcessed?: boolean;
    key?: string;
    alias?: string;
    iterator1?: string;
    iterator2?: string;
  
    staticClass?: string;
    classBinding?: string;
    staticStyle?: string;
    styleBinding?: string;
    events?: ASTElementHandlers;
    nativeEvents?: ASTElementHandlers;
  
    transition?: string | true;
    transitionOnAppear?: boolean;
  
    model?: {
      value: string;
      callback: string;
      expression: string;
    };
  
    directives?: Array<ASTDirective>;
  
    forbidden?: true;
    once?: true;
    onceProcessed?: boolean;
    wrapData?: (code: string) => string;
    wrapListeners?: (code: string) => string;
  
    // 2.4 ssr optimization
    ssrOptimizability?: number;
  
    // weex specific
    appendAsTree?: boolean;
};

interface ASTText {
    type: 3;
    text: string;
    static?: boolean;
    isComment?: boolean;
    // 2.4 ssr optimization
    ssrOptimizability?: number;
};

interface ASTExpression {
    type: 2;
    expression: string;
    text: string;
    tokens: Array<string | Object>;
    static?: boolean;
    // 2.4 ssr optimization
    ssrOptimizability?: number;
};

interface ASTIfCondition {
    exp?: string;
    block: ASTElement
};

interface prop {
    name: string;
    value: any;
}

interface CodegenResult {
    render: string
};

/**
 * 复杂表达式的数据格式
 */
interface filterData {
    [fid: number]: {
        _p: {
            [key: string]: any
        },
        _t: {
            [index: number]: any
        },
        _if: any,
        _for: any
    }
}
/**
 * @file sfc parser
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

const File = require('./File');
const {parseHTML} = require('../../helper/html-parser');
const {parseComponent} = require('vue-template-compiler/build');
// const merge = require('lodash.merge');
const merge = require('../../helper/util').merge;

/**
 * pre parse SFC content to convert <script type="config"> => <config>
 *
 * @description since vue-template-compiler parseComponent takes only one <script> block
 * @param {string} content SFC content
 * @return {string}
 */
function preParse(content) {
    let blocks = [];
    let depth = 0;
    let currentBlock = null;

    function start(tag, attrs, unary, start, end) {
        if (depth === 0) {
            if (
                tag === 'script'
                && attrs.find(attr => attr.name === 'type' && attr.value === 'config')
            ) {
                currentBlock = {
                    tag,
                    start
                };
                blocks.push(currentBlock);
            }
        }

        if (!unary) {
            depth++;
        }
    }

    function end(tag, start, end) {
        if (depth === 1 && currentBlock) {
            currentBlock.end = end;
            currentBlock.content = `<config${content.slice(currentBlock.start + 7, currentBlock.end - 9)}</config>`;
            currentBlock = null;
        }

        depth--;
    }

    parseHTML(content, {
        start,
        end
    });

    if (blocks.length === 0) {
        return content;
    }

    return blocks.reduce((prev, item, index) => {
        const {
            start,
            end,
            content: blockContent
        } = item;
        const tailContent = index === blocks.length - 1 ? content.slice(end) : '';
        const curContent = prev.content
            + content.slice(prev.end, start)
            + blockContent
            + tailContent;
        return {
            content: curContent,
            end
        };
    }, {
        content: '',
        end: 0
    }).content;
}

function getLang(block, defaultLang) {
    return (block && block.lang) ? block.lang : defaultLang;
}

function parseConfig(blocks = []) {
    const configObjs = blocks.map(block => {
        let {content} = block;
        content = content.trim();
        const fnStr = `return ${content};`;
        try {
            return (new Function(fnStr))();
        }
        catch (e) {
            throw new Error(`config parse error: ${content}`);
        }
    });
    return configObjs.length > 0
        ? merge.apply(null, configObjs)
        : null;
}

function wrapFiles(ret, options) {
    const {
        fPath,
        fileSuffix,
        target
    } = options;

    const {
        script,
        template,
        styles,
        config
    } = ret;

    const scriptFile = new File({
        type: 'js',
        lang: getLang(script, 'js'),
        path: fPath + `.${fileSuffix.js}`,
        contents: Buffer.from(script ? script.content : ''),
        $options: {
            attrs: script ? script.attrs : {}
        }
    });

    const stylesArr = styles.filter(item => !item.attrs
        || (!item.attrs.target || item.attrs.target === (process.env.MARS_ENV_TARGET || target))
    );
    const styleContent = stylesArr.reduce((stylestr, {content}) => `${stylestr}
${content}
`, '');
    const styleWithLang = styles.find(item => item.lang);
    const styleFile = new File({
        type: 'css',
        lang: getLang(styleWithLang, 'css'),
        path: fPath + `.${fileSuffix.css}`,
        contents: Buffer.from(styleContent || ''),
        $options: {
            attrs: styleWithLang ? styleWithLang.attrs : {}
        }
    });

    const templateFile = new File({
        type: 'html',
        lang: getLang(template, 'html'),
        path: fPath + `.${fileSuffix.html}`,
        contents: Buffer.from(template ? template.content : ''),
        $options: {
            attrs: template ? template.attrs : {}
        }
    });

    const jsonFile = new File({
        type: 'json',
        path: fPath + `.${fileSuffix.json}`,
        $options: {
            config
        }
    });

    return {
        script: scriptFile,
        styles: styleFile,
        template: templateFile,
        config: jsonFile
    };
}

exports.parse = function parse(file, options, withWrap = true) {
    const {target} = options;

    const content = preParse(file.contents.toString());
    let {
        script = {},
        template = {},
        styles = [{}],
        customBlocks = []
    } = parseComponent(content, {});

    let configBlocks = {
        default: [],
        target: []
    };
    customBlocks.forEach(block => {
        if (block.type === 'config') {
            if (!block.attrs.target) {
                configBlocks.default.push(block);
            }

            if (block.attrs.target === (process.env.MARS_ENV_TARGET || target)) {
                configBlocks.target.push(block);
            }
        }

    });
    // target config 覆盖 default config，同一类型后面覆盖前面
    const config = parseConfig(configBlocks.default.concat(configBlocks.target));
    const ret = {
        script,
        template,
        styles,
        customBlocks,
        config
    };

    // for H5
    if (!withWrap) {
        return ret;
    }

    return wrapFiles(ret, options);
};

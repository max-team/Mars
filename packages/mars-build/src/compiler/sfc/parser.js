/**
 * @file sfc parser
 * @author zhangwentao <winty2013@gmail.com>
 */
/* eslint-disable fecs-min-vars-per-destructure */

const File = require('./File');
const {parseComponent} = require('vue-template-compiler/build');

function getLang(block, defaultLang) {
    return (block && block.attrs && block.attrs.lang) ? block.attrs.lang : defaultLang;
}

exports.parse = function parse(file, options) {
    const {
        fPath,
        fileSuffix,
        target
    } = options;

    let {
        script = {},
        template = {},
        styles = [{}],
        customBlocks
    } = parseComponent(file.contents.toString(), {});

    const scriptFile = new File({
        type: 'js',
        lang: getLang(script, 'js'),
        path: fPath + `.${fileSuffix.js}`,
        contents: new Buffer(script ? script.content : ''),
        $options: {
            attrs: script ? script.attrs : {}
        }
    });
    const stylesArr = styles.filter(item =>
        !item.attrs || (!item.attrs.target || item.attrs.target === (process.env.MARS_ENV_TARGET || target)));
    const styleContent = stylesArr.reduce((stylestr, {content}) => `
${stylestr}
${content}
    `, '');
    const styleBlockWithLang = styles.find(item => item.lang);
    const styleFile = new File({
        type: 'css',
        lang: getLang(styleBlockWithLang, 'css'),
        path: fPath + `.${fileSuffix.css}`,
        contents: new Buffer(styleContent || ''),
        $options: {
            attrs: styleBlockWithLang ? styleBlockWithLang.attrs : {}
        }
    });

    const templateFile = new File({
        type: 'html',
        lang: getLang(template, 'html'),
        path: fPath + `.${fileSuffix.html}`,
        contents: new Buffer(template ? template.content : ''),
        $options: {
            attrs: template ? template.attrs : {}
        }
    });

    const jsonFile = new File({
        type: 'json',
        path: fPath + `.${fileSuffix.json}`
    });

    return {
        script: scriptFile,
        styles: styleFile,
        template: templateFile,
        config: jsonFile
    };
};

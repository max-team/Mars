/**
 * @file base file compiler
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */
/* eslint-disable fecs-no-require */

const buildInProcessors = require('./processor');

async function process(source, processors, file) {
    for (const processor of processors) {
        const {name, options = {}, process} = processor;
        if (typeof process === 'function') {
            source = await process(source, options, file);
        }
        else if (buildInProcessors[name]) {
            source = await buildInProcessors[name](source, options);
        }
        else {
            throw new Error('[processor not found]', processor);
        }
    }
    return source;
}

function getExtProcessors(processors, lang) {
    let ret = [];
    Object.keys(processors).forEach(name => {
        let val = processors[name];
        if (Array.isArray(val)) {
            val = {
                extnames: val
            }
        }
        let {extnames, options = {}, process} = val;
        if (Array.isArray(extnames) && extnames.indexOf(lang) > -1) {
            ret.push({
                name,
                options,
                process
            });
        }
    });

    return ret;
}

function defaultCompile(bufferOrString) {
    return { code: bufferOrString };
}

function getFileSource(file) {
    return file.isBinary && file.isBinary()
        ? file.contents
        : file.contents
            ? file.contents.toString()
            : '';
}

function getFileCompiler(compile, config) {
    const {preprocessors = {}, postprocessors = {}} = config;
    compile = compile || defaultCompile;

    return async function fileCompiler(file, options) {
        const fileOptions = file.$options;
        const lang = file.lang || file.type;
        let source = getFileSource(file);
        // preprocessors
        source = await process(source, getExtProcessors(preprocessors, lang), file);
        // compile
        options.path = file.path;
        options.file = file;
        const result =  await compile(source, options, fileOptions);
        // postprocessors
        let {code, ...rest} = result;
        code = await process(code, getExtProcessors(postprocessors, lang), file);
        // overwrite file contents
        file.contents = typeof code === 'string'
            ? Buffer.from(code || '')
            : code;

        return rest;
    };
}

function getFileCompilers(compilers = {}, options) {
    const buildConfig = options._config || {};
    let ret = {};
    Object.keys(compilers).forEach(key => {
        const compiler = compilers[key];
        ret[key] = getFileCompiler(compiler, buildConfig);
    });
    return ret;
}

exports.getFileCompiler = getFileCompiler;
exports.getFileCompilers = getFileCompilers;

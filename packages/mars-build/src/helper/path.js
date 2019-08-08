/**
 * @file path
 * @author zhangwentao
 */

const path = require('path');

function getPathToCWD(p) {
    return path.relative(process.cwd(), p);
}

function isCSS(filePath) {
    const ext = path.extname(filePath).substr(1);
    return /^(css|less|styl(us)?|s(c|a)ss)$/i.test(ext);
}

function isJS(filePath) {
    const ext = path.extname(filePath).substr(1);
    return /^(js|ts)$/i.test(ext);
}

function changeExt(filePath, ext) {
    ext = ext[0] === '.' ? ext : ('.' + ext);
    const {dir, name} = path.parse(filePath);
    filePath = path.format({dir, name, ext});
    return filePath;
}

function getModuleName(mod) {
    if (mod[0] === '.') {
        return null;
    }
    let [name, temp] = mod.split('/');
    if (name[0] === '@') {
        name = `${name}/${temp}`;
    }
    return name;
}

module.exports = {
    getPathToCWD,
    isCSS,
    isJS,
    changeExt,
    getModuleName
};

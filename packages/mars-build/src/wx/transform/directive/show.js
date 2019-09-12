/**
 * @file wx show build
 * @author guoyong03 <perfectgy@gmail.com>
 */

module.exports = function dirShow(param, val, attrs, node) {
    // 通过 :style="{display: ${val}}" 实现隐藏或展现
    val = `;display: {{${val} ? ' ' : 'none'}};`;

    // 需要把之前处理的style包含进去
    if (attrs.style && attrs.style !== '') {
        val = attrs.style + val;
    }

    attrs.style = val;
};

/**
 * @file build
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

exports.modifyBind = function modifyBind(node, modifier) {
    const {
        type,
        attrsMap
    } = node;

    // text bind node
    if (type === 2) {
        const tokens = node.tokens.map(t => {
            if (t['@binding']) {
                const val = modifier(t['@binding']);
                return `{{${val}}}`;
            }

            return t;
        });

        node.text = tokens.join('');
    }

    // element node
    if (type === 1) {
        let attrs = {};
        Object.keys(attrsMap).forEach(key => {
            let val = attrsMap[key];
            if (key === 'v-if'
                || key === 'v-else-if'
                || key === 'v-for'
                || key.indexOf('v-bind:') === 0
            ) {
                if (key === 'v-for' && node.for) {
                    node.for = `(${modifier(node.for)})`;
                }

                if (val) {
                    val = modifier(val);
                }
            }

            attrs[key] = val;
        });
        node.attrsMap = attrs;
    }

    return node;
};

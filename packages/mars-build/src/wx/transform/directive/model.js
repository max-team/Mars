/**
 * @file transform v-model
 * @description
 * 支持 input，textarea，picker，switch，radio-group，checkbox-group
 * 暂不支持 自定义组件
 * @author guoyong03
 */

const TYPE_LIST =  ['input', 'textarea', 'picker', 'switch', 'radio-group', 'checkbox-group'];

module.exports = function (name, value, attrs, node) {

    if (TYPE_LIST.indexOf(node.tag) === -1) {
        return;
    }
    switch (node.tag) {
        case 'input':
        case 'textarea':
            attrs['value'] = `{{${value}}}`;
            attrs['bindinput'] = 'handleModel';
            attrs['data-model'] = value;
            attrs['data-tag'] = 'input';
            break;
        case 'picker':
            attrs['value'] = `{{${value}}}`;
            attrs['bindchange'] = 'handleModel';
            attrs['data-model'] = value;
            attrs['data-tag'] = 'picker';
            break;
        case 'switch':
            attrs['checked'] = `{{${value}}}`;
            attrs['bindchange'] = 'handleModel';
            attrs['data-model'] = value;
            attrs['data-tag'] = 'switch';
            break;
        case 'radio-group':
        case 'checkbox-group':
            attrs['bindchange'] = 'handleModel';
            attrs['data-model'] = value;
            attrs['data-tag'] = 'radio';
            break;
    }
};

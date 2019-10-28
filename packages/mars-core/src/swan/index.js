/**
 * @file  runtime entry
 * @author zhangwentao
 */

import config from '../config';
config.$platform = 'swan';

export const $platform = 'swan';

export {config};

export {default as $api} from './nativeAPI';
export {default as createApp} from './createApp';
export {default as createPage} from './createPage';
export {default as createComponent, vueCompCreator} from './createComponent';
export {default as Vue} from '../base/vue/index';

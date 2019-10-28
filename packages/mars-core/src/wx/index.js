/**
 * @file  runtime entry
 * @author zhangwentao
 */
import config from '../config';
config.$platform = 'wx';
export const $platform = 'wx';

export {config};

export {default as $api} from './nativeAPI';
export {default as createApp} from './createApp';
export {default as createPage} from './createPage';
export {default as createComponent, vueCompCreator} from './createComponent';
export {default as Vue} from '../base/vue/index';

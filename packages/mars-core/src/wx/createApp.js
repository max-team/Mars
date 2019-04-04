/**
 * @file swan Component wrapper
 * @author zhangwentao <winty2013@gmail.com>
 */

import {makeCreateApp} from '../base/createApp';
import $api from './nativeAPI';

export default makeCreateApp($api);

/**
 * @file mixins
 * @author zhangwentao <winty2013@gmail.com>
 */

import $api from './nativeAPI';
import {makePageMixin, makeGetCompMixin} from '../base/mixins';

export {handleProxy, handleModel} from '../base/mixins';

export const getCompMixin = makeGetCompMixin($api);

export default makePageMixin($api);

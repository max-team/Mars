/**
 * @file 合并api
 * @author mars
 */

import * as system from './api/system';
import * as storage from './api/storage';
import * as file from './api/file';
import * as navigate from './api/navigate';
import * as selector from './api/selector';
import * as socket from './api/socket';
import * as other from './api/other';
import * as open from './api/open';
import * as interactive from './api/interactive';
import * as canvas from './api/canvas';
import * as pageInfo from './api/pageInfo';
import request from './api/request';
import {createAnimation, animationDirective} from './api/createAnimation';
import * as media from './api/media';
import * as battery from './api/battery';
import * as motion from './api/motion';
import * as clipboard from './api/clipboard';

export const directives = {
    animation: animationDirective
};

export default function initNativeApi(mars) {
    Object.assign(
        mars,
        system,
        storage,
        file,
        navigate,
        other,
        open,
        interactive,
        selector,
        socket,
        canvas,
        pageInfo,
        {
            request,
            createAnimation
        },
        media,
        battery,
        motion,
        clipboard
    );
}

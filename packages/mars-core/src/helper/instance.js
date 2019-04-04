/**
 * @file  props helper
 * @author zhangwentao
 */
/* global getApp */

export function getPageInstance($mp) {
    const uid = $mp.data.rootUID;
    const pages = getApp().__pages__;
    const page = pages[uid];
    if (!page) {
        throw new Error(`cannot find page instance for $mp ${$mp.data.compId}`, $mp);
    }
    return page;
}

export function getVMS($mp) {
    const page = getPageInstance($mp);
    return page.$vue.__vms__;
}
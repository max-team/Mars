/**
 * @file  props helper
 * @author zhangwentao
 */
/* global getApp, getCurrentPages */

export function getPageInstance($mp) {
    const uid = $mp.data.rootUID;
    let page;
    if (uid === -1) {
        const pages = getCurrentPages();
        page = pages[pages.length - 1];
    }
    else {
        page = getApp().__pages__[uid];
    }

    if (!page) {
        throw new Error(`cannot find page instance for $mp ${$mp.data.compId}`, $mp);
    }
    return page;
}

export function getVMS($mp) {
    const page = getPageInstance($mp);
    return page.$vue.__vms__;
}
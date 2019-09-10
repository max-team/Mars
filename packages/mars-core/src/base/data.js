/**
 * @file mixins
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-camelcase */
/* eslint-disable babel/new-cap */
/* eslint-disable no-console */
/* eslint-disable fecs-min-vars-per-destructure */

import {mark, measure} from '../helper/perf';
import deepEqual from '../helper/deepEqual';
import config from '../config';
import {getMpUpdatedCallbacks} from './api/mpNextTick';

// const {framework = {}} = config;

function cleanKeyPath(vm) {
    if (vm.__mpKeyPath) {
        Object.keys(vm.__mpKeyPath).forEach(_key => {
            delete vm.__mpKeyPath[_key].__changedKeys__;
            delete vm.__mpKeyPath[_key].__changed__;
        });
        delete vm.__mpKeyPath;
    }
}

export function setData(vm, $mp, isRoot = false) {
    let perfTagPre;
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        perfTagPre = `${vm._uid}-(${vm.compId})-${Date.now()}`;
        const perfTagStart = `${perfTagPre}-data-start`;
        mark(perfTagStart);
    }
    let data = {};
    data = getFiltersData(vm, $mp, data);

    if (!vm.__swan_inited__) {
        vm.__swan_inited__ = true;
        data = getData(vm, data);
        // compare initial data with $mp data
        // 从 swan properties 和 data 取到的初始数据都是 plain Object 不是 Vue 数据的引用
        data = compareInitialData($mp, data);

        if (isRoot) {
            // const rootComputed = getAllComputed(vm);
            // data.rootComputed = rootComputed;
            data.rootUID = $mp.__uid__;
        }
    }
    else {
        setTimeout(() => {
            cleanKeyPath(vm);
        }, 0);

        const changed = getChangedData(vm, vm._data);
        const computed = getChangedComputed(vm);
        data = Object.assign(data, computed, changed);
        // 如果后续数据更新 需要计算新增的实例上的 computed 值
        // const skipLaterCalc = framework.computed && framework.computed.skipLaterCalc;
        // if (!skipLaterCalc && Object.keys(data).length > 0) {
        //     const allComputed = getAllComputed(vm);
        //     data = Object.keys(allComputed).length > 0
        //         ? Object.assign(data, {
        //             [isRoot ? 'rootComputed' : 'compComputed']: allComputed
        //         })
        //         : data;
        // }
    }

    // if vm has _computedWatchers and has new data
    // set __inited__ true to use VM _computedWatchers data
    // need to sync comp rootComputed data
    // if (
    //     !$mp.data.__inited__
    //     && vm._computedWatchers
    //     && Object.keys(vm._computedWatchers).length > 0
    //     && Object.keys(data).length > 0
    // ) {
    //     data.__inited__ = true;
    //     const {rootComputed, compId} = $mp.data;
    //     let computedProps = {};
    //     if (rootComputed && compId) {
    //         computedProps = rootComputed[compId] || {};
    //     }
    //     data = Object.assign(computedProps, data);
    // }

    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        const perfTagStart = `${perfTagPre}-data-start`;
        const perfTagEnd = `${perfTagPre}-data-end`;
        mark(perfTagEnd);
        measure(`${perfTagPre}-data-collect`, perfTagStart, perfTagEnd);
    }

    if (Object.keys(data).length > 0) {
        if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
            // const perfTagPre = `${vm.$root.$mp.scope.__uid__}$${vm._name}`;
            const size = JSON.stringify(data).length / 1024;
            const perfTagStart = `${perfTagPre}-updated-start`;
            const perfTagEnd = `${perfTagPre}-updated-end`;

            mark(perfTagStart);

            const flushMpUpdatedCallbacks = getMpUpdatedCallbacks(vm);
            $mp.setData(data, () => {
                mark(perfTagEnd);
                measure(`${perfTagPre}-mpUpdated`, perfTagStart, perfTagEnd);
                flushMpUpdatedCallbacks();
            });
            console.info('[perf: setData]', perfTagPre, (size).toFixed(3) + 'KB', data);
        }
        else {
            const flushMpUpdatedCallbacks = getMpUpdatedCallbacks(vm);
            // console.log('[perf setData]:', data);
            $mp.setData(data, () => {
                flushMpUpdatedCallbacks();
            });
        }
    }
}

/**
 * compare Initial data with $mp.data and omit the same data
 *
 * @param {Object} $mp swan instance
 * @param {Object} data collected data from vm
 * @return {Object} data omited
 */
function compareInitialData($mp, data) {
    const mpData = $mp.data;
    // const {rootComputed, compId} = mpData;
    // let computedProps = {};
    // if (rootComputed && compId) {
    //     computedProps = rootComputed[compId] || {};
    // }
    Object.keys(data).forEach(key => {
        let mpVal = mpData[key];
        if (mpVal !== undefined && deepEqual(data[key], mpVal)) {
            delete data[key];
        }
    });

    return data;
}

function compareAndSetData(k, val, old, key, data) {
    if (!deepEqual(val, old)) {
        data[`_f_.${k}.` + key] = val;
    }
}

/*
optimised filter data
init:
{
    _f_: {
        0: {
            _t: ['Hello'],
            _p: {
                text: 'Olleh'
            }
        }
    }
}
update:
{
    '_f_.0._t.0: 'Olleh',
    '_f_.0._p.text: 'Hello',
    '_f_.1': {
        _t: [],
        _p: {}
    }
}
*/
function getFiltersData(vm, $mp, data = {}) {
    if (vm._fData) {
        const originFData = $mp.data._f_;
        if (!originFData) {
            data._f_ = {};
        }
        Object.keys(vm._fData).forEach(k => {
            // if vnode equals null, means its vif equals false
            let f = vm._fData[k];
            const {_t, _p, _if, _for} = f;

            const curData = originFData && originFData[k];
            if (!curData) {
                let kData = f;
                if (originFData) {
                    const key = `_f_.${k}`;
                    data[key] = kData;
                }
                else {
                    data._f_[k] = kData;
                }
            }
            else {
                _if !== undefined && compareAndSetData(k, _if, curData._if, '_if', data);
                _for !== undefined && compareAndSetData(k, _for, curData._for, '_for', data);
                // compare texts
                _t !== undefined && compareAndSetData(k, _t + '', curData._t, '_t', data);

                // compare props
                if (_p) {
                    Object.keys(_p).forEach(key => {
                        compareAndSetData(k, _p[key], curData._p[key], `_p.${key}`, data);
                    });
                }
            }
        });
    }
    return data;
}

function getData(vm, data = {}) {
    const dataKeys = getKeys(vm);
    dataKeys.forEach(key => {
        data[key] = vm[key];
    });
    // reset __changedKeys__
    if (vm._data.__ob__ && vm._data.__ob__.__changedKeys__) {
        const ob = vm._data.__ob__;
        ob.__changedKeys__ = null;
        delete ob.__changedKeys__;
    }

    return data;
}

function getKeys(vm) {
    return [].concat(
        Object.keys(vm._data || {}),
        // Object.keys(vm._props || {}),
        Object.keys(vm._computedWatchers || {})
    );
}

// function quickEquel(a, b) {
//     return JSON.stringify(a) === JSON.stringify(b);
// }

function getChangedData(vm, _data, keyPath = '', ret = {}) {
    const {__ob__: ob} = _data;
    if (!ob) {
        return ret;
    }
    const {__changedKeys__: changedKeys, __isArray__: isArray} = ob;
    vm.__mpKeyPath = vm.__mpKeyPath || {};

    if (ob.__changed__ || ob.__changedKeys__) {
        vm.__mpKeyPath[ob.dep.id] = ob;
    }
    // wx 通过下标更新数组有问题 暂时全部更新
    if (
        ob.__changed__
        || (config.$platform === 'wx' && ob.__isArray__ && changedKeys)
    ) {
        ret[keyPath] = _data;
    }
    else {
        Object.keys(_data).forEach(key => {
            const data = _data[key];
            let path = (keyPath ? `${keyPath}.` : '') + key;
            if (changedKeys && changedKeys[key]) {
                ret[path] = data;
            }
            else if (data instanceof Object) {
                getChangedData(vm, data, path, ret);
            }
        });
    }
    return ret;
}

function getChangedComputed(vm) {
    let data = {};
    Object.keys(vm._computedWatchers || {}).forEach(key => {
        const watcher = vm._computedWatchers[key];
        if (watcher.__changed__) {
            data[key] = vm[key];
            delete watcher.__changed__;
        }

    });
    return data;
}

// function getAllComputed(vm, ret = {}) {
//     const compId = vm.compId;
//     const inited = vm.__swan_inited__;
//     // const inited = vm.$mp && vm.$mp.scope.data.__inited__;
//     // rootVM (Page) 上没有 compId, 也不需要取 _computedWatchers
//     if (compId && !inited) {
//         let keys = Object.keys(vm._computedWatchers || {});
//         if (keys.length > 0) {
//             let data = {};
//             keys.forEach(key => {
//                 data[key] = vm[key];
//             });
//             ret[compId] = data;
//         }
//     }

//     if (vm.$children) {
//         vm.$children.forEach(c => getAllComputed(c, ret));
//     }

//     return ret;
// }

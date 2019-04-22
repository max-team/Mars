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

const {framework = {}} = config;

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
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        const prefix = `${vm.$root.$mp.scope.__uid__}$${vm._name}`;
        const perfTagStart = `${prefix}-data-start`;
        // const perfTagEnd = `${this.route}-end`;
        mark(perfTagStart);
    }
    let data = {};
    data = getFiltersData(vm, $mp, data);

    if (!vm.__swan_inited__) {
        vm.__swan_inited__ = true;
        data.__inited__ = true;
        isRoot && (data.rootUID = $mp.__uid__);
        data = getData(vm, data);
        if (isRoot) {
            const rootComputed = getAllComputed(vm);
            data = Object.assign(data, {
                rootComputed
            });
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
        const skipLaterCalc = framework.computed && framework.computed.skipLaterCalc;
        if (!skipLaterCalc && Object.keys(data).length > 0) {
            const allComputed = getAllComputed(vm);
            data = Object.keys(allComputed).length > 0
                ? Object.assign(data, {
                    [isRoot ? 'rootComputed' : 'compComputed']: allComputed
                })
                : data;
        }
    }

    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        const prefix = `${vm.$root.$mp.scope.__uid__}$${vm._name}`;
        const perfTagStart = `${prefix}-data-start`;
        const perfTagEnd = `${prefix}-data-end`;
        mark(perfTagEnd);
        measure(`${prefix}-data-collect`, perfTagStart, perfTagEnd);
    }

    if (Object.keys(data).length > 0) {
        if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
            const prefix = `${vm.$root.$mp.scope.__uid__}$${vm._name}`;
            const size = JSON.stringify(data).length / 1024;
            const perfTagStart = `${prefix}-updated-start`;
            const perfTagEnd = `${prefix}-updated-end`;
            let perfShowDataSize = false;
            if (size > 1) {
                perfShowDataSize = true;
                mark(perfTagStart);
                console.info('[perf: data size]', prefix, (size).toFixed(3) + 'KB', data);
            }

            const flushMpUpdatedCallbacks = getMpUpdatedCallbacks(vm);
            $mp.setData(data, () => {
                if (perfShowDataSize) {
                    mark(perfTagEnd);
                    measure(`${prefix}-data-updated`, perfTagStart, perfTagEnd);
                }

                flushMpUpdatedCallbacks();
            });
        }
        else {
            const flushMpUpdatedCallbacks = getMpUpdatedCallbacks(vm);
            $mp.setData(data, () => {
                flushMpUpdatedCallbacks();
            });
        }
    }
}

function compareAndSetData(k, val, old, key, data) {
    if (!deepEqual(val, old)) {
        data[`_f_.${k}.` + key] = val;
    }
}

function getFiltersData(vm, $mp, data = {}) {
    /*
    optimised filter data
    init:
    {
        _f_: {
            0: {
                _if: true,
                _t: ['Hello'],
                _p: {
                    test: 'text'
                }
            }
        }
    }
    update:
    {
        '_f_.0._if': false,
        '_f_.0._t.0: 'Olleh',
        '_f_.0._p.test: 'test',
        '_f_.1': {
            _t: [],
            _p: {}
        }
    } */

    if (vm._fData) {
        const originFData = $mp.data._f_;
        if (!originFData) {
            data._f_ = {};
        }
        Object.keys(vm._fData).forEach(k => {
            // if vnode equals null, means its vif equals false
            let vnode = vm._fData[k];
            const vnodeFData = vnode
                ? (vnode.data && vnode.data.f || {})
                : {if: false};

            const {t: texts, p: props, for: _for} = vnodeFData;
            const _if = !!vnodeFData.if;
            let propsData = {};
            if (vnode && props) {
                propsData = vnode.componentOptions
                    ? vnode.componentOptions.propsData
                    : (vnode.data && vnode.data.attrs);
            }

            const curData = originFData && originFData[k];
            if (!curData) {
                let kData = {};
                kData = {
                    _if,
                    _for
                };
                if (props) {
                    kData._p = kData._p || {};
                    props.forEach(key => {
                        kData._p[key] = propsData[key];
                    });
                }
                if (texts) {
                    kData._t = kData._t || {};
                    texts.forEach((t, index) => {
                        kData._t[index] = t + '';
                    });
                }
                if (originFData) {
                    const key = `_f_.${k}`;
                    data[key] = kData;
                }
                else {
                    data._f_[k] = kData;
                }
            }
            else {
                compareAndSetData(k, _if, curData._if, '_if', data);
                compareAndSetData(k, _for, curData._for, '_for', data);
                // compare texts
                if (texts) {
                    texts.forEach((t, index) => {
                        compareAndSetData(k, t + '', curData._t[index], `_t.${index}`, data);
                    });
                }
                // compare props
                if (props) {
                    props.forEach(key => {
                        compareAndSetData(k, propsData[key], curData._p[key], `_p.${key}`, data);
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

    const {__changedKeys__: changedKeys} = ob;
    vm.__mpKeyPath = vm.__mpKeyPath || {};

    if (ob.__changed__ || ob.__changedKeys__) {
        vm.__mpKeyPath[ob.dep.id] = ob;
    }

    if (ob.__changed__) {
        ret[keyPath] = _data;
    }
    else {
        Object.keys(_data).forEach(key => {
            const data = _data[key];
            const path = (keyPath ? `${keyPath}.` : '') + key;
            if (changedKeys && changedKeys[key]) {
                ret[path] = data;
            // if (data instanceof Object) {
            //     // if (quickEquel()) {
            //     // }
            // }
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

function getAllComputed(vm, ret = {}) {
    const compId = vm.compId;
    const inited = vm.__swan_inited__;
    // const inited = vm.$mp && vm.$mp.scope.data.__inited__;
    // rootVM (Page) 上没有 compId, 也不需要取 _computedWatchers
    if (compId && !inited) {
        let keys = Object.keys(vm._computedWatchers || {});
        if (keys.length > 0) {
            let data = {};
            keys.forEach(key => {
                data[key] = vm[key];
            });
            ret[compId] = data;
        }
    }

    if (vm.$children) {
        vm.$children.forEach(c => getAllComputed(c, ret));
    }

    return ret;
}

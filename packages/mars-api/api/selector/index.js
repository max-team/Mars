/**
 * @file Selector API
 * @author: zhaolongfei
 * @Date: 2019-03-02 12:03:26
 * @Last Modified by: zhaolongfei
 * @Last Modified time: 2019-03-02 19:23:48
 */

class Selector {
    constructor() {
        this.$root = document;
        this.$doms = [];
        this.queue = [];
    }

    _domStrMapToObj(domStrMap) {
        let obj = {};

        for (let key in domStrMap) {
            if (typeof domStrMap[key] !== 'function') {
                obj[key] = domStrMap[key];
            }
        }

        return obj;
    }

    /* eslint-disable */
    in(component) {
        this.$root = component.$el;
        return this;
    }
    /* eslint-ensable */

    select(selector) {
        // 小程序里跨自定义组件的后代选择器 '>>>' 在 h5 替换为普通后代选择器 '>'
        if (typeof selector === 'string') {
            selector = selector.replace('>>>', '>');
        }
        this.$doms.push(this.$root.querySelector(selector));
        return this;
    }

    selectAll(selector) {
        if (typeof selector === 'string') {
            selector = selector.replace('>>>', '>');
        }
        // NodeList to Array
        this.$doms.push(Array.prototype.slice.apply(this.$root.querySelectorAll(selector)));
        return this;
    }

    selectViewport() {
        this.$doms.push(document.querySelector('html'));
        return this;
    }

    _addQueryQueue(query, fields, cb) {
        this.queue.push({
            query,
            fields,
            cb
        });
    }

    _filterRects(doms, fields = {}) {
        if (!(doms instanceof Array)) {
            doms = [doms];
        }

        const {
            id = false,
                dataset = false,
                rect = false,
                size = false,
                scrollOffset = false,
                properties = [],
                computedStyle = []
        } = fields;

        const rects = doms.reduce(
            (accumulator, dom) => {
                let info = {
                    id: dom.id,
                    dataset: this._domStrMapToObj(dom.dataset),
                    ...this._domStrMapToObj(dom.getBoundingClientRect())
                };

                !id && delete info.id;
                !dataset && delete info.dataset;
                !rect && (delete info.top, delete info.left, delete info.right, delete info.bottom);
                !size && (delete info.width, delete info.height);

                scrollOffset && (info.scrollTop = dom.scrollTop, info.scrollLeft = dom.scrollLeft);

                if (properties.length) {
                    properties.forEach(prop => {
                        const attr = dom.getAttribute(prop);
                        if (attr) {
                            info[prop] = attr;
                        }
                    })
                }

                if (computedStyle.length) {
                    const styles = window.getComputedStyle(dom);
                    computedStyle.forEach(key => {
                        const value = styles.getPropertyValue(key);
                        if (value) {
                            info[key] = value;
                        }
                    });
                }

                accumulator.push(info);
                return accumulator;
            },
            []
        );

        const res = doms.length === 1 ? rects[0] : rects;

        return res;
    }

    _boundingClientRect(fields, doms, cb) {
        return new Promise((resolve, reject) => {
            const rect = this._filterRects(doms, {
                ...fields
            });

            cb && cb(rect);

            resolve(rect);
        });
    }

    boundingClientRect(cb) {
        this._addQueryQueue('_boundingClientRect', {
            id: true,
            dataset: true,
            size: true,
            rect: true
        }, cb);
        return this;
    }

    _scrollOffset(fields, doms, cb) {
        return new Promise((resolve, reject) => {
            const rect = this._filterRects(doms, {
                ...fields
            });

            cb && cb(rect);

            resolve(rect);
        });
    }

    scrollOffset(cb) {
        this._addQueryQueue('_scrollOffset', {
            id: true,
            dataset: true,
            scrollOffset: true
        }, cb);
        return this;
    }

    _fields(fields, doms, cb) {
        return new Promise((resolve, reject) => {
            const rect = this._filterRects(doms, {
                ...fields
            });

            cb && cb(rect);

            resolve(rect);
        });
    }

    fields(fields, cb) {
        this._addQueryQueue('_fields', fields, cb);
        return this;
    }

    exec(cb) {
        let querys = [];

        for (let item of this.queue) {
            const dom = this.$doms.shift();

            if (!dom || dom instanceof Array && dom.length === 0) {
                // 选择器不存在（错误或在h5中不存在）
                querys.push(Promise.resolve(null));
            } else {
                querys.push(this[item.query](item.fields, dom, item.cb));
            }
        }

        Promise.all(querys).then(res => {
            cb && cb(res);
        });
    }
}

export function createSelectorQuery() {
    return new Selector();
}
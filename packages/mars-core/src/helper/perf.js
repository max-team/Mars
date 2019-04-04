/**
 * @file  pref helper
 * @author zhangwentao
 */

// import { inBrowser } from './env'
export let mark;
export let measure;

if (process.env.NODE_ENV !== 'production') {
    const perf = global.performance;
    /* istanbul ignore if */
    if (
        perf
        && perf.mark
        && perf.measure
        && perf.clearMarks
        && perf.clearMeasures
    ) {
        mark = tag => perf.mark(tag);
        measure = (name, startTag, endTag) => {
            perf.measure(name, startTag, endTag);
            const duration = perf.getEntriesByName(name)[0].duration;
            duration > 1 && console.info('[perf: measure]', name, parseFloat(duration.toFixed(3)));
            perf.clearMarks(startTag);
            perf.clearMarks(endTag);
            perf.clearMeasures(name);
        };
    }
}

/**
 * @file  config helper
 * @author zhangwentao
 */

export default {
    performance: false,
    debug: {
        events: false,
        lifetimes: false
    },
    framework: process.env.MARS_CONFIG_FRAMEWORK
};

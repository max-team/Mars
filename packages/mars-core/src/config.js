/**
 * @file  config helper
 * @author zhangwentao
 */

export default {
    performance: false,
    debug: {
        lifetimes: false,
        events: false
    },
    framework: process.env.MARS_CONFIG_FRAMEWORK
};

/**
 * @file  config helper
 * @author zhangwentao
 */

export default {
    performance: true,
    debug: {
        events: true,
        lifetimes: false
    },
    framework: process.env.MARS_CONFIG_FRAMEWORK
};
/**
 * @file  config helper
 * @author zhangwentao
 */

export default {
    performance: true,
    debug: {
        lifetimes: true,
        events: false
    },
    framework: process.env.MARS_CONFIG_FRAMEWORK
};

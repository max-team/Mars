/**
 * @file  h5 runtime entry
 * @description this file is for H5 runtime, and will be copied directly without compile or pack
 * @author zhangwentao
 */
export {default as Vue} from 'vue';
export const config = {
    $platform: 'h5',
    router: {
        mode: undefined,
        base: undefined
    }
};

export const $platform = 'h5';

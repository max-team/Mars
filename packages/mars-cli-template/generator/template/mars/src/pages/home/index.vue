<template>
    <view class="home-wrap">
        <view class="home-text">Vue 驱动的多端开发框架</view>
        <hello></hello>
    </view>
</template>

<script>
import Hello from '../../components/Hello/Hello';

export default {
    config: {
        navigationBarTitleText: 'Mars'
    },
    data() {
        return {};
    },
    components: {
        hello: Hello
    }
};

</script>
<style>
.home-wrap {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.home-text {
    font-size: 24px;
    line-height: 1.3;
    color: #6a8bad;
    text-align: center;
}
</style>

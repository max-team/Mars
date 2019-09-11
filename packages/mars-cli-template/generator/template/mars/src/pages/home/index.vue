<template>
    <view class="home-wrap">
        <view class="home-text">Vue 驱动的多端开发框架</view>
        <Hello></Hello>
    </view>
</template>

<script type="config">
{
    config: {
        navigationBarTitleText: 'Mars'
    }
}
</script>

<script>
import Hello from '../../components/Hello/Hello';

export default {
    data() {
        return {};
    },
    components: {
        Hello
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

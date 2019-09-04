<template>
    <div
        class="tab-bar-wrap"
        :style="{
            borderTop: `1px ${borderStyle === 'black' ? '#eee' : '#fff'} solid`,
            backgroundColor: backgroundColor,
            color: color
        }"
    >
        <router-link
            v-for="(item, index) in tabList"
            :key="index"
            :to="item.pagePath"
            class="tab-item-link"
            :style="{
                width: `${1 / tabList.length * 100}%`,
                color: currentPath === item.pagePath ? selectedColor : color
            }"
        >
            <div
                v-if="item.iconPath"
                class="tab-item icon-and-text"
                @click="tap(item, index)"
            >
                <div
                    class="tab-item-icon"
                    :style="{
                        backgroundImage: `url(${require('../../../tabBarIcons/'
                        + (currentPath === item.pagePath ? item.selectedIconPath : item.iconPath))})`
                    }"
                >
                    <div
                        v-if="item.badge"
                        class="tab-item-badge"
                    >
                        {{ item.badge }}
                    </div>
                    <div
                        v-else-if="!item.badge && item.showRedDot"
                        class="tab-item-red-dot"
                    >
                    </div>
                </div>
                <div class="tab-item-text">{{ item.text }}</div>
            </div>
            <div
                v-else
                class="tab-item"
            >
                <span class="tab-link">{{ item.text }}</span>
            </div>
        </router-link>
    </div>
</template>

<script >
export default {
    props: {
        tabList: { 
            type: Array,
            default: []
        },
        selectedColor: {
            type: String,
            default: '#3388ff'
        },
        color: {
            type: String,
            default: '#a2a2a2'
        },
        backgroundColor: {
            type: String,
            default: '#fff'
        },
        currentPath: {
            type: String
        },
        borderStyle: {
            type: String,
            default: '#fff'
        }
    },
    methods: {
        tap(item, index) {
            this.$emit('tab-item-tap', {
                index: `${index}`,
                text: item.text,
                pagePath: item.pagePath.replace(/^\//, '')
            });
        }
    }
}
</script>


<style lang="less" scoped>
.tab-bar-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 45px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    align-content: flex-start;
    flex-wrap: nowrap;
    z-index: 300;
}
.tab-item {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
}

.icon-and-text {
    flex-direction: column;
    height: 45px;
}
.tab-item-link {
    text-decoration-line: none;
}

.tab-item-badge {
    position: relative;
    display: inline-block;
    top: -5px;
    left: 10px;
    color: #fff;
    background-color: red;
    border-radius: 5px;
    padding: 0 2px;
    white-space: nowrap;
}
.tab-item-red-dot {
    position: relative;
    display: inline-block;
    top: 0px;
    left: 10px;
    color: #fff;
    background-color: red;
    border-radius: 5px;
    width: 10px;
    height: 10px;
}
.tab-item-icon {
    width: 20px;
    height: 20px;
    background-position: center;
    background-size: cover;
}
</style>

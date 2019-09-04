<template>
    <div
        class="swan-app-navigation-bar"
    >
        <div
            :class="navigationStyle === 'default' ? 'default' : 'custom'"
            align="center"
            :style="{
                transitionProperty: 'background-color, color',
                transitionDuration: transitionDuration,
                transitionTimingFunction: transitionTimingFunc,
                backgroundColor: backgroundColor,
                color: textStyle,
                borderBottom: (navigationStyle === 'default' && showBottomBorder) ? '1px #ccc solid' : null
            }"
        >
            <router-link
                v-show="!isHomePage"
                class="return-to-home"
                :class="[homeIconColor === 'dark' ? 'dark' : 'light']"
                to="/pages/home/index"/>
            <div
                v-if="navigationStyle === 'default'"
                class="title"
            >
                <div class="title-inner">
                    {{ title }}
                </div>
            </div>
        </div>
    </div>
</template>

<script >
export default {
    props: {
        transitionDuration: {
            type: Number,
            default: 0
        },
        transitionTimingFunc: {
            type: String,
            default: 'linear'
        },
        backgroundColor: {
            type: String
        },
        textStyle: {
            type: String
        },
        showBottomBorder: {
            type: Boolean,
            default: true
        },
        homeIconColor: {
            type: String,
            default: 'dark'
        },
        title: {
            type: String
        },
        isHomePage: {
            type: Boolean,
            default: false
        },
        navigationStyle: {
            type: String,
            default: 'default'
        }
    }
}
</script>


<style lang="less" scoped>
.swan-app-navigation-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 920;
    .dark {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEZ0lEQVRoQ+2ZTYgcRRTH3yt7Yza7YhYhyIIyyaIz1qvF00JcFCKCHgwaUAQVMYkH40mPbg6CoElAhHgQvUhyUAKKEDE5xA8IGKKil7j1emYWcVcCCQQCgssa0tNdUkt16J3tme6Z6dnZwNRtpqre+//qVb2qN4Nwmze8zfXDEKBVBKWU9wshfgeAP4MgeL5er1/pR7T7EoFKpXKP53m/AcBOK9oYsxCG4WytVrteNEThAOVy+S7P835CxIeTYo0xlxqNxmP1ev3fIiEKBSiVSlvHx8d/BIDZFiIvLi8vP7G0tHSjKIgiATwiOouITzpxK1EUPY6IIwDwAyJuddvpO2Z+GgAaRUAUBSCI6EtEfM6JvImIT2mtz9vPSikLdRYAPNf/NTO/AABRrxCFABDRCUTc78RFiPis1vpMUhwRWbivEHHVpzHmJDMfGDiAUuoIAMzFQqIoOuD7/sk0YUqpQwDwSWLsR77vv9ULRE8RUEq9CQDHE4LmfN8/1k6QUuowALyfmHPY9/2j3UJ0DSCl3C+EONHNakopjwshLHzc3tBaf9oNRFcAbj/bQyvcfj7FzC91IqDp3BgAeJmZT3Viw47tGEAptQcAvk9klDPMvA8Awg6d28z1DSLudfPs/H3Nhz/LZkcARDSDiDY1bnOGL9pc7/v+zSxHaf1Syi1CiHMAYBfFZqY16TePzdwAUkoSQlwAgO3OWSFPg8nJyW0TExPnEXHGCV4xxuxhZvuWymy5AKanp3cZY34GgB3O4mKj0Zgp6nFWKpW2j42NXUBEcvb/iaLoUd/3OYsgE6BcLk+OjIz8AgD3uZW/goi7tdaXs4x30j81NbVjdHTU+ll9wQLANUR8ZH5+/q92dtoCuJX5FREfdOKvu2fxQifi8o5VStlFsjVEHOnLQRDsbldLtARosTdnmflSXkHdjEs5a21riVSAIrJDN+LjOc3Zrl0tkQZwBxGdjvOzMSb1cdaLwDxz7X1jjDmHiFvilJ1WSzQDIBF9gYgvxk7aPc7yCOlljFJqrzHGXnbxjb+ullgDQERHEfHtNKfuknlXa21fn31rRPQqIn4MAGMtnHyutX4l7msGuIqI97ZRF2it45D2BYKI6nHWa+VAa22rvNWKbg2AUuo1APgQAO5uMznz7uiFjIgWEbHUwsZ/xpgjzPxeagRaOVZK2dfiatNabxhAEAS76vX6YrsFySVmCNDBnkpuoQ2NgJTydSFErqrKGHOMmW/V0Um+gQEQkY+ID+Vc7BWtdWqaHCTAAiI+kBOg4VLhuuGbAsAY8wwzf5tUV6lUpj3P+8N9t7kBwjAsVavVv5uXN5HNhgCFX2REdOsMDCPgnhIbeg8MI+A29aZIo8Mz0M8zkOemzRGBPGagsENMRDcQ8c5cXm2p1GjsrNVqS03j7Y+5QVzf5rEVhuFktVq92nM9IKWcE0LkqYXt75qnmdnWrOv+/1JKfQYAB7PEG2Psv5gfMPM7WWNzFTRZRgbZPwQY5Opb3/8Dcc3uT4aa/8AAAAAASUVORK5CYII=');
    }
    .light {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADqUlEQVRoQ+2ZTcgVZRTHf//KikIKhAihMMEgQloFFgVKUIuigiLQkDIX1cqW6SII1IQIahG1iVwUQhEk1qIPQSisqE1BQRF9EBQEQhBYpPWPv8yVee87c+e575373le4Z3fvzJzn/M55nvMxI85x0TluP3OAtgjavhr4AvgeuF/Sr9OI9lQiYHsN8DlwTWX0d8DNkk70DdE7gO3VwEfADUPGfgncKunPPiF6BbB9MXA03m4x8jhwm6S/+4LoDcD2BcC7wO2VcSeBLcAq4EMgcJH3gTslne4DohcA2+cBbwD3VUb9A9wh6Vh+2w5U4AIZeQt4QNJ/k0L0BfAq8HBlTIy6R9I7deNsB+5NOJu6D0raMXMA2/uB3TVDdkg62GSY7ceAl2rXXpD0xCQQE0XA9i7g+ZoBuyUdGGWQ7T3Avto9eyQ9s1SIJQPYzpbJ1hlIsTdtBzrwA3lc0stLgVgSQLWfc2hzeCOHJG0bxwDb9XNj4EFJh8bRkXvHBrC9GfigllFyWO+V9O84i1eZ6zBwV/Vcno+eBYe/S+dYALZvBJIaL6kUpzBtkZS0ObbYvhB4D4hTIgvSb4nCYgDb1wMfA5dXintpDWzHGXFKnBNJAdwsKb1UpxQB2F4PfAJcUWn8MQv21ZzZjlPinDgp8gdwi6Svuwg6AWyvBT4FrqqUpS3eJOmXLuXjXLcd52SdQQf7O3CTpB9G6RkJUHnmM+DaSkna4bTFaY97F9txUmaIQaTjpDirdZZoBWjZmzE+e39q0nDWRs4SjQB9ZIdJCBuyXWvCWARg+3zg7Vp+bmzOJjGw5Nmq3iTFJtVGGmeJBQC28/t1YGttkdbmrMSQSe6xnSKXYjeo+ItmiWGANFVPtiyaIvO0pHSfUxPbDwEvApe2LPKapO2Da8MAvwFXjrDulKRBSKcCYfvbWtZrW2PVYKIbBtgJPAdc1vakpM7aMQmZ7RTJdS06/gL2S9rbGIG2hW2nWzwjywywXlKAWqXIm3OAMfbU0BZavgjYfhQonaoOSKrP0WcRZwnwDXBdobNPSmpMk7MESM+yoRDgtKS88FokKwXgbklH6tbZ3gh8Vf234gHWSfp52L21bDYH6L2Q2a6fgXkEKg8vax2YRyBeXylpdH4GpnYGCittVwQK1dDbIc5HuYtKV83LKUk/DVXizLWnavNtibq1kjIlTjwPpHMsmYXzXjNvNLY3ff+y/QrwSIHlcdizkp7qurdooOlSMsvrc4BZej9r/w9jZwdPlfANnQAAAABJRU5ErkJggg==');
    }

    .default {
        padding: 4px 0;
        font-size: 16px;
        

        .title {
            width: 100%;
            padding: 0 98px;
            line-height: 30px;
            box-sizing: border-box;
            height: 30px;
            .title-inner {
                display: block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .return-to-home {
            float: right;
            margin-right: 20px;
            width: 25px;
            height: 25px;
            border-radius: 2px;
            background-position: center center;
            background-size: 20px;
            background-repeat: no-repeat;
        }
    }
    
    .custom {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 0;

        .return-to-home {
            position: absolute;
            top: 6px;
            right: 20px;
            width: 25px;
            height: 25px;
            border-radius: 2px;
            background-position: center center;
            background-size: 20px;
            background-repeat: no-repeat;
        }
    }
    
}
</style>


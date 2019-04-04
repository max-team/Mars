/**
 * @file 描述用户动画的文件
 * @author houyu
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */
const commonMethodList = {
    opacity: {
        type: 'normal'
    },
    backgroundColor: {type: 'normal', originProperty: 'background-color'},
    width: {
        type: 'normal'
    },
    height: {
        type: 'normal'
    },
    left: {
        type: 'normal'
    },
    right: {
        type: 'normal'
    },
    top: {
        type: 'normal'
    },
    bottom: {
        type: 'normal'
    },
    translateY: {
        type: 'transform'
    },
    translateX: {
        type: 'transform'
    },
    translateZ: {
        type: 'transform'
    },
    translate3d: {
        type: 'transform'
    },
    translate: {
        type: 'transform'
    },
    skewY: {
        type: 'transform'
    },
    skewX: {
        type: 'transform'
    },
    skew: {
        type: 'transform'
    },
    matrix: {
        type: 'transform'
    },
    matrix3d: {
        type: 'transform'
    },
    rotate: {
        type: 'transform'
    },
    rotateX: {
        type: 'transform'
    },
    rotateY: {
        type: 'transform'
    },
    rotateZ: {
        type: 'transform'
    },
    rotate3d: {
        type: 'transform'
    },
    scale: {
        type: 'transform'
    },
    scaleX: {
        type: 'transform'
    },
    scaleY: {
        type: 'transform'
    },
    scaleZ: {
        type: 'transform'
    },
    scale3d: {
        type: 'transform'
    }
};
const commonAnimateMethodMaker = method => function (...args) {
    this.currentCommandSet[method] = {
        type: commonMethodList[method].type,
        rule: {property: commonMethodList[method].originProperty || method, value: [...args]}
    };
    return this;
};
const commonMethod = (methodList, animateMethodMaker) => target => {
    Object.keys(methodList)
        .forEach(method => {
            target.prototype[method] = animateMethodMaker(method);
        });
};
@commonMethod(commonMethodList, commonAnimateMethodMaker)
class Animation {
    constructor({
            duration = 400,
            timingFunction = 'linear',
            delay = 0,
            transformOrigin = '50% 50% 0'
        }) {
        this.commandSetQueue = [];
        this.currentCommandSet = {};
        this.duration = duration;
        this.timingFunction = timingFunction;
        this.delay = delay;
        this.transformOrigin = transformOrigin;
    }
    step(additionalConfiguration = {}) {
        this.commandSetQueue.push({...this.currentCommandSet, additionalConfiguration});
        return this;
    }
    export() {
        const originCommandSetQueue = this.commandSetQueue;
        this.commandSetQueue = [];
        this.currentCommandSet = {};
        return {
            commandSetQueue: originCommandSetQueue,
            configuration: {
                duration: this.duration,
                timingFunction: this.timingFunction,
                delay: this.delay,
                transformOrigin: this.transformOrigin
            }
        };
    }
}
export const createAnimation = (animationConfig = {}) => {
    return new Animation(animationConfig);
};
// const supplyUnit = (value, unit = 'px') => (value + '').replace(new RegExp(`(${unit})?$`, 'g'), unit);
const supplyUnit = (value, unit = 'px') => (value + '').replace(/^(-?\d+(\.\d+)?)$/g, ($1, $2) => `${$2}${unit}`);

/**
 * transform类型的属性，转换为css transform模式，依照下面的字典，进行指导
 */
const animateProperReflection = {
    matrix: values => `matrix(${values.join(',')})`,
    matrix3d: values => `matrix3d(${values.join(',')})`,
    rotate: values => `rotate(${values.map(value => supplyUnit(value, 'deg'))[0]})`,
    rotate3d: values => `rotate3d(${
        values.map((value, index) => index === 3 ? supplyUnit(value, 'deg') : value).join(',')
        })`,
    rotateX: values => `rotateX(${supplyUnit(values[0], 'deg')})`,
    rotateY: values => `rotateY(${supplyUnit(values[0], 'deg')})`,
    rotateZ: values => `rotateZ(${supplyUnit(values[0], 'deg')})`,
    scale: values => `scale(${values.join(',')})`,
    scale3d: values => `scale3d(${values.join(',')})`,
    scaleX: values => `scaleX(${values[0]})`,
    scaleY: values => `scaleY(${values[0]})`,
    scaleZ: values => `scaleZ(${values[0]})`,
    translate: values => `translate(${values.map(value => supplyUnit(value)).join(',')})`,
    translate3d: values => `translate3d(${values.map(value => supplyUnit(value)).join(',')})`,
    translateX: values => `translateX(${supplyUnit(values[0])})`,
    translateY: values => `translateY(${supplyUnit(values[0])})`,
    translateZ: values => `translateZ(${supplyUnit(values[0])})`,
    skew: values => `skew(${values.map(value => supplyUnit(value, 'deg')).join(',')})`,
    skewX: values => `skewX(${supplyUnit(values[0], 'deg')})`,
    skewY: values => `skewY(${supplyUnit(values[0], 'deg')})`,
    width: values => `${supplyUnit(values[0])}`,
    height: values => `${supplyUnit(values[0])}`,
    top: values => `${supplyUnit(values[0])}`,
    right: values => `${supplyUnit(values[0])}`,
    bottom: values => `${supplyUnit(values[0])}`,
    left: values => `${supplyUnit(values[0])}`
};

/**
 * 转换动画的command为元素应用的style
 * @param {Object} [commandSetQueue] animation的指令对象
 * @param {Object} [configuration] animation的指令对
 * @return {Object} 转换后的元素的transition对象
 */
const convertStep2Styles = ({commandSetQueue = [], configuration}) => {
    return commandSetQueue
        .map(currentCommandSet => {
            // transform类的，特殊处理，因为其css的特殊性
            const transformValue = Object.keys(currentCommandSet)
                .filter(commandKey => currentCommandSet[commandKey].type === 'transform')
                .map(commandKey => {
                    const command = currentCommandSet[commandKey];
                    return animateProperReflection[command.rule.property](command.rule.value);
                })
                .join(' ');
            const styleSet = Object.keys(currentCommandSet)
                .filter(commandKey => currentCommandSet[commandKey].type === 'normal')
                .map(commandKey => {
                    const originValue = currentCommandSet[commandKey].rule.value;
                    const processedValue = animateProperReflection[commandKey]
                        ? animateProperReflection[commandKey](originValue)
                        : originValue;
                    return {
                        property: currentCommandSet[commandKey].rule.property,
                        value: processedValue
                    };
                })
                .concat([{
                    property: 'transform',
                    value: transformValue
                }]);
            const {
                delay,
                duration,
                timingFunction,
                transformOrigin
            } = {
                ...configuration,
                ...currentCommandSet.additionalConfiguration
            };
            return {
                styleSet,
                transition: `${duration}ms ${timingFunction} ${delay}ms`,
                transitionProperty: styleSet.map(rule => rule.property).join(','),
                transformOrigin: transformOrigin
            };
        });
};

/**
 * 对于要设定的样式，判断当前的EL是不是已经是那个样式
 * @param {Object} [el] 原DOM
 * @param {Object} [stepStyles] 要设置的样式
 * @return {boolean} 要设定的样式，和当前样式是否全部一样
 */
const allSameStyle = (el, stepStyles) => {
    return stepStyles.styleSet
        .every(styleRule => {
            return (
                styleRule.property === 'transform'
                    ? el.style.webkitTransform
                    : el.style[styleRule.property]
                ) === styleRule.value;
        });
};

/**
 * 动画效果应用
 * @param {Object} [el] 需要做动画效果的element
 * @param {Object} [animateCommands] 动画指令对象
 * @return {Promise} 动画结束的promise对象
 */
export const animationEffect = (el, animateCommands) => new Promise((resolve, reject) => {
    const styleQueue = convertStep2Styles(animateCommands);
    let step = 0;
    const animateStep = () => {
        const stepStyles = styleQueue[step++];
        if (!stepStyles) {
            el.removeEventListener('transitionend', animateStep);
            el.removeEventListener('-webkit-transitionend', animateStep);
            resolve(styleQueue);
            return styleQueue;
        }

        if (allSameStyle(el, stepStyles)) {
            Promise.resolve().then(() => {
                el.dispatchEvent(new Event('transitionend'));
            });
        }

        el.style.transition = stepStyles.transition;
        el.style.transitionProperty = stepStyles.transitionProperty;
        el.style.transformOrigin = stepStyles.transformOrigin;
        el.style.webkitTransition = stepStyles.transition;
        el.style.webkitTransitionProperty = stepStyles.transitionProperty;
        el.style.webkitTransformOrigin = stepStyles.transformOrigin;
        stepStyles.styleSet.forEach(styleRule => {
            el.style[styleRule.property] = styleRule.value;
            if (styleRule.property === 'transform') {
                el.style.webkitTransform = styleRule.value;
            }

        });
    };
    el.addEventListener('transitionend', animateStep);
    el.addEventListener('-webkit-transitionend', animateStep);
    animateStep();
});

/**
 * 动画效果指令 v-animation
 */
export const animationDirective = {
    update(el, binding, vnode) {
        const {value: animateCommands} = binding;
        animationEffect(el, animateCommands);
    }
};

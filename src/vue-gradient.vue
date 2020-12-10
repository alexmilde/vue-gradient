<script>
const Color = require("color");
const transitionSpeedDefault = 0.5;

export default {
    name: "VueGradient",
    props: {
        colors: {
            type: Array,
            required: true,
        },
        transitionSpeed: {
            type: Number,
            required: false,
            default: transitionSpeedDefault,
        },
        blendMode: {
            type: String,
            required: false,
            default: "normal",
        },
        gradientSize: {
            type: String,
            required: false,
            default: "farthest-corner",
        },
        middleColorOpaquer: {
            type: Number,
            required: false,
            default: -0.75,
        },
    },
    mounted() {
        if (this.supportedSpeeds.indexOf(this.transitionSpeed) == -1) {
            (console
                ? console.warn || console.log
                : function(m) {
                      return m;
                  })(
                `VueGradient:\ntransition-speed of ${this.transitionSpeed} is unsupported.\nPlease choose from: ${this.supportedSpeeds.join(" | ")}`
            );
        }
    },
    data() {
        return {
            supportedSpeeds: [0.3, 0.5, 1, 2],
            newColorsPushed: false,
            colorConfigurations: [this.$props.colors],
        };
    },
    watch: {
        colors: function(colors) {
            this.newColorsPushed = true;
            this.colorConfigurations.push(colors);
        },
    },
    methods: {
        transitionSpeedClass() {
            let speedSanitzed = this.supportedSpeeds.indexOf(this.transitionSpeed) == -1 ? transitionSpeedDefault : this.transitionSpeed;
            let speedStr = `${speedSanitzed}`.replace(".", "");
            return `speed-${speedStr}s`;
        },
        createStyleForConfig(config) {
            let gradients = [];

            config.forEach((colorData, index) => {
                let colorStart = Color(colorData.color_start);
                let colorMiddle = Color(colorData.color_middle ? colorData.color_middle : colorData.color_start);
                if (!colorData.color_middle) {
                    colorMiddle = colorMiddle.opaquer(this.middleColorOpaquer);
                }

                let colorStrStart = `rgba(${colorStart.red()},${colorStart.green()},${colorStart.blue()},${colorStart.alpha()})`;
                let colorStrMiddle = `rgba(${colorMiddle.red()},${colorMiddle.green()},${colorMiddle.blue()},${colorMiddle.alpha()})`;

                let gradientStr = `radial-gradient(circle ${this.gradientSize} at ${colorData.x}% ${colorData.y}%, ${colorStrStart}, ${colorStrMiddle}, transparent)`;
                gradients.push(gradientStr);
            });

            return {
                "background-image": gradients.join(","),
                "background-blend-mode": this.blendMode,
            };
        },
    },
};
</script>

<template>
    <div class="p-r">
        <transition-group name="opacity" :class="transitionSpeedClass()" v-on:enter="$emit('change-start')" v-on:after-enter="$emit('change-end')">
            <div v-for="(config, index) in colorConfigurations" class="p-a wh-full gradient" :key="index" :style="createStyleForConfig(config)"></div>
        </transition-group>
        <div class="p-r wh-full">
            <div class="p-r wh-full">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.p-a {
    position: absolute;
}

.p-r {
    position: relative;
}

.wh-full {
    width: 100%;
    height: 100%;
}

.speed-03s {
    --speed: 0.3s;
}

.speed-05s {
    --speed: 0.5s;
}

.speed-1s {
    --speed: 1s;
}

.speed-2s {
    --speed: 2s;
}

.opacity-enter-active {
    animation: opacity-in var(--speed);
}
.opacity-leave-active {
    animation: opacity-in var(--speed) reverse;
}
@keyframes opacity-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>

<script>
import Vue from "vue";
import VueGradient from "@/vue-gradient.vue";

export default Vue.extend({
    name: "ServeDev",
    components: {
        VueGradient,
    },
    data() {
        return {
            state: "Initial",
            colors: [
                {
                    x: 0,
                    y: 0,
                    color_start: "rgb(255, 255,0,1)",
                    color_middle: "rgb(255, 255,0,0.25)", // optional
                },
                {
                    x: 100,
                    y: 0,
                    color_start: "rgb(0, 255,0,1)",
                },
                {
                    x: 0,
                    y: 50,
                    color_start: "rgb(255, 0,0,1)",
                },
                {
                    x: 0,
                    y: 100,
                    color_start: "rgb(0, 255,255,1)",
                },
                {
                    x: 100,
                    y: 100,
                    color_start: "rgb(255, 0,255,1)",
                },
            ],
        };
    },
    methods: {
        changeColors() {
            this.colors = [
                {
                    x: 100,
                    y: 0,
                    color_start: "rgb(123, 255,0,1)",
                    color_middle: "rgb(255, 255,0,0.25)", // optional
                },
                {
                    x: 0,
                    y: 0,
                    color_start: "rgb(0, 255,0,1)",
                },
                {
                    x: 100,
                    y: 100,
                    color_start: "rgb(0, 255,255,1)",
                },
                {
                    x: 0,
                    y: 100,
                    color_start: "rgb(255, 0,255,1)",
                },
            ];
        },
        changeColorsTwo() {
            this.colors = [
                {
                    x: 0,
                    y: 0,
                    color_start: "rgb(255, 0,0,1)",
                },
                {
                    x: 100,
                    y: 0,
                    color_start: "rgb(0, 255,255,1)",
                },
                {
                    x: 0,
                    y: 100,
                    color_start: "rgb(255, 255,255,1)",
                },
                {
                    x: 100,
                    y: 100,
                    color_start: "rgb(255, 0,255,1)",
                },
            ];
        },
    },
});
</script>

<template>
    <div id="app" style="background-color: white; width:100vw; height:100vh;">
        <vue-gradient
            :colors="colors"
            v-on:change-end="state = 'Change End'"
            v-on:change-start="state = 'Change Start'"
            style="width:100%; height: 100%;"
        >
            <div style="padding:40px">
                State: {{ state }}<br />
                <a v-on:click="changeColors">Change Colors One</a><br />
                <a v-on:click="changeColorsTwo">Change Colors Two</a>
            </div>
        </vue-gradient>
    </div>
</template>

<style>
html,
body {
    margin: 0;
    padding: 0;
}
</style>

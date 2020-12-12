A vue.js component to create multi radial-gradient backgrounds with animtions on color change.

![](https://www.dropbox.com/s/ww1elpsd1afv0mn/sample_1.gif?raw=1)

# Installation
`npm install vue-gradient`

[CodeSandBox Example](https://codesandbox.io/s/vue-gradient-6sgmx?file=/src/App.vue)

### Sample code

```vue
<template>
  <div id="app">
    <vue-gradient class="full" :colors="colors" />
  </div>
</template>

<script>
import VueGradient from "vue-gradient";

export default {
  name: "App",
  components: {
    VueGradient,
  },
  data() {
    return {
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
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

.full {
  width: 100vw;
  height: 100vh;
}
</style>

```




## Options

Here's a list of the properties and what they are used for. The **default** values are **bold**

```
<vue-gradient :colors="colors" 
	transition-speed="0.3" 
	blend-mode="darken" 
	gradient-size="farthest-side" 
	middle-color-opaquer="-0.4"
>
	CONTENT
</vue-gradient>
```


| Property | Options | Description | 
| -----| --- | ------------|
| transition-speed | 0.3, **0.5**, 1, 2 | Speed of transition in seconds |
| blend-mode | **normal**, multiply, screen, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion, hue, saturation, color, luminosity | CSS background blend mode. [docs](https://developer.mozilla.org/de/docs/Web/CSS/background-blend-mode) |
| gradient-size | closest-side, closest-corner, farthest-side, **farthest-corner** | Gradient size configuration. [docs](https://developer.mozilla.org/de/docs/Web/CSS/radial-gradient()) |
| middle-color-opaquer | **-0.75** (Number) 0 ... -1 | Opacity level for `color_middle`, **if no color_middle was set**.  [docs](https://github.com/Qix-/color#readme) |
| colors (required) | Array with color objects  | **Animated** If the color data is changed, the new color setting will be animated in. See below |

####Color object options:

| Property | Type | Description | 
| -----| --- | ------------|
| x | Number | X position in percent |
| y | Number | Y position in percent |
| color_start | Color | Main color of gradient [docs](https://github.com/Qix-/color#readme) |
| color_middle *(optional)* | Color | Second color of gradient [docs](https://github.com/Qix-/color#readme) If unused, color_start with opacity will be used.|


## Events

```
<vue-gradient v-on:change-start="onChangeStart" v-on:change-end="onChangeEnd" ... />
```

| Property |Description | 
| -----| ------------|
| change-start | Color animation started |
| change-end | Color animation ended |


## License
[The MIT license](LICENSE.md)
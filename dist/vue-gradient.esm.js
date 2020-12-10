import color from 'color';

const transitionSpeedDefault = 0.5;
var script = {
  name: "VueGradient",
  props: {
    colors: {
      type: Array,
      required: true
    },
    transitionSpeed: {
      type: Number,
      required: false,
      default: transitionSpeedDefault
    },
    blendMode: {
      type: String,
      required: false,
      default: "normal"
    },
    gradientSize: {
      type: String,
      required: false,
      default: "farthest-corner"
    },
    middleColorOpaquer: {
      type: Number,
      required: false,
      default: -0.75
    }
  },

  mounted() {
    if (this.supportedSpeeds.indexOf(this.transitionSpeed) == -1) {
      (console ? console.warn || console.log : function (m) {
        return m;
      })(`VueGradient:\ntransition-speed of ${this.transitionSpeed} is unsupported.\nPlease choose from: ${this.supportedSpeeds.join(" | ")}`);
    }
  },

  data() {
    return {
      supportedSpeeds: [0.3, 0.5, 1, 2],
      newColorsPushed: false,
      colorConfigurations: [this.$props.colors]
    };
  },

  watch: {
    colors: function (colors) {
      this.newColorsPushed = true;
      this.colorConfigurations.push(colors);
    }
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
        let colorStart = color(colorData.color_start);
        let colorMiddle = color(colorData.color_middle ? colorData.color_middle : colorData.color_start);

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
        "background-blend-mode": this.blendMode
      };
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "p-r"
  }, [_c('transition-group', {
    class: _vm.transitionSpeedClass(),
    attrs: {
      "name": "opacity"
    },
    on: {
      "enter": function ($event) {
        return _vm.$emit('change-start');
      },
      "after-enter": function ($event) {
        return _vm.$emit('change-end');
      }
    }
  }, _vm._l(_vm.colorConfigurations, function (config, index) {
    return _c('div', {
      key: index,
      staticClass: "p-a wh-full gradient",
      style: _vm.createStyleForConfig(config)
    });
  }), 0), _vm._v(" "), _c('div', {
    staticClass: "p-r wh-full"
  }, [_c('div', {
    staticClass: "p-r wh-full"
  }, [_vm._t("default")], 2)])], 1);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-66314b7d_0", {
    source: ".p-a[data-v-66314b7d]{position:absolute}.p-r[data-v-66314b7d]{position:relative}.wh-full[data-v-66314b7d]{width:100%;height:100%}.speed-03s[data-v-66314b7d]{--speed:0.3s}.speed-05s[data-v-66314b7d]{--speed:0.5s}.speed-1s[data-v-66314b7d]{--speed:1s}.speed-2s[data-v-66314b7d]{--speed:2s}.opacity-enter-active[data-v-66314b7d]{animation:opacity-in-data-v-66314b7d var(--speed)}.opacity-leave-active[data-v-66314b7d]{animation:opacity-in-data-v-66314b7d var(--speed) reverse}@keyframes opacity-in-data-v-66314b7d{0%{opacity:0}100%{opacity:1}}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-66314b7d";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

// Import vue component

const install = function installVueGradient(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('VueGradient', __vue_component__);
}; // Create module definition for Vue.use()
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default __vue_component__;

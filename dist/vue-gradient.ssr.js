'use strict';Object.defineProperty(exports,'__esModule',{value:true});var color=require('color');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var color__default=/*#__PURE__*/_interopDefaultLegacy(color);var transitionSpeedDefault = 0.5;
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
  mounted: function mounted() {
    if (this.supportedSpeeds.indexOf(this.transitionSpeed) == -1) {
      (console ? console.warn || console.log : function (m) {
        return m;
      })("VueGradient:\ntransition-speed of ".concat(this.transitionSpeed, " is unsupported.\nPlease choose from: ").concat(this.supportedSpeeds.join(" | ")));
    }
  },
  data: function data() {
    return {
      supportedSpeeds: [0.3, 0.5, 1, 2],
      newColorsPushed: false,
      colorConfigurations: [this.$props.colors]
    };
  },
  watch: {
    colors: function colors(_colors) {
      this.newColorsPushed = true;
      this.colorConfigurations.push(_colors);
    }
  },
  methods: {
    transitionSpeedClass: function transitionSpeedClass() {
      var speedSanitzed = this.supportedSpeeds.indexOf(this.transitionSpeed) == -1 ? transitionSpeedDefault : this.transitionSpeed;
      var speedStr = "".concat(speedSanitzed).replace(".", "");
      return "speed-".concat(speedStr, "s");
    },
    createStyleForConfig: function createStyleForConfig(config) {
      var _this = this;

      var gradients = [];
      config.forEach(function (colorData, index) {
        var colorStart = color__default['default'](colorData.color_start);
        var colorMiddle = color__default['default'](colorData.color_middle ? colorData.color_middle : colorData.color_start);

        if (!colorData.color_middle) {
          colorMiddle = colorMiddle.opaquer(_this.middleColorOpaquer);
        }

        var colorStrStart = "rgba(".concat(colorStart.red(), ",").concat(colorStart.green(), ",").concat(colorStart.blue(), ",").concat(colorStart.alpha(), ")");
        var colorStrMiddle = "rgba(".concat(colorMiddle.red(), ",").concat(colorMiddle.green(), ",").concat(colorMiddle.blue(), ",").concat(colorMiddle.alpha(), ")");
        var gradientStr = "radial-gradient(circle ".concat(_this.gradientSize, " at ").concat(colorData.x, "% ").concat(colorData.y, "%, ").concat(colorStrStart, ", ").concat(colorStrMiddle, ", transparent)");
        gradients.push(gradientStr);
      });
      return {
        "background-image": gradients.join(","),
        "background-blend-mode": this.blendMode
      };
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
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
      "enter": function enter($event) {
        return _vm.$emit('change-start');
      },
      "after-enter": function afterEnter($event) {
        return _vm.$emit('change-end');
      }
    }
  }, _vm._l(_vm.colorConfigurations, function (config, index) {
    return _c('div', {
      key: index,
      staticClass: "p-a wh-full gradient",
      style: _vm.createStyleForConfig(config)
    });
  }), 0), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"p-r wh-full\" data-v-66314b7d>", "</div>", [_vm._ssrNode("<div class=\"p-r wh-full\" data-v-66314b7d>", "</div>", [_vm._t("default")], 2)])], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-66314b7d_0", {
    source: ".p-a[data-v-66314b7d]{position:absolute}.p-r[data-v-66314b7d]{position:relative}.wh-full[data-v-66314b7d]{width:100%;height:100%}.speed-03s[data-v-66314b7d]{--speed:0.3s}.speed-05s[data-v-66314b7d]{--speed:0.5s}.speed-1s[data-v-66314b7d]{--speed:1s}.speed-2s[data-v-66314b7d]{--speed:2s}.opacity-enter-active[data-v-66314b7d]{animation:opacity-in-data-v-66314b7d var(--speed)}.opacity-leave-active[data-v-66314b7d]{animation:opacity-in-data-v-66314b7d var(--speed) reverse}@keyframes opacity-in-data-v-66314b7d{0%{opacity:0}100%{opacity:1}}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-66314b7d";
/* module identifier */

var __vue_module_identifier__ = "data-v-66314b7d";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);// Import vue component

var install = function installVueGradient(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('VueGradient', __vue_component__);
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

{
  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
} // Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
exports.default=__vue_component__;
var _e = Object.defineProperty;
var Ee = (e, r, a) => r in e ? _e(e, r, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[r] = a;
var xe = (e, r, a) => (Ee(e, typeof r != "symbol" ? r + "" : r, a), a);
import { onUnmounted, onDeactivated, isRef, watch, ref, onMounted, inject, unref, nextTick, onActivated, reactive, getCurrentInstance, computed, provide, isVNode, defineComponent, createVNode, watchEffect, mergeProps, onBeforeUnmount, Transition, withDirectives, vShow, Teleport, Fragment, createApp, resolveDirective, openBlock, createElementBlock, normalizeClass, normalizeStyle, createStaticVNode, renderSlot, createElementVNode, withCtx, renderList, toDisplayString, createCommentVNode, withModifiers, createTextVNode, useSlots, createBlock, vModelText, createSlots } from "vue";
function mitt(e) {
  return { all: e = e || /* @__PURE__ */ new Map(), on: function(r, a) {
    var i = e.get(r);
    i ? i.push(a) : e.set(r, [a]);
  }, off: function(r, a) {
    var i = e.get(r);
    i && (a ? i.splice(i.indexOf(a) >>> 0, 1) : e.set(r, []));
  }, emit: function(r, a) {
    var i = e.get(r);
    i && i.slice().map(function(s) {
      s(a);
    }), (i = e.get("*")) && i.slice().map(function(s) {
      s(r, a);
    });
  } };
}
const isDef = (e) => e != null, isFunction$3 = (e) => typeof e == "function", isObject$5 = (e) => e !== null && typeof e == "object", isPromise = (e) => isObject$5(e) && isFunction$3(e.then) && isFunction$3(e.catch), isNumeric = (e) => typeof e == "number" || /^\d+(\.\d+)?$/.test(e), isIOS = () => !!inBrowser$1 && /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
function noop() {
}
const extend = Object.assign, inBrowser$1 = typeof window < "u";
function get(e, r) {
  const a = r.split(".");
  let i = e;
  return a.forEach((s) => {
    var n;
    i = isObject$5(i) && (n = i[s]) != null ? n : "";
  }), i;
}
function pick(e, r, a) {
  return r.reduce((i, s) => (a && e[s] === void 0 || (i[s] = e[s]), i), {});
}
const toArray = (e) => Array.isArray(e) ? e : [e], unknownProp = null, numericProp = [Number, String], truthProp = { type: Boolean, default: !0 }, makeRequiredProp = (e) => ({ type: e, required: !0 }), makeArrayProp = () => ({ type: Array, default: () => [] }), makeNumberProp = (e) => ({ type: Number, default: e }), makeNumericProp = (e) => ({ type: numericProp, default: e }), makeStringProp = (e) => ({ type: String, default: e });
var inBrowser = typeof window < "u";
function raf(e) {
  return inBrowser ? requestAnimationFrame(e) : -1;
}
function doubleRaf(e) {
  raf(() => raf(e));
}
var isWindow = (e) => e === window, makeDOMRect = (e, r) => ({ top: 0, left: 0, right: e, bottom: r, width: e, height: r }), useRect = (e) => {
  const r = unref(e);
  if (isWindow(r)) {
    const a = r.innerWidth, i = r.innerHeight;
    return makeDOMRect(a, i);
  }
  return r != null && r.getBoundingClientRect ? r.getBoundingClientRect() : makeDOMRect(0, 0);
}, width, height;
function useParent(e) {
  const r = inject(e, null);
  if (r) {
    const a = getCurrentInstance(), { link: i, unlink: s, internalChildren: n } = r;
    return i(a), onUnmounted(() => s(a)), { parent: r, index: computed(() => n.indexOf(a)) };
  }
  return { parent: null, index: ref(-1) };
}
function flattenVNodes(e) {
  const r = [], a = (i) => {
    Array.isArray(i) && i.forEach((s) => {
      var n;
      isVNode(s) && (r.push(s), (n = s.component) != null && n.subTree && (r.push(s.component.subTree), a(s.component.subTree.children)), s.children && a(s.children));
    });
  };
  return a(e), r;
}
function sortChildren(e, r, a) {
  const i = flattenVNodes(e.subTree.children);
  a.sort((n, u) => i.indexOf(n.vnode) - i.indexOf(u.vnode));
  const s = a.map((n) => n.proxy);
  r.sort((n, u) => s.indexOf(n) - s.indexOf(u));
}
function useChildren(e) {
  const r = reactive([]), a = reactive([]), i = getCurrentInstance();
  return { children: r, linkChildren: (s) => {
    provide(e, Object.assign({ link: (n) => {
      n.proxy && (a.push(n), r.push(n.proxy), sortChildren(i, r, a));
    }, unlink: (n) => {
      const u = a.indexOf(n);
      r.splice(u, 1), a.splice(u, 1);
    }, children: r, internalChildren: a }, s));
  } };
}
function onMountedOrActivated(e) {
  let r;
  onMounted(() => {
    e(), nextTick(() => {
      r = !0;
    });
  }), onActivated(() => {
    r && e();
  });
}
function useEventListener(e, r, a = {}) {
  if (!inBrowser)
    return;
  const { target: i = window, passive: s = !1, capture: n = !1 } = a;
  let u;
  const p = (x) => {
    const c = unref(x);
    c && !u && (c.addEventListener(e, r, { capture: n, passive: s }), u = !0);
  }, b = (x) => {
    const c = unref(x);
    c && u && (c.removeEventListener(e, r, n), u = !1);
  };
  onUnmounted(() => b(i)), onDeactivated(() => b(i)), onMountedOrActivated(() => p(i)), isRef(i) && watch(i, (x, c) => {
    b(c), p(x);
  });
}
function useWindowSize() {
  if (!width && (width = ref(0), height = ref(0), inBrowser)) {
    const e = () => {
      width.value = window.innerWidth, height.value = window.innerHeight;
    };
    e(), window.addEventListener("resize", e, { passive: !0 }), window.addEventListener("orientationchange", e, { passive: !0 });
  }
  return { width, height };
}
var overflowScrollReg = /scroll|auto|overlay/i, defaultRoot = inBrowser ? window : void 0, visibility;
function isElement(e) {
  return e.tagName !== "HTML" && e.tagName !== "BODY" && e.nodeType === 1;
}
function getScrollParent(e, r = defaultRoot) {
  let a = e;
  for (; a && a !== r && isElement(a); ) {
    const { overflowY: i } = window.getComputedStyle(a);
    if (overflowScrollReg.test(i))
      return a;
    a = a.parentNode;
  }
  return r;
}
function useScrollParent(e, r = defaultRoot) {
  const a = ref();
  return onMounted(() => {
    e.value && (a.value = getScrollParent(e.value, r));
  }), a;
}
function usePageVisibility() {
  if (!visibility && (visibility = ref("visible"), inBrowser)) {
    const e = () => {
      visibility.value = document.hidden ? "hidden" : "visible";
    };
    e(), window.addEventListener("visibilitychange", e);
  }
  return visibility;
}
var CUSTOM_FIELD_INJECTION_KEY = Symbol("van-field");
function useCustomFieldValue(e) {
  const r = inject(CUSTOM_FIELD_INJECTION_KEY, null);
  r && !r.customValue.value && (r.customValue.value = e, watch(e, () => {
    r.resetValidation(), r.validateWithTrigger("onChange");
  }));
}
function getScrollTop(e) {
  const r = "scrollTop" in e ? e.scrollTop : e.pageYOffset;
  return Math.max(r, 0);
}
isIOS();
const stopPropagation = (e) => e.stopPropagation();
function preventDefault(e, r) {
  (typeof e.cancelable != "boolean" || e.cancelable) && e.preventDefault(), r && stopPropagation(e);
}
function isHidden(e) {
  const r = unref(e);
  if (!r)
    return !1;
  const a = window.getComputedStyle(r), i = a.display === "none", s = r.offsetParent === null && a.position !== "fixed";
  return i || s;
}
const { width: windowWidth, height: windowHeight } = useWindowSize();
function addUnit(e) {
  if (isDef(e))
    return isNumeric(e) ? `${e}px` : String(e);
}
function getSizeStyle(e) {
  if (isDef(e)) {
    if (Array.isArray(e))
      return { width: addUnit(e[0]), height: addUnit(e[1]) };
    const r = addUnit(e);
    return { width: r, height: r };
  }
}
function getZIndexStyle(e) {
  const r = {};
  return e !== void 0 && (r.zIndex = +e), r;
}
const camelizeRE = /-(\w)/g, camelize = (e) => e.replace(camelizeRE, (r, a) => a.toUpperCase()), kebabCase = (e) => e.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, ""), clamp = (e, r, a) => Math.min(Math.max(e, r), a), { hasOwnProperty: hasOwnProperty$6 } = Object.prototype;
function assignKey(e, r, a) {
  const i = r[a];
  isDef(i) && (hasOwnProperty$6.call(e, a) && isObject$5(i) ? e[a] = deepAssign(Object(e[a]), i) : e[a] = i);
}
function deepAssign(e, r) {
  return Object.keys(r).forEach((a) => {
    assignKey(e, r, a);
  }), e;
}
var stdin_default$g = { name: "\u59D3\u540D", tel: "\u7535\u8BDD", save: "\u4FDD\u5B58", confirm: "\u786E\u8BA4", cancel: "\u53D6\u6D88", delete: "\u5220\u9664", loading: "\u52A0\u8F7D\u4E2D...", noCoupon: "\u6682\u65E0\u4F18\u60E0\u5238", nameEmpty: "\u8BF7\u586B\u5199\u59D3\u540D", addContact: "\u6DFB\u52A0\u8054\u7CFB\u4EBA", telInvalid: "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u7535\u8BDD", vanCalendar: { end: "\u7ED3\u675F", start: "\u5F00\u59CB", title: "\u65E5\u671F\u9009\u62E9", weekdays: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"], monthTitle: (e, r) => `${e}\u5E74${r}\u6708`, rangePrompt: (e) => `\u6700\u591A\u9009\u62E9 ${e} \u5929` }, vanCascader: { select: "\u8BF7\u9009\u62E9" }, vanPagination: { prev: "\u4E0A\u4E00\u9875", next: "\u4E0B\u4E00\u9875" }, vanPullRefresh: { pulling: "\u4E0B\u62C9\u5373\u53EF\u5237\u65B0...", loosing: "\u91CA\u653E\u5373\u53EF\u5237\u65B0..." }, vanSubmitBar: { label: "\u5408\u8BA1:" }, vanCoupon: { unlimited: "\u65E0\u95E8\u69DB", discount: (e) => `${e}\u6298`, condition: (e) => `\u6EE1${e}\u5143\u53EF\u7528` }, vanCouponCell: { title: "\u4F18\u60E0\u5238", count: (e) => `${e}\u5F20\u53EF\u7528` }, vanCouponList: { exchange: "\u5151\u6362", close: "\u4E0D\u4F7F\u7528", enable: "\u53EF\u7528", disabled: "\u4E0D\u53EF\u7528", placeholder: "\u8F93\u5165\u4F18\u60E0\u7801" }, vanAddressEdit: { area: "\u5730\u533A", postal: "\u90AE\u653F\u7F16\u7801", areaEmpty: "\u8BF7\u9009\u62E9\u5730\u533A", addressEmpty: "\u8BF7\u586B\u5199\u8BE6\u7EC6\u5730\u5740", postalEmpty: "\u90AE\u653F\u7F16\u7801\u4E0D\u6B63\u786E", addressDetail: "\u8BE6\u7EC6\u5730\u5740", defaultAddress: "\u8BBE\u4E3A\u9ED8\u8BA4\u6536\u8D27\u5730\u5740" }, vanAddressList: { add: "\u65B0\u589E\u5730\u5740" } };
const lang = ref("zh-CN"), messages = reactive({ "zh-CN": stdin_default$g }), Locale = { messages: () => messages[lang.value], use(e, r) {
  lang.value = e, this.add({ [e]: r });
}, add(e = {}) {
  deepAssign(messages, e);
} };
var stdin_default$f = Locale;
function createTranslate(e) {
  const r = camelize(e) + ".";
  return (a, ...i) => {
    const s = stdin_default$f.messages(), n = get(s, r + a) || get(s, a);
    return isFunction$3(n) ? n(...i) : n;
  };
}
function genBem(e, r) {
  return r ? typeof r == "string" ? ` ${e}--${r}` : Array.isArray(r) ? r.reduce((a, i) => a + genBem(e, i), "") : Object.keys(r).reduce((a, i) => a + (r[i] ? genBem(e, i) : ""), "") : "";
}
function createBEM(e) {
  return (r, a) => (r && typeof r != "string" && (a = r, r = ""), `${r = r ? `${e}__${r}` : e}${genBem(r, a)}`);
}
function createNamespace(e) {
  const r = `van-${e}`;
  return [r, createBEM(r), createTranslate(r)];
}
const BORDER = "van-hairline", BORDER_SURROUND = `${BORDER}--surround`, HAPTICS_FEEDBACK = "van-haptics-feedback";
function callInterceptor(e, { args: r = [], done: a, canceled: i }) {
  if (e) {
    const s = e.apply(null, r);
    isPromise(s) ? s.then((n) => {
      n ? a() : i && i();
    }).catch(noop) : s ? a() : i && i();
  } else
    a();
}
function withInstall$1(e) {
  return e.install = (r) => {
    const { name: a } = e;
    a && (r.component(a, e), r.component(camelize(`-${a}`), e));
  }, e;
}
const POPUP_TOGGLE_KEY = Symbol();
function onPopupReopen(e) {
  const r = inject(POPUP_TOGGLE_KEY, null);
  r && watch(r, (a) => {
    a && e();
  });
}
function useExpose(e) {
  const r = getCurrentInstance();
  r && extend(r.proxy, e);
}
const routeProps = { to: [String, Object], url: String, replace: Boolean };
function route({ to: e, url: r, replace: a, $router: i }) {
  e && i ? i[a ? "replace" : "push"](e) : r && (a ? location.replace(r) : location.href = r);
}
function useRoute() {
  const e = getCurrentInstance().proxy;
  return () => route(e);
}
const [name$d, bem$e] = createNamespace("badge"), badgeProps = { dot: Boolean, max: numericProp, tag: makeStringProp("div"), color: String, offset: Array, content: numericProp, showZero: truthProp, position: makeStringProp("top-right") };
var stdin_default$e = defineComponent({ name: name$d, props: badgeProps, setup(e, { slots: r }) {
  const a = () => {
    if (r.content)
      return !0;
    const { content: u, showZero: p } = e;
    return isDef(u) && u !== "" && (p || u !== 0 && u !== "0");
  }, i = () => {
    const { dot: u, max: p, content: b } = e;
    if (!u && a())
      return r.content ? r.content() : isDef(p) && isNumeric(b) && +b > p ? `${p}+` : b;
  }, s = computed(() => {
    const u = { background: e.color };
    if (e.offset) {
      const [p, b] = e.offset;
      r.default ? (u.top = addUnit(b), u.right = typeof p == "number" ? addUnit(-p) : p.startsWith("-") ? p.replace("-", "") : `-${p}`) : (u.marginTop = addUnit(b), u.marginLeft = addUnit(p));
    }
    return u;
  }), n = () => {
    if (a() || e.dot)
      return createVNode("div", { class: bem$e([e.position, { dot: e.dot, fixed: !!r.default }]), style: s.value }, [i()]);
  };
  return () => {
    if (r.default) {
      const { tag: u } = e;
      return createVNode(u, { class: bem$e("wrapper") }, { default: () => [r.default(), n()] });
    }
    return n();
  };
} });
const Badge = withInstall$1(stdin_default$e);
let globalZIndex = 2e3;
const useGlobalZIndex = () => ++globalZIndex, setGlobalZIndex = (e) => {
  globalZIndex = e;
}, [name$c, bem$d] = createNamespace("config-provider"), CONFIG_PROVIDER_KEY = Symbol(name$c), configProviderProps = { tag: makeStringProp("div"), zIndex: Number, themeVars: Object, iconPrefix: String };
function mapThemeVarsToCSSVars(e) {
  const r = {};
  return Object.keys(e).forEach((a) => {
    r[`--van-${kebabCase(a)}`] = e[a];
  }), r;
}
defineComponent({ name: name$c, props: configProviderProps, setup(e, { slots: r }) {
  const a = computed(() => {
    if (e.themeVars)
      return mapThemeVarsToCSSVars(e.themeVars);
  });
  return provide(CONFIG_PROVIDER_KEY, e), watchEffect(() => {
    e.zIndex !== void 0 && setGlobalZIndex(e.zIndex);
  }), () => createVNode(e.tag, { class: bem$d(), style: a.value }, { default: () => {
    var i;
    return [(i = r.default) == null ? void 0 : i.call(r)];
  } });
} });
const [name$b, bem$c] = createNamespace("icon"), isImage = (e) => e == null ? void 0 : e.includes("/"), iconProps = { dot: Boolean, tag: makeStringProp("i"), name: String, size: numericProp, badge: numericProp, color: String, badgeProps: Object, classPrefix: String };
var stdin_default$d = defineComponent({ name: name$b, props: iconProps, setup(e, { slots: r }) {
  const a = inject(CONFIG_PROVIDER_KEY, null), i = computed(() => e.classPrefix || (a == null ? void 0 : a.iconPrefix) || bem$c());
  return () => {
    const { tag: s, dot: n, name: u, size: p, badge: b, color: x } = e, c = isImage(u);
    return createVNode(Badge, mergeProps({ dot: n, tag: s, class: [i.value, c ? "" : `${i.value}-${u}`], style: { color: x, fontSize: addUnit(p) }, content: b }, e.badgeProps), { default: () => {
      var f;
      return [(f = r.default) == null ? void 0 : f.call(r), c && createVNode("img", { class: bem$c("image"), src: u }, null)];
    } });
  };
} });
const Icon = withInstall$1(stdin_default$d), [name$a, bem$b] = createNamespace("loading"), SpinIcon = Array(12).fill(null).map((e, r) => createVNode("i", { class: bem$b("line", String(r + 1)) }, null)), CircularIcon = createVNode("svg", { class: bem$b("circular"), viewBox: "25 25 50 50" }, [createVNode("circle", { cx: "50", cy: "50", r: "20", fill: "none" }, null)]), loadingProps = { size: numericProp, type: makeStringProp("circular"), color: String, vertical: Boolean, textSize: numericProp, textColor: String };
var stdin_default$c = defineComponent({ name: name$a, props: loadingProps, setup(e, { slots: r }) {
  const a = computed(() => extend({ color: e.color }, getSizeStyle(e.size))), i = () => {
    var s;
    if (r.default)
      return createVNode("span", { class: bem$b("text"), style: { fontSize: addUnit(e.textSize), color: (s = e.textColor) != null ? s : e.color } }, [r.default()]);
  };
  return () => {
    const { type: s, vertical: n } = e;
    return createVNode("div", { class: bem$b([s, { vertical: n }]), "aria-live": "polite", "aria-busy": !0 }, [createVNode("span", { class: bem$b("spinner", s), style: a.value }, [s === "spinner" ? SpinIcon : CircularIcon]), i()]);
  };
} });
const Loading = withInstall$1(stdin_default$c), [name$9, bem$a] = createNamespace("button"), buttonProps = extend({}, routeProps, { tag: makeStringProp("button"), text: String, icon: String, type: makeStringProp("default"), size: makeStringProp("normal"), color: String, block: Boolean, plain: Boolean, round: Boolean, square: Boolean, loading: Boolean, hairline: Boolean, disabled: Boolean, iconPrefix: String, nativeType: makeStringProp("button"), loadingSize: numericProp, loadingText: String, loadingType: String, iconPosition: makeStringProp("left") });
var stdin_default$b = defineComponent({ name: name$9, props: buttonProps, emits: ["click"], setup(e, { emit: r, slots: a }) {
  const i = useRoute(), s = () => e.loading ? a.loading ? a.loading() : createVNode(Loading, { size: e.loadingSize, type: e.loadingType, class: bem$a("loading") }, null) : a.icon ? createVNode("div", { class: bem$a("icon") }, [a.icon()]) : e.icon ? createVNode(Icon, { name: e.icon, class: bem$a("icon"), classPrefix: e.iconPrefix }, null) : void 0, n = () => {
    let b;
    if (b = e.loading ? e.loadingText : a.default ? a.default() : e.text, b)
      return createVNode("span", { class: bem$a("text") }, [b]);
  }, u = () => {
    const { color: b, plain: x } = e;
    if (b) {
      const c = { color: x ? b : "white" };
      return x || (c.background = b), b.includes("gradient") ? c.border = 0 : c.borderColor = b, c;
    }
  }, p = (b) => {
    e.loading ? preventDefault(b) : e.disabled || (r("click", b), i());
  };
  return () => {
    const { tag: b, type: x, size: c, block: f, round: m, plain: y, square: d, loading: l, disabled: o, hairline: g, nativeType: _, iconPosition: S } = e, E = [bem$a([x, c, { plain: y, block: f, round: m, square: d, loading: l, disabled: o, hairline: g }]), { [BORDER_SURROUND]: g }];
    return createVNode(b, { type: _, class: E, style: u(), disabled: o, onClick: p }, { default: () => [createVNode("div", { class: bem$a("content") }, [S === "left" && s(), n(), S === "right" && s()])] });
  };
} });
const Button = withInstall$1(stdin_default$b), popupSharedProps = { show: Boolean, zIndex: numericProp, overlay: truthProp, duration: numericProp, teleport: [String, Object], lockScroll: truthProp, lazyRender: truthProp, beforeClose: Function, overlayStyle: Object, overlayClass: unknownProp, transitionAppear: Boolean, closeOnClickOverlay: truthProp };
function getDirection(e, r) {
  return e > r ? "horizontal" : r > e ? "vertical" : "";
}
function useTouch() {
  const e = ref(0), r = ref(0), a = ref(0), i = ref(0), s = ref(0), n = ref(0), u = ref(""), p = () => {
    a.value = 0, i.value = 0, s.value = 0, n.value = 0, u.value = "";
  };
  return { move: (b) => {
    const x = b.touches[0];
    a.value = (x.clientX < 0 ? 0 : x.clientX) - e.value, i.value = x.clientY - r.value, s.value = Math.abs(a.value), n.value = Math.abs(i.value), (!u.value || s.value < 10 && n.value < 10) && (u.value = getDirection(s.value, n.value));
  }, start: (b) => {
    p(), e.value = b.touches[0].clientX, r.value = b.touches[0].clientY;
  }, reset: p, startX: e, startY: r, deltaX: a, deltaY: i, offsetX: s, offsetY: n, direction: u, isVertical: () => u.value === "vertical", isHorizontal: () => u.value === "horizontal" };
}
let totalLockCount = 0;
const BODY_LOCK_CLASS = "van-overflow-hidden";
function useLockScroll(e, r) {
  const a = useTouch(), i = (p) => {
    a.move(p);
    const b = a.deltaY.value > 0 ? "10" : "01", x = getScrollParent(p.target, e.value), { scrollHeight: c, offsetHeight: f, scrollTop: m } = x;
    let y = "11";
    m === 0 ? y = f >= c ? "00" : "01" : m + f >= c && (y = "10"), y === "11" || !a.isVertical() || parseInt(y, 2) & parseInt(b, 2) || preventDefault(p, !0);
  }, s = () => {
    document.addEventListener("touchstart", a.start), document.addEventListener("touchmove", i, { passive: !1 }), totalLockCount || document.body.classList.add(BODY_LOCK_CLASS), totalLockCount++;
  }, n = () => {
    totalLockCount && (document.removeEventListener("touchstart", a.start), document.removeEventListener("touchmove", i), totalLockCount--, totalLockCount || document.body.classList.remove(BODY_LOCK_CLASS));
  }, u = () => r() && n();
  onMountedOrActivated(() => r() && s()), onDeactivated(u), onBeforeUnmount(u), watch(r, (p) => {
    p ? s() : n();
  });
}
function useLazyRender(e) {
  const r = ref(!1);
  return watch(e, (a) => {
    a && (r.value = a);
  }, { immediate: !0 }), (a) => () => r.value ? a() : null;
}
const [name$8, bem$9] = createNamespace("overlay"), overlayProps = { show: Boolean, zIndex: numericProp, duration: numericProp, className: unknownProp, lockScroll: truthProp, lazyRender: truthProp, customStyle: Object };
var stdin_default$a = defineComponent({ name: name$8, props: overlayProps, setup(e, { slots: r }) {
  const a = ref(), i = useLazyRender(() => e.show || !e.lazyRender)(() => {
    var s;
    const n = extend(getZIndexStyle(e.zIndex), e.customStyle);
    return isDef(e.duration) && (n.animationDuration = `${e.duration}s`), withDirectives(createVNode("div", { ref: a, style: n, class: [bem$9(), e.className] }, [(s = r.default) == null ? void 0 : s.call(r)]), [[vShow, e.show]]);
  });
  return useEventListener("touchmove", (s) => {
    e.lockScroll && preventDefault(s, !0);
  }, { target: a }), () => createVNode(Transition, { name: "van-fade", appear: !0 }, { default: i });
} });
const Overlay = withInstall$1(stdin_default$a), popupProps$1 = extend({}, popupSharedProps, { round: Boolean, position: makeStringProp("center"), closeIcon: makeStringProp("cross"), closeable: Boolean, transition: String, iconPrefix: String, closeOnPopstate: Boolean, closeIconPosition: makeStringProp("top-right"), safeAreaInsetTop: Boolean, safeAreaInsetBottom: Boolean }), [name$7, bem$8] = createNamespace("popup");
var stdin_default$9 = defineComponent({ name: name$7, inheritAttrs: !1, props: popupProps$1, emits: ["open", "close", "opened", "closed", "keydown", "update:show", "click-overlay", "click-close-icon"], setup(e, { emit: r, attrs: a, slots: i }) {
  let s, n;
  const u = ref(), p = ref(), b = useLazyRender(() => e.show || !e.lazyRender), x = computed(() => {
    const P = { zIndex: u.value };
    return isDef(e.duration) && (P[e.position === "center" ? "animationDuration" : "transitionDuration"] = `${e.duration}s`), P;
  }), c = () => {
    s || (s = !0, u.value = e.zIndex !== void 0 ? +e.zIndex : useGlobalZIndex(), r("open"));
  }, f = () => {
    s && callInterceptor(e.beforeClose, { done() {
      s = !1, r("close"), r("update:show", !1);
    } });
  }, m = (P) => {
    r("click-overlay", P), e.closeOnClickOverlay && f();
  }, y = () => {
    if (e.overlay)
      return createVNode(Overlay, { show: e.show, class: e.overlayClass, zIndex: u.value, duration: e.duration, customStyle: e.overlayStyle, role: e.closeOnClickOverlay ? "button" : void 0, tabindex: e.closeOnClickOverlay ? 0 : void 0, onClick: m }, { default: i["overlay-content"] });
  }, d = (P) => {
    r("click-close-icon", P), f();
  }, l = () => {
    if (e.closeable)
      return createVNode(Icon, { role: "button", tabindex: 0, name: e.closeIcon, class: [bem$8("close-icon", e.closeIconPosition), HAPTICS_FEEDBACK], classPrefix: e.iconPrefix, onClick: d }, null);
  }, o = () => r("opened"), g = () => r("closed"), _ = (P) => r("keydown", P), S = b(() => {
    var P;
    const { round: k, position: C, safeAreaInsetTop: A, safeAreaInsetBottom: M } = e;
    return withDirectives(createVNode("div", mergeProps({ ref: p, style: x.value, role: "dialog", tabindex: 0, class: [bem$8({ round: k, [C]: C }), { "van-safe-area-top": A, "van-safe-area-bottom": M }], onKeydown: _ }, a), [(P = i.default) == null ? void 0 : P.call(i), l()]), [[vShow, e.show]]);
  }), E = () => {
    const { position: P, transition: k, transitionAppear: C } = e;
    return createVNode(Transition, { name: k || (P === "center" ? "van-fade" : `van-popup-slide-${P}`), appear: C, onAfterEnter: o, onAfterLeave: g }, { default: S });
  };
  return watch(() => e.show, (P) => {
    P && !s && (c(), a.tabindex === 0 && nextTick(() => {
      var k;
      (k = p.value) == null || k.focus();
    })), !P && s && (s = !1, r("close"));
  }), useExpose({ popupRef: p }), useLockScroll(p, () => e.show && e.lockScroll), useEventListener("popstate", () => {
    e.closeOnPopstate && (f(), n = !1);
  }), onMounted(() => {
    e.show && c();
  }), onActivated(() => {
    n && (r("update:show", !0), n = !1);
  }), onDeactivated(() => {
    e.show && e.teleport && (f(), n = !0);
  }), provide(POPUP_TOGGLE_KEY, () => e.show), () => e.teleport ? createVNode(Teleport, { to: e.teleport }, { default: () => [y(), E()] }) : createVNode(Fragment, null, [y(), E()]);
} });
const Popup = withInstall$1(stdin_default$9);
function usePopupState() {
  const e = reactive({ show: !1 }), r = (s) => {
    e.show = s;
  }, a = (s) => {
    extend(e, s, { transitionAppear: !0 }), r(!0);
  }, i = () => r(!1);
  return useExpose({ open: a, close: i, toggle: r }), { open: a, close: i, state: e, toggle: r };
}
function mountComponent(e) {
  const r = createApp(e), a = document.createElement("div");
  return document.body.appendChild(a), { instance: r.mount(a), unmount() {
    r.unmount(), document.body.removeChild(a);
  } };
}
let lockCount = 0;
function lockClick(e) {
  e ? (lockCount || document.body.classList.add("van-toast--unclickable"), lockCount++) : lockCount && (lockCount--, lockCount || document.body.classList.remove("van-toast--unclickable"));
}
const [name$6, bem$7] = createNamespace("toast"), popupInheritProps = ["show", "overlay", "teleport", "transition", "overlayClass", "overlayStyle", "closeOnClickOverlay"], toastProps = { icon: String, show: Boolean, type: makeStringProp("text"), overlay: Boolean, message: numericProp, iconSize: numericProp, duration: makeNumberProp(2e3), position: makeStringProp("middle"), teleport: [String, Object], className: unknownProp, iconPrefix: String, transition: makeStringProp("van-fade"), loadingType: String, forbidClick: Boolean, overlayClass: unknownProp, overlayStyle: Object, closeOnClick: Boolean, closeOnClickOverlay: Boolean };
var stdin_default$8 = defineComponent({ name: name$6, props: toastProps, emits: ["update:show"], setup(e, { emit: r }) {
  let a, i = !1;
  const s = () => {
    const c = e.show && e.forbidClick;
    i !== c && (i = c, lockClick(i));
  }, n = (c) => r("update:show", c), u = () => {
    e.closeOnClick && n(!1);
  }, p = () => clearTimeout(a), b = () => {
    const { icon: c, type: f, iconSize: m, iconPrefix: y, loadingType: d } = e;
    return c || f === "success" || f === "fail" ? createVNode(Icon, { name: c || f, size: m, class: bem$7("icon"), classPrefix: y }, null) : f === "loading" ? createVNode(Loading, { class: bem$7("loading"), size: m, type: d }, null) : void 0;
  }, x = () => {
    const { type: c, message: f } = e;
    if (isDef(f) && f !== "")
      return c === "html" ? createVNode("div", { key: 0, class: bem$7("text"), innerHTML: String(f) }, null) : createVNode("div", { class: bem$7("text") }, [f]);
  };
  return watch(() => [e.show, e.forbidClick], s), watch(() => [e.show, e.type, e.message, e.duration], () => {
    p(), e.show && e.duration > 0 && (a = setTimeout(() => {
      n(!1);
    }, e.duration));
  }), onMounted(s), onUnmounted(s), () => createVNode(Popup, mergeProps({ class: [bem$7([e.position, { [e.type]: !e.icon }]), e.className], lockScroll: !1, onClick: u, onClosed: p, "onUpdate:show": n }, pick(e, popupInheritProps)), { default: () => [b(), x()] });
} });
const defaultOptions = { icon: "", type: "text", message: "", className: "", overlay: !1, onClose: void 0, onOpened: void 0, duration: 2e3, teleport: "body", iconSize: void 0, iconPrefix: void 0, position: "middle", transition: "van-fade", forbidClick: !1, loadingType: void 0, overlayClass: "", overlayStyle: void 0, closeOnClick: !1, closeOnClickOverlay: !1 };
let queue = [], allowMultiple = !1, currentOptions = extend({}, defaultOptions);
const defaultOptionsMap = /* @__PURE__ */ new Map();
function parseOptions(e) {
  return isObject$5(e) ? e : { message: e };
}
function createInstance() {
  const { instance: e, unmount: r } = mountComponent({ setup() {
    const a = ref(""), { open: i, state: s, close: n, toggle: u } = usePopupState(), p = () => {
      allowMultiple && (queue = queue.filter((b) => b !== e), r());
    };
    return watch(a, (b) => {
      s.message = b;
    }), getCurrentInstance().render = () => createVNode(stdin_default$8, mergeProps(s, { onClosed: p, "onUpdate:show": u }), null), { open: i, clear: n, message: a };
  } });
  return e;
}
function getInstance() {
  if (!queue.length || allowMultiple) {
    const e = createInstance();
    queue.push(e);
  }
  return queue[queue.length - 1];
}
function Toast(e = {}) {
  if (!inBrowser$1)
    return {};
  const r = getInstance(), a = parseOptions(e);
  return r.open(extend({}, currentOptions, defaultOptionsMap.get(a.type || currentOptions.type), a)), r;
}
const createMethod = (e) => (r) => Toast(extend({ type: e }, parseOptions(r)));
function setDefaultOptions(e, r) {
  typeof e == "string" ? defaultOptionsMap.set(e, r) : extend(currentOptions, e);
}
Toast.loading = createMethod("loading"), Toast.success = createMethod("success"), Toast.fail = createMethod("fail"), Toast.clear = (e) => {
  var r;
  queue.length && (e ? (queue.forEach((a) => {
    a.clear();
  }), queue = []) : allowMultiple ? (r = queue.shift()) == null || r.clear() : queue[0].clear());
}, Toast.setDefaultOptions = setDefaultOptions, Toast.resetDefaultOptions = (e) => {
  typeof e == "string" ? defaultOptionsMap.delete(e) : (currentOptions = extend({}, defaultOptions), defaultOptionsMap.clear());
}, Toast.allowMultiple = (e = !0) => {
  allowMultiple = e;
}, Toast.install = (e) => {
  e.use(withInstall$1(stdin_default$8)), e.config.globalProperties.$toast = Toast;
};
const [name$5, bem$6] = createNamespace("image"), imageProps = { src: String, alt: String, fit: String, position: String, round: Boolean, block: Boolean, width: numericProp, height: numericProp, radius: numericProp, lazyLoad: Boolean, iconSize: numericProp, showError: truthProp, errorIcon: makeStringProp("photo-fail"), iconPrefix: String, showLoading: truthProp, loadingIcon: makeStringProp("photo") };
var stdin_default$7 = defineComponent({ name: name$5, props: imageProps, emits: ["load", "error"], setup(e, { emit: r, slots: a }) {
  const i = ref(!1), s = ref(!0), n = ref(), { $Lazyload: u } = getCurrentInstance().proxy, p = computed(() => {
    const d = { width: addUnit(e.width), height: addUnit(e.height) };
    return isDef(e.radius) && (d.overflow = "hidden", d.borderRadius = addUnit(e.radius)), d;
  });
  watch(() => e.src, () => {
    i.value = !1, s.value = !0;
  });
  const b = (d) => {
    s.value = !1, r("load", d);
  }, x = (d) => {
    i.value = !0, s.value = !1, r("error", d);
  }, c = (d, l, o) => o ? o() : createVNode(Icon, { name: d, size: e.iconSize, class: l, classPrefix: e.iconPrefix }, null), f = () => {
    if (i.value || !e.src)
      return;
    const d = { alt: e.alt, class: bem$6("img"), style: { objectFit: e.fit, objectPosition: e.position } };
    return e.lazyLoad ? withDirectives(createVNode("img", mergeProps({ ref: n }, d), null), [[resolveDirective("lazy"), e.src]]) : createVNode("img", mergeProps({ src: e.src, onLoad: b, onError: x }, d), null);
  }, m = ({ el: d }) => {
    const l = () => {
      d === n.value && s.value && b();
    };
    n.value ? l() : nextTick(l);
  }, y = ({ el: d }) => {
    d !== n.value || i.value || x();
  };
  return u && inBrowser$1 && (u.$on("loaded", m), u.$on("error", y), onBeforeUnmount(() => {
    u.$off("loaded", m), u.$off("error", y);
  })), () => {
    var d;
    return createVNode("div", { class: bem$6({ round: e.round, block: e.block }), style: p.value }, [f(), s.value && e.showLoading ? createVNode("div", { class: bem$6("loading") }, [c(e.loadingIcon, bem$6("loading-icon"), a.loading)]) : i.value && e.showError ? createVNode("div", { class: bem$6("error") }, [c(e.errorIcon, bem$6("error-icon"), a.error)]) : void 0, (d = a.default) == null ? void 0 : d.call(a)]);
  };
} });
const Image$1 = withInstall$1(stdin_default$7), [name$4, bem$5] = createNamespace("swipe"), swipeProps = { loop: truthProp, width: numericProp, height: numericProp, vertical: Boolean, autoplay: makeNumericProp(0), duration: makeNumericProp(500), touchable: truthProp, lazyRender: Boolean, initialSwipe: makeNumericProp(0), indicatorColor: String, showIndicators: truthProp, stopPropagation: truthProp }, SWIPE_KEY = Symbol(name$4);
var stdin_default$6 = defineComponent({ name: name$4, props: swipeProps, emits: ["change"], setup(e, { emit: r, slots: a }) {
  const i = ref(), s = ref(), n = reactive({ rect: null, width: 0, height: 0, offset: 0, active: 0, swiping: !1 }), u = useTouch(), { children: p, linkChildren: b } = useChildren(SWIPE_KEY), x = computed(() => p.length), c = computed(() => n[e.vertical ? "height" : "width"]), f = computed(() => e.vertical ? u.deltaY.value : u.deltaX.value), m = computed(() => n.rect ? (e.vertical ? n.rect.height : n.rect.width) - c.value * x.value : 0), y = computed(() => Math.ceil(Math.abs(m.value) / c.value)), d = computed(() => x.value * c.value), l = computed(() => (n.active + x.value) % x.value), o = computed(() => {
    const B = e.vertical ? "vertical" : "horizontal";
    return u.direction.value === B;
  }), g = computed(() => {
    const B = { transitionDuration: `${n.swiping ? 0 : e.duration}ms`, transform: `translate${e.vertical ? "Y" : "X"}(${n.offset}px)` };
    if (c.value) {
      const N = e.vertical ? "height" : "width", F = e.vertical ? "width" : "height";
      B[N] = `${d.value}px`, B[F] = e[F] ? `${e[F]}px` : "";
    }
    return B;
  }), _ = (B, N = 0) => {
    let F = B * c.value;
    e.loop || (F = Math.min(F, -m.value));
    let T = N - F;
    return e.loop || (T = clamp(T, m.value, 0)), T;
  }, S = ({ pace: B = 0, offset: N = 0, emitChange: F }) => {
    if (x.value <= 1)
      return;
    const { active: T } = n, $ = ((j) => {
      const { active: W } = n;
      return j ? e.loop ? clamp(W + j, -1, x.value) : clamp(W + j, 0, y.value) : W;
    })(B), z = _($, N);
    if (e.loop) {
      if (p[0] && z !== m.value) {
        const j = z < m.value;
        p[0].setOffset(j ? d.value : 0);
      }
      if (p[x.value - 1] && z !== 0) {
        const j = z > 0;
        p[x.value - 1].setOffset(j ? -d.value : 0);
      }
    }
    n.active = $, n.offset = z, F && $ !== T && r("change", l.value);
  }, E = () => {
    n.swiping = !0, n.active <= -1 ? S({ pace: x.value }) : n.active >= x.value && S({ pace: -x.value });
  }, P = () => {
    E(), u.reset(), doubleRaf(() => {
      n.swiping = !1, S({ pace: 1, emitChange: !0 });
    });
  };
  let k;
  const C = () => clearTimeout(k), A = () => {
    C(), e.autoplay > 0 && x.value > 1 && (k = setTimeout(() => {
      P(), A();
    }, +e.autoplay));
  }, M = (B = +e.initialSwipe) => {
    if (!i.value)
      return;
    const N = () => {
      var F, T;
      if (!isHidden(i)) {
        const $ = { width: i.value.offsetWidth, height: i.value.offsetHeight };
        n.rect = $, n.width = +((F = e.width) != null ? F : $.width), n.height = +((T = e.height) != null ? T : $.height);
      }
      x.value && (B = Math.min(x.value - 1, B)), n.active = B, n.swiping = !0, n.offset = _(B), p.forEach(($) => {
        $.setOffset(0);
      }), A();
    };
    isHidden(i) ? nextTick().then(N) : N();
  }, I = () => M(n.active);
  let D;
  const L = (B) => {
    e.touchable && (u.start(B), D = Date.now(), C(), E());
  }, R = () => {
    if (!e.touchable || !n.swiping)
      return;
    const B = Date.now() - D, N = f.value / B;
    if ((Math.abs(N) > 0.25 || Math.abs(f.value) > c.value / 2) && o.value) {
      const F = e.vertical ? u.offsetY.value : u.offsetX.value;
      let T = 0;
      T = e.loop ? F > 0 ? f.value > 0 ? -1 : 1 : 0 : -Math[f.value > 0 ? "ceil" : "floor"](f.value / c.value), S({ pace: T, emitChange: !0 });
    } else
      f.value && S({ pace: 0 });
    n.swiping = !1, A();
  }, V = (B, N) => {
    const F = N === l.value, T = F ? { backgroundColor: e.indicatorColor } : void 0;
    return createVNode("i", { style: T, class: bem$5("indicator", { active: F }) }, null);
  };
  return useExpose({ prev: () => {
    E(), u.reset(), doubleRaf(() => {
      n.swiping = !1, S({ pace: -1, emitChange: !0 });
    });
  }, next: P, state: n, resize: I, swipeTo: (B, N = {}) => {
    E(), u.reset(), doubleRaf(() => {
      let F;
      F = e.loop && B === x.value ? n.active === 0 ? 0 : B : B % x.value, N.immediate ? doubleRaf(() => {
        n.swiping = !1;
      }) : n.swiping = !1, S({ pace: F - n.active, emitChange: !0 });
    });
  } }), b({ size: c, props: e, count: x, activeIndicator: l }), watch(() => e.initialSwipe, (B) => M(+B)), watch(x, () => M(n.active)), watch(() => e.autoplay, A), watch([windowWidth, windowHeight], I), watch(usePageVisibility(), (B) => {
    B === "visible" ? A() : C();
  }), onMounted(M), onActivated(() => M(n.active)), onPopupReopen(() => M(n.active)), onDeactivated(C), onBeforeUnmount(C), useEventListener("touchmove", (B) => {
    e.touchable && n.swiping && (u.move(B), o.value) && (!e.loop && (n.active === 0 && f.value > 0 || n.active === x.value - 1 && f.value < 0) || (preventDefault(B, e.stopPropagation), S({ offset: f.value })));
  }, { target: s }), () => {
    var B;
    return createVNode("div", { ref: i, class: bem$5() }, [createVNode("div", { ref: s, style: g.value, class: bem$5("track", { vertical: e.vertical }), onTouchstartPassive: L, onTouchend: R, onTouchcancel: R }, [(B = a.default) == null ? void 0 : B.call(a)]), a.indicator ? a.indicator({ active: l.value, total: x.value }) : e.showIndicators && x.value > 1 ? createVNode("div", { class: bem$5("indicators", { vertical: e.vertical }) }, [Array(x.value).fill("").map(V)]) : void 0]);
  };
} });
const Swipe = withInstall$1(stdin_default$6), [name$3, bem$4] = createNamespace("swipe-item");
var stdin_default$5 = defineComponent({ name: name$3, setup(e, { slots: r }) {
  let a;
  const i = reactive({ offset: 0, inited: !1, mounted: !1 }), { parent: s, index: n } = useParent(SWIPE_KEY);
  if (!s)
    return void (process.env.NODE_ENV !== "production" && console.error("[Vant] <SwipeItem> must be a child component of <Swipe>."));
  const u = computed(() => {
    const b = {}, { vertical: x } = s.props;
    return s.size.value && (b[x ? "height" : "width"] = `${s.size.value}px`), i.offset && (b.transform = `translate${x ? "Y" : "X"}(${i.offset}px)`), b;
  }), p = computed(() => {
    const { loop: b, lazyRender: x } = s.props;
    if (!x || a)
      return !0;
    if (!i.mounted)
      return !1;
    const c = s.activeIndicator.value, f = s.count.value - 1, m = c === 0 && b ? f : c - 1, y = c === f && b ? 0 : c + 1;
    return a = n.value === c || n.value === m || n.value === y, a;
  });
  return onMounted(() => {
    nextTick(() => {
      i.mounted = !0;
    });
  }), useExpose({ setOffset: (b) => {
    i.offset = b;
  } }), () => {
    var b;
    return createVNode("div", { class: bem$4(), style: u.value }, [p.value ? (b = r.default) == null ? void 0 : b.call(r) : null]);
  };
} });
const SwipeItem = withInstall$1(stdin_default$5), getDistance = (e) => Math.sqrt((e[0].clientX - e[1].clientX) ** 2 + (e[0].clientY - e[1].clientY) ** 2), bem$3 = createNamespace("image-preview")[1];
var stdin_default$4 = defineComponent({ props: { src: String, show: Boolean, active: Number, minZoom: makeRequiredProp(numericProp), maxZoom: makeRequiredProp(numericProp), rootWidth: makeRequiredProp(Number), rootHeight: makeRequiredProp(Number) }, emits: ["scale", "close"], setup(e, { emit: r }) {
  const a = reactive({ scale: 1, moveX: 0, moveY: 0, moving: !1, zooming: !1, imageRatio: 0, displayWidth: 0, displayHeight: 0 }), i = useTouch(), s = ref(), n = computed(() => {
    const { rootWidth: k, rootHeight: C } = e, A = C / k;
    return a.imageRatio > A;
  }), u = computed(() => {
    const { scale: k, moveX: C, moveY: A, moving: M, zooming: I } = a, D = { transitionDuration: I || M ? "0s" : ".3s" };
    if (k !== 1) {
      const L = C / k, R = A / k;
      D.transform = `scale(${k}, ${k}) translate(${L}px, ${R}px)`;
    }
    return D;
  }), p = computed(() => {
    if (a.imageRatio) {
      const { rootWidth: k, rootHeight: C } = e, A = n.value ? C / a.imageRatio : k;
      return Math.max(0, (a.scale * A - k) / 2);
    }
    return 0;
  }), b = computed(() => {
    if (a.imageRatio) {
      const { rootWidth: k, rootHeight: C } = e, A = n.value ? C : k * a.imageRatio;
      return Math.max(0, (a.scale * A - C) / 2);
    }
    return 0;
  }), x = (k) => {
    (k = clamp(k, +e.minZoom, +e.maxZoom + 1)) !== a.scale && (a.scale = k, r("scale", { scale: k, index: e.active }));
  }, c = () => {
    x(1), a.moveX = 0, a.moveY = 0;
  };
  let f, m, y, d, l, o, g;
  const _ = (k) => {
    const { touches: C } = k, { offsetX: A } = i;
    i.start(k), f = C.length, m = a.moveX, y = a.moveY, g = Date.now(), a.moving = f === 1 && a.scale !== 1, a.zooming = f === 2 && !A.value, a.zooming && (d = a.scale, l = getDistance(k.touches));
  }, S = () => {
    if (f > 1)
      return;
    const { offsetX: k, offsetY: C } = i, A = Date.now() - g;
    k.value < 5 && C.value < 5 && A < 250 && (o ? (clearTimeout(o), o = null, (() => {
      const M = a.scale > 1 ? 1 : 2;
      x(M), a.moveX = 0, a.moveY = 0;
    })()) : o = setTimeout(() => {
      r("close"), o = null;
    }, 250));
  }, E = (k) => {
    let C = !1;
    (a.moving || a.zooming) && (C = !0, a.moving && m === a.moveX && y === a.moveY && (C = !1), k.touches.length || (a.zooming && (a.moveX = clamp(a.moveX, -p.value, p.value), a.moveY = clamp(a.moveY, -b.value, b.value), a.zooming = !1), a.moving = !1, m = 0, y = 0, d = 1, a.scale < 1 && c(), a.scale > e.maxZoom && (a.scale = +e.maxZoom))), preventDefault(k, C), S(), i.reset();
  }, P = (k) => {
    const { naturalWidth: C, naturalHeight: A } = k.target;
    a.imageRatio = A / C;
  };
  return watch(() => e.active, c), watch(() => e.show, (k) => {
    k || c();
  }), useEventListener("touchmove", (k) => {
    const { touches: C } = k;
    if (i.move(k), (a.moving || a.zooming) && preventDefault(k, !0), a.moving) {
      const { deltaX: A, deltaY: M } = i, I = A.value + m, D = M.value + y;
      a.moveX = clamp(I, -p.value, p.value), a.moveY = clamp(D, -b.value, b.value);
    }
    if (a.zooming && C.length === 2) {
      const A = getDistance(C);
      x(d * A / l);
    }
  }, { target: computed(() => {
    var k;
    return (k = s.value) == null ? void 0 : k.$el;
  }) }), () => {
    const k = { loading: () => createVNode(Loading, { type: "spinner" }, null) };
    return createVNode(SwipeItem, { ref: s, class: bem$3("swipe-item"), onTouchstartPassive: _, onTouchend: E, onTouchcancel: E }, { default: () => [createVNode(Image$1, { src: e.src, fit: "contain", class: bem$3("image", { vertical: n.value }), style: u.value, onLoad: P }, k)] });
  };
} });
const [name$2, bem$2] = createNamespace("image-preview"), popupProps = ["show", "transition", "overlayStyle", "closeOnPopstate"], imagePreviewProps = { show: Boolean, loop: truthProp, images: makeArrayProp(), minZoom: makeNumericProp(1 / 3), maxZoom: makeNumericProp(3), overlay: truthProp, closeable: Boolean, showIndex: truthProp, className: unknownProp, closeIcon: makeStringProp("clear"), transition: String, beforeClose: Function, overlayClass: unknownProp, overlayStyle: Object, swipeDuration: makeNumericProp(300), startPosition: makeNumericProp(0), showIndicators: Boolean, closeOnPopstate: truthProp, closeIconPosition: makeStringProp("top-right") };
var stdin_default$3 = defineComponent({ name: name$2, props: imagePreviewProps, emits: ["scale", "close", "closed", "change", "update:show"], setup(e, { emit: r, slots: a }) {
  const i = ref(), s = reactive({ active: 0, rootWidth: 0, rootHeight: 0 }), n = () => {
    if (i.value) {
      const l = useRect(i.value.$el);
      s.rootWidth = l.width, s.rootHeight = l.height, i.value.resize();
    }
  }, u = (l) => r("scale", l), p = (l) => r("update:show", l), b = () => {
    callInterceptor(e.beforeClose, { args: [s.active], done: () => p(!1) });
  }, x = (l) => {
    l !== s.active && (s.active = l, r("change", l));
  }, c = () => {
    if (e.showIndex)
      return createVNode("div", { class: bem$2("index") }, [a.index ? a.index({ index: s.active }) : `${s.active + 1} / ${e.images.length}`]);
  }, f = () => {
    if (a.cover)
      return createVNode("div", { class: bem$2("cover") }, [a.cover()]);
  }, m = () => {
    if (e.closeable)
      return createVNode(Icon, { role: "button", name: e.closeIcon, class: [bem$2("close-icon", e.closeIconPosition), HAPTICS_FEEDBACK], onClick: b }, null);
  }, y = () => r("closed"), d = (l, o) => {
    var g;
    return (g = i.value) == null ? void 0 : g.swipeTo(l, o);
  };
  return useExpose({ swipeTo: d }), onMounted(n), watch([windowWidth, windowHeight], n), watch(() => e.startPosition, (l) => x(+l)), watch(() => e.show, (l) => {
    const { images: o, startPosition: g } = e;
    l ? (x(+g), nextTick(() => {
      n(), d(+g, { immediate: !0 });
    })) : r("close", { index: s.active, url: o[s.active] });
  }), () => createVNode(Popup, mergeProps({ class: [bem$2(), e.className], overlayClass: [bem$2("overlay"), e.overlayClass], onClosed: y, "onUpdate:show": p }, pick(e, popupProps)), { default: () => [m(), createVNode(Swipe, { ref: i, lazyRender: !0, loop: e.loop, class: bem$2("swipe"), duration: e.swipeDuration, initialSwipe: e.startPosition, showIndicators: e.showIndicators, indicatorColor: "white", onChange: x }, { default: () => [e.images.map((l) => createVNode(stdin_default$4, { src: l, show: e.show, active: s.active, maxZoom: e.maxZoom, minZoom: e.minZoom, rootWidth: s.rootWidth, rootHeight: s.rootHeight, onScale: u, onClose: b }, null))] }), c(), f()] });
} });
let instance;
const defaultConfig = { loop: !0, images: [], maxZoom: 3, minZoom: 1 / 3, onScale: void 0, onClose: void 0, onChange: void 0, teleport: "body", className: "", showIndex: !0, closeable: !1, closeIcon: "clear", transition: void 0, beforeClose: void 0, overlayStyle: void 0, overlayClass: void 0, startPosition: 0, swipeDuration: 300, showIndicators: !1, closeOnPopstate: !0, closeIconPosition: "top-right" };
function initInstance() {
  ({ instance } = mountComponent({ setup() {
    const { state: e, toggle: r } = usePopupState(), a = () => {
      e.images = [];
    };
    return () => createVNode(stdin_default$3, mergeProps(e, { onClosed: a, "onUpdate:show": r }), null);
  } }));
}
const ImagePreview = (e, r = 0) => {
  if (inBrowser$1)
    return instance || initInstance(), e = Array.isArray(e) ? { images: e, startPosition: r } : e, instance.open(extend({}, defaultConfig, e)), instance;
};
ImagePreview.Component = withInstall$1(stdin_default$3), ImagePreview.install = (e) => {
  e.use(ImagePreview.Component);
};
const [name$1, bem$1, t$1] = createNamespace("pull-refresh"), DEFAULT_HEAD_HEIGHT = 50, TEXT_STATUS = ["pulling", "loosing", "success"], pullRefreshProps = { disabled: Boolean, modelValue: Boolean, headHeight: makeNumericProp(DEFAULT_HEAD_HEIGHT), successText: String, pullingText: String, loosingText: String, loadingText: String, pullDistance: numericProp, successDuration: makeNumericProp(500), animationDuration: makeNumericProp(300) };
var stdin_default$2 = defineComponent({ name: name$1, props: pullRefreshProps, emits: ["change", "refresh", "update:modelValue"], setup(e, { emit: r, slots: a }) {
  let i;
  const s = ref(), n = ref(), u = useScrollParent(s), p = reactive({ status: "normal", distance: 0, duration: 0 }), b = useTouch(), x = () => {
    if (e.headHeight !== DEFAULT_HEAD_HEIGHT)
      return { height: `${e.headHeight}px` };
  }, c = () => p.status !== "loading" && p.status !== "success" && !e.disabled, f = (g, _) => {
    const S = +(e.pullDistance || e.headHeight);
    p.distance = g, p.status = _ ? "loading" : g === 0 ? "normal" : g < S ? "pulling" : "loosing", r("change", { status: p.status, distance: g });
  }, m = () => {
    const { status: g } = p;
    return g === "normal" ? "" : e[`${g}Text`] || t$1(g);
  }, y = () => {
    const { status: g, distance: _ } = p;
    if (a[g])
      return a[g]({ distance: _ });
    const S = [];
    return TEXT_STATUS.includes(g) && S.push(createVNode("div", { class: bem$1("text") }, [m()])), g === "loading" && S.push(createVNode(Loading, { class: bem$1("loading") }, { default: m })), S;
  }, d = (g) => {
    i = getScrollTop(u.value) === 0, i && (p.duration = 0, b.start(g));
  }, l = (g) => {
    c() && d(g);
  }, o = () => {
    i && b.deltaY.value && c() && (p.duration = +e.animationDuration, p.status === "loosing" ? (f(+e.headHeight, !0), r("update:modelValue", !0), nextTick(() => r("refresh"))) : f(0));
  };
  return watch(() => e.modelValue, (g) => {
    p.duration = +e.animationDuration, g ? f(+e.headHeight, !0) : a.success || e.successText ? (p.status = "success", setTimeout(() => {
      f(0);
    }, +e.successDuration)) : f(0, !1);
  }), useEventListener("touchmove", (g) => {
    if (c()) {
      i || d(g);
      const { deltaY: _ } = b;
      b.move(g), i && _.value >= 0 && b.isVertical() && (preventDefault(g), f(((S) => {
        const E = +(e.pullDistance || e.headHeight);
        return S > E && (S = S < 2 * E ? E + (S - E) / 2 : 1.5 * E + (S - 2 * E) / 4), Math.round(S);
      })(_.value)));
    }
  }, { target: n }), () => {
    var g;
    const _ = { transitionDuration: `${p.duration}ms`, transform: p.distance ? `translate3d(0,${p.distance}px, 0)` : "" };
    return createVNode("div", { ref: s, class: bem$1() }, [createVNode("div", { ref: n, class: bem$1("track"), style: _, onTouchstartPassive: l, onTouchend: o, onTouchcancel: o }, [createVNode("div", { class: bem$1("head"), style: x() }, [y()]), (g = a.default) == null ? void 0 : g.call(a)])]);
  };
} });
const PullRefresh = withInstall$1(stdin_default$2), [name, bem, t] = createNamespace("uploader");
function readFileContent(e, r) {
  return new Promise((a) => {
    if (r === "file")
      return void a();
    const i = new FileReader();
    i.onload = (s) => {
      a(s.target.result);
    }, r === "dataUrl" ? i.readAsDataURL(e) : r === "text" && i.readAsText(e);
  });
}
function isOversize(e, r) {
  return toArray(e).some((a) => !!a.file && (isFunction$3(r) ? r(a.file) : a.file.size > r));
}
function filterFiles(e, r) {
  const a = [], i = [];
  return e.forEach((s) => {
    isOversize(s, r) ? i.push(s) : a.push(s);
  }), { valid: a, invalid: i };
}
const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i, isImageUrl = (e) => IMAGE_REGEXP.test(e);
function isImageFile(e) {
  return !!e.isImage || (e.file && e.file.type ? e.file.type.indexOf("image") === 0 : e.url ? isImageUrl(e.url) : typeof e.content == "string" && e.content.indexOf("data:image") === 0);
}
var stdin_default$1 = defineComponent({ props: { name: numericProp, item: makeRequiredProp(Object), index: Number, imageFit: String, lazyLoad: Boolean, deletable: Boolean, previewSize: [Number, String, Array], beforeDelete: Function }, emits: ["delete", "preview"], setup(e, { emit: r, slots: a }) {
  const i = () => {
    const { status: x, message: c } = e.item;
    if (x === "uploading" || x === "failed") {
      const f = x === "failed" ? createVNode(Icon, { name: "close", class: bem("mask-icon") }, null) : createVNode(Loading, { class: bem("loading") }, null), m = isDef(c) && c !== "";
      return createVNode("div", { class: bem("mask") }, [f, m && createVNode("div", { class: bem("mask-message") }, [c])]);
    }
  }, s = (x) => {
    const { name: c, item: f, index: m, beforeDelete: y } = e;
    x.stopPropagation(), callInterceptor(y, { args: [f, { name: c, index: m }], done: () => r("delete") });
  }, n = () => r("preview"), u = () => {
    if (e.deletable && e.item.status !== "uploading") {
      const x = a["preview-delete"];
      return createVNode("div", { role: "button", class: bem("preview-delete", { shadow: !x }), tabindex: 0, "aria-label": t("delete"), onClick: s }, [x ? x() : createVNode(Icon, { name: "cross", class: bem("preview-delete-icon") }, null)]);
    }
  }, p = () => {
    if (a["preview-cover"]) {
      const { index: x, item: c } = e;
      return createVNode("div", { class: bem("preview-cover") }, [a["preview-cover"](extend({ index: x }, c))]);
    }
  }, b = () => {
    const { item: x, lazyLoad: c, imageFit: f, previewSize: m } = e;
    return isImageFile(x) ? createVNode(Image$1, { fit: f, src: x.content || x.url, class: bem("preview-image"), width: Array.isArray(m) ? m[0] : m, height: Array.isArray(m) ? m[1] : m, lazyLoad: c, onClick: n }, { default: p }) : createVNode("div", { class: bem("file"), style: getSizeStyle(e.previewSize) }, [createVNode(Icon, { class: bem("file-icon"), name: "description" }, null), createVNode("div", { class: [bem("file-name"), "van-ellipsis"] }, [x.file ? x.file.name : x.url]), p()]);
  };
  return () => createVNode("div", { class: bem("preview") }, [b(), i(), u()]);
} });
const uploaderProps = { name: makeNumericProp(""), accept: makeStringProp("image/*"), capture: String, multiple: Boolean, disabled: Boolean, readonly: Boolean, lazyLoad: Boolean, maxCount: makeNumericProp(1 / 0), imageFit: makeStringProp("cover"), resultType: makeStringProp("dataUrl"), uploadIcon: makeStringProp("photograph"), uploadText: String, deletable: truthProp, afterRead: Function, showUpload: truthProp, modelValue: makeArrayProp(), beforeRead: Function, beforeDelete: Function, previewSize: [Number, String, Array], previewImage: truthProp, previewOptions: Object, previewFullImage: truthProp, maxSize: { type: [Number, String, Function], default: 1 / 0 } };
var stdin_default = defineComponent({ name, props: uploaderProps, emits: ["delete", "oversize", "click-upload", "close-preview", "click-preview", "update:modelValue"], setup(e, { emit: r, slots: a }) {
  const i = ref(), s = [], n = (o = e.modelValue.length) => ({ name: e.name, index: o }), u = () => {
    i.value && (i.value.value = "");
  }, p = (o) => {
    if (u(), isOversize(o, e.maxSize)) {
      if (!Array.isArray(o))
        return void r("oversize", o, n());
      {
        const g = filterFiles(o, e.maxSize);
        if (o = g.valid, r("oversize", g.invalid, n()), !o.length)
          return;
      }
    }
    o = reactive(o), r("update:modelValue", [...e.modelValue, ...toArray(o)]), e.afterRead && e.afterRead(o, n());
  }, b = (o) => {
    const { maxCount: g, modelValue: _, resultType: S } = e;
    if (Array.isArray(o)) {
      const E = +g - _.length;
      o.length > E && (o = o.slice(0, E)), Promise.all(o.map((P) => readFileContent(P, S))).then((P) => {
        const k = o.map((C, A) => {
          const M = { file: C, status: "", message: "" };
          return P[A] && (M.content = P[A]), M;
        });
        p(k);
      });
    } else
      readFileContent(o, S).then((E) => {
        const P = { file: o, status: "", message: "" };
        E && (P.content = E), p(P);
      });
  }, x = (o) => {
    const { files: g } = o.target;
    if (e.disabled || !g || !g.length)
      return;
    const _ = g.length === 1 ? g[0] : [].slice.call(g);
    if (e.beforeRead) {
      const S = e.beforeRead(_, n());
      if (!S)
        return void u();
      if (isPromise(S))
        return void S.then((E) => {
          b(E || _);
        }).catch(u);
    }
    b(_);
  };
  let c;
  const f = () => r("close-preview"), m = (o, g) => {
    const _ = ["imageFit", "deletable", "previewSize", "beforeDelete"], S = extend(pick(e, _), pick(o, _, !0));
    return createVNode(stdin_default$1, mergeProps({ item: o, index: g, onClick: () => r("click-preview", o, n(g)), onDelete: () => ((E, P) => {
      const k = e.modelValue.slice(0);
      k.splice(P, 1), r("update:modelValue", k), r("delete", E, n(P));
    })(o, g), onPreview: () => ((E) => {
      if (e.previewFullImage) {
        const P = e.modelValue.filter(isImageFile), k = P.map((C) => (C.file && !C.url && C.status !== "failed" && (C.url = URL.createObjectURL(C.file), s.push(C.url)), C.url)).filter(Boolean);
        c = ImagePreview(extend({ images: k, startPosition: P.indexOf(E), onClose: f }, e.previewOptions));
      }
    })(o) }, pick(e, ["name", "lazyLoad"]), S), pick(a, ["preview-cover", "preview-delete"]));
  }, y = () => {
    if (e.previewImage)
      return e.modelValue.map(m);
  }, d = (o) => r("click-upload", o), l = () => {
    if (e.modelValue.length >= e.maxCount || !e.showUpload)
      return;
    const o = e.readonly ? null : createVNode("input", { ref: i, type: "file", class: bem("input"), accept: e.accept, capture: e.capture, multiple: e.multiple, disabled: e.disabled, onChange: x }, null);
    return a.default ? createVNode("div", { class: bem("input-wrapper"), onClick: d }, [a.default(), o]) : createVNode("div", { class: bem("upload", { readonly: e.readonly }), style: getSizeStyle(e.previewSize), onClick: d }, [createVNode(Icon, { name: e.uploadIcon, class: bem("upload-icon") }, null), e.uploadText && createVNode("span", { class: bem("upload-text") }, [e.uploadText]), o]);
  };
  return onBeforeUnmount(() => {
    s.forEach((o) => URL.revokeObjectURL(o));
  }), useExpose({ chooseFile: () => {
    i.value && !e.disabled && i.value.click();
  }, closeImagePreview: () => {
    c && c.close();
  } }), useCustomFieldValue(() => e.modelValue), () => createVNode("div", { class: bem() }, [createVNode("div", { class: bem("wrapper", { disabled: e.disabled }) }, [y(), l()])]);
} });
const Uploader = withInstall$1(stdin_default), base = "", index$c = "", index$b = "", index$a = "", index$9 = "", index$8 = "", index$7 = "", index$6 = "", index$5 = "", index$4 = "", index$3 = "", index$2 = "";
var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, lottie$1 = { exports: {} };
(function(module, exports) {
  var factory;
  typeof navigator < "u" && (factory = function() {
    var svgNS = "http://www.w3.org/2000/svg", locationHref = "", _useWebWorker = !1, initialDefaultFrame = -999999, setWebWorker = function(e) {
      _useWebWorker = !!e;
    }, getWebWorker = function() {
      return _useWebWorker;
    }, setLocationHref = function(e) {
      locationHref = e;
    }, getLocationHref = function() {
      return locationHref;
    };
    function createTag(e) {
      return document.createElement(e);
    }
    function extendPrototype(e, r) {
      var a, i, s = e.length;
      for (a = 0; a < s; a += 1)
        for (var n in i = e[a].prototype)
          Object.prototype.hasOwnProperty.call(i, n) && (r.prototype[n] = i[n]);
    }
    function getDescriptor(e, r) {
      return Object.getOwnPropertyDescriptor(e, r);
    }
    function createProxyFunction(e) {
      function r() {
      }
      return r.prototype = e, r;
    }
    var audioControllerFactory = function() {
      function e(r) {
        this.audios = [], this.audioFactory = r, this._volume = 1, this._isMuted = !1;
      }
      return e.prototype = { addAudio: function(r) {
        this.audios.push(r);
      }, pause: function() {
        var r, a = this.audios.length;
        for (r = 0; r < a; r += 1)
          this.audios[r].pause();
      }, resume: function() {
        var r, a = this.audios.length;
        for (r = 0; r < a; r += 1)
          this.audios[r].resume();
      }, setRate: function(r) {
        var a, i = this.audios.length;
        for (a = 0; a < i; a += 1)
          this.audios[a].setRate(r);
      }, createAudio: function(r) {
        return this.audioFactory ? this.audioFactory(r) : window.Howl ? new window.Howl({ src: [r] }) : { isPlaying: !1, play: function() {
          this.isPlaying = !0;
        }, seek: function() {
          this.isPlaying = !1;
        }, playing: function() {
        }, rate: function() {
        }, setVolume: function() {
        } };
      }, setAudioFactory: function(r) {
        this.audioFactory = r;
      }, setVolume: function(r) {
        this._volume = r, this._updateVolume();
      }, mute: function() {
        this._isMuted = !0, this._updateVolume();
      }, unmute: function() {
        this._isMuted = !1, this._updateVolume();
      }, getVolume: function() {
        return this._volume;
      }, _updateVolume: function() {
        var r, a = this.audios.length;
        for (r = 0; r < a; r += 1)
          this.audios[r].volume(this._volume * (this._isMuted ? 0 : 1));
      } }, function() {
        return new e();
      };
    }(), createTypedArray = function() {
      function e(r, a) {
        var i, s = 0, n = [];
        switch (r) {
          case "int16":
          case "uint8c":
            i = 1;
            break;
          default:
            i = 1.1;
        }
        for (s = 0; s < a; s += 1)
          n.push(i);
        return n;
      }
      return typeof Uint8ClampedArray == "function" && typeof Float32Array == "function" ? function(r, a) {
        return r === "float32" ? new Float32Array(a) : r === "int16" ? new Int16Array(a) : r === "uint8c" ? new Uint8ClampedArray(a) : e(r, a);
      } : e;
    }();
    function createSizedArray(e) {
      return Array.apply(null, { length: e });
    }
    function _typeof$6(e) {
      return _typeof$6 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
        return typeof r;
      } : function(r) {
        return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
      }, _typeof$6(e);
    }
    var subframeEnabled = !0, expressionsPlugin = null, idPrefix$1 = "", isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), bmPow = Math.pow, bmSqrt = Math.sqrt, bmFloor = Math.floor, bmMax = Math.max, bmMin = Math.min, BMMath = {};
    (function() {
      var e, r = ["abs", "acos", "acosh", "asin", "asinh", "atan", "atanh", "atan2", "ceil", "cbrt", "expm1", "clz32", "cos", "cosh", "exp", "floor", "fround", "hypot", "imul", "log", "log1p", "log2", "log10", "max", "min", "pow", "random", "round", "sign", "sin", "sinh", "sqrt", "tan", "tanh", "trunc", "E", "LN10", "LN2", "LOG10E", "LOG2E", "PI", "SQRT1_2", "SQRT2"], a = r.length;
      for (e = 0; e < a; e += 1)
        BMMath[r[e]] = Math[r[e]];
    })(), BMMath.random = Math.random, BMMath.abs = function(e) {
      if (_typeof$6(e) === "object" && e.length) {
        var r, a = createSizedArray(e.length), i = e.length;
        for (r = 0; r < i; r += 1)
          a[r] = Math.abs(e[r]);
        return a;
      }
      return Math.abs(e);
    };
    var defaultCurveSegments = 150, degToRads = Math.PI / 180, roundCorner = 0.5519;
    function styleDiv(e) {
      e.style.position = "absolute", e.style.top = 0, e.style.left = 0, e.style.display = "block", e.style.transformOrigin = "0 0", e.style.webkitTransformOrigin = "0 0", e.style.backfaceVisibility = "visible", e.style.webkitBackfaceVisibility = "visible", e.style.transformStyle = "preserve-3d", e.style.webkitTransformStyle = "preserve-3d", e.style.mozTransformStyle = "preserve-3d";
    }
    function BMEnterFrameEvent(e, r, a, i) {
      this.type = e, this.currentTime = r, this.totalTime = a, this.direction = i < 0 ? -1 : 1;
    }
    function BMCompleteEvent(e, r) {
      this.type = e, this.direction = r < 0 ? -1 : 1;
    }
    function BMCompleteLoopEvent(e, r, a, i) {
      this.type = e, this.currentLoop = a, this.totalLoops = r, this.direction = i < 0 ? -1 : 1;
    }
    function BMSegmentStartEvent(e, r, a) {
      this.type = e, this.firstFrame = r, this.totalFrames = a;
    }
    function BMDestroyEvent(e, r) {
      this.type = e, this.target = r;
    }
    function BMRenderFrameErrorEvent(e, r) {
      this.type = "renderFrameError", this.nativeError = e, this.currentTime = r;
    }
    function BMConfigErrorEvent(e) {
      this.type = "configError", this.nativeError = e;
    }
    var createElementID = (_count = 0, function() {
      return idPrefix$1 + "__lottie_element_" + (_count += 1);
    }), _count;
    function HSVtoRGB(e, r, a) {
      var i, s, n, u, p, b, x, c;
      switch (b = a * (1 - r), x = a * (1 - (p = 6 * e - (u = Math.floor(6 * e))) * r), c = a * (1 - (1 - p) * r), u % 6) {
        case 0:
          i = a, s = c, n = b;
          break;
        case 1:
          i = x, s = a, n = b;
          break;
        case 2:
          i = b, s = a, n = c;
          break;
        case 3:
          i = b, s = x, n = a;
          break;
        case 4:
          i = c, s = b, n = a;
          break;
        case 5:
          i = a, s = b, n = x;
      }
      return [i, s, n];
    }
    function RGBtoHSV(e, r, a) {
      var i, s = Math.max(e, r, a), n = Math.min(e, r, a), u = s - n, p = s === 0 ? 0 : u / s, b = s / 255;
      switch (s) {
        case n:
          i = 0;
          break;
        case e:
          i = r - a + u * (r < a ? 6 : 0), i /= 6 * u;
          break;
        case r:
          i = a - e + 2 * u, i /= 6 * u;
          break;
        case a:
          i = e - r + 4 * u, i /= 6 * u;
      }
      return [i, p, b];
    }
    function addSaturationToRGB(e, r) {
      var a = RGBtoHSV(255 * e[0], 255 * e[1], 255 * e[2]);
      return a[1] += r, a[1] > 1 ? a[1] = 1 : a[1] <= 0 && (a[1] = 0), HSVtoRGB(a[0], a[1], a[2]);
    }
    function addBrightnessToRGB(e, r) {
      var a = RGBtoHSV(255 * e[0], 255 * e[1], 255 * e[2]);
      return a[2] += r, a[2] > 1 ? a[2] = 1 : a[2] < 0 && (a[2] = 0), HSVtoRGB(a[0], a[1], a[2]);
    }
    function addHueToRGB(e, r) {
      var a = RGBtoHSV(255 * e[0], 255 * e[1], 255 * e[2]);
      return a[0] += r / 360, a[0] > 1 ? a[0] -= 1 : a[0] < 0 && (a[0] += 1), HSVtoRGB(a[0], a[1], a[2]);
    }
    var rgbToHex = function() {
      var e, r, a = [];
      for (e = 0; e < 256; e += 1)
        r = e.toString(16), a[e] = r.length === 1 ? "0" + r : r;
      return function(i, s, n) {
        return i < 0 && (i = 0), s < 0 && (s = 0), n < 0 && (n = 0), "#" + a[i] + a[s] + a[n];
      };
    }(), setSubframeEnabled = function(e) {
      subframeEnabled = !!e;
    }, getSubframeEnabled = function() {
      return subframeEnabled;
    }, setExpressionsPlugin = function(e) {
      expressionsPlugin = e;
    }, getExpressionsPlugin = function() {
      return expressionsPlugin;
    }, setDefaultCurveSegments = function(e) {
      defaultCurveSegments = e;
    }, getDefaultCurveSegments = function() {
      return defaultCurveSegments;
    }, setIdPrefix = function(e) {
      idPrefix$1 = e;
    };
    function createNS(e) {
      return document.createElementNS(svgNS, e);
    }
    function _typeof$5(e) {
      return _typeof$5 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
        return typeof r;
      } : function(r) {
        return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
      }, _typeof$5(e);
    }
    var dataManager = function() {
      var e, r, a = 1, i = [], s = { onmessage: function() {
      }, postMessage: function(b) {
        e({ data: b });
      } }, n = { postMessage: function(b) {
        s.onmessage({ data: b });
      } };
      function u() {
        r || (r = function(b) {
          if (window.Worker && window.Blob && getWebWorker()) {
            var x = new Blob(["var _workerSelf = self; self.onmessage = ", b.toString()], { type: "text/javascript" }), c = URL.createObjectURL(x);
            return new Worker(c);
          }
          return e = b, s;
        }(function(b) {
          if (n.dataManager || (n.dataManager = function() {
            function c(C, A) {
              var M, I, D, L, R, V, B = C.length;
              for (I = 0; I < B; I += 1)
                if ("ks" in (M = C[I]) && !M.completed) {
                  if (M.completed = !0, M.tt && (C[I - 1].td = M.tt), M.hasMask) {
                    var N = M.masksProperties;
                    for (L = N.length, D = 0; D < L; D += 1)
                      if (N[D].pt.k.i)
                        y(N[D].pt.k);
                      else
                        for (V = N[D].pt.k.length, R = 0; R < V; R += 1)
                          N[D].pt.k[R].s && y(N[D].pt.k[R].s[0]), N[D].pt.k[R].e && y(N[D].pt.k[R].e[0]);
                  }
                  M.ty === 0 ? (M.layers = f(M.refId, A), c(M.layers, A)) : M.ty === 4 ? m(M.shapes) : M.ty === 5 && P(M);
                }
            }
            function f(C, A) {
              var M = function(I, D) {
                for (var L = 0, R = D.length; L < R; ) {
                  if (D[L].id === I)
                    return D[L];
                  L += 1;
                }
                return null;
              }(C, A);
              return M ? M.layers.__used ? JSON.parse(JSON.stringify(M.layers)) : (M.layers.__used = !0, M.layers) : null;
            }
            function m(C) {
              var A, M, I;
              for (A = C.length - 1; A >= 0; A -= 1)
                if (C[A].ty === "sh")
                  if (C[A].ks.k.i)
                    y(C[A].ks.k);
                  else
                    for (I = C[A].ks.k.length, M = 0; M < I; M += 1)
                      C[A].ks.k[M].s && y(C[A].ks.k[M].s[0]), C[A].ks.k[M].e && y(C[A].ks.k[M].e[0]);
                else
                  C[A].ty === "gr" && m(C[A].it);
            }
            function y(C) {
              var A, M = C.i.length;
              for (A = 0; A < M; A += 1)
                C.i[A][0] += C.v[A][0], C.i[A][1] += C.v[A][1], C.o[A][0] += C.v[A][0], C.o[A][1] += C.v[A][1];
            }
            function d(C, A) {
              var M = A ? A.split(".") : [100, 100, 100];
              return C[0] > M[0] || !(M[0] > C[0]) && (C[1] > M[1] || !(M[1] > C[1]) && (C[2] > M[2] || !(M[2] > C[2]) && null));
            }
            var l, o = function() {
              var C = [4, 4, 14];
              function A(M) {
                var I, D, L, R = M.length;
                for (I = 0; I < R; I += 1)
                  M[I].ty === 5 && (L = void 0, L = (D = M[I]).t.d, D.t.d = { k: [{ s: L, t: 0 }] });
              }
              return function(M) {
                if (d(C, M.v) && (A(M.layers), M.assets)) {
                  var I, D = M.assets.length;
                  for (I = 0; I < D; I += 1)
                    M.assets[I].layers && A(M.assets[I].layers);
                }
              };
            }(), g = (l = [4, 7, 99], function(C) {
              if (C.chars && !d(l, C.v)) {
                var A, M = C.chars.length;
                for (A = 0; A < M; A += 1) {
                  var I = C.chars[A];
                  I.data && I.data.shapes && (m(I.data.shapes), I.data.ip = 0, I.data.op = 99999, I.data.st = 0, I.data.sr = 1, I.data.ks = { p: { k: [0, 0], a: 0 }, s: { k: [100, 100], a: 0 }, a: { k: [0, 0], a: 0 }, r: { k: 0, a: 0 }, o: { k: 100, a: 0 } }, C.chars[A].t || (I.data.shapes.push({ ty: "no" }), I.data.shapes[0].it.push({ p: { k: [0, 0], a: 0 }, s: { k: [100, 100], a: 0 }, a: { k: [0, 0], a: 0 }, r: { k: 0, a: 0 }, o: { k: 100, a: 0 }, sk: { k: 0, a: 0 }, sa: { k: 0, a: 0 }, ty: "tr" })));
                }
              }
            }), _ = function() {
              var C = [5, 7, 15];
              function A(M) {
                var I, D, L = M.length;
                for (I = 0; I < L; I += 1)
                  M[I].ty === 5 && (D = void 0, typeof (D = M[I].t.p).a == "number" && (D.a = { a: 0, k: D.a }), typeof D.p == "number" && (D.p = { a: 0, k: D.p }), typeof D.r == "number" && (D.r = { a: 0, k: D.r }));
              }
              return function(M) {
                if (d(C, M.v) && (A(M.layers), M.assets)) {
                  var I, D = M.assets.length;
                  for (I = 0; I < D; I += 1)
                    M.assets[I].layers && A(M.assets[I].layers);
                }
              };
            }(), S = function() {
              var C = [4, 1, 9];
              function A(I) {
                var D, L, R, V = I.length;
                for (D = 0; D < V; D += 1)
                  if (I[D].ty === "gr")
                    A(I[D].it);
                  else if (I[D].ty === "fl" || I[D].ty === "st")
                    if (I[D].c.k && I[D].c.k[0].i)
                      for (R = I[D].c.k.length, L = 0; L < R; L += 1)
                        I[D].c.k[L].s && (I[D].c.k[L].s[0] /= 255, I[D].c.k[L].s[1] /= 255, I[D].c.k[L].s[2] /= 255, I[D].c.k[L].s[3] /= 255), I[D].c.k[L].e && (I[D].c.k[L].e[0] /= 255, I[D].c.k[L].e[1] /= 255, I[D].c.k[L].e[2] /= 255, I[D].c.k[L].e[3] /= 255);
                    else
                      I[D].c.k[0] /= 255, I[D].c.k[1] /= 255, I[D].c.k[2] /= 255, I[D].c.k[3] /= 255;
              }
              function M(I) {
                var D, L = I.length;
                for (D = 0; D < L; D += 1)
                  I[D].ty === 4 && A(I[D].shapes);
              }
              return function(I) {
                if (d(C, I.v) && (M(I.layers), I.assets)) {
                  var D, L = I.assets.length;
                  for (D = 0; D < L; D += 1)
                    I.assets[D].layers && M(I.assets[D].layers);
                }
              };
            }(), E = function() {
              var C = [4, 4, 18];
              function A(I) {
                var D, L, R;
                for (D = I.length - 1; D >= 0; D -= 1)
                  if (I[D].ty === "sh")
                    if (I[D].ks.k.i)
                      I[D].ks.k.c = I[D].closed;
                    else
                      for (R = I[D].ks.k.length, L = 0; L < R; L += 1)
                        I[D].ks.k[L].s && (I[D].ks.k[L].s[0].c = I[D].closed), I[D].ks.k[L].e && (I[D].ks.k[L].e[0].c = I[D].closed);
                  else
                    I[D].ty === "gr" && A(I[D].it);
              }
              function M(I) {
                var D, L, R, V, B, N, F = I.length;
                for (L = 0; L < F; L += 1) {
                  if ((D = I[L]).hasMask) {
                    var T = D.masksProperties;
                    for (V = T.length, R = 0; R < V; R += 1)
                      if (T[R].pt.k.i)
                        T[R].pt.k.c = T[R].cl;
                      else
                        for (N = T[R].pt.k.length, B = 0; B < N; B += 1)
                          T[R].pt.k[B].s && (T[R].pt.k[B].s[0].c = T[R].cl), T[R].pt.k[B].e && (T[R].pt.k[B].e[0].c = T[R].cl);
                  }
                  D.ty === 4 && A(D.shapes);
                }
              }
              return function(I) {
                if (d(C, I.v) && (M(I.layers), I.assets)) {
                  var D, L = I.assets.length;
                  for (D = 0; D < L; D += 1)
                    I.assets[D].layers && M(I.assets[D].layers);
                }
              };
            }();
            function P(C) {
              C.t.a.length === 0 && C.t.p;
            }
            var k = { completeData: function(C) {
              C.__complete || (S(C), o(C), g(C), _(C), E(C), c(C.layers, C.assets), function(A, M) {
                if (A) {
                  var I = 0, D = A.length;
                  for (I = 0; I < D; I += 1)
                    A[I].t === 1 && (A[I].data.layers = f(A[I].data.refId, M), c(A[I].data.layers, M));
                }
              }(C.chars, C.assets), C.__complete = !0);
            } };
            return k.checkColors = S, k.checkChars = g, k.checkPathProperties = _, k.checkShapes = E, k.completeLayers = c, k;
          }()), n.assetLoader || (n.assetLoader = function() {
            function c(f) {
              var m = f.getResponseHeader("content-type");
              return m && f.responseType === "json" && m.indexOf("json") !== -1 || f.response && _typeof$5(f.response) === "object" ? f.response : f.response && typeof f.response == "string" ? JSON.parse(f.response) : f.responseText ? JSON.parse(f.responseText) : null;
            }
            return { load: function(f, m, y, d) {
              var l, o = new XMLHttpRequest();
              try {
                o.responseType = "json";
              } catch {
              }
              o.onreadystatechange = function() {
                if (o.readyState === 4)
                  if (o.status === 200)
                    l = c(o), y(l);
                  else
                    try {
                      l = c(o), y(l);
                    } catch (g) {
                      d && d(g);
                    }
              };
              try {
                o.open("GET", f, !0);
              } catch {
                o.open("GET", m + "/" + f, !0);
              }
              o.send();
            } };
          }()), b.data.type === "loadAnimation")
            n.assetLoader.load(b.data.path, b.data.fullPath, function(c) {
              n.dataManager.completeData(c), n.postMessage({ id: b.data.id, payload: c, status: "success" });
            }, function() {
              n.postMessage({ id: b.data.id, status: "error" });
            });
          else if (b.data.type === "complete") {
            var x = b.data.animation;
            n.dataManager.completeData(x), n.postMessage({ id: b.data.id, payload: x, status: "success" });
          } else
            b.data.type === "loadData" && n.assetLoader.load(b.data.path, b.data.fullPath, function(c) {
              n.postMessage({ id: b.data.id, payload: c, status: "success" });
            }, function() {
              n.postMessage({ id: b.data.id, status: "error" });
            });
        }), r.onmessage = function(b) {
          var x = b.data, c = x.id, f = i[c];
          i[c] = null, x.status === "success" ? f.onComplete(x.payload) : f.onError && f.onError();
        });
      }
      function p(b, x) {
        var c = "processId_" + (a += 1);
        return i[c] = { onComplete: b, onError: x }, c;
      }
      return { loadAnimation: function(b, x, c) {
        u();
        var f = p(x, c);
        r.postMessage({ type: "loadAnimation", path: b, fullPath: window.location.origin + window.location.pathname, id: f });
      }, loadData: function(b, x, c) {
        u();
        var f = p(x, c);
        r.postMessage({ type: "loadData", path: b, fullPath: window.location.origin + window.location.pathname, id: f });
      }, completeAnimation: function(b, x, c) {
        u();
        var f = p(x, c);
        r.postMessage({ type: "complete", animation: b, id: f });
      } };
    }(), ImagePreloader = function() {
      var e = function() {
        var p = createTag("canvas");
        p.width = 1, p.height = 1;
        var b = p.getContext("2d");
        return b.fillStyle = "rgba(0,0,0,0)", b.fillRect(0, 0, 1, 1), p;
      }();
      function r() {
        this.loadedAssets += 1, this.loadedAssets === this.totalImages && this.loadedFootagesCount === this.totalFootages && this.imagesLoadedCb && this.imagesLoadedCb(null);
      }
      function a() {
        this.loadedFootagesCount += 1, this.loadedAssets === this.totalImages && this.loadedFootagesCount === this.totalFootages && this.imagesLoadedCb && this.imagesLoadedCb(null);
      }
      function i(p, b, x) {
        var c = "";
        if (p.e)
          c = p.p;
        else if (b) {
          var f = p.p;
          f.indexOf("images/") !== -1 && (f = f.split("/")[1]), c = b + f;
        } else
          c = x, c += p.u ? p.u : "", c += p.p;
        return c;
      }
      function s(p) {
        var b = 0, x = setInterval(function() {
          (p.getBBox().width || b > 500) && (this._imageLoaded(), clearInterval(x)), b += 1;
        }.bind(this), 50);
      }
      function n(p) {
        var b = { assetData: p }, x = i(p, this.assetsPath, this.path);
        return dataManager.loadData(x, function(c) {
          b.img = c, this._footageLoaded();
        }.bind(this), function() {
          b.img = {}, this._footageLoaded();
        }.bind(this)), b;
      }
      function u() {
        this._imageLoaded = r.bind(this), this._footageLoaded = a.bind(this), this.testImageLoaded = s.bind(this), this.createFootageData = n.bind(this), this.assetsPath = "", this.path = "", this.totalImages = 0, this.totalFootages = 0, this.loadedAssets = 0, this.loadedFootagesCount = 0, this.imagesLoadedCb = null, this.images = [];
      }
      return u.prototype = { loadAssets: function(p, b) {
        var x;
        this.imagesLoadedCb = b;
        var c = p.length;
        for (x = 0; x < c; x += 1)
          p[x].layers || (p[x].t && p[x].t !== "seq" ? p[x].t === 3 && (this.totalFootages += 1, this.images.push(this.createFootageData(p[x]))) : (this.totalImages += 1, this.images.push(this._createImageData(p[x]))));
      }, setAssetsPath: function(p) {
        this.assetsPath = p || "";
      }, setPath: function(p) {
        this.path = p || "";
      }, loadedImages: function() {
        return this.totalImages === this.loadedAssets;
      }, loadedFootages: function() {
        return this.totalFootages === this.loadedFootagesCount;
      }, destroy: function() {
        this.imagesLoadedCb = null, this.images.length = 0;
      }, getAsset: function(p) {
        for (var b = 0, x = this.images.length; b < x; ) {
          if (this.images[b].assetData === p)
            return this.images[b].img;
          b += 1;
        }
        return null;
      }, createImgData: function(p) {
        var b = i(p, this.assetsPath, this.path), x = createTag("img");
        x.crossOrigin = "anonymous", x.addEventListener("load", this._imageLoaded, !1), x.addEventListener("error", function() {
          c.img = e, this._imageLoaded();
        }.bind(this), !1), x.src = b;
        var c = { img: x, assetData: p };
        return c;
      }, createImageData: function(p) {
        var b = i(p, this.assetsPath, this.path), x = createNS("image");
        isSafari ? this.testImageLoaded(x) : x.addEventListener("load", this._imageLoaded, !1), x.addEventListener("error", function() {
          c.img = e, this._imageLoaded();
        }.bind(this), !1), x.setAttributeNS("http://www.w3.org/1999/xlink", "href", b), this._elementHelper.append ? this._elementHelper.append(x) : this._elementHelper.appendChild(x);
        var c = { img: x, assetData: p };
        return c;
      }, imageLoaded: r, footageLoaded: a, setCacheType: function(p, b) {
        p === "svg" ? (this._elementHelper = b, this._createImageData = this.createImageData.bind(this)) : this._createImageData = this.createImgData.bind(this);
      } }, u;
    }();
    function BaseEvent() {
    }
    BaseEvent.prototype = { triggerEvent: function(e, r) {
      if (this._cbs[e])
        for (var a = this._cbs[e], i = 0; i < a.length; i += 1)
          a[i](r);
    }, addEventListener: function(e, r) {
      return this._cbs[e] || (this._cbs[e] = []), this._cbs[e].push(r), function() {
        this.removeEventListener(e, r);
      }.bind(this);
    }, removeEventListener: function(e, r) {
      if (r) {
        if (this._cbs[e]) {
          for (var a = 0, i = this._cbs[e].length; a < i; )
            this._cbs[e][a] === r && (this._cbs[e].splice(a, 1), a -= 1, i -= 1), a += 1;
          this._cbs[e].length || (this._cbs[e] = null);
        }
      } else
        this._cbs[e] = null;
    } };
    var markerParser = function() {
      function e(r) {
        for (var a, i = r.split(`\r
`), s = {}, n = 0, u = 0; u < i.length; u += 1)
          (a = i[u].split(":")).length === 2 && (s[a[0]] = a[1].trim(), n += 1);
        if (n === 0)
          throw new Error();
        return s;
      }
      return function(r) {
        for (var a = [], i = 0; i < r.length; i += 1) {
          var s = r[i], n = { time: s.tm, duration: s.dr };
          try {
            n.payload = JSON.parse(r[i].cm);
          } catch {
            try {
              n.payload = e(r[i].cm);
            } catch {
              n.payload = { name: r[i].cm };
            }
          }
          a.push(n);
        }
        return a;
      };
    }(), ProjectInterface = function() {
      function e(r) {
        this.compositions.push(r);
      }
      return function() {
        function r(a) {
          for (var i = 0, s = this.compositions.length; i < s; ) {
            if (this.compositions[i].data && this.compositions[i].data.nm === a)
              return this.compositions[i].prepareFrame && this.compositions[i].data.xt && this.compositions[i].prepareFrame(this.currentFrame), this.compositions[i].compInterface;
            i += 1;
          }
          return null;
        }
        return r.compositions = [], r.currentFrame = 0, r.registerComposition = e, r;
      };
    }(), renderers = {}, registerRenderer = function(e, r) {
      renderers[e] = r;
    };
    function getRenderer(e) {
      return renderers[e];
    }
    function _typeof$4(e) {
      return _typeof$4 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
        return typeof r;
      } : function(r) {
        return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
      }, _typeof$4(e);
    }
    var AnimationItem = function() {
      this._cbs = [], this.name = "", this.path = "", this.isLoaded = !1, this.currentFrame = 0, this.currentRawFrame = 0, this.firstFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, this.playSpeed = 1, this.playDirection = 1, this.playCount = 0, this.animationData = {}, this.assets = [], this.isPaused = !0, this.autoplay = !1, this.loop = !0, this.renderer = null, this.animationID = createElementID(), this.assetsPath = "", this.timeCompleted = 0, this.segmentPos = 0, this.isSubframeEnabled = getSubframeEnabled(), this.segments = [], this._idle = !0, this._completedLoop = !1, this.projectInterface = ProjectInterface(), this.imagePreloader = new ImagePreloader(), this.audioController = audioControllerFactory(), this.markers = [], this.configAnimation = this.configAnimation.bind(this), this.onSetupError = this.onSetupError.bind(this), this.onSegmentComplete = this.onSegmentComplete.bind(this), this.drawnFrameEvent = new BMEnterFrameEvent("drawnFrame", 0, 0, 0);
    };
    extendPrototype([BaseEvent], AnimationItem), AnimationItem.prototype.setParams = function(e) {
      (e.wrapper || e.container) && (this.wrapper = e.wrapper || e.container);
      var r = "svg";
      e.animType ? r = e.animType : e.renderer && (r = e.renderer);
      var a = getRenderer(r);
      this.renderer = new a(this, e.rendererSettings), this.imagePreloader.setCacheType(r, this.renderer.globalData.defs), this.renderer.setProjectInterface(this.projectInterface), this.animType = r, e.loop === "" || e.loop === null || e.loop === void 0 || e.loop === !0 ? this.loop = !0 : e.loop === !1 ? this.loop = !1 : this.loop = parseInt(e.loop, 10), this.autoplay = !("autoplay" in e) || e.autoplay, this.name = e.name ? e.name : "", this.autoloadSegments = !Object.prototype.hasOwnProperty.call(e, "autoloadSegments") || e.autoloadSegments, this.assetsPath = e.assetsPath, this.initialSegment = e.initialSegment, e.audioFactory && this.audioController.setAudioFactory(e.audioFactory), e.animationData ? this.setupAnimation(e.animationData) : e.path && (e.path.lastIndexOf("\\") !== -1 ? this.path = e.path.substr(0, e.path.lastIndexOf("\\") + 1) : this.path = e.path.substr(0, e.path.lastIndexOf("/") + 1), this.fileName = e.path.substr(e.path.lastIndexOf("/") + 1), this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), dataManager.loadAnimation(e.path, this.configAnimation, this.onSetupError));
    }, AnimationItem.prototype.onSetupError = function() {
      this.trigger("data_failed");
    }, AnimationItem.prototype.setupAnimation = function(e) {
      dataManager.completeAnimation(e, this.configAnimation);
    }, AnimationItem.prototype.setData = function(e, r) {
      r && _typeof$4(r) !== "object" && (r = JSON.parse(r));
      var a = { wrapper: e, animationData: r }, i = e.attributes;
      a.path = i.getNamedItem("data-animation-path") ? i.getNamedItem("data-animation-path").value : i.getNamedItem("data-bm-path") ? i.getNamedItem("data-bm-path").value : i.getNamedItem("bm-path") ? i.getNamedItem("bm-path").value : "", a.animType = i.getNamedItem("data-anim-type") ? i.getNamedItem("data-anim-type").value : i.getNamedItem("data-bm-type") ? i.getNamedItem("data-bm-type").value : i.getNamedItem("bm-type") ? i.getNamedItem("bm-type").value : i.getNamedItem("data-bm-renderer") ? i.getNamedItem("data-bm-renderer").value : i.getNamedItem("bm-renderer") ? i.getNamedItem("bm-renderer").value : "canvas";
      var s = i.getNamedItem("data-anim-loop") ? i.getNamedItem("data-anim-loop").value : i.getNamedItem("data-bm-loop") ? i.getNamedItem("data-bm-loop").value : i.getNamedItem("bm-loop") ? i.getNamedItem("bm-loop").value : "";
      s === "false" ? a.loop = !1 : s === "true" ? a.loop = !0 : s !== "" && (a.loop = parseInt(s, 10));
      var n = i.getNamedItem("data-anim-autoplay") ? i.getNamedItem("data-anim-autoplay").value : i.getNamedItem("data-bm-autoplay") ? i.getNamedItem("data-bm-autoplay").value : !i.getNamedItem("bm-autoplay") || i.getNamedItem("bm-autoplay").value;
      a.autoplay = n !== "false", a.name = i.getNamedItem("data-name") ? i.getNamedItem("data-name").value : i.getNamedItem("data-bm-name") ? i.getNamedItem("data-bm-name").value : i.getNamedItem("bm-name") ? i.getNamedItem("bm-name").value : "", (i.getNamedItem("data-anim-prerender") ? i.getNamedItem("data-anim-prerender").value : i.getNamedItem("data-bm-prerender") ? i.getNamedItem("data-bm-prerender").value : i.getNamedItem("bm-prerender") ? i.getNamedItem("bm-prerender").value : "") === "false" && (a.prerender = !1), this.setParams(a);
    }, AnimationItem.prototype.includeLayers = function(e) {
      e.op > this.animationData.op && (this.animationData.op = e.op, this.totalFrames = Math.floor(e.op - this.animationData.ip));
      var r, a, i = this.animationData.layers, s = i.length, n = e.layers, u = n.length;
      for (a = 0; a < u; a += 1)
        for (r = 0; r < s; ) {
          if (i[r].id === n[a].id) {
            i[r] = n[a];
            break;
          }
          r += 1;
        }
      if ((e.chars || e.fonts) && (this.renderer.globalData.fontManager.addChars(e.chars), this.renderer.globalData.fontManager.addFonts(e.fonts, this.renderer.globalData.defs)), e.assets)
        for (s = e.assets.length, r = 0; r < s; r += 1)
          this.animationData.assets.push(e.assets[r]);
      this.animationData.__complete = !1, dataManager.completeAnimation(this.animationData, this.onSegmentComplete);
    }, AnimationItem.prototype.onSegmentComplete = function(e) {
      this.animationData = e;
      var r = getExpressionsPlugin();
      r && r.initExpressions(this), this.loadNextSegment();
    }, AnimationItem.prototype.loadNextSegment = function() {
      var e = this.animationData.segments;
      if (!e || e.length === 0 || !this.autoloadSegments)
        return this.trigger("data_ready"), void (this.timeCompleted = this.totalFrames);
      var r = e.shift();
      this.timeCompleted = r.time * this.frameRate;
      var a = this.path + this.fileName + "_" + this.segmentPos + ".json";
      this.segmentPos += 1, dataManager.loadData(a, this.includeLayers.bind(this), function() {
        this.trigger("data_failed");
      }.bind(this));
    }, AnimationItem.prototype.loadSegments = function() {
      this.animationData.segments || (this.timeCompleted = this.totalFrames), this.loadNextSegment();
    }, AnimationItem.prototype.imagesLoaded = function() {
      this.trigger("loaded_images"), this.checkLoaded();
    }, AnimationItem.prototype.preloadImages = function() {
      this.imagePreloader.setAssetsPath(this.assetsPath), this.imagePreloader.setPath(this.path), this.imagePreloader.loadAssets(this.animationData.assets, this.imagesLoaded.bind(this));
    }, AnimationItem.prototype.configAnimation = function(e) {
      if (this.renderer)
        try {
          this.animationData = e, this.initialSegment ? (this.totalFrames = Math.floor(this.initialSegment[1] - this.initialSegment[0]), this.firstFrame = Math.round(this.initialSegment[0])) : (this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), this.firstFrame = Math.round(this.animationData.ip)), this.renderer.configAnimation(e), e.assets || (e.assets = []), this.assets = this.animationData.assets, this.frameRate = this.animationData.fr, this.frameMult = this.animationData.fr / 1e3, this.renderer.searchExtraCompositions(e.assets), this.markers = markerParser(e.markers || []), this.trigger("config_ready"), this.preloadImages(), this.loadSegments(), this.updaFrameModifier(), this.waitForFontsLoaded(), this.isPaused && this.audioController.pause();
        } catch (r) {
          this.triggerConfigError(r);
        }
    }, AnimationItem.prototype.waitForFontsLoaded = function() {
      this.renderer && (this.renderer.globalData.fontManager.isLoaded ? this.checkLoaded() : setTimeout(this.waitForFontsLoaded.bind(this), 20));
    }, AnimationItem.prototype.checkLoaded = function() {
      if (!this.isLoaded && this.renderer.globalData.fontManager.isLoaded && (this.imagePreloader.loadedImages() || this.renderer.rendererType !== "canvas") && this.imagePreloader.loadedFootages()) {
        this.isLoaded = !0;
        var e = getExpressionsPlugin();
        e && e.initExpressions(this), this.renderer.initItems(), setTimeout(function() {
          this.trigger("DOMLoaded");
        }.bind(this), 0), this.gotoFrame(), this.autoplay && this.play();
      }
    }, AnimationItem.prototype.resize = function() {
      this.renderer.updateContainerSize();
    }, AnimationItem.prototype.setSubframe = function(e) {
      this.isSubframeEnabled = !!e;
    }, AnimationItem.prototype.gotoFrame = function() {
      this.currentFrame = this.isSubframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame, this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), this.trigger("enterFrame"), this.renderFrame(), this.trigger("drawnFrame");
    }, AnimationItem.prototype.renderFrame = function() {
      if (this.isLoaded !== !1 && this.renderer)
        try {
          this.renderer.renderFrame(this.currentFrame + this.firstFrame);
        } catch (e) {
          this.triggerRenderFrameError(e);
        }
    }, AnimationItem.prototype.play = function(e) {
      e && this.name !== e || this.isPaused === !0 && (this.isPaused = !1, this.trigger("_pause"), this.audioController.resume(), this._idle && (this._idle = !1, this.trigger("_active")));
    }, AnimationItem.prototype.pause = function(e) {
      e && this.name !== e || this.isPaused === !1 && (this.isPaused = !0, this.trigger("_play"), this._idle = !0, this.trigger("_idle"), this.audioController.pause());
    }, AnimationItem.prototype.togglePause = function(e) {
      e && this.name !== e || (this.isPaused === !0 ? this.play() : this.pause());
    }, AnimationItem.prototype.stop = function(e) {
      e && this.name !== e || (this.pause(), this.playCount = 0, this._completedLoop = !1, this.setCurrentRawFrameValue(0));
    }, AnimationItem.prototype.getMarkerData = function(e) {
      for (var r, a = 0; a < this.markers.length; a += 1)
        if ((r = this.markers[a]).payload && r.payload.name === e)
          return r;
      return null;
    }, AnimationItem.prototype.goToAndStop = function(e, r, a) {
      if (!a || this.name === a) {
        var i = Number(e);
        if (isNaN(i)) {
          var s = this.getMarkerData(e);
          s && this.goToAndStop(s.time, !0);
        } else
          r ? this.setCurrentRawFrameValue(e) : this.setCurrentRawFrameValue(e * this.frameModifier);
        this.pause();
      }
    }, AnimationItem.prototype.goToAndPlay = function(e, r, a) {
      if (!a || this.name === a) {
        var i = Number(e);
        if (isNaN(i)) {
          var s = this.getMarkerData(e);
          s && (s.duration ? this.playSegments([s.time, s.time + s.duration], !0) : this.goToAndStop(s.time, !0));
        } else
          this.goToAndStop(i, r, a);
        this.play();
      }
    }, AnimationItem.prototype.advanceTime = function(e) {
      if (this.isPaused !== !0 && this.isLoaded !== !1) {
        var r = this.currentRawFrame + e * this.frameModifier, a = !1;
        r >= this.totalFrames - 1 && this.frameModifier > 0 ? this.loop && this.playCount !== this.loop ? r >= this.totalFrames ? (this.playCount += 1, this.checkSegments(r % this.totalFrames) || (this.setCurrentRawFrameValue(r % this.totalFrames), this._completedLoop = !0, this.trigger("loopComplete"))) : this.setCurrentRawFrameValue(r) : this.checkSegments(r > this.totalFrames ? r % this.totalFrames : 0) || (a = !0, r = this.totalFrames - 1) : r < 0 ? this.checkSegments(r % this.totalFrames) || (!this.loop || this.playCount-- <= 0 && this.loop !== !0 ? (a = !0, r = 0) : (this.setCurrentRawFrameValue(this.totalFrames + r % this.totalFrames), this._completedLoop ? this.trigger("loopComplete") : this._completedLoop = !0)) : this.setCurrentRawFrameValue(r), a && (this.setCurrentRawFrameValue(r), this.pause(), this.trigger("complete"));
      }
    }, AnimationItem.prototype.adjustSegment = function(e, r) {
      this.playCount = 0, e[1] < e[0] ? (this.frameModifier > 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)), this.totalFrames = e[0] - e[1], this.timeCompleted = this.totalFrames, this.firstFrame = e[1], this.setCurrentRawFrameValue(this.totalFrames - 1e-3 - r)) : e[1] > e[0] && (this.frameModifier < 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)), this.totalFrames = e[1] - e[0], this.timeCompleted = this.totalFrames, this.firstFrame = e[0], this.setCurrentRawFrameValue(1e-3 + r)), this.trigger("segmentStart");
    }, AnimationItem.prototype.setSegment = function(e, r) {
      var a = -1;
      this.isPaused && (this.currentRawFrame + this.firstFrame < e ? a = e : this.currentRawFrame + this.firstFrame > r && (a = r - e)), this.firstFrame = e, this.totalFrames = r - e, this.timeCompleted = this.totalFrames, a !== -1 && this.goToAndStop(a, !0);
    }, AnimationItem.prototype.playSegments = function(e, r) {
      if (r && (this.segments.length = 0), _typeof$4(e[0]) === "object") {
        var a, i = e.length;
        for (a = 0; a < i; a += 1)
          this.segments.push(e[a]);
      } else
        this.segments.push(e);
      this.segments.length && r && this.adjustSegment(this.segments.shift(), 0), this.isPaused && this.play();
    }, AnimationItem.prototype.resetSegments = function(e) {
      this.segments.length = 0, this.segments.push([this.animationData.ip, this.animationData.op]), e && this.checkSegments(0);
    }, AnimationItem.prototype.checkSegments = function(e) {
      return !!this.segments.length && (this.adjustSegment(this.segments.shift(), e), !0);
    }, AnimationItem.prototype.destroy = function(e) {
      e && this.name !== e || !this.renderer || (this.renderer.destroy(), this.imagePreloader.destroy(), this.trigger("destroy"), this._cbs = null, this.onEnterFrame = null, this.onLoopComplete = null, this.onComplete = null, this.onSegmentStart = null, this.onDestroy = null, this.renderer = null, this.renderer = null, this.imagePreloader = null, this.projectInterface = null);
    }, AnimationItem.prototype.setCurrentRawFrameValue = function(e) {
      this.currentRawFrame = e, this.gotoFrame();
    }, AnimationItem.prototype.setSpeed = function(e) {
      this.playSpeed = e, this.updaFrameModifier();
    }, AnimationItem.prototype.setDirection = function(e) {
      this.playDirection = e < 0 ? -1 : 1, this.updaFrameModifier();
    }, AnimationItem.prototype.setVolume = function(e, r) {
      r && this.name !== r || this.audioController.setVolume(e);
    }, AnimationItem.prototype.getVolume = function() {
      return this.audioController.getVolume();
    }, AnimationItem.prototype.mute = function(e) {
      e && this.name !== e || this.audioController.mute();
    }, AnimationItem.prototype.unmute = function(e) {
      e && this.name !== e || this.audioController.unmute();
    }, AnimationItem.prototype.updaFrameModifier = function() {
      this.frameModifier = this.frameMult * this.playSpeed * this.playDirection, this.audioController.setRate(this.playSpeed * this.playDirection);
    }, AnimationItem.prototype.getPath = function() {
      return this.path;
    }, AnimationItem.prototype.getAssetsPath = function(e) {
      var r = "";
      if (e.e)
        r = e.p;
      else if (this.assetsPath) {
        var a = e.p;
        a.indexOf("images/") !== -1 && (a = a.split("/")[1]), r = this.assetsPath + a;
      } else
        r = this.path, r += e.u ? e.u : "", r += e.p;
      return r;
    }, AnimationItem.prototype.getAssetData = function(e) {
      for (var r = 0, a = this.assets.length; r < a; ) {
        if (e === this.assets[r].id)
          return this.assets[r];
        r += 1;
      }
      return null;
    }, AnimationItem.prototype.hide = function() {
      this.renderer.hide();
    }, AnimationItem.prototype.show = function() {
      this.renderer.show();
    }, AnimationItem.prototype.getDuration = function(e) {
      return e ? this.totalFrames : this.totalFrames / this.frameRate;
    }, AnimationItem.prototype.updateDocumentData = function(e, r, a) {
      try {
        this.renderer.getElementByPath(e).updateDocumentData(r, a);
      } catch {
      }
    }, AnimationItem.prototype.trigger = function(e) {
      if (this._cbs && this._cbs[e])
        switch (e) {
          case "enterFrame":
            this.triggerEvent(e, new BMEnterFrameEvent(e, this.currentFrame, this.totalFrames, this.frameModifier));
            break;
          case "drawnFrame":
            this.drawnFrameEvent.currentTime = this.currentFrame, this.drawnFrameEvent.totalTime = this.totalFrames, this.drawnFrameEvent.direction = this.frameModifier, this.triggerEvent(e, this.drawnFrameEvent);
            break;
          case "loopComplete":
            this.triggerEvent(e, new BMCompleteLoopEvent(e, this.loop, this.playCount, this.frameMult));
            break;
          case "complete":
            this.triggerEvent(e, new BMCompleteEvent(e, this.frameMult));
            break;
          case "segmentStart":
            this.triggerEvent(e, new BMSegmentStartEvent(e, this.firstFrame, this.totalFrames));
            break;
          case "destroy":
            this.triggerEvent(e, new BMDestroyEvent(e, this));
            break;
          default:
            this.triggerEvent(e);
        }
      e === "enterFrame" && this.onEnterFrame && this.onEnterFrame.call(this, new BMEnterFrameEvent(e, this.currentFrame, this.totalFrames, this.frameMult)), e === "loopComplete" && this.onLoopComplete && this.onLoopComplete.call(this, new BMCompleteLoopEvent(e, this.loop, this.playCount, this.frameMult)), e === "complete" && this.onComplete && this.onComplete.call(this, new BMCompleteEvent(e, this.frameMult)), e === "segmentStart" && this.onSegmentStart && this.onSegmentStart.call(this, new BMSegmentStartEvent(e, this.firstFrame, this.totalFrames)), e === "destroy" && this.onDestroy && this.onDestroy.call(this, new BMDestroyEvent(e, this));
    }, AnimationItem.prototype.triggerRenderFrameError = function(e) {
      var r = new BMRenderFrameErrorEvent(e, this.currentFrame);
      this.triggerEvent("error", r), this.onError && this.onError.call(this, r);
    }, AnimationItem.prototype.triggerConfigError = function(e) {
      var r = new BMConfigErrorEvent(e, this.currentFrame);
      this.triggerEvent("error", r), this.onError && this.onError.call(this, r);
    };
    var animationManager = function() {
      var e = {}, r = [], a = 0, i = 0, s = 0, n = !0, u = !1;
      function p(l) {
        for (var o = 0, g = l.target; o < i; )
          r[o].animation === g && (r.splice(o, 1), o -= 1, i -= 1, g.isPaused || c()), o += 1;
      }
      function b(l, o) {
        if (!l)
          return null;
        for (var g = 0; g < i; ) {
          if (r[g].elem === l && r[g].elem !== null)
            return r[g].animation;
          g += 1;
        }
        var _ = new AnimationItem();
        return f(_, l), _.setData(l, o), _;
      }
      function x() {
        s += 1, d();
      }
      function c() {
        s -= 1;
      }
      function f(l, o) {
        l.addEventListener("destroy", p), l.addEventListener("_active", x), l.addEventListener("_idle", c), r.push({ elem: o, animation: l }), i += 1;
      }
      function m(l) {
        var o, g = l - a;
        for (o = 0; o < i; o += 1)
          r[o].animation.advanceTime(g);
        a = l, s && !u ? window.requestAnimationFrame(m) : n = !0;
      }
      function y(l) {
        a = l, window.requestAnimationFrame(m);
      }
      function d() {
        !u && s && n && (window.requestAnimationFrame(y), n = !1);
      }
      return e.registerAnimation = b, e.loadAnimation = function(l) {
        var o = new AnimationItem();
        return f(o, null), o.setParams(l), o;
      }, e.setSpeed = function(l, o) {
        var g;
        for (g = 0; g < i; g += 1)
          r[g].animation.setSpeed(l, o);
      }, e.setDirection = function(l, o) {
        var g;
        for (g = 0; g < i; g += 1)
          r[g].animation.setDirection(l, o);
      }, e.play = function(l) {
        var o;
        for (o = 0; o < i; o += 1)
          r[o].animation.play(l);
      }, e.pause = function(l) {
        var o;
        for (o = 0; o < i; o += 1)
          r[o].animation.pause(l);
      }, e.stop = function(l) {
        var o;
        for (o = 0; o < i; o += 1)
          r[o].animation.stop(l);
      }, e.togglePause = function(l) {
        var o;
        for (o = 0; o < i; o += 1)
          r[o].animation.togglePause(l);
      }, e.searchAnimations = function(l, o, g) {
        var _, S = [].concat([].slice.call(document.getElementsByClassName("lottie")), [].slice.call(document.getElementsByClassName("bodymovin"))), E = S.length;
        for (_ = 0; _ < E; _ += 1)
          g && S[_].setAttribute("data-bm-type", g), b(S[_], l);
        if (o && E === 0) {
          g || (g = "svg");
          var P = document.getElementsByTagName("body")[0];
          P.innerText = "";
          var k = createTag("div");
          k.style.width = "100%", k.style.height = "100%", k.setAttribute("data-bm-type", g), P.appendChild(k), b(k, l);
        }
      }, e.resize = function() {
        var l;
        for (l = 0; l < i; l += 1)
          r[l].animation.resize();
      }, e.goToAndStop = function(l, o, g) {
        var _;
        for (_ = 0; _ < i; _ += 1)
          r[_].animation.goToAndStop(l, o, g);
      }, e.destroy = function(l) {
        var o;
        for (o = i - 1; o >= 0; o -= 1)
          r[o].animation.destroy(l);
      }, e.freeze = function() {
        u = !0;
      }, e.unfreeze = function() {
        u = !1, d();
      }, e.setVolume = function(l, o) {
        var g;
        for (g = 0; g < i; g += 1)
          r[g].animation.setVolume(l, o);
      }, e.mute = function(l) {
        var o;
        for (o = 0; o < i; o += 1)
          r[o].animation.mute(l);
      }, e.unmute = function(l) {
        var o;
        for (o = 0; o < i; o += 1)
          r[o].animation.unmute(l);
      }, e.getRegisteredAnimations = function() {
        var l, o = r.length, g = [];
        for (l = 0; l < o; l += 1)
          g.push(r[l].animation);
        return g;
      }, e;
    }(), BezierFactory = function() {
      var e = { getBezierEasing: function(c, f, m, y, d) {
        var l = d || ("bez_" + c + "_" + f + "_" + m + "_" + y).replace(/\./g, "p");
        if (r[l])
          return r[l];
        var o = new x([c, f, m, y]);
        return r[l] = o, o;
      } }, r = {}, a = 0.1, i = typeof Float32Array == "function";
      function s(c, f) {
        return 1 - 3 * f + 3 * c;
      }
      function n(c, f) {
        return 3 * f - 6 * c;
      }
      function u(c) {
        return 3 * c;
      }
      function p(c, f, m) {
        return ((s(f, m) * c + n(f, m)) * c + u(f)) * c;
      }
      function b(c, f, m) {
        return 3 * s(f, m) * c * c + 2 * n(f, m) * c + u(f);
      }
      function x(c) {
        this._p = c, this._mSampleValues = i ? new Float32Array(11) : new Array(11), this._precomputed = !1, this.get = this.get.bind(this);
      }
      return x.prototype = { get: function(c) {
        var f = this._p[0], m = this._p[1], y = this._p[2], d = this._p[3];
        return this._precomputed || this._precompute(), f === m && y === d ? c : c === 0 ? 0 : c === 1 ? 1 : p(this._getTForX(c), m, d);
      }, _precompute: function() {
        var c = this._p[0], f = this._p[1], m = this._p[2], y = this._p[3];
        this._precomputed = !0, c === f && m === y || this._calcSampleValues();
      }, _calcSampleValues: function() {
        for (var c = this._p[0], f = this._p[2], m = 0; m < 11; ++m)
          this._mSampleValues[m] = p(m * a, c, f);
      }, _getTForX: function(c) {
        for (var f = this._p[0], m = this._p[2], y = this._mSampleValues, d = 0, l = 1; l !== 10 && y[l] <= c; ++l)
          d += a;
        var o = d + (c - y[--l]) / (y[l + 1] - y[l]) * a, g = b(o, f, m);
        return g >= 1e-3 ? function(_, S, E, P) {
          for (var k = 0; k < 4; ++k) {
            var C = b(S, E, P);
            if (C === 0)
              return S;
            S -= (p(S, E, P) - _) / C;
          }
          return S;
        }(c, o, f, m) : g === 0 ? o : function(_, S, E, P, k) {
          var C, A, M = 0;
          do
            (C = p(A = S + (E - S) / 2, P, k) - _) > 0 ? E = A : S = A;
          while (Math.abs(C) > 1e-7 && ++M < 10);
          return A;
        }(c, d, d + a, f, m);
      } }, e;
    }(), pooling = { double: function(e) {
      return e.concat(createSizedArray(e.length));
    } }, poolFactory = function(e, r, a) {
      var i = 0, s = e, n = createSizedArray(s);
      return { newElement: function() {
        return i ? n[i -= 1] : r();
      }, release: function(u) {
        i === s && (n = pooling.double(n), s *= 2), a && a(u), n[i] = u, i += 1;
      } };
    }, bezierLengthPool = poolFactory(8, function() {
      return { addedLength: 0, percents: createTypedArray("float32", getDefaultCurveSegments()), lengths: createTypedArray("float32", getDefaultCurveSegments()) };
    }), segmentsLengthPool = poolFactory(8, function() {
      return { lengths: [], totalLength: 0 };
    }, function(e) {
      var r, a = e.lengths.length;
      for (r = 0; r < a; r += 1)
        bezierLengthPool.release(e.lengths[r]);
      e.lengths.length = 0;
    });
    function bezFunction() {
      var e = Math;
      function r(x, c, f, m, y, d) {
        var l = x * m + c * y + f * d - y * m - d * x - f * c;
        return l > -1e-3 && l < 1e-3;
      }
      var a = function(x, c, f, m) {
        var y, d, l, o, g, _, S = getDefaultCurveSegments(), E = 0, P = [], k = [], C = bezierLengthPool.newElement();
        for (l = f.length, y = 0; y < S; y += 1) {
          for (g = y / (S - 1), _ = 0, d = 0; d < l; d += 1)
            o = bmPow(1 - g, 3) * x[d] + 3 * bmPow(1 - g, 2) * g * f[d] + 3 * (1 - g) * bmPow(g, 2) * m[d] + bmPow(g, 3) * c[d], P[d] = o, k[d] !== null && (_ += bmPow(P[d] - k[d], 2)), k[d] = P[d];
          _ && (E += _ = bmSqrt(_)), C.percents[y] = g, C.lengths[y] = E;
        }
        return C.addedLength = E, C;
      };
      function i(x) {
        this.segmentLength = 0, this.points = new Array(x);
      }
      function s(x, c) {
        this.partialLength = x, this.point = c;
      }
      var n, u = (n = {}, function(x, c, f, m) {
        var y = (x[0] + "_" + x[1] + "_" + c[0] + "_" + c[1] + "_" + f[0] + "_" + f[1] + "_" + m[0] + "_" + m[1]).replace(/\./g, "p");
        if (!n[y]) {
          var d, l, o, g, _, S, E, P = getDefaultCurveSegments(), k = 0, C = null;
          x.length === 2 && (x[0] !== c[0] || x[1] !== c[1]) && r(x[0], x[1], c[0], c[1], x[0] + f[0], x[1] + f[1]) && r(x[0], x[1], c[0], c[1], c[0] + m[0], c[1] + m[1]) && (P = 2);
          var A = new i(P);
          for (o = f.length, d = 0; d < P; d += 1) {
            for (E = createSizedArray(o), _ = d / (P - 1), S = 0, l = 0; l < o; l += 1)
              g = bmPow(1 - _, 3) * x[l] + 3 * bmPow(1 - _, 2) * _ * (x[l] + f[l]) + 3 * (1 - _) * bmPow(_, 2) * (c[l] + m[l]) + bmPow(_, 3) * c[l], E[l] = g, C !== null && (S += bmPow(E[l] - C[l], 2));
            k += S = bmSqrt(S), A.points[d] = new s(S, E), C = E;
          }
          A.segmentLength = k, n[y] = A;
        }
        return n[y];
      });
      function p(x, c) {
        var f = c.percents, m = c.lengths, y = f.length, d = bmFloor((y - 1) * x), l = x * c.addedLength, o = 0;
        if (d === y - 1 || d === 0 || l === m[d])
          return f[d];
        for (var g = m[d] > l ? -1 : 1, _ = !0; _; )
          if (m[d] <= l && m[d + 1] > l ? (o = (l - m[d]) / (m[d + 1] - m[d]), _ = !1) : d += g, d < 0 || d >= y - 1) {
            if (d === y - 1)
              return f[d];
            _ = !1;
          }
        return f[d] + (f[d + 1] - f[d]) * o;
      }
      var b = createTypedArray("float32", 8);
      return { getSegmentsLength: function(x) {
        var c, f = segmentsLengthPool.newElement(), m = x.c, y = x.v, d = x.o, l = x.i, o = x._length, g = f.lengths, _ = 0;
        for (c = 0; c < o - 1; c += 1)
          g[c] = a(y[c], y[c + 1], d[c], l[c + 1]), _ += g[c].addedLength;
        return m && o && (g[c] = a(y[c], y[0], d[c], l[0]), _ += g[c].addedLength), f.totalLength = _, f;
      }, getNewSegment: function(x, c, f, m, y, d, l) {
        y < 0 ? y = 0 : y > 1 && (y = 1);
        var o, g = p(y, l), _ = p(d = d > 1 ? 1 : d, l), S = x.length, E = 1 - g, P = 1 - _, k = E * E * E, C = g * E * E * 3, A = g * g * E * 3, M = g * g * g, I = E * E * P, D = g * E * P + E * g * P + E * E * _, L = g * g * P + E * g * _ + g * E * _, R = g * g * _, V = E * P * P, B = g * P * P + E * _ * P + E * P * _, N = g * _ * P + E * _ * _ + g * P * _, F = g * _ * _, T = P * P * P, $ = _ * P * P + P * _ * P + P * P * _, z = _ * _ * P + P * _ * _ + _ * P * _, j = _ * _ * _;
        for (o = 0; o < S; o += 1)
          b[4 * o] = e.round(1e3 * (k * x[o] + C * f[o] + A * m[o] + M * c[o])) / 1e3, b[4 * o + 1] = e.round(1e3 * (I * x[o] + D * f[o] + L * m[o] + R * c[o])) / 1e3, b[4 * o + 2] = e.round(1e3 * (V * x[o] + B * f[o] + N * m[o] + F * c[o])) / 1e3, b[4 * o + 3] = e.round(1e3 * (T * x[o] + $ * f[o] + z * m[o] + j * c[o])) / 1e3;
        return b;
      }, getPointInSegment: function(x, c, f, m, y, d) {
        var l = p(y, d), o = 1 - l;
        return [e.round(1e3 * (o * o * o * x[0] + (l * o * o + o * l * o + o * o * l) * f[0] + (l * l * o + o * l * l + l * o * l) * m[0] + l * l * l * c[0])) / 1e3, e.round(1e3 * (o * o * o * x[1] + (l * o * o + o * l * o + o * o * l) * f[1] + (l * l * o + o * l * l + l * o * l) * m[1] + l * l * l * c[1])) / 1e3];
      }, buildBezierData: u, pointOnLine2D: r, pointOnLine3D: function(x, c, f, m, y, d, l, o, g) {
        if (f === 0 && d === 0 && g === 0)
          return r(x, c, m, y, l, o);
        var _, S = e.sqrt(e.pow(m - x, 2) + e.pow(y - c, 2) + e.pow(d - f, 2)), E = e.sqrt(e.pow(l - x, 2) + e.pow(o - c, 2) + e.pow(g - f, 2)), P = e.sqrt(e.pow(l - m, 2) + e.pow(o - y, 2) + e.pow(g - d, 2));
        return (_ = S > E ? S > P ? S - E - P : P - E - S : P > E ? P - E - S : E - S - P) > -1e-4 && _ < 1e-4;
      } };
    }
    var bez = bezFunction(), PropertyFactory = function() {
      var e = initialDefaultFrame, r = Math.abs;
      function a(m, y) {
        var d, l = this.offsetTime;
        this.propType === "multidimensional" && (d = createTypedArray("float32", this.pv.length));
        for (var o, g, _, S, E, P, k, C, A, M = y.lastIndex, I = M, D = this.keyframes.length - 1, L = !0; L; ) {
          if (o = this.keyframes[I], g = this.keyframes[I + 1], I === D - 1 && m >= g.t - l) {
            o.h && (o = g), M = 0;
            break;
          }
          if (g.t - l > m) {
            M = I;
            break;
          }
          I < D - 1 ? I += 1 : (M = 0, L = !1);
        }
        _ = this.keyframesMetadata[I] || {};
        var R, V, B, N, F, T, $, z, j, W, Y = g.t - l, H = o.t - l;
        if (o.to) {
          _.bezierData || (_.bezierData = bez.buildBezierData(o.s, g.s || o.e, o.to, o.ti));
          var G = _.bezierData;
          if (m >= Y || m < H) {
            var K = m >= Y ? G.points.length - 1 : 0;
            for (E = G.points[K].point.length, S = 0; S < E; S += 1)
              d[S] = G.points[K].point[S];
          } else {
            _.__fnct ? A = _.__fnct : (A = BezierFactory.getBezierEasing(o.o.x, o.o.y, o.i.x, o.i.y, o.n).get, _.__fnct = A), P = A((m - H) / (Y - H));
            var q, U = G.segmentLength * P, Z = y.lastFrame < m && y._lastKeyframeIndex === I ? y._lastAddedLength : 0;
            for (C = y.lastFrame < m && y._lastKeyframeIndex === I ? y._lastPoint : 0, L = !0, k = G.points.length; L; ) {
              if (Z += G.points[C].partialLength, U === 0 || P === 0 || C === G.points.length - 1) {
                for (E = G.points[C].point.length, S = 0; S < E; S += 1)
                  d[S] = G.points[C].point[S];
                break;
              }
              if (U >= Z && U < Z + G.points[C + 1].partialLength) {
                for (q = (U - Z) / G.points[C + 1].partialLength, E = G.points[C].point.length, S = 0; S < E; S += 1)
                  d[S] = G.points[C].point[S] + (G.points[C + 1].point[S] - G.points[C].point[S]) * q;
                break;
              }
              C < k - 1 ? C += 1 : L = !1;
            }
            y._lastPoint = C, y._lastAddedLength = Z - G.points[C].partialLength, y._lastKeyframeIndex = I;
          }
        } else {
          var re, Q, ee, O, he;
          if (D = o.s.length, R = g.s || o.e, this.sh && o.h !== 1)
            if (m >= Y)
              d[0] = R[0], d[1] = R[1], d[2] = R[2];
            else if (m <= H)
              d[0] = o.s[0], d[1] = o.s[1], d[2] = o.s[2];
            else {
              var pe = i(o.s), me = i(R);
              V = d, B = function(oe, ae, se) {
                var X, ne, le, J, ie, te = [], ce = oe[0], de = oe[1], fe = oe[2], ue = oe[3], ge = ae[0], ye = ae[1], ve = ae[2], be = ae[3];
                return (ne = ce * ge + de * ye + fe * ve + ue * be) < 0 && (ne = -ne, ge = -ge, ye = -ye, ve = -ve, be = -be), 1 - ne > 1e-6 ? (X = Math.acos(ne), le = Math.sin(X), J = Math.sin((1 - se) * X) / le, ie = Math.sin(se * X) / le) : (J = 1 - se, ie = se), te[0] = J * ce + ie * ge, te[1] = J * de + ie * ye, te[2] = J * fe + ie * ve, te[3] = J * ue + ie * be, te;
              }(pe, me, (m - H) / (Y - H)), N = B[0], F = B[1], T = B[2], $ = B[3], z = Math.atan2(2 * F * $ - 2 * N * T, 1 - 2 * F * F - 2 * T * T), j = Math.asin(2 * N * F + 2 * T * $), W = Math.atan2(2 * N * $ - 2 * F * T, 1 - 2 * N * N - 2 * T * T), V[0] = z / degToRads, V[1] = j / degToRads, V[2] = W / degToRads;
            }
          else
            for (I = 0; I < D; I += 1)
              o.h !== 1 && (m >= Y ? P = 1 : m < H ? P = 0 : (o.o.x.constructor === Array ? (_.__fnct || (_.__fnct = []), _.__fnct[I] ? A = _.__fnct[I] : (re = o.o.x[I] === void 0 ? o.o.x[0] : o.o.x[I], Q = o.o.y[I] === void 0 ? o.o.y[0] : o.o.y[I], ee = o.i.x[I] === void 0 ? o.i.x[0] : o.i.x[I], O = o.i.y[I] === void 0 ? o.i.y[0] : o.i.y[I], A = BezierFactory.getBezierEasing(re, Q, ee, O).get, _.__fnct[I] = A)) : _.__fnct ? A = _.__fnct : (re = o.o.x, Q = o.o.y, ee = o.i.x, O = o.i.y, A = BezierFactory.getBezierEasing(re, Q, ee, O).get, o.keyframeMetadata = A), P = A((m - H) / (Y - H)))), R = g.s || o.e, he = o.h === 1 ? o.s[I] : o.s[I] + (R[I] - o.s[I]) * P, this.propType === "multidimensional" ? d[I] = he : d = he;
        }
        return y.lastIndex = M, d;
      }
      function i(m) {
        var y = m[0] * degToRads, d = m[1] * degToRads, l = m[2] * degToRads, o = Math.cos(y / 2), g = Math.cos(d / 2), _ = Math.cos(l / 2), S = Math.sin(y / 2), E = Math.sin(d / 2), P = Math.sin(l / 2);
        return [S * E * _ + o * g * P, S * g * _ + o * E * P, o * E * _ - S * g * P, o * g * _ - S * E * P];
      }
      function s() {
        var m = this.comp.renderedFrame - this.offsetTime, y = this.keyframes[0].t - this.offsetTime, d = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
        if (!(m === this._caching.lastFrame || this._caching.lastFrame !== e && (this._caching.lastFrame >= d && m >= d || this._caching.lastFrame < y && m < y))) {
          this._caching.lastFrame >= m && (this._caching._lastKeyframeIndex = -1, this._caching.lastIndex = 0);
          var l = this.interpolateValue(m, this._caching);
          this.pv = l;
        }
        return this._caching.lastFrame = m, this.pv;
      }
      function n(m) {
        var y;
        if (this.propType === "unidimensional")
          y = m * this.mult, r(this.v - y) > 1e-5 && (this.v = y, this._mdf = !0);
        else
          for (var d = 0, l = this.v.length; d < l; )
            y = m[d] * this.mult, r(this.v[d] - y) > 1e-5 && (this.v[d] = y, this._mdf = !0), d += 1;
      }
      function u() {
        if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length)
          if (this.lock)
            this.setVValue(this.pv);
          else {
            var m;
            this.lock = !0, this._mdf = this._isFirstFrame;
            var y = this.effectsSequence.length, d = this.kf ? this.pv : this.data.k;
            for (m = 0; m < y; m += 1)
              d = this.effectsSequence[m](d);
            this.setVValue(d), this._isFirstFrame = !1, this.lock = !1, this.frameId = this.elem.globalData.frameId;
          }
      }
      function p(m) {
        this.effectsSequence.push(m), this.container.addDynamicProperty(this);
      }
      function b(m, y, d, l) {
        this.propType = "unidimensional", this.mult = d || 1, this.data = y, this.v = d ? y.k * d : y.k, this.pv = y.k, this._mdf = !1, this.elem = m, this.container = l, this.comp = m.comp, this.k = !1, this.kf = !1, this.vel = 0, this.effectsSequence = [], this._isFirstFrame = !0, this.getValue = u, this.setVValue = n, this.addEffect = p;
      }
      function x(m, y, d, l) {
        var o;
        this.propType = "multidimensional", this.mult = d || 1, this.data = y, this._mdf = !1, this.elem = m, this.container = l, this.comp = m.comp, this.k = !1, this.kf = !1, this.frameId = -1;
        var g = y.k.length;
        for (this.v = createTypedArray("float32", g), this.pv = createTypedArray("float32", g), this.vel = createTypedArray("float32", g), o = 0; o < g; o += 1)
          this.v[o] = y.k[o] * this.mult, this.pv[o] = y.k[o];
        this._isFirstFrame = !0, this.effectsSequence = [], this.getValue = u, this.setVValue = n, this.addEffect = p;
      }
      function c(m, y, d, l) {
        this.propType = "unidimensional", this.keyframes = y.k, this.keyframesMetadata = [], this.offsetTime = m.data.st, this.frameId = -1, this._caching = { lastFrame: e, lastIndex: 0, value: 0, _lastKeyframeIndex: -1 }, this.k = !0, this.kf = !0, this.data = y, this.mult = d || 1, this.elem = m, this.container = l, this.comp = m.comp, this.v = e, this.pv = e, this._isFirstFrame = !0, this.getValue = u, this.setVValue = n, this.interpolateValue = a, this.effectsSequence = [s.bind(this)], this.addEffect = p;
      }
      function f(m, y, d, l) {
        var o;
        this.propType = "multidimensional";
        var g, _, S, E, P = y.k.length;
        for (o = 0; o < P - 1; o += 1)
          y.k[o].to && y.k[o].s && y.k[o + 1] && y.k[o + 1].s && (g = y.k[o].s, _ = y.k[o + 1].s, S = y.k[o].to, E = y.k[o].ti, (g.length === 2 && (g[0] !== _[0] || g[1] !== _[1]) && bez.pointOnLine2D(g[0], g[1], _[0], _[1], g[0] + S[0], g[1] + S[1]) && bez.pointOnLine2D(g[0], g[1], _[0], _[1], _[0] + E[0], _[1] + E[1]) || g.length === 3 && (g[0] !== _[0] || g[1] !== _[1] || g[2] !== _[2]) && bez.pointOnLine3D(g[0], g[1], g[2], _[0], _[1], _[2], g[0] + S[0], g[1] + S[1], g[2] + S[2]) && bez.pointOnLine3D(g[0], g[1], g[2], _[0], _[1], _[2], _[0] + E[0], _[1] + E[1], _[2] + E[2])) && (y.k[o].to = null, y.k[o].ti = null), g[0] === _[0] && g[1] === _[1] && S[0] === 0 && S[1] === 0 && E[0] === 0 && E[1] === 0 && (g.length === 2 || g[2] === _[2] && S[2] === 0 && E[2] === 0) && (y.k[o].to = null, y.k[o].ti = null));
        this.effectsSequence = [s.bind(this)], this.data = y, this.keyframes = y.k, this.keyframesMetadata = [], this.offsetTime = m.data.st, this.k = !0, this.kf = !0, this._isFirstFrame = !0, this.mult = d || 1, this.elem = m, this.container = l, this.comp = m.comp, this.getValue = u, this.setVValue = n, this.interpolateValue = a, this.frameId = -1;
        var k = y.k[0].s.length;
        for (this.v = createTypedArray("float32", k), this.pv = createTypedArray("float32", k), o = 0; o < k; o += 1)
          this.v[o] = e, this.pv[o] = e;
        this._caching = { lastFrame: e, lastIndex: 0, value: createTypedArray("float32", k) }, this.addEffect = p;
      }
      return { getProp: function(m, y, d, l, o) {
        var g;
        if (y.k.length)
          if (typeof y.k[0] == "number")
            g = new x(m, y, l, o);
          else
            switch (d) {
              case 0:
                g = new c(m, y, l, o);
                break;
              case 1:
                g = new f(m, y, l, o);
            }
        else
          g = new b(m, y, l, o);
        return g.effectsSequence.length && o.addDynamicProperty(g), g;
      } };
    }();
    function DynamicPropertyContainer() {
    }
    DynamicPropertyContainer.prototype = { addDynamicProperty: function(e) {
      this.dynamicProperties.indexOf(e) === -1 && (this.dynamicProperties.push(e), this.container.addDynamicProperty(this), this._isAnimated = !0);
    }, iterateDynamicProperties: function() {
      var e;
      this._mdf = !1;
      var r = this.dynamicProperties.length;
      for (e = 0; e < r; e += 1)
        this.dynamicProperties[e].getValue(), this.dynamicProperties[e]._mdf && (this._mdf = !0);
    }, initDynamicPropertyContainer: function(e) {
      this.container = e, this.dynamicProperties = [], this._mdf = !1, this._isAnimated = !1;
    } };
    var pointPool = poolFactory(8, function() {
      return createTypedArray("float32", 2);
    });
    function ShapePath() {
      this.c = !1, this._length = 0, this._maxLength = 8, this.v = createSizedArray(this._maxLength), this.o = createSizedArray(this._maxLength), this.i = createSizedArray(this._maxLength);
    }
    ShapePath.prototype.setPathData = function(e, r) {
      this.c = e, this.setLength(r);
      for (var a = 0; a < r; )
        this.v[a] = pointPool.newElement(), this.o[a] = pointPool.newElement(), this.i[a] = pointPool.newElement(), a += 1;
    }, ShapePath.prototype.setLength = function(e) {
      for (; this._maxLength < e; )
        this.doubleArrayLength();
      this._length = e;
    }, ShapePath.prototype.doubleArrayLength = function() {
      this.v = this.v.concat(createSizedArray(this._maxLength)), this.i = this.i.concat(createSizedArray(this._maxLength)), this.o = this.o.concat(createSizedArray(this._maxLength)), this._maxLength *= 2;
    }, ShapePath.prototype.setXYAt = function(e, r, a, i, s) {
      var n;
      switch (this._length = Math.max(this._length, i + 1), this._length >= this._maxLength && this.doubleArrayLength(), a) {
        case "v":
          n = this.v;
          break;
        case "i":
          n = this.i;
          break;
        case "o":
          n = this.o;
          break;
        default:
          n = [];
      }
      (!n[i] || n[i] && !s) && (n[i] = pointPool.newElement()), n[i][0] = e, n[i][1] = r;
    }, ShapePath.prototype.setTripleAt = function(e, r, a, i, s, n, u, p) {
      this.setXYAt(e, r, "v", u, p), this.setXYAt(a, i, "o", u, p), this.setXYAt(s, n, "i", u, p);
    }, ShapePath.prototype.reverse = function() {
      var e = new ShapePath();
      e.setPathData(this.c, this._length);
      var r = this.v, a = this.o, i = this.i, s = 0;
      this.c && (e.setTripleAt(r[0][0], r[0][1], i[0][0], i[0][1], a[0][0], a[0][1], 0, !1), s = 1);
      var n, u = this._length - 1, p = this._length;
      for (n = s; n < p; n += 1)
        e.setTripleAt(r[u][0], r[u][1], i[u][0], i[u][1], a[u][0], a[u][1], n, !1), u -= 1;
      return e;
    };
    var shapePool = (factory = poolFactory(4, function() {
      return new ShapePath();
    }, function(e) {
      var r, a = e._length;
      for (r = 0; r < a; r += 1)
        pointPool.release(e.v[r]), pointPool.release(e.i[r]), pointPool.release(e.o[r]), e.v[r] = null, e.i[r] = null, e.o[r] = null;
      e._length = 0, e.c = !1;
    }), factory.clone = function(e) {
      var r, a = factory.newElement(), i = e._length === void 0 ? e.v.length : e._length;
      for (a.setLength(i), a.c = e.c, r = 0; r < i; r += 1)
        a.setTripleAt(e.v[r][0], e.v[r][1], e.o[r][0], e.o[r][1], e.i[r][0], e.i[r][1], r);
      return a;
    }, factory), factory;
    function ShapeCollection() {
      this._length = 0, this._maxLength = 4, this.shapes = createSizedArray(this._maxLength);
    }
    ShapeCollection.prototype.addShape = function(e) {
      this._length === this._maxLength && (this.shapes = this.shapes.concat(createSizedArray(this._maxLength)), this._maxLength *= 2), this.shapes[this._length] = e, this._length += 1;
    }, ShapeCollection.prototype.releaseShapes = function() {
      var e;
      for (e = 0; e < this._length; e += 1)
        shapePool.release(this.shapes[e]);
      this._length = 0;
    };
    var shapeCollectionPool = (ob = { newShapeCollection: function() {
      return _length ? pool[_length -= 1] : new ShapeCollection();
    }, release: function(e) {
      var r, a = e._length;
      for (r = 0; r < a; r += 1)
        shapePool.release(e.shapes[r]);
      e._length = 0, _length === _maxLength && (pool = pooling.double(pool), _maxLength *= 2), pool[_length] = e, _length += 1;
    } }, _length = 0, _maxLength = 4, pool = createSizedArray(_maxLength), ob), ob, _length, _maxLength, pool, ShapePropertyFactory = function() {
      var e = -999999;
      function r(y, d, l) {
        var o, g, _, S, E, P, k, C, A, M = l.lastIndex, I = this.keyframes;
        if (y < I[0].t - this.offsetTime)
          o = I[0].s[0], _ = !0, M = 0;
        else if (y >= I[I.length - 1].t - this.offsetTime)
          o = I[I.length - 1].s ? I[I.length - 1].s[0] : I[I.length - 2].e[0], _ = !0;
        else {
          for (var D, L, R, V = M, B = I.length - 1, N = !0; N && (D = I[V], !((L = I[V + 1]).t - this.offsetTime > y)); )
            V < B - 1 ? V += 1 : N = !1;
          if (R = this.keyframesMetadata[V] || {}, M = V, !(_ = D.h === 1)) {
            if (y >= L.t - this.offsetTime)
              C = 1;
            else if (y < D.t - this.offsetTime)
              C = 0;
            else {
              var F;
              R.__fnct ? F = R.__fnct : (F = BezierFactory.getBezierEasing(D.o.x, D.o.y, D.i.x, D.i.y).get, R.__fnct = F), C = F((y - (D.t - this.offsetTime)) / (L.t - this.offsetTime - (D.t - this.offsetTime)));
            }
            g = L.s ? L.s[0] : D.e[0];
          }
          o = D.s[0];
        }
        for (P = d._length, k = o.i[0].length, l.lastIndex = M, S = 0; S < P; S += 1)
          for (E = 0; E < k; E += 1)
            A = _ ? o.i[S][E] : o.i[S][E] + (g.i[S][E] - o.i[S][E]) * C, d.i[S][E] = A, A = _ ? o.o[S][E] : o.o[S][E] + (g.o[S][E] - o.o[S][E]) * C, d.o[S][E] = A, A = _ ? o.v[S][E] : o.v[S][E] + (g.v[S][E] - o.v[S][E]) * C, d.v[S][E] = A;
      }
      function a() {
        var y = this.comp.renderedFrame - this.offsetTime, d = this.keyframes[0].t - this.offsetTime, l = this.keyframes[this.keyframes.length - 1].t - this.offsetTime, o = this._caching.lastFrame;
        return o !== e && (o < d && y < d || o > l && y > l) || (this._caching.lastIndex = o < y ? this._caching.lastIndex : 0, this.interpolateShape(y, this.pv, this._caching)), this._caching.lastFrame = y, this.pv;
      }
      function i() {
        this.paths = this.localShapeCollection;
      }
      function s(y) {
        (function(d, l) {
          if (d._length !== l._length || d.c !== l.c)
            return !1;
          var o, g = d._length;
          for (o = 0; o < g; o += 1)
            if (d.v[o][0] !== l.v[o][0] || d.v[o][1] !== l.v[o][1] || d.o[o][0] !== l.o[o][0] || d.o[o][1] !== l.o[o][1] || d.i[o][0] !== l.i[o][0] || d.i[o][1] !== l.i[o][1])
              return !1;
          return !0;
        })(this.v, y) || (this.v = shapePool.clone(y), this.localShapeCollection.releaseShapes(), this.localShapeCollection.addShape(this.v), this._mdf = !0, this.paths = this.localShapeCollection);
      }
      function n() {
        if (this.elem.globalData.frameId !== this.frameId)
          if (this.effectsSequence.length)
            if (this.lock)
              this.setVValue(this.pv);
            else {
              var y, d;
              this.lock = !0, this._mdf = !1, y = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k;
              var l = this.effectsSequence.length;
              for (d = 0; d < l; d += 1)
                y = this.effectsSequence[d](y);
              this.setVValue(y), this.lock = !1, this.frameId = this.elem.globalData.frameId;
            }
          else
            this._mdf = !1;
      }
      function u(y, d, l) {
        this.propType = "shape", this.comp = y.comp, this.container = y, this.elem = y, this.data = d, this.k = !1, this.kf = !1, this._mdf = !1;
        var o = l === 3 ? d.pt.k : d.ks.k;
        this.v = shapePool.clone(o), this.pv = shapePool.clone(this.v), this.localShapeCollection = shapeCollectionPool.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.reset = i, this.effectsSequence = [];
      }
      function p(y) {
        this.effectsSequence.push(y), this.container.addDynamicProperty(this);
      }
      function b(y, d, l) {
        this.propType = "shape", this.comp = y.comp, this.elem = y, this.container = y, this.offsetTime = y.data.st, this.keyframes = l === 3 ? d.pt.k : d.ks.k, this.keyframesMetadata = [], this.k = !0, this.kf = !0;
        var o = this.keyframes[0].s[0].i.length;
        this.v = shapePool.newElement(), this.v.setPathData(this.keyframes[0].s[0].c, o), this.pv = shapePool.clone(this.v), this.localShapeCollection = shapeCollectionPool.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.lastFrame = e, this.reset = i, this._caching = { lastFrame: e, lastIndex: 0 }, this.effectsSequence = [a.bind(this)];
      }
      u.prototype.interpolateShape = r, u.prototype.getValue = n, u.prototype.setVValue = s, u.prototype.addEffect = p, b.prototype.getValue = n, b.prototype.interpolateShape = r, b.prototype.setVValue = s, b.prototype.addEffect = p;
      var x = function() {
        var y = roundCorner;
        function d(l, o) {
          this.v = shapePool.newElement(), this.v.setPathData(!0, 4), this.localShapeCollection = shapeCollectionPool.newShapeCollection(), this.paths = this.localShapeCollection, this.localShapeCollection.addShape(this.v), this.d = o.d, this.elem = l, this.comp = l.comp, this.frameId = -1, this.initDynamicPropertyContainer(l), this.p = PropertyFactory.getProp(l, o.p, 1, 0, this), this.s = PropertyFactory.getProp(l, o.s, 1, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertEllToPath());
        }
        return d.prototype = { reset: i, getValue: function() {
          this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertEllToPath());
        }, convertEllToPath: function() {
          var l = this.p.v[0], o = this.p.v[1], g = this.s.v[0] / 2, _ = this.s.v[1] / 2, S = this.d !== 3, E = this.v;
          E.v[0][0] = l, E.v[0][1] = o - _, E.v[1][0] = S ? l + g : l - g, E.v[1][1] = o, E.v[2][0] = l, E.v[2][1] = o + _, E.v[3][0] = S ? l - g : l + g, E.v[3][1] = o, E.i[0][0] = S ? l - g * y : l + g * y, E.i[0][1] = o - _, E.i[1][0] = S ? l + g : l - g, E.i[1][1] = o - _ * y, E.i[2][0] = S ? l + g * y : l - g * y, E.i[2][1] = o + _, E.i[3][0] = S ? l - g : l + g, E.i[3][1] = o + _ * y, E.o[0][0] = S ? l + g * y : l - g * y, E.o[0][1] = o - _, E.o[1][0] = S ? l + g : l - g, E.o[1][1] = o + _ * y, E.o[2][0] = S ? l - g * y : l + g * y, E.o[2][1] = o + _, E.o[3][0] = S ? l - g : l + g, E.o[3][1] = o - _ * y;
        } }, extendPrototype([DynamicPropertyContainer], d), d;
      }(), c = function() {
        function y(d, l) {
          this.v = shapePool.newElement(), this.v.setPathData(!0, 0), this.elem = d, this.comp = d.comp, this.data = l, this.frameId = -1, this.d = l.d, this.initDynamicPropertyContainer(d), l.sy === 1 ? (this.ir = PropertyFactory.getProp(d, l.ir, 0, 0, this), this.is = PropertyFactory.getProp(d, l.is, 0, 0.01, this), this.convertToPath = this.convertStarToPath) : this.convertToPath = this.convertPolygonToPath, this.pt = PropertyFactory.getProp(d, l.pt, 0, 0, this), this.p = PropertyFactory.getProp(d, l.p, 1, 0, this), this.r = PropertyFactory.getProp(d, l.r, 0, degToRads, this), this.or = PropertyFactory.getProp(d, l.or, 0, 0, this), this.os = PropertyFactory.getProp(d, l.os, 0, 0.01, this), this.localShapeCollection = shapeCollectionPool.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertToPath());
        }
        return y.prototype = { reset: i, getValue: function() {
          this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertToPath());
        }, convertStarToPath: function() {
          var d, l, o, g, _ = 2 * Math.floor(this.pt.v), S = 2 * Math.PI / _, E = !0, P = this.or.v, k = this.ir.v, C = this.os.v, A = this.is.v, M = 2 * Math.PI * P / (2 * _), I = 2 * Math.PI * k / (2 * _), D = -Math.PI / 2;
          D += this.r.v;
          var L = this.data.d === 3 ? -1 : 1;
          for (this.v._length = 0, d = 0; d < _; d += 1) {
            o = E ? C : A, g = E ? M : I;
            var R = (l = E ? P : k) * Math.cos(D), V = l * Math.sin(D), B = R === 0 && V === 0 ? 0 : V / Math.sqrt(R * R + V * V), N = R === 0 && V === 0 ? 0 : -R / Math.sqrt(R * R + V * V);
            R += +this.p.v[0], V += +this.p.v[1], this.v.setTripleAt(R, V, R - B * g * o * L, V - N * g * o * L, R + B * g * o * L, V + N * g * o * L, d, !0), E = !E, D += S * L;
          }
        }, convertPolygonToPath: function() {
          var d, l = Math.floor(this.pt.v), o = 2 * Math.PI / l, g = this.or.v, _ = this.os.v, S = 2 * Math.PI * g / (4 * l), E = 0.5 * -Math.PI, P = this.data.d === 3 ? -1 : 1;
          for (E += this.r.v, this.v._length = 0, d = 0; d < l; d += 1) {
            var k = g * Math.cos(E), C = g * Math.sin(E), A = k === 0 && C === 0 ? 0 : C / Math.sqrt(k * k + C * C), M = k === 0 && C === 0 ? 0 : -k / Math.sqrt(k * k + C * C);
            k += +this.p.v[0], C += +this.p.v[1], this.v.setTripleAt(k, C, k - A * S * _ * P, C - M * S * _ * P, k + A * S * _ * P, C + M * S * _ * P, d, !0), E += o * P;
          }
          this.paths.length = 0, this.paths[0] = this.v;
        } }, extendPrototype([DynamicPropertyContainer], y), y;
      }(), f = function() {
        function y(d, l) {
          this.v = shapePool.newElement(), this.v.c = !0, this.localShapeCollection = shapeCollectionPool.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.elem = d, this.comp = d.comp, this.frameId = -1, this.d = l.d, this.initDynamicPropertyContainer(d), this.p = PropertyFactory.getProp(d, l.p, 1, 0, this), this.s = PropertyFactory.getProp(d, l.s, 1, 0, this), this.r = PropertyFactory.getProp(d, l.r, 0, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertRectToPath());
        }
        return y.prototype = { convertRectToPath: function() {
          var d = this.p.v[0], l = this.p.v[1], o = this.s.v[0] / 2, g = this.s.v[1] / 2, _ = bmMin(o, g, this.r.v), S = _ * (1 - roundCorner);
          this.v._length = 0, this.d === 2 || this.d === 1 ? (this.v.setTripleAt(d + o, l - g + _, d + o, l - g + _, d + o, l - g + S, 0, !0), this.v.setTripleAt(d + o, l + g - _, d + o, l + g - S, d + o, l + g - _, 1, !0), _ !== 0 ? (this.v.setTripleAt(d + o - _, l + g, d + o - _, l + g, d + o - S, l + g, 2, !0), this.v.setTripleAt(d - o + _, l + g, d - o + S, l + g, d - o + _, l + g, 3, !0), this.v.setTripleAt(d - o, l + g - _, d - o, l + g - _, d - o, l + g - S, 4, !0), this.v.setTripleAt(d - o, l - g + _, d - o, l - g + S, d - o, l - g + _, 5, !0), this.v.setTripleAt(d - o + _, l - g, d - o + _, l - g, d - o + S, l - g, 6, !0), this.v.setTripleAt(d + o - _, l - g, d + o - S, l - g, d + o - _, l - g, 7, !0)) : (this.v.setTripleAt(d - o, l + g, d - o + S, l + g, d - o, l + g, 2), this.v.setTripleAt(d - o, l - g, d - o, l - g + S, d - o, l - g, 3))) : (this.v.setTripleAt(d + o, l - g + _, d + o, l - g + S, d + o, l - g + _, 0, !0), _ !== 0 ? (this.v.setTripleAt(d + o - _, l - g, d + o - _, l - g, d + o - S, l - g, 1, !0), this.v.setTripleAt(d - o + _, l - g, d - o + S, l - g, d - o + _, l - g, 2, !0), this.v.setTripleAt(d - o, l - g + _, d - o, l - g + _, d - o, l - g + S, 3, !0), this.v.setTripleAt(d - o, l + g - _, d - o, l + g - S, d - o, l + g - _, 4, !0), this.v.setTripleAt(d - o + _, l + g, d - o + _, l + g, d - o + S, l + g, 5, !0), this.v.setTripleAt(d + o - _, l + g, d + o - S, l + g, d + o - _, l + g, 6, !0), this.v.setTripleAt(d + o, l + g - _, d + o, l + g - _, d + o, l + g - S, 7, !0)) : (this.v.setTripleAt(d - o, l - g, d - o + S, l - g, d - o, l - g, 1, !0), this.v.setTripleAt(d - o, l + g, d - o, l + g - S, d - o, l + g, 2, !0), this.v.setTripleAt(d + o, l + g, d + o - S, l + g, d + o, l + g, 3, !0)));
        }, getValue: function() {
          this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertRectToPath());
        }, reset: i }, extendPrototype([DynamicPropertyContainer], y), y;
      }(), m = { getShapeProp: function(y, d, l) {
        var o;
        return l === 3 || l === 4 ? o = (l === 3 ? d.pt : d.ks).k.length ? new b(y, d, l) : new u(y, d, l) : l === 5 ? o = new f(y, d) : l === 6 ? o = new x(y, d) : l === 7 && (o = new c(y, d)), o.k && y.addDynamicProperty(o), o;
      }, getConstructorFunction: function() {
        return u;
      }, getKeyframedConstructorFunction: function() {
        return b;
      } };
      return m;
    }(), Matrix = function() {
      var e = Math.cos, r = Math.sin, a = Math.tan, i = Math.round;
      function s() {
        return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 0, this.props[4] = 0, this.props[5] = 1, this.props[6] = 0, this.props[7] = 0, this.props[8] = 0, this.props[9] = 0, this.props[10] = 1, this.props[11] = 0, this.props[12] = 0, this.props[13] = 0, this.props[14] = 0, this.props[15] = 1, this;
      }
      function n(F) {
        if (F === 0)
          return this;
        var T = e(F), $ = r(F);
        return this._t(T, -$, 0, 0, $, T, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
      function u(F) {
        if (F === 0)
          return this;
        var T = e(F), $ = r(F);
        return this._t(1, 0, 0, 0, 0, T, -$, 0, 0, $, T, 0, 0, 0, 0, 1);
      }
      function p(F) {
        if (F === 0)
          return this;
        var T = e(F), $ = r(F);
        return this._t(T, 0, $, 0, 0, 1, 0, 0, -$, 0, T, 0, 0, 0, 0, 1);
      }
      function b(F) {
        if (F === 0)
          return this;
        var T = e(F), $ = r(F);
        return this._t(T, -$, 0, 0, $, T, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
      function x(F, T) {
        return this._t(1, T, F, 1, 0, 0);
      }
      function c(F, T) {
        return this.shear(a(F), a(T));
      }
      function f(F, T) {
        var $ = e(T), z = r(T);
        return this._t($, z, 0, 0, -z, $, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, a(F), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t($, -z, 0, 0, z, $, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
      function m(F, T, $) {
        return $ || $ === 0 || ($ = 1), F === 1 && T === 1 && $ === 1 ? this : this._t(F, 0, 0, 0, 0, T, 0, 0, 0, 0, $, 0, 0, 0, 0, 1);
      }
      function y(F, T, $, z, j, W, Y, H, G, K, q, U, Z, re, Q, ee) {
        return this.props[0] = F, this.props[1] = T, this.props[2] = $, this.props[3] = z, this.props[4] = j, this.props[5] = W, this.props[6] = Y, this.props[7] = H, this.props[8] = G, this.props[9] = K, this.props[10] = q, this.props[11] = U, this.props[12] = Z, this.props[13] = re, this.props[14] = Q, this.props[15] = ee, this;
      }
      function d(F, T, $) {
        return $ = $ || 0, F !== 0 || T !== 0 || $ !== 0 ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, F, T, $, 1) : this;
      }
      function l(F, T, $, z, j, W, Y, H, G, K, q, U, Z, re, Q, ee) {
        var O = this.props;
        if (F === 1 && T === 0 && $ === 0 && z === 0 && j === 0 && W === 1 && Y === 0 && H === 0 && G === 0 && K === 0 && q === 1 && U === 0)
          return O[12] = O[12] * F + O[15] * Z, O[13] = O[13] * W + O[15] * re, O[14] = O[14] * q + O[15] * Q, O[15] *= ee, this._identityCalculated = !1, this;
        var he = O[0], pe = O[1], me = O[2], oe = O[3], ae = O[4], se = O[5], X = O[6], ne = O[7], le = O[8], J = O[9], ie = O[10], te = O[11], ce = O[12], de = O[13], fe = O[14], ue = O[15];
        return O[0] = he * F + pe * j + me * G + oe * Z, O[1] = he * T + pe * W + me * K + oe * re, O[2] = he * $ + pe * Y + me * q + oe * Q, O[3] = he * z + pe * H + me * U + oe * ee, O[4] = ae * F + se * j + X * G + ne * Z, O[5] = ae * T + se * W + X * K + ne * re, O[6] = ae * $ + se * Y + X * q + ne * Q, O[7] = ae * z + se * H + X * U + ne * ee, O[8] = le * F + J * j + ie * G + te * Z, O[9] = le * T + J * W + ie * K + te * re, O[10] = le * $ + J * Y + ie * q + te * Q, O[11] = le * z + J * H + ie * U + te * ee, O[12] = ce * F + de * j + fe * G + ue * Z, O[13] = ce * T + de * W + fe * K + ue * re, O[14] = ce * $ + de * Y + fe * q + ue * Q, O[15] = ce * z + de * H + fe * U + ue * ee, this._identityCalculated = !1, this;
      }
      function o() {
        return this._identityCalculated || (this._identity = !(this.props[0] !== 1 || this.props[1] !== 0 || this.props[2] !== 0 || this.props[3] !== 0 || this.props[4] !== 0 || this.props[5] !== 1 || this.props[6] !== 0 || this.props[7] !== 0 || this.props[8] !== 0 || this.props[9] !== 0 || this.props[10] !== 1 || this.props[11] !== 0 || this.props[12] !== 0 || this.props[13] !== 0 || this.props[14] !== 0 || this.props[15] !== 1), this._identityCalculated = !0), this._identity;
      }
      function g(F) {
        for (var T = 0; T < 16; ) {
          if (F.props[T] !== this.props[T])
            return !1;
          T += 1;
        }
        return !0;
      }
      function _(F) {
        var T;
        for (T = 0; T < 16; T += 1)
          F.props[T] = this.props[T];
        return F;
      }
      function S(F) {
        var T;
        for (T = 0; T < 16; T += 1)
          this.props[T] = F[T];
      }
      function E(F, T, $) {
        return { x: F * this.props[0] + T * this.props[4] + $ * this.props[8] + this.props[12], y: F * this.props[1] + T * this.props[5] + $ * this.props[9] + this.props[13], z: F * this.props[2] + T * this.props[6] + $ * this.props[10] + this.props[14] };
      }
      function P(F, T, $) {
        return F * this.props[0] + T * this.props[4] + $ * this.props[8] + this.props[12];
      }
      function k(F, T, $) {
        return F * this.props[1] + T * this.props[5] + $ * this.props[9] + this.props[13];
      }
      function C(F, T, $) {
        return F * this.props[2] + T * this.props[6] + $ * this.props[10] + this.props[14];
      }
      function A() {
        var F = this.props[0] * this.props[5] - this.props[1] * this.props[4], T = this.props[5] / F, $ = -this.props[1] / F, z = -this.props[4] / F, j = this.props[0] / F, W = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / F, Y = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / F, H = new Matrix();
        return H.props[0] = T, H.props[1] = $, H.props[4] = z, H.props[5] = j, H.props[12] = W, H.props[13] = Y, H;
      }
      function M(F) {
        return this.getInverseMatrix().applyToPointArray(F[0], F[1], F[2] || 0);
      }
      function I(F) {
        var T, $ = F.length, z = [];
        for (T = 0; T < $; T += 1)
          z[T] = M(F[T]);
        return z;
      }
      function D(F, T, $) {
        var z = createTypedArray("float32", 6);
        if (this.isIdentity())
          z[0] = F[0], z[1] = F[1], z[2] = T[0], z[3] = T[1], z[4] = $[0], z[5] = $[1];
        else {
          var j = this.props[0], W = this.props[1], Y = this.props[4], H = this.props[5], G = this.props[12], K = this.props[13];
          z[0] = F[0] * j + F[1] * Y + G, z[1] = F[0] * W + F[1] * H + K, z[2] = T[0] * j + T[1] * Y + G, z[3] = T[0] * W + T[1] * H + K, z[4] = $[0] * j + $[1] * Y + G, z[5] = $[0] * W + $[1] * H + K;
        }
        return z;
      }
      function L(F, T, $) {
        return this.isIdentity() ? [F, T, $] : [F * this.props[0] + T * this.props[4] + $ * this.props[8] + this.props[12], F * this.props[1] + T * this.props[5] + $ * this.props[9] + this.props[13], F * this.props[2] + T * this.props[6] + $ * this.props[10] + this.props[14]];
      }
      function R(F, T) {
        if (this.isIdentity())
          return F + "," + T;
        var $ = this.props;
        return Math.round(100 * (F * $[0] + T * $[4] + $[12])) / 100 + "," + Math.round(100 * (F * $[1] + T * $[5] + $[13])) / 100;
      }
      function V() {
        for (var F = 0, T = this.props, $ = "matrix3d("; F < 16; )
          $ += i(1e4 * T[F]) / 1e4, $ += F === 15 ? ")" : ",", F += 1;
        return $;
      }
      function B(F) {
        return F < 1e-6 && F > 0 || F > -1e-6 && F < 0 ? i(1e4 * F) / 1e4 : F;
      }
      function N() {
        var F = this.props;
        return "matrix(" + B(F[0]) + "," + B(F[1]) + "," + B(F[4]) + "," + B(F[5]) + "," + B(F[12]) + "," + B(F[13]) + ")";
      }
      return function() {
        this.reset = s, this.rotate = n, this.rotateX = u, this.rotateY = p, this.rotateZ = b, this.skew = c, this.skewFromAxis = f, this.shear = x, this.scale = m, this.setTransform = y, this.translate = d, this.transform = l, this.applyToPoint = E, this.applyToX = P, this.applyToY = k, this.applyToZ = C, this.applyToPointArray = L, this.applyToTriplePoints = D, this.applyToPointStringified = R, this.toCSS = V, this.to2dCSS = N, this.clone = _, this.cloneFromProps = S, this.equals = g, this.inversePoints = I, this.inversePoint = M, this.getInverseMatrix = A, this._t = this.transform, this.isIdentity = o, this._identity = !0, this._identityCalculated = !1, this.props = createTypedArray("float32", 16), this.reset();
      };
    }();
    function _typeof$3(e) {
      return _typeof$3 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
        return typeof r;
      } : function(r) {
        return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
      }, _typeof$3(e);
    }
    var lottie = {};
    function setLocation(e) {
      setLocationHref(e);
    }
    function searchAnimations() {
      animationManager.searchAnimations();
    }
    function setSubframeRendering(e) {
      setSubframeEnabled(e);
    }
    function setPrefix(e) {
      setIdPrefix(e);
    }
    function loadAnimation(e) {
      return animationManager.loadAnimation(e);
    }
    function setQuality(e) {
      if (typeof e == "string")
        switch (e) {
          case "high":
            setDefaultCurveSegments(200);
            break;
          default:
          case "medium":
            setDefaultCurveSegments(50);
            break;
          case "low":
            setDefaultCurveSegments(10);
        }
      else
        !isNaN(e) && e > 1 && setDefaultCurveSegments(e);
    }
    function inBrowser() {
      return typeof navigator < "u";
    }
    function installPlugin(e, r) {
      e === "expressions" && setExpressionsPlugin(r);
    }
    function getFactory(e) {
      switch (e) {
        case "propertyFactory":
          return PropertyFactory;
        case "shapePropertyFactory":
          return ShapePropertyFactory;
        case "matrix":
          return Matrix;
        default:
          return null;
      }
    }
    function checkReady() {
      document.readyState === "complete" && (clearInterval(readyStateCheckInterval), searchAnimations());
    }
    function getQueryVariable(e) {
      for (var r = queryString.split("&"), a = 0; a < r.length; a += 1) {
        var i = r[a].split("=");
        if (decodeURIComponent(i[0]) == e)
          return decodeURIComponent(i[1]);
      }
      return null;
    }
    lottie.play = animationManager.play, lottie.pause = animationManager.pause, lottie.setLocationHref = setLocation, lottie.togglePause = animationManager.togglePause, lottie.setSpeed = animationManager.setSpeed, lottie.setDirection = animationManager.setDirection, lottie.stop = animationManager.stop, lottie.searchAnimations = searchAnimations, lottie.registerAnimation = animationManager.registerAnimation, lottie.loadAnimation = loadAnimation, lottie.setSubframeRendering = setSubframeRendering, lottie.resize = animationManager.resize, lottie.goToAndStop = animationManager.goToAndStop, lottie.destroy = animationManager.destroy, lottie.setQuality = setQuality, lottie.inBrowser = inBrowser, lottie.installPlugin = installPlugin, lottie.freeze = animationManager.freeze, lottie.unfreeze = animationManager.unfreeze, lottie.setVolume = animationManager.setVolume, lottie.mute = animationManager.mute, lottie.unmute = animationManager.unmute, lottie.getRegisteredAnimations = animationManager.getRegisteredAnimations, lottie.useWebWorker = setWebWorker, lottie.setIDPrefix = setPrefix, lottie.__getFactory = getFactory, lottie.version = "5.9.6";
    var queryString = "", scripts = document.getElementsByTagName("script"), index = scripts.length - 1, myScript = scripts[index] || { src: "" };
    queryString = myScript.src ? myScript.src.replace(/^[^\?]+\??/, "") : "", getQueryVariable("renderer");
    var readyStateCheckInterval = setInterval(checkReady, 100);
    try {
      _typeof$3(exports) !== "object" && (window.bodymovin = lottie);
    } catch (e) {
    }
    var ShapeModifiers = function() {
      var e = {}, r = {};
      return e.registerModifier = function(a, i) {
        r[a] || (r[a] = i);
      }, e.getModifier = function(a, i, s) {
        return new r[a](i, s);
      }, e;
    }();
    function ShapeModifier() {
    }
    function TrimModifier() {
    }
    function PuckerAndBloatModifier() {
    }
    ShapeModifier.prototype.initModifierProperties = function() {
    }, ShapeModifier.prototype.addShapeToModifier = function() {
    }, ShapeModifier.prototype.addShape = function(e) {
      if (!this.closed) {
        e.sh.container.addDynamicProperty(e.sh);
        var r = { shape: e.sh, data: e, localShapeCollection: shapeCollectionPool.newShapeCollection() };
        this.shapes.push(r), this.addShapeToModifier(r), this._isAnimated && e.setAsAnimated();
      }
    }, ShapeModifier.prototype.init = function(e, r) {
      this.shapes = [], this.elem = e, this.initDynamicPropertyContainer(e), this.initModifierProperties(e, r), this.frameId = initialDefaultFrame, this.closed = !1, this.k = !1, this.dynamicProperties.length ? this.k = !0 : this.getValue(!0);
    }, ShapeModifier.prototype.processKeys = function() {
      this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties());
    }, extendPrototype([DynamicPropertyContainer], ShapeModifier), extendPrototype([ShapeModifier], TrimModifier), TrimModifier.prototype.initModifierProperties = function(e, r) {
      this.s = PropertyFactory.getProp(e, r.s, 0, 0.01, this), this.e = PropertyFactory.getProp(e, r.e, 0, 0.01, this), this.o = PropertyFactory.getProp(e, r.o, 0, 0, this), this.sValue = 0, this.eValue = 0, this.getValue = this.processKeys, this.m = r.m, this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length;
    }, TrimModifier.prototype.addShapeToModifier = function(e) {
      e.pathsData = [];
    }, TrimModifier.prototype.calculateShapeEdges = function(e, r, a, i, s) {
      var n = [];
      r <= 1 ? n.push({ s: e, e: r }) : e >= 1 ? n.push({ s: e - 1, e: r - 1 }) : (n.push({ s: e, e: 1 }), n.push({ s: 0, e: r - 1 }));
      var u, p, b = [], x = n.length;
      for (u = 0; u < x; u += 1) {
        var c, f;
        (p = n[u]).e * s < i || p.s * s > i + a || (c = p.s * s <= i ? 0 : (p.s * s - i) / a, f = p.e * s >= i + a ? 1 : (p.e * s - i) / a, b.push([c, f]));
      }
      return b.length || b.push([0, 0]), b;
    }, TrimModifier.prototype.releasePathsData = function(e) {
      var r, a = e.length;
      for (r = 0; r < a; r += 1)
        segmentsLengthPool.release(e[r]);
      return e.length = 0, e;
    }, TrimModifier.prototype.processShapes = function(e) {
      var r, a, i, s;
      if (this._mdf || e) {
        var n = this.o.v % 360 / 360;
        if (n < 0 && (n += 1), (r = this.s.v > 1 ? 1 + n : this.s.v < 0 ? 0 + n : this.s.v + n) > (a = this.e.v > 1 ? 1 + n : this.e.v < 0 ? 0 + n : this.e.v + n)) {
          var u = r;
          r = a, a = u;
        }
        r = 1e-4 * Math.round(1e4 * r), a = 1e-4 * Math.round(1e4 * a), this.sValue = r, this.eValue = a;
      } else
        r = this.sValue, a = this.eValue;
      var p, b, x, c, f, m = this.shapes.length, y = 0;
      if (a === r)
        for (s = 0; s < m; s += 1)
          this.shapes[s].localShapeCollection.releaseShapes(), this.shapes[s].shape._mdf = !0, this.shapes[s].shape.paths = this.shapes[s].localShapeCollection, this._mdf && (this.shapes[s].pathsData.length = 0);
      else if (a === 1 && r === 0 || a === 0 && r === 1) {
        if (this._mdf)
          for (s = 0; s < m; s += 1)
            this.shapes[s].pathsData.length = 0, this.shapes[s].shape._mdf = !0;
      } else {
        var d, l, o = [];
        for (s = 0; s < m; s += 1)
          if ((d = this.shapes[s]).shape._mdf || this._mdf || e || this.m === 2) {
            if (b = (i = d.shape.paths)._length, f = 0, !d.shape._mdf && d.pathsData.length)
              f = d.totalShapeLength;
            else {
              for (x = this.releasePathsData(d.pathsData), p = 0; p < b; p += 1)
                c = bez.getSegmentsLength(i.shapes[p]), x.push(c), f += c.totalLength;
              d.totalShapeLength = f, d.pathsData = x;
            }
            y += f, d.shape._mdf = !0;
          } else
            d.shape.paths = d.localShapeCollection;
        var g, _ = r, S = a, E = 0;
        for (s = m - 1; s >= 0; s -= 1)
          if ((d = this.shapes[s]).shape._mdf) {
            for ((l = d.localShapeCollection).releaseShapes(), this.m === 2 && m > 1 ? (g = this.calculateShapeEdges(r, a, d.totalShapeLength, E, y), E += d.totalShapeLength) : g = [[_, S]], b = g.length, p = 0; p < b; p += 1) {
              _ = g[p][0], S = g[p][1], o.length = 0, S <= 1 ? o.push({ s: d.totalShapeLength * _, e: d.totalShapeLength * S }) : _ >= 1 ? o.push({ s: d.totalShapeLength * (_ - 1), e: d.totalShapeLength * (S - 1) }) : (o.push({ s: d.totalShapeLength * _, e: d.totalShapeLength }), o.push({ s: 0, e: d.totalShapeLength * (S - 1) }));
              var P = this.addShapes(d, o[0]);
              if (o[0].s !== o[0].e) {
                if (o.length > 1)
                  if (d.shape.paths.shapes[d.shape.paths._length - 1].c) {
                    var k = P.pop();
                    this.addPaths(P, l), P = this.addShapes(d, o[1], k);
                  } else
                    this.addPaths(P, l), P = this.addShapes(d, o[1]);
                this.addPaths(P, l);
              }
            }
            d.shape.paths = l;
          }
      }
    }, TrimModifier.prototype.addPaths = function(e, r) {
      var a, i = e.length;
      for (a = 0; a < i; a += 1)
        r.addShape(e[a]);
    }, TrimModifier.prototype.addSegment = function(e, r, a, i, s, n, u) {
      s.setXYAt(r[0], r[1], "o", n), s.setXYAt(a[0], a[1], "i", n + 1), u && s.setXYAt(e[0], e[1], "v", n), s.setXYAt(i[0], i[1], "v", n + 1);
    }, TrimModifier.prototype.addSegmentFromArray = function(e, r, a, i) {
      r.setXYAt(e[1], e[5], "o", a), r.setXYAt(e[2], e[6], "i", a + 1), i && r.setXYAt(e[0], e[4], "v", a), r.setXYAt(e[3], e[7], "v", a + 1);
    }, TrimModifier.prototype.addShapes = function(e, r, a) {
      var i, s, n, u, p, b, x, c, f = e.pathsData, m = e.shape.paths.shapes, y = e.shape.paths._length, d = 0, l = [], o = !0;
      for (a ? (p = a._length, c = a._length) : (a = shapePool.newElement(), p = 0, c = 0), l.push(a), i = 0; i < y; i += 1) {
        for (b = f[i].lengths, a.c = m[i].c, n = m[i].c ? b.length : b.length + 1, s = 1; s < n; s += 1)
          if (d + (u = b[s - 1]).addedLength < r.s)
            d += u.addedLength, a.c = !1;
          else {
            if (d > r.e) {
              a.c = !1;
              break;
            }
            r.s <= d && r.e >= d + u.addedLength ? (this.addSegment(m[i].v[s - 1], m[i].o[s - 1], m[i].i[s], m[i].v[s], a, p, o), o = !1) : (x = bez.getNewSegment(m[i].v[s - 1], m[i].v[s], m[i].o[s - 1], m[i].i[s], (r.s - d) / u.addedLength, (r.e - d) / u.addedLength, b[s - 1]), this.addSegmentFromArray(x, a, p, o), o = !1, a.c = !1), d += u.addedLength, p += 1;
          }
        if (m[i].c && b.length) {
          if (u = b[s - 1], d <= r.e) {
            var g = b[s - 1].addedLength;
            r.s <= d && r.e >= d + g ? (this.addSegment(m[i].v[s - 1], m[i].o[s - 1], m[i].i[0], m[i].v[0], a, p, o), o = !1) : (x = bez.getNewSegment(m[i].v[s - 1], m[i].v[0], m[i].o[s - 1], m[i].i[0], (r.s - d) / g, (r.e - d) / g, b[s - 1]), this.addSegmentFromArray(x, a, p, o), o = !1, a.c = !1);
          } else
            a.c = !1;
          d += u.addedLength, p += 1;
        }
        if (a._length && (a.setXYAt(a.v[c][0], a.v[c][1], "i", c), a.setXYAt(a.v[a._length - 1][0], a.v[a._length - 1][1], "o", a._length - 1)), d > r.e)
          break;
        i < y - 1 && (a = shapePool.newElement(), o = !0, l.push(a), p = 0);
      }
      return l;
    }, extendPrototype([ShapeModifier], PuckerAndBloatModifier), PuckerAndBloatModifier.prototype.initModifierProperties = function(e, r) {
      this.getValue = this.processKeys, this.amount = PropertyFactory.getProp(e, r.a, 0, null, this), this._isAnimated = !!this.amount.effectsSequence.length;
    }, PuckerAndBloatModifier.prototype.processPath = function(e, r) {
      var a = r / 100, i = [0, 0], s = e._length, n = 0;
      for (n = 0; n < s; n += 1)
        i[0] += e.v[n][0], i[1] += e.v[n][1];
      i[0] /= s, i[1] /= s;
      var u, p, b, x, c, f, m = shapePool.newElement();
      for (m.c = e.c, n = 0; n < s; n += 1)
        u = e.v[n][0] + (i[0] - e.v[n][0]) * a, p = e.v[n][1] + (i[1] - e.v[n][1]) * a, b = e.o[n][0] + (i[0] - e.o[n][0]) * -a, x = e.o[n][1] + (i[1] - e.o[n][1]) * -a, c = e.i[n][0] + (i[0] - e.i[n][0]) * -a, f = e.i[n][1] + (i[1] - e.i[n][1]) * -a, m.setTripleAt(u, p, b, x, c, f, n);
      return m;
    }, PuckerAndBloatModifier.prototype.processShapes = function(e) {
      var r, a, i, s, n, u, p = this.shapes.length, b = this.amount.v;
      if (b !== 0)
        for (a = 0; a < p; a += 1) {
          if (u = (n = this.shapes[a]).localShapeCollection, n.shape._mdf || this._mdf || e)
            for (u.releaseShapes(), n.shape._mdf = !0, r = n.shape.paths.shapes, s = n.shape.paths._length, i = 0; i < s; i += 1)
              u.addShape(this.processPath(r[i], b));
          n.shape.paths = n.localShapeCollection;
        }
      this.dynamicProperties.length || (this._mdf = !1);
    };
    var TransformPropertyFactory = function() {
      var e = [0, 0];
      function r(a, i, s) {
        if (this.elem = a, this.frameId = -1, this.propType = "transform", this.data = i, this.v = new Matrix(), this.pre = new Matrix(), this.appliedTransformations = 0, this.initDynamicPropertyContainer(s || a), i.p && i.p.s ? (this.px = PropertyFactory.getProp(a, i.p.x, 0, 0, this), this.py = PropertyFactory.getProp(a, i.p.y, 0, 0, this), i.p.z && (this.pz = PropertyFactory.getProp(a, i.p.z, 0, 0, this))) : this.p = PropertyFactory.getProp(a, i.p || { k: [0, 0, 0] }, 1, 0, this), i.rx) {
          if (this.rx = PropertyFactory.getProp(a, i.rx, 0, degToRads, this), this.ry = PropertyFactory.getProp(a, i.ry, 0, degToRads, this), this.rz = PropertyFactory.getProp(a, i.rz, 0, degToRads, this), i.or.k[0].ti) {
            var n, u = i.or.k.length;
            for (n = 0; n < u; n += 1)
              i.or.k[n].to = null, i.or.k[n].ti = null;
          }
          this.or = PropertyFactory.getProp(a, i.or, 1, degToRads, this), this.or.sh = !0;
        } else
          this.r = PropertyFactory.getProp(a, i.r || { k: 0 }, 0, degToRads, this);
        i.sk && (this.sk = PropertyFactory.getProp(a, i.sk, 0, degToRads, this), this.sa = PropertyFactory.getProp(a, i.sa, 0, degToRads, this)), this.a = PropertyFactory.getProp(a, i.a || { k: [0, 0, 0] }, 1, 0, this), this.s = PropertyFactory.getProp(a, i.s || { k: [100, 100, 100] }, 1, 0.01, this), i.o ? this.o = PropertyFactory.getProp(a, i.o, 0, 0.01, a) : this.o = { _mdf: !1, v: 1 }, this._isDirty = !0, this.dynamicProperties.length || this.getValue(!0);
      }
      return r.prototype = { applyToMatrix: function(a) {
        var i = this._mdf;
        this.iterateDynamicProperties(), this._mdf = this._mdf || i, this.a && a.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && a.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && a.skewFromAxis(-this.sk.v, this.sa.v), this.r ? a.rotate(-this.r.v) : a.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.data.p.s ? this.data.p.z ? a.translate(this.px.v, this.py.v, -this.pz.v) : a.translate(this.px.v, this.py.v, 0) : a.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
      }, getValue: function(a) {
        if (this.elem.globalData.frameId !== this.frameId) {
          if (this._isDirty && (this.precalculateMatrix(), this._isDirty = !1), this.iterateDynamicProperties(), this._mdf || a) {
            var i;
            if (this.v.cloneFromProps(this.pre.props), this.appliedTransformations < 1 && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations < 2 && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.appliedTransformations < 3 && this.v.skewFromAxis(-this.sk.v, this.sa.v), this.r && this.appliedTransformations < 4 ? this.v.rotate(-this.r.v) : !this.r && this.appliedTransformations < 4 && this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.autoOriented) {
              var s, n;
              if (i = this.elem.globalData.frameRate, this.p && this.p.keyframes && this.p.getValueAtTime)
                this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t ? (s = this.p.getValueAtTime((this.p.keyframes[0].t + 0.01) / i, 0), n = this.p.getValueAtTime(this.p.keyframes[0].t / i, 0)) : this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t ? (s = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / i, 0), n = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - 0.05) / i, 0)) : (s = this.p.pv, n = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - 0.01) / i, this.p.offsetTime));
              else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
                s = [], n = [];
                var u = this.px, p = this.py;
                u._caching.lastFrame + u.offsetTime <= u.keyframes[0].t ? (s[0] = u.getValueAtTime((u.keyframes[0].t + 0.01) / i, 0), s[1] = p.getValueAtTime((p.keyframes[0].t + 0.01) / i, 0), n[0] = u.getValueAtTime(u.keyframes[0].t / i, 0), n[1] = p.getValueAtTime(p.keyframes[0].t / i, 0)) : u._caching.lastFrame + u.offsetTime >= u.keyframes[u.keyframes.length - 1].t ? (s[0] = u.getValueAtTime(u.keyframes[u.keyframes.length - 1].t / i, 0), s[1] = p.getValueAtTime(p.keyframes[p.keyframes.length - 1].t / i, 0), n[0] = u.getValueAtTime((u.keyframes[u.keyframes.length - 1].t - 0.01) / i, 0), n[1] = p.getValueAtTime((p.keyframes[p.keyframes.length - 1].t - 0.01) / i, 0)) : (s = [u.pv, p.pv], n[0] = u.getValueAtTime((u._caching.lastFrame + u.offsetTime - 0.01) / i, u.offsetTime), n[1] = p.getValueAtTime((p._caching.lastFrame + p.offsetTime - 0.01) / i, p.offsetTime));
              } else
                s = n = e;
              this.v.rotate(-Math.atan2(s[1] - n[1], s[0] - n[0]));
            }
            this.data.p && this.data.p.s ? this.data.p.z ? this.v.translate(this.px.v, this.py.v, -this.pz.v) : this.v.translate(this.px.v, this.py.v, 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
          }
          this.frameId = this.elem.globalData.frameId;
        }
      }, precalculateMatrix: function() {
        if (!this.a.k && (this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations = 1, !this.s.effectsSequence.length)) {
          if (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.appliedTransformations = 2, this.sk) {
            if (this.sk.effectsSequence.length || this.sa.effectsSequence.length)
              return;
            this.pre.skewFromAxis(-this.sk.v, this.sa.v), this.appliedTransformations = 3;
          }
          this.r ? this.r.effectsSequence.length || (this.pre.rotate(-this.r.v), this.appliedTransformations = 4) : this.rz.effectsSequence.length || this.ry.effectsSequence.length || this.rx.effectsSequence.length || this.or.effectsSequence.length || (this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.appliedTransformations = 4);
        }
      }, autoOrient: function() {
      } }, extendPrototype([DynamicPropertyContainer], r), r.prototype.addDynamicProperty = function(a) {
        this._addDynamicProperty(a), this.elem.addDynamicProperty(a), this._isDirty = !0;
      }, r.prototype._addDynamicProperty = DynamicPropertyContainer.prototype.addDynamicProperty, { getTransformProperty: function(a, i, s) {
        return new r(a, i, s);
      } };
    }();
    function RepeaterModifier() {
    }
    function RoundCornersModifier() {
    }
    function getFontProperties(e) {
      for (var r = e.fStyle ? e.fStyle.split(" ") : [], a = "normal", i = "normal", s = r.length, n = 0; n < s; n += 1)
        switch (r[n].toLowerCase()) {
          case "italic":
            i = "italic";
            break;
          case "bold":
            a = "700";
            break;
          case "black":
            a = "900";
            break;
          case "medium":
            a = "500";
            break;
          case "regular":
          case "normal":
            a = "400";
            break;
          case "light":
          case "thin":
            a = "200";
        }
      return { style: i, weight: e.fWeight || a };
    }
    extendPrototype([ShapeModifier], RepeaterModifier), RepeaterModifier.prototype.initModifierProperties = function(e, r) {
      this.getValue = this.processKeys, this.c = PropertyFactory.getProp(e, r.c, 0, null, this), this.o = PropertyFactory.getProp(e, r.o, 0, null, this), this.tr = TransformPropertyFactory.getTransformProperty(e, r.tr, this), this.so = PropertyFactory.getProp(e, r.tr.so, 0, 0.01, this), this.eo = PropertyFactory.getProp(e, r.tr.eo, 0, 0.01, this), this.data = r, this.dynamicProperties.length || this.getValue(!0), this._isAnimated = !!this.dynamicProperties.length, this.pMatrix = new Matrix(), this.rMatrix = new Matrix(), this.sMatrix = new Matrix(), this.tMatrix = new Matrix(), this.matrix = new Matrix();
    }, RepeaterModifier.prototype.applyTransforms = function(e, r, a, i, s, n) {
      var u = n ? -1 : 1, p = i.s.v[0] + (1 - i.s.v[0]) * (1 - s), b = i.s.v[1] + (1 - i.s.v[1]) * (1 - s);
      e.translate(i.p.v[0] * u * s, i.p.v[1] * u * s, i.p.v[2]), r.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]), r.rotate(-i.r.v * u * s), r.translate(i.a.v[0], i.a.v[1], i.a.v[2]), a.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]), a.scale(n ? 1 / p : p, n ? 1 / b : b), a.translate(i.a.v[0], i.a.v[1], i.a.v[2]);
    }, RepeaterModifier.prototype.init = function(e, r, a, i) {
      for (this.elem = e, this.arr = r, this.pos = a, this.elemsData = i, this._currentCopies = 0, this._elements = [], this._groups = [], this.frameId = -1, this.initDynamicPropertyContainer(e), this.initModifierProperties(e, r[a]); a > 0; )
        a -= 1, this._elements.unshift(r[a]);
      this.dynamicProperties.length ? this.k = !0 : this.getValue(!0);
    }, RepeaterModifier.prototype.resetElements = function(e) {
      var r, a = e.length;
      for (r = 0; r < a; r += 1)
        e[r]._processed = !1, e[r].ty === "gr" && this.resetElements(e[r].it);
    }, RepeaterModifier.prototype.cloneElements = function(e) {
      var r = JSON.parse(JSON.stringify(e));
      return this.resetElements(r), r;
    }, RepeaterModifier.prototype.changeGroupRender = function(e, r) {
      var a, i = e.length;
      for (a = 0; a < i; a += 1)
        e[a]._render = r, e[a].ty === "gr" && this.changeGroupRender(e[a].it, r);
    }, RepeaterModifier.prototype.processShapes = function(e) {
      var r, a, i, s, n, u = !1;
      if (this._mdf || e) {
        var p, b = Math.ceil(this.c.v);
        if (this._groups.length < b) {
          for (; this._groups.length < b; ) {
            var x = { it: this.cloneElements(this._elements), ty: "gr" };
            x.it.push({ a: { a: 0, ix: 1, k: [0, 0] }, nm: "Transform", o: { a: 0, ix: 7, k: 100 }, p: { a: 0, ix: 2, k: [0, 0] }, r: { a: 1, ix: 6, k: [{ s: 0, e: 0, t: 0 }, { s: 0, e: 0, t: 1 }] }, s: { a: 0, ix: 3, k: [100, 100] }, sa: { a: 0, ix: 5, k: 0 }, sk: { a: 0, ix: 4, k: 0 }, ty: "tr" }), this.arr.splice(0, 0, x), this._groups.splice(0, 0, x), this._currentCopies += 1;
          }
          this.elem.reloadShapes(), u = !0;
        }
        for (n = 0, i = 0; i <= this._groups.length - 1; i += 1) {
          if (p = n < b, this._groups[i]._render = p, this.changeGroupRender(this._groups[i].it, p), !p) {
            var c = this.elemsData[i].it, f = c[c.length - 1];
            f.transform.op.v !== 0 ? (f.transform.op._mdf = !0, f.transform.op.v = 0) : f.transform.op._mdf = !1;
          }
          n += 1;
        }
        this._currentCopies = b;
        var m = this.o.v, y = m % 1, d = m > 0 ? Math.floor(m) : Math.ceil(m), l = this.pMatrix.props, o = this.rMatrix.props, g = this.sMatrix.props;
        this.pMatrix.reset(), this.rMatrix.reset(), this.sMatrix.reset(), this.tMatrix.reset(), this.matrix.reset();
        var _, S, E = 0;
        if (m > 0) {
          for (; E < d; )
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), E += 1;
          y && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, y, !1), E += y);
        } else if (m < 0) {
          for (; E > d; )
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !0), E -= 1;
          y && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -y, !0), E -= y);
        }
        for (i = this.data.m === 1 ? 0 : this._currentCopies - 1, s = this.data.m === 1 ? 1 : -1, n = this._currentCopies; n; ) {
          if (S = (a = (r = this.elemsData[i].it)[r.length - 1].transform.mProps.v.props).length, r[r.length - 1].transform.mProps._mdf = !0, r[r.length - 1].transform.op._mdf = !0, r[r.length - 1].transform.op.v = this._currentCopies === 1 ? this.so.v : this.so.v + (this.eo.v - this.so.v) * (i / (this._currentCopies - 1)), E !== 0) {
            for ((i !== 0 && s === 1 || i !== this._currentCopies - 1 && s === -1) && this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), this.matrix.transform(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[12], o[13], o[14], o[15]), this.matrix.transform(g[0], g[1], g[2], g[3], g[4], g[5], g[6], g[7], g[8], g[9], g[10], g[11], g[12], g[13], g[14], g[15]), this.matrix.transform(l[0], l[1], l[2], l[3], l[4], l[5], l[6], l[7], l[8], l[9], l[10], l[11], l[12], l[13], l[14], l[15]), _ = 0; _ < S; _ += 1)
              a[_] = this.matrix.props[_];
            this.matrix.reset();
          } else
            for (this.matrix.reset(), _ = 0; _ < S; _ += 1)
              a[_] = this.matrix.props[_];
          E += 1, n -= 1, i += s;
        }
      } else
        for (n = this._currentCopies, i = 0, s = 1; n; )
          a = (r = this.elemsData[i].it)[r.length - 1].transform.mProps.v.props, r[r.length - 1].transform.mProps._mdf = !1, r[r.length - 1].transform.op._mdf = !1, n -= 1, i += s;
      return u;
    }, RepeaterModifier.prototype.addShape = function() {
    }, extendPrototype([ShapeModifier], RoundCornersModifier), RoundCornersModifier.prototype.initModifierProperties = function(e, r) {
      this.getValue = this.processKeys, this.rd = PropertyFactory.getProp(e, r.r, 0, null, this), this._isAnimated = !!this.rd.effectsSequence.length;
    }, RoundCornersModifier.prototype.processPath = function(e, r) {
      var a, i = shapePool.newElement();
      i.c = e.c;
      var s, n, u, p, b, x, c, f, m, y, d, l, o = e._length, g = 0;
      for (a = 0; a < o; a += 1)
        s = e.v[a], u = e.o[a], n = e.i[a], s[0] === u[0] && s[1] === u[1] && s[0] === n[0] && s[1] === n[1] ? a !== 0 && a !== o - 1 || e.c ? (p = a === 0 ? e.v[o - 1] : e.v[a - 1], x = (b = Math.sqrt(Math.pow(s[0] - p[0], 2) + Math.pow(s[1] - p[1], 2))) ? Math.min(b / 2, r) / b : 0, c = d = s[0] + (p[0] - s[0]) * x, f = l = s[1] - (s[1] - p[1]) * x, m = c - (c - s[0]) * roundCorner, y = f - (f - s[1]) * roundCorner, i.setTripleAt(c, f, m, y, d, l, g), g += 1, p = a === o - 1 ? e.v[0] : e.v[a + 1], x = (b = Math.sqrt(Math.pow(s[0] - p[0], 2) + Math.pow(s[1] - p[1], 2))) ? Math.min(b / 2, r) / b : 0, c = m = s[0] + (p[0] - s[0]) * x, f = y = s[1] + (p[1] - s[1]) * x, d = c - (c - s[0]) * roundCorner, l = f - (f - s[1]) * roundCorner, i.setTripleAt(c, f, m, y, d, l, g), g += 1) : (i.setTripleAt(s[0], s[1], u[0], u[1], n[0], n[1], g), g += 1) : (i.setTripleAt(e.v[a][0], e.v[a][1], e.o[a][0], e.o[a][1], e.i[a][0], e.i[a][1], g), g += 1);
      return i;
    }, RoundCornersModifier.prototype.processShapes = function(e) {
      var r, a, i, s, n, u, p = this.shapes.length, b = this.rd.v;
      if (b !== 0)
        for (a = 0; a < p; a += 1) {
          if (u = (n = this.shapes[a]).localShapeCollection, n.shape._mdf || this._mdf || e)
            for (u.releaseShapes(), n.shape._mdf = !0, r = n.shape.paths.shapes, s = n.shape.paths._length, i = 0; i < s; i += 1)
              u.addShape(this.processPath(r[i], b));
          n.shape.paths = n.localShapeCollection;
        }
      this.dynamicProperties.length || (this._mdf = !1);
    };
    var FontManager = function() {
      var e = { w: 0, size: 0, shapes: [], data: { shapes: [] } }, r = [];
      r = r.concat([2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403]);
      var a = ["d83cdffb", "d83cdffc", "d83cdffd", "d83cdffe", "d83cdfff"], i = [65039, 8205];
      function s(b, x) {
        var c = createTag("span");
        c.setAttribute("aria-hidden", !0), c.style.fontFamily = x;
        var f = createTag("span");
        f.innerText = "giItT1WQy@!-/#", c.style.position = "absolute", c.style.left = "-10000px", c.style.top = "-10000px", c.style.fontSize = "300px", c.style.fontVariant = "normal", c.style.fontStyle = "normal", c.style.fontWeight = "normal", c.style.letterSpacing = "0", c.appendChild(f), document.body.appendChild(c);
        var m = f.offsetWidth;
        return f.style.fontFamily = function(y) {
          var d, l = y.split(","), o = l.length, g = [];
          for (d = 0; d < o; d += 1)
            l[d] !== "sans-serif" && l[d] !== "monospace" && g.push(l[d]);
          return g.join(",");
        }(b) + ", " + x, { node: f, w: m, parent: c };
      }
      function n(b, x) {
        var c, f = document.body && x ? "svg" : "canvas", m = getFontProperties(b);
        if (f === "svg") {
          var y = createNS("text");
          y.style.fontSize = "100px", y.setAttribute("font-family", b.fFamily), y.setAttribute("font-style", m.style), y.setAttribute("font-weight", m.weight), y.textContent = "1", b.fClass ? (y.style.fontFamily = "inherit", y.setAttribute("class", b.fClass)) : y.style.fontFamily = b.fFamily, x.appendChild(y), c = y;
        } else {
          var d = new OffscreenCanvas(500, 500).getContext("2d");
          d.font = m.style + " " + m.weight + " 100px " + b.fFamily, c = d;
        }
        return { measureText: function(l) {
          return f === "svg" ? (c.textContent = l, c.getComputedTextLength()) : c.measureText(l).width;
        } };
      }
      var u = function() {
        this.fonts = [], this.chars = null, this.typekitLoaded = 0, this.isLoaded = !1, this._warned = !1, this.initTime = Date.now(), this.setIsLoadedBinded = this.setIsLoaded.bind(this), this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this);
      };
      u.isModifier = function(b, x) {
        var c = b.toString(16) + x.toString(16);
        return a.indexOf(c) !== -1;
      }, u.isZeroWidthJoiner = function(b, x) {
        return x ? b === i[0] && x === i[1] : b === i[1];
      }, u.isCombinedCharacter = function(b) {
        return r.indexOf(b) !== -1;
      };
      var p = { addChars: function(b) {
        if (b) {
          var x;
          this.chars || (this.chars = []);
          var c, f, m = b.length, y = this.chars.length;
          for (x = 0; x < m; x += 1) {
            for (c = 0, f = !1; c < y; )
              this.chars[c].style === b[x].style && this.chars[c].fFamily === b[x].fFamily && this.chars[c].ch === b[x].ch && (f = !0), c += 1;
            f || (this.chars.push(b[x]), y += 1);
          }
        }
      }, addFonts: function(b, x) {
        if (b) {
          if (this.chars)
            return this.isLoaded = !0, void (this.fonts = b.list);
          if (!document.body)
            return this.isLoaded = !0, b.list.forEach(function(E) {
              E.helper = n(E), E.cache = {};
            }), void (this.fonts = b.list);
          var c, f = b.list, m = f.length, y = m;
          for (c = 0; c < m; c += 1) {
            var d, l, o = !0;
            if (f[c].loaded = !1, f[c].monoCase = s(f[c].fFamily, "monospace"), f[c].sansCase = s(f[c].fFamily, "sans-serif"), f[c].fPath) {
              if (f[c].fOrigin === "p" || f[c].origin === 3) {
                if ((d = document.querySelectorAll('style[f-forigin="p"][f-family="' + f[c].fFamily + '"], style[f-origin="3"][f-family="' + f[c].fFamily + '"]')).length > 0 && (o = !1), o) {
                  var g = createTag("style");
                  g.setAttribute("f-forigin", f[c].fOrigin), g.setAttribute("f-origin", f[c].origin), g.setAttribute("f-family", f[c].fFamily), g.type = "text/css", g.innerText = "@font-face {font-family: " + f[c].fFamily + "; font-style: normal; src: url('" + f[c].fPath + "');}", x.appendChild(g);
                }
              } else if (f[c].fOrigin === "g" || f[c].origin === 1) {
                for (d = document.querySelectorAll('link[f-forigin="g"], link[f-origin="1"]'), l = 0; l < d.length; l += 1)
                  d[l].href.indexOf(f[c].fPath) !== -1 && (o = !1);
                if (o) {
                  var _ = createTag("link");
                  _.setAttribute("f-forigin", f[c].fOrigin), _.setAttribute("f-origin", f[c].origin), _.type = "text/css", _.rel = "stylesheet", _.href = f[c].fPath, document.body.appendChild(_);
                }
              } else if (f[c].fOrigin === "t" || f[c].origin === 2) {
                for (d = document.querySelectorAll('script[f-forigin="t"], script[f-origin="2"]'), l = 0; l < d.length; l += 1)
                  f[c].fPath === d[l].src && (o = !1);
                if (o) {
                  var S = createTag("link");
                  S.setAttribute("f-forigin", f[c].fOrigin), S.setAttribute("f-origin", f[c].origin), S.setAttribute("rel", "stylesheet"), S.setAttribute("href", f[c].fPath), x.appendChild(S);
                }
              }
            } else
              f[c].loaded = !0, y -= 1;
            f[c].helper = n(f[c], x), f[c].cache = {}, this.fonts.push(f[c]);
          }
          y === 0 ? this.isLoaded = !0 : setTimeout(this.checkLoadedFonts.bind(this), 100);
        } else
          this.isLoaded = !0;
      }, getCharData: function(b, x, c) {
        for (var f = 0, m = this.chars.length; f < m; ) {
          if (this.chars[f].ch === b && this.chars[f].style === x && this.chars[f].fFamily === c)
            return this.chars[f];
          f += 1;
        }
        return (typeof b == "string" && b.charCodeAt(0) !== 13 || !b) && console && console.warn && !this._warned && (this._warned = !0, console.warn("Missing character from exported characters list: ", b, x, c)), e;
      }, getFontByName: function(b) {
        for (var x = 0, c = this.fonts.length; x < c; ) {
          if (this.fonts[x].fName === b)
            return this.fonts[x];
          x += 1;
        }
        return this.fonts[0];
      }, measureText: function(b, x, c) {
        var f = this.getFontByName(x), m = b.charCodeAt(0);
        if (!f.cache[m + 1]) {
          var y = f.helper;
          if (b === " ") {
            var d = y.measureText("|" + b + "|"), l = y.measureText("||");
            f.cache[m + 1] = (d - l) / 100;
          } else
            f.cache[m + 1] = y.measureText(b) / 100;
        }
        return f.cache[m + 1] * c;
      }, checkLoadedFonts: function() {
        var b, x, c, f = this.fonts.length, m = f;
        for (b = 0; b < f; b += 1)
          this.fonts[b].loaded ? m -= 1 : this.fonts[b].fOrigin === "n" || this.fonts[b].origin === 0 ? this.fonts[b].loaded = !0 : (x = this.fonts[b].monoCase.node, c = this.fonts[b].monoCase.w, x.offsetWidth !== c ? (m -= 1, this.fonts[b].loaded = !0) : (x = this.fonts[b].sansCase.node, c = this.fonts[b].sansCase.w, x.offsetWidth !== c && (m -= 1, this.fonts[b].loaded = !0)), this.fonts[b].loaded && (this.fonts[b].sansCase.parent.parentNode.removeChild(this.fonts[b].sansCase.parent), this.fonts[b].monoCase.parent.parentNode.removeChild(this.fonts[b].monoCase.parent)));
        m !== 0 && Date.now() - this.initTime < 5e3 ? setTimeout(this.checkLoadedFontsBinded, 20) : setTimeout(this.setIsLoadedBinded, 10);
      }, setIsLoaded: function() {
        this.isLoaded = !0;
      } };
      return u.prototype = p, u;
    }();
    function RenderableElement() {
    }
    RenderableElement.prototype = { initRenderable: function() {
      this.isInRange = !1, this.hidden = !1, this.isTransparent = !1, this.renderableComponents = [];
    }, addRenderableComponent: function(e) {
      this.renderableComponents.indexOf(e) === -1 && this.renderableComponents.push(e);
    }, removeRenderableComponent: function(e) {
      this.renderableComponents.indexOf(e) !== -1 && this.renderableComponents.splice(this.renderableComponents.indexOf(e), 1);
    }, prepareRenderableFrame: function(e) {
      this.checkLayerLimits(e);
    }, checkTransparency: function() {
      this.finalTransform.mProp.o.v <= 0 ? !this.isTransparent && this.globalData.renderConfig.hideOnTransparent && (this.isTransparent = !0, this.hide()) : this.isTransparent && (this.isTransparent = !1, this.show());
    }, checkLayerLimits: function(e) {
      this.data.ip - this.data.st <= e && this.data.op - this.data.st > e ? this.isInRange !== !0 && (this.globalData._mdf = !0, this._mdf = !0, this.isInRange = !0, this.show()) : this.isInRange !== !1 && (this.globalData._mdf = !0, this.isInRange = !1, this.hide());
    }, renderRenderable: function() {
      var e, r = this.renderableComponents.length;
      for (e = 0; e < r; e += 1)
        this.renderableComponents[e].renderFrame(this._isFirstFrame);
    }, sourceRectAtTime: function() {
      return { top: 0, left: 0, width: 100, height: 100 };
    }, getLayerSize: function() {
      return this.data.ty === 5 ? { w: this.data.textData.width, h: this.data.textData.height } : { w: this.data.width, h: this.data.height };
    } };
    var MaskManagerInterface = function() {
      function e(r, a) {
        this._mask = r, this._data = a;
      }
      return Object.defineProperty(e.prototype, "maskPath", { get: function() {
        return this._mask.prop.k && this._mask.prop.getValue(), this._mask.prop;
      } }), Object.defineProperty(e.prototype, "maskOpacity", { get: function() {
        return this._mask.op.k && this._mask.op.getValue(), 100 * this._mask.op.v;
      } }), function(r) {
        var a, i = createSizedArray(r.viewData.length), s = r.viewData.length;
        for (a = 0; a < s; a += 1)
          i[a] = new e(r.viewData[a], r.masksProperties[a]);
        return function(n) {
          for (a = 0; a < s; ) {
            if (r.masksProperties[a].nm === n)
              return i[a];
            a += 1;
          }
          return null;
        };
      };
    }(), ExpressionPropertyInterface = function() {
      var e = { pv: 0, v: 0, mult: 1 }, r = { pv: [0, 0, 0], v: [0, 0, 0], mult: 1 };
      function a(s, n, u) {
        Object.defineProperty(s, "velocity", { get: function() {
          return n.getVelocityAtTime(n.comp.currentFrame);
        } }), s.numKeys = n.keyframes ? n.keyframes.length : 0, s.key = function(p) {
          if (!s.numKeys)
            return 0;
          var b = "";
          b = "s" in n.keyframes[p - 1] ? n.keyframes[p - 1].s : "e" in n.keyframes[p - 2] ? n.keyframes[p - 2].e : n.keyframes[p - 2].s;
          var x = u === "unidimensional" ? new Number(b) : Object.assign({}, b);
          return x.time = n.keyframes[p - 1].t / n.elem.comp.globalData.frameRate, x.value = u === "unidimensional" ? b[0] : b, x;
        }, s.valueAtTime = n.getValueAtTime, s.speedAtTime = n.getSpeedAtTime, s.velocityAtTime = n.getVelocityAtTime, s.propertyGroup = n.propertyGroup;
      }
      function i() {
        return e;
      }
      return function(s) {
        return s ? s.propType === "unidimensional" ? function(n) {
          n && "pv" in n || (n = e);
          var u = 1 / n.mult, p = n.pv * u, b = new Number(p);
          return b.value = p, a(b, n, "unidimensional"), function() {
            return n.k && n.getValue(), p = n.v * u, b.value !== p && ((b = new Number(p)).value = p, a(b, n, "unidimensional")), b;
          };
        }(s) : function(n) {
          n && "pv" in n || (n = r);
          var u = 1 / n.mult, p = n.data && n.data.l || n.pv.length, b = createTypedArray("float32", p), x = createTypedArray("float32", p);
          return b.value = x, a(b, n, "multidimensional"), function() {
            n.k && n.getValue();
            for (var c = 0; c < p; c += 1)
              x[c] = n.v[c] * u, b[c] = x[c];
            return b;
          };
        }(s) : i;
      };
    }(), TransformExpressionInterface = function(e) {
      function r(u) {
        switch (u) {
          case "scale":
          case "Scale":
          case "ADBE Scale":
          case 6:
            return r.scale;
          case "rotation":
          case "Rotation":
          case "ADBE Rotation":
          case "ADBE Rotate Z":
          case 10:
            return r.rotation;
          case "ADBE Rotate X":
            return r.xRotation;
          case "ADBE Rotate Y":
            return r.yRotation;
          case "position":
          case "Position":
          case "ADBE Position":
          case 2:
            return r.position;
          case "ADBE Position_0":
            return r.xPosition;
          case "ADBE Position_1":
            return r.yPosition;
          case "ADBE Position_2":
            return r.zPosition;
          case "anchorPoint":
          case "AnchorPoint":
          case "Anchor Point":
          case "ADBE AnchorPoint":
          case 1:
            return r.anchorPoint;
          case "opacity":
          case "Opacity":
          case 11:
            return r.opacity;
          default:
            return null;
        }
      }
      var a, i, s, n;
      return Object.defineProperty(r, "rotation", { get: ExpressionPropertyInterface(e.r || e.rz) }), Object.defineProperty(r, "zRotation", { get: ExpressionPropertyInterface(e.rz || e.r) }), Object.defineProperty(r, "xRotation", { get: ExpressionPropertyInterface(e.rx) }), Object.defineProperty(r, "yRotation", { get: ExpressionPropertyInterface(e.ry) }), Object.defineProperty(r, "scale", { get: ExpressionPropertyInterface(e.s) }), e.p ? n = ExpressionPropertyInterface(e.p) : (a = ExpressionPropertyInterface(e.px), i = ExpressionPropertyInterface(e.py), e.pz && (s = ExpressionPropertyInterface(e.pz))), Object.defineProperty(r, "position", { get: function() {
        return e.p ? n() : [a(), i(), s ? s() : 0];
      } }), Object.defineProperty(r, "xPosition", { get: ExpressionPropertyInterface(e.px) }), Object.defineProperty(r, "yPosition", { get: ExpressionPropertyInterface(e.py) }), Object.defineProperty(r, "zPosition", { get: ExpressionPropertyInterface(e.pz) }), Object.defineProperty(r, "anchorPoint", { get: ExpressionPropertyInterface(e.a) }), Object.defineProperty(r, "opacity", { get: ExpressionPropertyInterface(e.o) }), Object.defineProperty(r, "skew", { get: ExpressionPropertyInterface(e.sk) }), Object.defineProperty(r, "skewAxis", { get: ExpressionPropertyInterface(e.sa) }), Object.defineProperty(r, "orientation", { get: ExpressionPropertyInterface(e.or) }), r;
    }, LayerExpressionInterface = function() {
      function e(x) {
        var c = new Matrix();
        return x !== void 0 ? this._elem.finalTransform.mProp.getValueAtTime(x).clone(c) : this._elem.finalTransform.mProp.applyToMatrix(c), c;
      }
      function r(x, c) {
        var f = this.getMatrix(c);
        return f.props[12] = 0, f.props[13] = 0, f.props[14] = 0, this.applyPoint(f, x);
      }
      function a(x, c) {
        var f = this.getMatrix(c);
        return this.applyPoint(f, x);
      }
      function i(x, c) {
        var f = this.getMatrix(c);
        return f.props[12] = 0, f.props[13] = 0, f.props[14] = 0, this.invertPoint(f, x);
      }
      function s(x, c) {
        var f = this.getMatrix(c);
        return this.invertPoint(f, x);
      }
      function n(x, c) {
        if (this._elem.hierarchy && this._elem.hierarchy.length) {
          var f, m = this._elem.hierarchy.length;
          for (f = 0; f < m; f += 1)
            this._elem.hierarchy[f].finalTransform.mProp.applyToMatrix(x);
        }
        return x.applyToPointArray(c[0], c[1], c[2] || 0);
      }
      function u(x, c) {
        if (this._elem.hierarchy && this._elem.hierarchy.length) {
          var f, m = this._elem.hierarchy.length;
          for (f = 0; f < m; f += 1)
            this._elem.hierarchy[f].finalTransform.mProp.applyToMatrix(x);
        }
        return x.inversePoint(c);
      }
      function p(x) {
        var c = new Matrix();
        if (c.reset(), this._elem.finalTransform.mProp.applyToMatrix(c), this._elem.hierarchy && this._elem.hierarchy.length) {
          var f, m = this._elem.hierarchy.length;
          for (f = 0; f < m; f += 1)
            this._elem.hierarchy[f].finalTransform.mProp.applyToMatrix(c);
          return c.inversePoint(x);
        }
        return c.inversePoint(x);
      }
      function b() {
        return [1, 1, 1, 1];
      }
      return function(x) {
        var c;
        function f(y) {
          switch (y) {
            case "ADBE Root Vectors Group":
            case "Contents":
            case 2:
              return f.shapeInterface;
            case 1:
            case 6:
            case "Transform":
            case "transform":
            case "ADBE Transform Group":
              return c;
            case 4:
            case "ADBE Effect Parade":
            case "effects":
            case "Effects":
              return f.effect;
            case "ADBE Text Properties":
              return f.textInterface;
            default:
              return null;
          }
        }
        f.getMatrix = e, f.invertPoint = u, f.applyPoint = n, f.toWorld = a, f.toWorldVec = r, f.fromWorld = s, f.fromWorldVec = i, f.toComp = a, f.fromComp = p, f.sampleImage = b, f.sourceRectAtTime = x.sourceRectAtTime.bind(x), f._elem = x;
        var m = getDescriptor(c = TransformExpressionInterface(x.finalTransform.mProp), "anchorPoint");
        return Object.defineProperties(f, { hasParent: { get: function() {
          return x.hierarchy.length;
        } }, parent: { get: function() {
          return x.hierarchy[0].layerInterface;
        } }, rotation: getDescriptor(c, "rotation"), scale: getDescriptor(c, "scale"), position: getDescriptor(c, "position"), opacity: getDescriptor(c, "opacity"), anchorPoint: m, anchor_point: m, transform: { get: function() {
          return c;
        } }, active: { get: function() {
          return x.isInRange;
        } } }), f.startTime = x.data.st, f.index = x.data.ind, f.source = x.data.refId, f.height = x.data.ty === 0 ? x.data.h : 100, f.width = x.data.ty === 0 ? x.data.w : 100, f.inPoint = x.data.ip / x.comp.globalData.frameRate, f.outPoint = x.data.op / x.comp.globalData.frameRate, f._name = x.data.nm, f.registerMaskInterface = function(y) {
          f.mask = new MaskManagerInterface(y, x);
        }, f.registerEffectsInterface = function(y) {
          f.effect = y;
        }, f;
      };
    }(), propertyGroupFactory = function(e, r) {
      return function(a) {
        return (a = a === void 0 ? 1 : a) <= 0 ? e : r(a - 1);
      };
    }, PropertyInterface = function(e, r) {
      var a = { _name: e };
      return function(i) {
        return (i = i === void 0 ? 1 : i) <= 0 ? a : r(i - 1);
      };
    }, EffectsExpressionInterface = function() {
      var e = { createEffectsInterface: function(i, s) {
        if (i.effectsManager) {
          var n, u = [], p = i.data.ef, b = i.effectsManager.effectElements.length;
          for (n = 0; n < b; n += 1)
            u.push(r(p[n], i.effectsManager.effectElements[n], s, i));
          var x = i.data.ef || [], c = function(f) {
            for (n = 0, b = x.length; n < b; ) {
              if (f === x[n].nm || f === x[n].mn || f === x[n].ix)
                return u[n];
              n += 1;
            }
            return null;
          };
          return Object.defineProperty(c, "numProperties", { get: function() {
            return x.length;
          } }), c;
        }
        return null;
      } };
      function r(i, s, n, u) {
        function p(m) {
          for (var y = i.ef, d = 0, l = y.length; d < l; ) {
            if (m === y[d].nm || m === y[d].mn || m === y[d].ix)
              return y[d].ty === 5 ? c[d] : c[d]();
            d += 1;
          }
          throw new Error();
        }
        var b, x = propertyGroupFactory(p, n), c = [], f = i.ef.length;
        for (b = 0; b < f; b += 1)
          i.ef[b].ty === 5 ? c.push(r(i.ef[b], s.effectElements[b], s.effectElements[b].propertyGroup, u)) : c.push(a(s.effectElements[b], i.ef[b].ty, u, x));
        return i.mn === "ADBE Color Control" && Object.defineProperty(p, "color", { get: function() {
          return c[0]();
        } }), Object.defineProperties(p, { numProperties: { get: function() {
          return i.np;
        } }, _name: { value: i.nm }, propertyGroup: { value: x } }), p.enabled = i.en !== 0, p.active = p.enabled, p;
      }
      function a(i, s, n, u) {
        var p = ExpressionPropertyInterface(i.p);
        return i.p.setGroupProperty && i.p.setGroupProperty(PropertyInterface("", u)), function() {
          return s === 10 ? n.comp.compInterface(i.p.v) : p();
        };
      }
      return e;
    }(), CompExpressionInterface = function(e) {
      function r(a) {
        for (var i = 0, s = e.layers.length; i < s; ) {
          if (e.layers[i].nm === a || e.layers[i].ind === a)
            return e.elements[i].layerInterface;
          i += 1;
        }
        return null;
      }
      return Object.defineProperty(r, "_name", { value: e.data.nm }), r.layer = r, r.pixelAspect = 1, r.height = e.data.h || e.globalData.compSize.h, r.width = e.data.w || e.globalData.compSize.w, r.pixelAspect = 1, r.frameDuration = 1 / e.globalData.frameRate, r.displayStartTime = 0, r.numLayers = e.layers.length, r;
    }, ShapePathInterface = function(e, r, a) {
      var i = r.sh;
      function s(u) {
        return u === "Shape" || u === "shape" || u === "Path" || u === "path" || u === "ADBE Vector Shape" || u === 2 ? s.path : null;
      }
      var n = propertyGroupFactory(s, a);
      return i.setGroupProperty(PropertyInterface("Path", n)), Object.defineProperties(s, { path: { get: function() {
        return i.k && i.getValue(), i;
      } }, shape: { get: function() {
        return i.k && i.getValue(), i;
      } }, _name: { value: e.nm }, ix: { value: e.ix }, propertyIndex: { value: e.ix }, mn: { value: e.mn }, propertyGroup: { value: a } }), s;
    }, ShapeExpressionInterface = function() {
      function e(m, y, d) {
        var l, o = [], g = m ? m.length : 0;
        for (l = 0; l < g; l += 1)
          m[l].ty === "gr" ? o.push(r(m[l], y[l], d)) : m[l].ty === "fl" ? o.push(a(m[l], y[l], d)) : m[l].ty === "st" ? o.push(s(m[l], y[l], d)) : m[l].ty === "tm" ? o.push(n(m[l], y[l], d)) : m[l].ty === "tr" || (m[l].ty === "el" ? o.push(p(m[l], y[l], d)) : m[l].ty === "sr" ? o.push(b(m[l], y[l], d)) : m[l].ty === "sh" ? o.push(ShapePathInterface(m[l], y[l], d)) : m[l].ty === "rc" ? o.push(x(m[l], y[l], d)) : m[l].ty === "rd" ? o.push(c(m[l], y[l], d)) : m[l].ty === "rp" ? o.push(f(m[l], y[l], d)) : m[l].ty === "gf" ? o.push(i(m[l], y[l], d)) : o.push((m[l], y[l], function() {
            return null;
          })));
        return o;
      }
      function r(m, y, d) {
        var l = function(_) {
          switch (_) {
            case "ADBE Vectors Group":
            case "Contents":
            case 2:
              return l.content;
            default:
              return l.transform;
          }
        };
        l.propertyGroup = propertyGroupFactory(l, d);
        var o = function(_, S, E) {
          var P, k = function(A) {
            for (var M = 0, I = P.length; M < I; ) {
              if (P[M]._name === A || P[M].mn === A || P[M].propertyIndex === A || P[M].ix === A || P[M].ind === A)
                return P[M];
              M += 1;
            }
            return typeof A == "number" ? P[A - 1] : null;
          };
          k.propertyGroup = propertyGroupFactory(k, E), P = e(_.it, S.it, k.propertyGroup), k.numProperties = P.length;
          var C = u(_.it[_.it.length - 1], S.it[S.it.length - 1], k.propertyGroup);
          return k.transform = C, k.propertyIndex = _.cix, k._name = _.nm, k;
        }(m, y, l.propertyGroup), g = u(m.it[m.it.length - 1], y.it[y.it.length - 1], l.propertyGroup);
        return l.content = o, l.transform = g, Object.defineProperty(l, "_name", { get: function() {
          return m.nm;
        } }), l.numProperties = m.np, l.propertyIndex = m.ix, l.nm = m.nm, l.mn = m.mn, l;
      }
      function a(m, y, d) {
        function l(o) {
          return o === "Color" || o === "color" ? l.color : o === "Opacity" || o === "opacity" ? l.opacity : null;
        }
        return Object.defineProperties(l, { color: { get: ExpressionPropertyInterface(y.c) }, opacity: { get: ExpressionPropertyInterface(y.o) }, _name: { value: m.nm }, mn: { value: m.mn } }), y.c.setGroupProperty(PropertyInterface("Color", d)), y.o.setGroupProperty(PropertyInterface("Opacity", d)), l;
      }
      function i(m, y, d) {
        function l(o) {
          return o === "Start Point" || o === "start point" ? l.startPoint : o === "End Point" || o === "end point" ? l.endPoint : o === "Opacity" || o === "opacity" ? l.opacity : null;
        }
        return Object.defineProperties(l, { startPoint: { get: ExpressionPropertyInterface(y.s) }, endPoint: { get: ExpressionPropertyInterface(y.e) }, opacity: { get: ExpressionPropertyInterface(y.o) }, type: { get: function() {
          return "a";
        } }, _name: { value: m.nm }, mn: { value: m.mn } }), y.s.setGroupProperty(PropertyInterface("Start Point", d)), y.e.setGroupProperty(PropertyInterface("End Point", d)), y.o.setGroupProperty(PropertyInterface("Opacity", d)), l;
      }
      function s(m, y, d) {
        var l, o = propertyGroupFactory(P, d), g = propertyGroupFactory(E, o);
        function _(k) {
          Object.defineProperty(E, m.d[k].nm, { get: ExpressionPropertyInterface(y.d.dataProps[k].p) });
        }
        var S = m.d ? m.d.length : 0, E = {};
        for (l = 0; l < S; l += 1)
          _(l), y.d.dataProps[l].p.setGroupProperty(g);
        function P(k) {
          return k === "Color" || k === "color" ? P.color : k === "Opacity" || k === "opacity" ? P.opacity : k === "Stroke Width" || k === "stroke width" ? P.strokeWidth : null;
        }
        return Object.defineProperties(P, { color: { get: ExpressionPropertyInterface(y.c) }, opacity: { get: ExpressionPropertyInterface(y.o) }, strokeWidth: { get: ExpressionPropertyInterface(y.w) }, dash: { get: function() {
          return E;
        } }, _name: { value: m.nm }, mn: { value: m.mn } }), y.c.setGroupProperty(PropertyInterface("Color", o)), y.o.setGroupProperty(PropertyInterface("Opacity", o)), y.w.setGroupProperty(PropertyInterface("Stroke Width", o)), P;
      }
      function n(m, y, d) {
        function l(g) {
          return g === m.e.ix || g === "End" || g === "end" ? l.end : g === m.s.ix ? l.start : g === m.o.ix ? l.offset : null;
        }
        var o = propertyGroupFactory(l, d);
        return l.propertyIndex = m.ix, y.s.setGroupProperty(PropertyInterface("Start", o)), y.e.setGroupProperty(PropertyInterface("End", o)), y.o.setGroupProperty(PropertyInterface("Offset", o)), l.propertyIndex = m.ix, l.propertyGroup = d, Object.defineProperties(l, { start: { get: ExpressionPropertyInterface(y.s) }, end: { get: ExpressionPropertyInterface(y.e) }, offset: { get: ExpressionPropertyInterface(y.o) }, _name: { value: m.nm } }), l.mn = m.mn, l;
      }
      function u(m, y, d) {
        function l(g) {
          return m.a.ix === g || g === "Anchor Point" ? l.anchorPoint : m.o.ix === g || g === "Opacity" ? l.opacity : m.p.ix === g || g === "Position" ? l.position : m.r.ix === g || g === "Rotation" || g === "ADBE Vector Rotation" ? l.rotation : m.s.ix === g || g === "Scale" ? l.scale : m.sk && m.sk.ix === g || g === "Skew" ? l.skew : m.sa && m.sa.ix === g || g === "Skew Axis" ? l.skewAxis : null;
        }
        var o = propertyGroupFactory(l, d);
        return y.transform.mProps.o.setGroupProperty(PropertyInterface("Opacity", o)), y.transform.mProps.p.setGroupProperty(PropertyInterface("Position", o)), y.transform.mProps.a.setGroupProperty(PropertyInterface("Anchor Point", o)), y.transform.mProps.s.setGroupProperty(PropertyInterface("Scale", o)), y.transform.mProps.r.setGroupProperty(PropertyInterface("Rotation", o)), y.transform.mProps.sk && (y.transform.mProps.sk.setGroupProperty(PropertyInterface("Skew", o)), y.transform.mProps.sa.setGroupProperty(PropertyInterface("Skew Angle", o))), y.transform.op.setGroupProperty(PropertyInterface("Opacity", o)), Object.defineProperties(l, { opacity: { get: ExpressionPropertyInterface(y.transform.mProps.o) }, position: { get: ExpressionPropertyInterface(y.transform.mProps.p) }, anchorPoint: { get: ExpressionPropertyInterface(y.transform.mProps.a) }, scale: { get: ExpressionPropertyInterface(y.transform.mProps.s) }, rotation: { get: ExpressionPropertyInterface(y.transform.mProps.r) }, skew: { get: ExpressionPropertyInterface(y.transform.mProps.sk) }, skewAxis: { get: ExpressionPropertyInterface(y.transform.mProps.sa) }, _name: { value: m.nm } }), l.ty = "tr", l.mn = m.mn, l.propertyGroup = d, l;
      }
      function p(m, y, d) {
        function l(_) {
          return m.p.ix === _ ? l.position : m.s.ix === _ ? l.size : null;
        }
        var o = propertyGroupFactory(l, d);
        l.propertyIndex = m.ix;
        var g = y.sh.ty === "tm" ? y.sh.prop : y.sh;
        return g.s.setGroupProperty(PropertyInterface("Size", o)), g.p.setGroupProperty(PropertyInterface("Position", o)), Object.defineProperties(l, { size: { get: ExpressionPropertyInterface(g.s) }, position: { get: ExpressionPropertyInterface(g.p) }, _name: { value: m.nm } }), l.mn = m.mn, l;
      }
      function b(m, y, d) {
        function l(_) {
          return m.p.ix === _ ? l.position : m.r.ix === _ ? l.rotation : m.pt.ix === _ ? l.points : m.or.ix === _ || _ === "ADBE Vector Star Outer Radius" ? l.outerRadius : m.os.ix === _ ? l.outerRoundness : !m.ir || m.ir.ix !== _ && _ !== "ADBE Vector Star Inner Radius" ? m.is && m.is.ix === _ ? l.innerRoundness : null : l.innerRadius;
        }
        var o = propertyGroupFactory(l, d), g = y.sh.ty === "tm" ? y.sh.prop : y.sh;
        return l.propertyIndex = m.ix, g.or.setGroupProperty(PropertyInterface("Outer Radius", o)), g.os.setGroupProperty(PropertyInterface("Outer Roundness", o)), g.pt.setGroupProperty(PropertyInterface("Points", o)), g.p.setGroupProperty(PropertyInterface("Position", o)), g.r.setGroupProperty(PropertyInterface("Rotation", o)), m.ir && (g.ir.setGroupProperty(PropertyInterface("Inner Radius", o)), g.is.setGroupProperty(PropertyInterface("Inner Roundness", o))), Object.defineProperties(l, { position: { get: ExpressionPropertyInterface(g.p) }, rotation: { get: ExpressionPropertyInterface(g.r) }, points: { get: ExpressionPropertyInterface(g.pt) }, outerRadius: { get: ExpressionPropertyInterface(g.or) }, outerRoundness: { get: ExpressionPropertyInterface(g.os) }, innerRadius: { get: ExpressionPropertyInterface(g.ir) }, innerRoundness: { get: ExpressionPropertyInterface(g.is) }, _name: { value: m.nm } }), l.mn = m.mn, l;
      }
      function x(m, y, d) {
        function l(_) {
          return m.p.ix === _ ? l.position : m.r.ix === _ ? l.roundness : m.s.ix === _ || _ === "Size" || _ === "ADBE Vector Rect Size" ? l.size : null;
        }
        var o = propertyGroupFactory(l, d), g = y.sh.ty === "tm" ? y.sh.prop : y.sh;
        return l.propertyIndex = m.ix, g.p.setGroupProperty(PropertyInterface("Position", o)), g.s.setGroupProperty(PropertyInterface("Size", o)), g.r.setGroupProperty(PropertyInterface("Rotation", o)), Object.defineProperties(l, { position: { get: ExpressionPropertyInterface(g.p) }, roundness: { get: ExpressionPropertyInterface(g.r) }, size: { get: ExpressionPropertyInterface(g.s) }, _name: { value: m.nm } }), l.mn = m.mn, l;
      }
      function c(m, y, d) {
        function l(_) {
          return m.r.ix === _ || _ === "Round Corners 1" ? l.radius : null;
        }
        var o = propertyGroupFactory(l, d), g = y;
        return l.propertyIndex = m.ix, g.rd.setGroupProperty(PropertyInterface("Radius", o)), Object.defineProperties(l, { radius: { get: ExpressionPropertyInterface(g.rd) }, _name: { value: m.nm } }), l.mn = m.mn, l;
      }
      function f(m, y, d) {
        function l(_) {
          return m.c.ix === _ || _ === "Copies" ? l.copies : m.o.ix === _ || _ === "Offset" ? l.offset : null;
        }
        var o = propertyGroupFactory(l, d), g = y;
        return l.propertyIndex = m.ix, g.c.setGroupProperty(PropertyInterface("Copies", o)), g.o.setGroupProperty(PropertyInterface("Offset", o)), Object.defineProperties(l, { copies: { get: ExpressionPropertyInterface(g.c) }, offset: { get: ExpressionPropertyInterface(g.o) }, _name: { value: m.nm } }), l.mn = m.mn, l;
      }
      return function(m, y, d) {
        var l;
        function o(g) {
          if (typeof g == "number")
            return (g = g === void 0 ? 1 : g) === 0 ? d : l[g - 1];
          for (var _ = 0, S = l.length; _ < S; ) {
            if (l[_]._name === g)
              return l[_];
            _ += 1;
          }
          return null;
        }
        return o.propertyGroup = propertyGroupFactory(o, function() {
          return d;
        }), l = e(m, y, o.propertyGroup), o.numProperties = l.length, o._name = "Contents", o;
      };
    }(), TextExpressionInterface = function(e) {
      var r, a;
      function i(s) {
        return s === "ADBE Text Document" ? i.sourceText : null;
      }
      return Object.defineProperty(i, "sourceText", { get: function() {
        e.textProperty.getValue();
        var s = e.textProperty.currentData.t;
        return s !== r && (e.textProperty.currentData.t = r, (a = new String(s)).value = s || new String(s)), a;
      } }), i;
    }, getBlendMode = (blendModeEnums = { 0: "source-over", 1: "multiply", 2: "screen", 3: "overlay", 4: "darken", 5: "lighten", 6: "color-dodge", 7: "color-burn", 8: "hard-light", 9: "soft-light", 10: "difference", 11: "exclusion", 12: "hue", 13: "saturation", 14: "color", 15: "luminosity" }, function(e) {
      return blendModeEnums[e] || "";
    }), blendModeEnums;
    function SliderEffect(e, r, a) {
      this.p = PropertyFactory.getProp(r, e.v, 0, 0, a);
    }
    function AngleEffect(e, r, a) {
      this.p = PropertyFactory.getProp(r, e.v, 0, 0, a);
    }
    function ColorEffect(e, r, a) {
      this.p = PropertyFactory.getProp(r, e.v, 1, 0, a);
    }
    function PointEffect(e, r, a) {
      this.p = PropertyFactory.getProp(r, e.v, 1, 0, a);
    }
    function LayerIndexEffect(e, r, a) {
      this.p = PropertyFactory.getProp(r, e.v, 0, 0, a);
    }
    function MaskIndexEffect(e, r, a) {
      this.p = PropertyFactory.getProp(r, e.v, 0, 0, a);
    }
    function CheckboxEffect(e, r, a) {
      this.p = PropertyFactory.getProp(r, e.v, 0, 0, a);
    }
    function NoValueEffect() {
      this.p = {};
    }
    function EffectsManager(e, r) {
      var a, i = e.ef || [];
      this.effectElements = [];
      var s, n = i.length;
      for (a = 0; a < n; a += 1)
        s = new GroupEffect(i[a], r), this.effectElements.push(s);
    }
    function GroupEffect(e, r) {
      this.init(e, r);
    }
    function BaseElement() {
    }
    function FrameElement() {
    }
    function _typeof$2(e) {
      return _typeof$2 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
        return typeof r;
      } : function(r) {
        return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
      }, _typeof$2(e);
    }
    extendPrototype([DynamicPropertyContainer], GroupEffect), GroupEffect.prototype.getValue = GroupEffect.prototype.iterateDynamicProperties, GroupEffect.prototype.init = function(e, r) {
      var a;
      this.data = e, this.effectElements = [], this.initDynamicPropertyContainer(r);
      var i, s = this.data.ef.length, n = this.data.ef;
      for (a = 0; a < s; a += 1) {
        switch (i = null, n[a].ty) {
          case 0:
            i = new SliderEffect(n[a], r, this);
            break;
          case 1:
            i = new AngleEffect(n[a], r, this);
            break;
          case 2:
            i = new ColorEffect(n[a], r, this);
            break;
          case 3:
            i = new PointEffect(n[a], r, this);
            break;
          case 4:
          case 7:
            i = new CheckboxEffect(n[a], r, this);
            break;
          case 10:
            i = new LayerIndexEffect(n[a], r, this);
            break;
          case 11:
            i = new MaskIndexEffect(n[a], r, this);
            break;
          case 5:
            i = new EffectsManager(n[a], r);
            break;
          default:
            i = new NoValueEffect(n[a]);
        }
        i && this.effectElements.push(i);
      }
    }, BaseElement.prototype = { checkMasks: function() {
      if (!this.data.hasMask)
        return !1;
      for (var e = 0, r = this.data.masksProperties.length; e < r; ) {
        if (this.data.masksProperties[e].mode !== "n" && this.data.masksProperties[e].cl !== !1)
          return !0;
        e += 1;
      }
      return !1;
    }, initExpressions: function() {
      this.layerInterface = LayerExpressionInterface(this), this.data.hasMask && this.maskManager && this.layerInterface.registerMaskInterface(this.maskManager);
      var e = EffectsExpressionInterface.createEffectsInterface(this, this.layerInterface);
      this.layerInterface.registerEffectsInterface(e), this.data.ty === 0 || this.data.xt ? this.compInterface = CompExpressionInterface(this) : this.data.ty === 4 ? (this.layerInterface.shapeInterface = ShapeExpressionInterface(this.shapesData, this.itemsData, this.layerInterface), this.layerInterface.content = this.layerInterface.shapeInterface) : this.data.ty === 5 && (this.layerInterface.textInterface = TextExpressionInterface(this), this.layerInterface.text = this.layerInterface.textInterface);
    }, setBlendMode: function() {
      var e = getBlendMode(this.data.bm);
      (this.baseElement || this.layerElement).style["mix-blend-mode"] = e;
    }, initBaseData: function(e, r, a) {
      this.globalData = r, this.comp = a, this.data = e, this.layerId = createElementID(), this.data.sr || (this.data.sr = 1), this.effectsManager = new EffectsManager(this.data, this, this.dynamicProperties);
    }, getType: function() {
      return this.type;
    }, sourceRectAtTime: function() {
    } }, FrameElement.prototype = { initFrame: function() {
      this._isFirstFrame = !1, this.dynamicProperties = [], this._mdf = !1;
    }, prepareProperties: function(e, r) {
      var a, i = this.dynamicProperties.length;
      for (a = 0; a < i; a += 1)
        (r || this._isParent && this.dynamicProperties[a].propType === "transform") && (this.dynamicProperties[a].getValue(), this.dynamicProperties[a]._mdf && (this.globalData._mdf = !0, this._mdf = !0));
    }, addDynamicProperty: function(e) {
      this.dynamicProperties.indexOf(e) === -1 && this.dynamicProperties.push(e);
    } };
    var FootageInterface = (dataInterfaceFactory = function(e) {
      function r(a) {
        return a === "Outline" ? r.outlineInterface() : null;
      }
      return r._name = "Outline", r.outlineInterface = function(a) {
        var i = "", s = a.getFootageData();
        function n(u) {
          if (s[u])
            return i = u, _typeof$2(s = s[u]) === "object" ? n : s;
          var p = u.indexOf(i);
          if (p !== -1) {
            var b = parseInt(u.substr(p + i.length), 10);
            return _typeof$2(s = s[b]) === "object" ? n : s;
          }
          return "";
        }
        return function() {
          return i = "", s = a.getFootageData(), n;
        };
      }(e), r;
    }, function(e) {
      function r(a) {
        return a === "Data" ? r.dataInterface : null;
      }
      return r._name = "Data", r.dataInterface = dataInterfaceFactory(e), r;
    }), dataInterfaceFactory;
    function FootageElement(e, r, a) {
      this.initFrame(), this.initRenderable(), this.assetData = r.getAssetData(e.refId), this.footageData = r.imageLoader.getAsset(this.assetData), this.initBaseData(e, r, a);
    }
    function AudioElement(e, r, a) {
      this.initFrame(), this.initRenderable(), this.assetData = r.getAssetData(e.refId), this.initBaseData(e, r, a), this._isPlaying = !1, this._canPlay = !1;
      var i = this.globalData.getAssetsPath(this.assetData);
      this.audio = this.globalData.audioController.createAudio(i), this._currentTime = 0, this.globalData.audioController.addAudio(this), this._volumeMultiplier = 1, this._volume = 1, this._previousVolume = null, this.tm = e.tm ? PropertyFactory.getProp(this, e.tm, 0, r.frameRate, this) : { _placeholder: !0 }, this.lv = PropertyFactory.getProp(this, e.au && e.au.lv ? e.au.lv : { k: [100] }, 1, 0.01, this);
    }
    function BaseRenderer() {
    }
    function TransformElement() {
    }
    function MaskElement(e, r, a) {
      this.data = e, this.element = r, this.globalData = a, this.storedData = [], this.masksProperties = this.data.masksProperties || [], this.maskElement = null;
      var i, s, n = this.globalData.defs, u = this.masksProperties ? this.masksProperties.length : 0;
      this.viewData = createSizedArray(u), this.solidPath = "";
      var p, b, x, c, f, m, y = this.masksProperties, d = 0, l = [], o = createElementID(), g = "clipPath", _ = "clip-path";
      for (i = 0; i < u; i += 1)
        if ((y[i].mode !== "a" && y[i].mode !== "n" || y[i].inv || y[i].o.k !== 100 || y[i].o.x) && (g = "mask", _ = "mask"), y[i].mode !== "s" && y[i].mode !== "i" || d !== 0 ? x = null : ((x = createNS("rect")).setAttribute("fill", "#ffffff"), x.setAttribute("width", this.element.comp.data.w || 0), x.setAttribute("height", this.element.comp.data.h || 0), l.push(x)), s = createNS("path"), y[i].mode === "n")
          this.viewData[i] = { op: PropertyFactory.getProp(this.element, y[i].o, 0, 0.01, this.element), prop: ShapePropertyFactory.getShapeProp(this.element, y[i], 3), elem: s, lastPath: "" }, n.appendChild(s);
        else {
          var S;
          if (d += 1, s.setAttribute("fill", y[i].mode === "s" ? "#000000" : "#ffffff"), s.setAttribute("clip-rule", "nonzero"), y[i].x.k !== 0 ? (g = "mask", _ = "mask", m = PropertyFactory.getProp(this.element, y[i].x, 0, null, this.element), S = createElementID(), (c = createNS("filter")).setAttribute("id", S), (f = createNS("feMorphology")).setAttribute("operator", "erode"), f.setAttribute("in", "SourceGraphic"), f.setAttribute("radius", "0"), c.appendChild(f), n.appendChild(c), s.setAttribute("stroke", y[i].mode === "s" ? "#000000" : "#ffffff")) : (f = null, m = null), this.storedData[i] = { elem: s, x: m, expan: f, lastPath: "", lastOperator: "", filterId: S, lastRadius: 0 }, y[i].mode === "i") {
            b = l.length;
            var E = createNS("g");
            for (p = 0; p < b; p += 1)
              E.appendChild(l[p]);
            var P = createNS("mask");
            P.setAttribute("mask-type", "alpha"), P.setAttribute("id", o + "_" + d), P.appendChild(s), n.appendChild(P), E.setAttribute("mask", "url(" + getLocationHref() + "#" + o + "_" + d + ")"), l.length = 0, l.push(E);
          } else
            l.push(s);
          y[i].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[i] = { elem: s, lastPath: "", op: PropertyFactory.getProp(this.element, y[i].o, 0, 0.01, this.element), prop: ShapePropertyFactory.getShapeProp(this.element, y[i], 3), invRect: x }, this.viewData[i].prop.k || this.drawPath(y[i], this.viewData[i].prop.v, this.viewData[i]);
        }
      for (this.maskElement = createNS(g), u = l.length, i = 0; i < u; i += 1)
        this.maskElement.appendChild(l[i]);
      d > 0 && (this.maskElement.setAttribute("id", o), this.element.maskedElement.setAttribute(_, "url(" + getLocationHref() + "#" + o + ")"), n.appendChild(this.maskElement)), this.viewData.length && this.element.addRenderableComponent(this);
    }
    FootageElement.prototype.prepareFrame = function() {
    }, extendPrototype([RenderableElement, BaseElement, FrameElement], FootageElement), FootageElement.prototype.getBaseElement = function() {
      return null;
    }, FootageElement.prototype.renderFrame = function() {
    }, FootageElement.prototype.destroy = function() {
    }, FootageElement.prototype.initExpressions = function() {
      this.layerInterface = FootageInterface(this);
    }, FootageElement.prototype.getFootageData = function() {
      return this.footageData;
    }, AudioElement.prototype.prepareFrame = function(e) {
      if (this.prepareRenderableFrame(e, !0), this.prepareProperties(e, !0), this.tm._placeholder)
        this._currentTime = e / this.data.sr;
      else {
        var r = this.tm.v;
        this._currentTime = r;
      }
      this._volume = this.lv.v[0];
      var a = this._volume * this._volumeMultiplier;
      this._previousVolume !== a && (this._previousVolume = a, this.audio.volume(a));
    }, extendPrototype([RenderableElement, BaseElement, FrameElement], AudioElement), AudioElement.prototype.renderFrame = function() {
      this.isInRange && this._canPlay && (this._isPlaying ? (!this.audio.playing() || Math.abs(this._currentTime / this.globalData.frameRate - this.audio.seek()) > 0.1) && this.audio.seek(this._currentTime / this.globalData.frameRate) : (this.audio.play(), this.audio.seek(this._currentTime / this.globalData.frameRate), this._isPlaying = !0));
    }, AudioElement.prototype.show = function() {
    }, AudioElement.prototype.hide = function() {
      this.audio.pause(), this._isPlaying = !1;
    }, AudioElement.prototype.pause = function() {
      this.audio.pause(), this._isPlaying = !1, this._canPlay = !1;
    }, AudioElement.prototype.resume = function() {
      this._canPlay = !0;
    }, AudioElement.prototype.setRate = function(e) {
      this.audio.rate(e);
    }, AudioElement.prototype.volume = function(e) {
      this._volumeMultiplier = e, this._previousVolume = e * this._volume, this.audio.volume(this._previousVolume);
    }, AudioElement.prototype.getBaseElement = function() {
      return null;
    }, AudioElement.prototype.destroy = function() {
    }, AudioElement.prototype.sourceRectAtTime = function() {
    }, AudioElement.prototype.initExpressions = function() {
    }, BaseRenderer.prototype.checkLayers = function(e) {
      var r, a, i = this.layers.length;
      for (this.completeLayers = !0, r = i - 1; r >= 0; r -= 1)
        this.elements[r] || (a = this.layers[r]).ip - a.st <= e - this.layers[r].st && a.op - a.st > e - this.layers[r].st && this.buildItem(r), this.completeLayers = !!this.elements[r] && this.completeLayers;
      this.checkPendingElements();
    }, BaseRenderer.prototype.createItem = function(e) {
      switch (e.ty) {
        case 2:
          return this.createImage(e);
        case 0:
          return this.createComp(e);
        case 1:
          return this.createSolid(e);
        case 3:
        default:
          return this.createNull(e);
        case 4:
          return this.createShape(e);
        case 5:
          return this.createText(e);
        case 6:
          return this.createAudio(e);
        case 13:
          return this.createCamera(e);
        case 15:
          return this.createFootage(e);
      }
    }, BaseRenderer.prototype.createCamera = function() {
      throw new Error("You're using a 3d camera. Try the html renderer.");
    }, BaseRenderer.prototype.createAudio = function(e) {
      return new AudioElement(e, this.globalData, this);
    }, BaseRenderer.prototype.createFootage = function(e) {
      return new FootageElement(e, this.globalData, this);
    }, BaseRenderer.prototype.buildAllItems = function() {
      var e, r = this.layers.length;
      for (e = 0; e < r; e += 1)
        this.buildItem(e);
      this.checkPendingElements();
    }, BaseRenderer.prototype.includeLayers = function(e) {
      var r;
      this.completeLayers = !1;
      var a, i = e.length, s = this.layers.length;
      for (r = 0; r < i; r += 1)
        for (a = 0; a < s; ) {
          if (this.layers[a].id === e[r].id) {
            this.layers[a] = e[r];
            break;
          }
          a += 1;
        }
    }, BaseRenderer.prototype.setProjectInterface = function(e) {
      this.globalData.projectInterface = e;
    }, BaseRenderer.prototype.initItems = function() {
      this.globalData.progressiveLoad || this.buildAllItems();
    }, BaseRenderer.prototype.buildElementParenting = function(e, r, a) {
      for (var i = this.elements, s = this.layers, n = 0, u = s.length; n < u; )
        s[n].ind == r && (i[n] && i[n] !== !0 ? (a.push(i[n]), i[n].setAsParent(), s[n].parent !== void 0 ? this.buildElementParenting(e, s[n].parent, a) : e.setHierarchy(a)) : (this.buildItem(n), this.addPendingElement(e))), n += 1;
    }, BaseRenderer.prototype.addPendingElement = function(e) {
      this.pendingElements.push(e);
    }, BaseRenderer.prototype.searchExtraCompositions = function(e) {
      var r, a = e.length;
      for (r = 0; r < a; r += 1)
        if (e[r].xt) {
          var i = this.createComp(e[r]);
          i.initExpressions(), this.globalData.projectInterface.registerComposition(i);
        }
    }, BaseRenderer.prototype.getElementByPath = function(e) {
      var r, a = e.shift();
      if (typeof a == "number")
        r = this.elements[a];
      else {
        var i, s = this.elements.length;
        for (i = 0; i < s; i += 1)
          if (this.elements[i].data.nm === a) {
            r = this.elements[i];
            break;
          }
      }
      return e.length === 0 ? r : r.getElementByPath(e);
    }, BaseRenderer.prototype.setupGlobalData = function(e, r) {
      this.globalData.fontManager = new FontManager(), this.globalData.fontManager.addChars(e.chars), this.globalData.fontManager.addFonts(e.fonts, r), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem), this.globalData.imageLoader = this.animationItem.imagePreloader, this.globalData.audioController = this.animationItem.audioController, this.globalData.frameId = 0, this.globalData.frameRate = e.fr, this.globalData.nm = e.nm, this.globalData.compSize = { w: e.w, h: e.h };
    }, TransformElement.prototype = { initTransform: function() {
      this.finalTransform = { mProp: this.data.ks ? TransformPropertyFactory.getTransformProperty(this, this.data.ks, this) : { o: 0 }, _matMdf: !1, _opMdf: !1, mat: new Matrix() }, this.data.ao && (this.finalTransform.mProp.autoOriented = !0), this.data.ty;
    }, renderTransform: function() {
      if (this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame, this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame, this.hierarchy) {
        var e, r = this.finalTransform.mat, a = 0, i = this.hierarchy.length;
        if (!this.finalTransform._matMdf)
          for (; a < i; ) {
            if (this.hierarchy[a].finalTransform.mProp._mdf) {
              this.finalTransform._matMdf = !0;
              break;
            }
            a += 1;
          }
        if (this.finalTransform._matMdf)
          for (e = this.finalTransform.mProp.v.props, r.cloneFromProps(e), a = 0; a < i; a += 1)
            e = this.hierarchy[a].finalTransform.mProp.v.props, r.transform(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]);
      }
    }, globalToLocal: function(e) {
      var r = [];
      r.push(this.finalTransform);
      for (var a, i = !0, s = this.comp; i; )
        s.finalTransform ? (s.data.hasMask && r.splice(0, 0, s.finalTransform), s = s.comp) : i = !1;
      var n, u = r.length;
      for (a = 0; a < u; a += 1)
        n = r[a].mat.applyToPointArray(0, 0, 0), e = [e[0] - n[0], e[1] - n[1], 0];
      return e;
    }, mHelper: new Matrix() }, MaskElement.prototype.getMaskProperty = function(e) {
      return this.viewData[e].prop;
    }, MaskElement.prototype.renderFrame = function(e) {
      var r, a = this.element.finalTransform.mat, i = this.masksProperties.length;
      for (r = 0; r < i; r += 1)
        if ((this.viewData[r].prop._mdf || e) && this.drawPath(this.masksProperties[r], this.viewData[r].prop.v, this.viewData[r]), (this.viewData[r].op._mdf || e) && this.viewData[r].elem.setAttribute("fill-opacity", this.viewData[r].op.v), this.masksProperties[r].mode !== "n" && (this.viewData[r].invRect && (this.element.finalTransform.mProp._mdf || e) && this.viewData[r].invRect.setAttribute("transform", a.getInverseMatrix().to2dCSS()), this.storedData[r].x && (this.storedData[r].x._mdf || e))) {
          var s = this.storedData[r].expan;
          this.storedData[r].x.v < 0 ? (this.storedData[r].lastOperator !== "erode" && (this.storedData[r].lastOperator = "erode", this.storedData[r].elem.setAttribute("filter", "url(" + getLocationHref() + "#" + this.storedData[r].filterId + ")")), s.setAttribute("radius", -this.storedData[r].x.v)) : (this.storedData[r].lastOperator !== "dilate" && (this.storedData[r].lastOperator = "dilate", this.storedData[r].elem.setAttribute("filter", null)), this.storedData[r].elem.setAttribute("stroke-width", 2 * this.storedData[r].x.v));
        }
    }, MaskElement.prototype.getMaskelement = function() {
      return this.maskElement;
    }, MaskElement.prototype.createLayerSolidPath = function() {
      var e = "M0,0 ";
      return e += " h" + this.globalData.compSize.w, e += " v" + this.globalData.compSize.h, e += " h-" + this.globalData.compSize.w, e += " v-" + this.globalData.compSize.h + " ";
    }, MaskElement.prototype.drawPath = function(e, r, a) {
      var i, s, n = " M" + r.v[0][0] + "," + r.v[0][1];
      for (s = r._length, i = 1; i < s; i += 1)
        n += " C" + r.o[i - 1][0] + "," + r.o[i - 1][1] + " " + r.i[i][0] + "," + r.i[i][1] + " " + r.v[i][0] + "," + r.v[i][1];
      if (r.c && s > 1 && (n += " C" + r.o[i - 1][0] + "," + r.o[i - 1][1] + " " + r.i[0][0] + "," + r.i[0][1] + " " + r.v[0][0] + "," + r.v[0][1]), a.lastPath !== n) {
        var u = "";
        a.elem && (r.c && (u = e.inv ? this.solidPath + n : n), a.elem.setAttribute("d", u)), a.lastPath = n;
      }
    }, MaskElement.prototype.destroy = function() {
      this.element = null, this.globalData = null, this.maskElement = null, this.data = null, this.masksProperties = null;
    };
    var filtersFactory = function() {
      var e = { createFilter: function(r, a) {
        var i = createNS("filter");
        return i.setAttribute("id", r), a !== !0 && (i.setAttribute("filterUnits", "objectBoundingBox"), i.setAttribute("x", "0%"), i.setAttribute("y", "0%"), i.setAttribute("width", "100%"), i.setAttribute("height", "100%")), i;
      }, createAlphaToLuminanceFilter: function() {
        var r = createNS("feColorMatrix");
        return r.setAttribute("type", "matrix"), r.setAttribute("color-interpolation-filters", "sRGB"), r.setAttribute("values", "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1"), r;
      } };
      return e;
    }(), featureSupport = function() {
      var e = { maskType: !0 };
      return (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) && (e.maskType = !1), e;
    }(), registeredEffects = {}, idPrefix = "filter_result_";
    function SVGEffects(e) {
      var r, a, i = "SourceGraphic", s = e.data.ef ? e.data.ef.length : 0, n = createElementID(), u = filtersFactory.createFilter(n, !0), p = 0;
      for (this.filters = [], r = 0; r < s; r += 1) {
        a = null;
        var b = e.data.ef[r].ty;
        registeredEffects[b] && (a = new registeredEffects[b].effect(u, e.effectsManager.effectElements[r], e, idPrefix + p, i), i = idPrefix + p, registeredEffects[b].countsAsEffect && (p += 1)), a && this.filters.push(a);
      }
      p && (e.globalData.defs.appendChild(u), e.layerElement.setAttribute("filter", "url(" + getLocationHref() + "#" + n + ")")), this.filters.length && e.addRenderableComponent(this);
    }
    function registerEffect(e, r, a) {
      registeredEffects[e] = { effect: r, countsAsEffect: a };
    }
    function SVGBaseElement() {
    }
    function HierarchyElement() {
    }
    function RenderableDOMElement() {
    }
    function IImageElement(e, r, a) {
      this.assetData = r.getAssetData(e.refId), this.initElement(e, r, a), this.sourceRect = { top: 0, left: 0, width: this.assetData.w, height: this.assetData.h };
    }
    function ProcessedElement(e, r) {
      this.elem = e, this.pos = r;
    }
    function IShapeElement() {
    }
    SVGEffects.prototype.renderFrame = function(e) {
      var r, a = this.filters.length;
      for (r = 0; r < a; r += 1)
        this.filters[r].renderFrame(e);
    }, SVGBaseElement.prototype = { initRendererElement: function() {
      this.layerElement = createNS("g");
    }, createContainerElements: function() {
      this.matteElement = createNS("g"), this.transformedElement = this.layerElement, this.maskedElement = this.layerElement, this._sizeChanged = !1;
      var e, r, a, i = null;
      if (this.data.td) {
        if (this.data.td == 3 || this.data.td == 1) {
          var s = createNS("mask");
          s.setAttribute("id", this.layerId), s.setAttribute("mask-type", this.data.td == 3 ? "luminance" : "alpha"), s.appendChild(this.layerElement), i = s, this.globalData.defs.appendChild(s), featureSupport.maskType || this.data.td != 1 || (s.setAttribute("mask-type", "luminance"), e = createElementID(), r = filtersFactory.createFilter(e), this.globalData.defs.appendChild(r), r.appendChild(filtersFactory.createAlphaToLuminanceFilter()), (a = createNS("g")).appendChild(this.layerElement), i = a, s.appendChild(a), a.setAttribute("filter", "url(" + getLocationHref() + "#" + e + ")"));
        } else if (this.data.td == 2) {
          var n = createNS("mask");
          n.setAttribute("id", this.layerId), n.setAttribute("mask-type", "alpha");
          var u = createNS("g");
          n.appendChild(u), e = createElementID(), r = filtersFactory.createFilter(e);
          var p = createNS("feComponentTransfer");
          p.setAttribute("in", "SourceGraphic"), r.appendChild(p);
          var b = createNS("feFuncA");
          b.setAttribute("type", "table"), b.setAttribute("tableValues", "1.0 0.0"), p.appendChild(b), this.globalData.defs.appendChild(r);
          var x = createNS("rect");
          x.setAttribute("width", this.comp.data.w), x.setAttribute("height", this.comp.data.h), x.setAttribute("x", "0"), x.setAttribute("y", "0"), x.setAttribute("fill", "#ffffff"), x.setAttribute("opacity", "0"), u.setAttribute("filter", "url(" + getLocationHref() + "#" + e + ")"), u.appendChild(x), u.appendChild(this.layerElement), i = u, featureSupport.maskType || (n.setAttribute("mask-type", "luminance"), r.appendChild(filtersFactory.createAlphaToLuminanceFilter()), a = createNS("g"), u.appendChild(x), a.appendChild(this.layerElement), i = a, u.appendChild(a)), this.globalData.defs.appendChild(n);
        }
      } else
        this.data.tt ? (this.matteElement.appendChild(this.layerElement), i = this.matteElement, this.baseElement = this.matteElement) : this.baseElement = this.layerElement;
      if (this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), this.data.ty === 0 && !this.data.hd) {
        var c = createNS("clipPath"), f = createNS("path");
        f.setAttribute("d", "M0,0 L" + this.data.w + ",0 L" + this.data.w + "," + this.data.h + " L0," + this.data.h + "z");
        var m = createElementID();
        if (c.setAttribute("id", m), c.appendChild(f), this.globalData.defs.appendChild(c), this.checkMasks()) {
          var y = createNS("g");
          y.setAttribute("clip-path", "url(" + getLocationHref() + "#" + m + ")"), y.appendChild(this.layerElement), this.transformedElement = y, i ? i.appendChild(this.transformedElement) : this.baseElement = this.transformedElement;
        } else
          this.layerElement.setAttribute("clip-path", "url(" + getLocationHref() + "#" + m + ")");
      }
      this.data.bm !== 0 && this.setBlendMode();
    }, renderElement: function() {
      this.finalTransform._matMdf && this.transformedElement.setAttribute("transform", this.finalTransform.mat.to2dCSS()), this.finalTransform._opMdf && this.transformedElement.setAttribute("opacity", this.finalTransform.mProp.o.v);
    }, destroyBaseElement: function() {
      this.layerElement = null, this.matteElement = null, this.maskManager.destroy();
    }, getBaseElement: function() {
      return this.data.hd ? null : this.baseElement;
    }, createRenderableComponents: function() {
      this.maskManager = new MaskElement(this.data, this, this.globalData), this.renderableEffectsManager = new SVGEffects(this);
    }, setMatte: function(e) {
      this.matteElement && this.matteElement.setAttribute("mask", "url(" + getLocationHref() + "#" + e + ")");
    } }, HierarchyElement.prototype = { initHierarchy: function() {
      this.hierarchy = [], this._isParent = !1, this.checkParenting();
    }, setHierarchy: function(e) {
      this.hierarchy = e;
    }, setAsParent: function() {
      this._isParent = !0;
    }, checkParenting: function() {
      this.data.parent !== void 0 && this.comp.buildElementParenting(this, this.data.parent, []);
    } }, extendPrototype([RenderableElement, createProxyFunction({ initElement: function(e, r, a) {
      this.initFrame(), this.initBaseData(e, r, a), this.initTransform(e, r, a), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide();
    }, hide: function() {
      this.hidden || this.isInRange && !this.isTransparent || ((this.baseElement || this.layerElement).style.display = "none", this.hidden = !0);
    }, show: function() {
      this.isInRange && !this.isTransparent && (this.data.hd || ((this.baseElement || this.layerElement).style.display = "block"), this.hidden = !1, this._isFirstFrame = !0);
    }, renderFrame: function() {
      this.data.hd || this.hidden || (this.renderTransform(), this.renderRenderable(), this.renderElement(), this.renderInnerContent(), this._isFirstFrame && (this._isFirstFrame = !1));
    }, renderInnerContent: function() {
    }, prepareFrame: function(e) {
      this._mdf = !1, this.prepareRenderableFrame(e), this.prepareProperties(e, this.isInRange), this.checkTransparency();
    }, destroy: function() {
      this.innerElem = null, this.destroyBaseElement();
    } })], RenderableDOMElement), extendPrototype([BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement], IImageElement), IImageElement.prototype.createContent = function() {
      var e = this.globalData.getAssetsPath(this.assetData);
      this.innerElem = createNS("image"), this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), this.innerElem.setAttribute("preserveAspectRatio", this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio), this.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", e), this.layerElement.appendChild(this.innerElem);
    }, IImageElement.prototype.sourceRectAtTime = function() {
      return this.sourceRect;
    }, IShapeElement.prototype = { addShapeToModifiers: function(e) {
      var r, a = this.shapeModifiers.length;
      for (r = 0; r < a; r += 1)
        this.shapeModifiers[r].addShape(e);
    }, isShapeInAnimatedModifiers: function(e) {
      for (var r = this.shapeModifiers.length; 0 < r; )
        if (this.shapeModifiers[0].isAnimatedWithShape(e))
          return !0;
      return !1;
    }, renderModifiers: function() {
      if (this.shapeModifiers.length) {
        var e, r = this.shapes.length;
        for (e = 0; e < r; e += 1)
          this.shapes[e].sh.reset();
        for (e = (r = this.shapeModifiers.length) - 1; e >= 0 && !this.shapeModifiers[e].processShapes(this._isFirstFrame); e -= 1)
          ;
      }
    }, searchProcessedElement: function(e) {
      for (var r = this.processedElements, a = 0, i = r.length; a < i; ) {
        if (r[a].elem === e)
          return r[a].pos;
        a += 1;
      }
      return 0;
    }, addProcessedElement: function(e, r) {
      for (var a = this.processedElements, i = a.length; i; )
        if (a[i -= 1].elem === e)
          return void (a[i].pos = r);
      a.push(new ProcessedElement(e, r));
    }, prepareFrame: function(e) {
      this.prepareRenderableFrame(e), this.prepareProperties(e, this.isInRange);
    } };
    var lineCapEnum = { 1: "butt", 2: "round", 3: "square" }, lineJoinEnum = { 1: "miter", 2: "round", 3: "bevel" };
    function SVGShapeData(e, r, a) {
      this.caches = [], this.styles = [], this.transformers = e, this.lStr = "", this.sh = a, this.lvl = r, this._isAnimated = !!a.k;
      for (var i = 0, s = e.length; i < s; ) {
        if (e[i].mProps.dynamicProperties.length) {
          this._isAnimated = !0;
          break;
        }
        i += 1;
      }
    }
    function SVGStyleData(e, r) {
      this.data = e, this.type = e.ty, this.d = "", this.lvl = r, this._mdf = !1, this.closed = e.hd === !0, this.pElem = createNS("path"), this.msElem = null;
    }
    function DashProperty(e, r, a, i) {
      var s;
      this.elem = e, this.frameId = -1, this.dataProps = createSizedArray(r.length), this.renderer = a, this.k = !1, this.dashStr = "", this.dashArray = createTypedArray("float32", r.length ? r.length - 1 : 0), this.dashoffset = createTypedArray("float32", 1), this.initDynamicPropertyContainer(i);
      var n, u = r.length || 0;
      for (s = 0; s < u; s += 1)
        n = PropertyFactory.getProp(e, r[s].v, 0, 0, this), this.k = n.k || this.k, this.dataProps[s] = { n: r[s].n, p: n };
      this.k || this.getValue(!0), this._isAnimated = this.k;
    }
    function SVGStrokeStyleData(e, r, a) {
      this.initDynamicPropertyContainer(e), this.getValue = this.iterateDynamicProperties, this.o = PropertyFactory.getProp(e, r.o, 0, 0.01, this), this.w = PropertyFactory.getProp(e, r.w, 0, null, this), this.d = new DashProperty(e, r.d || {}, "svg", this), this.c = PropertyFactory.getProp(e, r.c, 1, 255, this), this.style = a, this._isAnimated = !!this._isAnimated;
    }
    function SVGFillStyleData(e, r, a) {
      this.initDynamicPropertyContainer(e), this.getValue = this.iterateDynamicProperties, this.o = PropertyFactory.getProp(e, r.o, 0, 0.01, this), this.c = PropertyFactory.getProp(e, r.c, 1, 255, this), this.style = a;
    }
    function SVGNoStyleData(e, r, a) {
      this.initDynamicPropertyContainer(e), this.getValue = this.iterateDynamicProperties, this.style = a;
    }
    function GradientProperty(e, r, a) {
      this.data = r, this.c = createTypedArray("uint8c", 4 * r.p);
      var i = r.k.k[0].s ? r.k.k[0].s.length - 4 * r.p : r.k.k.length - 4 * r.p;
      this.o = createTypedArray("float32", i), this._cmdf = !1, this._omdf = !1, this._collapsable = this.checkCollapsable(), this._hasOpacity = i, this.initDynamicPropertyContainer(a), this.prop = PropertyFactory.getProp(e, r.k, 1, null, this), this.k = this.prop.k, this.getValue(!0);
    }
    function SVGGradientFillStyleData(e, r, a) {
      this.initDynamicPropertyContainer(e), this.getValue = this.iterateDynamicProperties, this.initGradientData(e, r, a);
    }
    function SVGGradientStrokeStyleData(e, r, a) {
      this.initDynamicPropertyContainer(e), this.getValue = this.iterateDynamicProperties, this.w = PropertyFactory.getProp(e, r.w, 0, null, this), this.d = new DashProperty(e, r.d || {}, "svg", this), this.initGradientData(e, r, a), this._isAnimated = !!this._isAnimated;
    }
    function ShapeGroupData() {
      this.it = [], this.prevViewData = [], this.gr = createNS("g");
    }
    function SVGTransformData(e, r, a) {
      this.transform = { mProps: e, op: r, container: a }, this.elements = [], this._isAnimated = this.transform.mProps.dynamicProperties.length || this.transform.op.effectsSequence.length;
    }
    SVGShapeData.prototype.setAsAnimated = function() {
      this._isAnimated = !0;
    }, SVGStyleData.prototype.reset = function() {
      this.d = "", this._mdf = !1;
    }, DashProperty.prototype.getValue = function(e) {
      if ((this.elem.globalData.frameId !== this.frameId || e) && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf = this._mdf || e, this._mdf)) {
        var r = 0, a = this.dataProps.length;
        for (this.renderer === "svg" && (this.dashStr = ""), r = 0; r < a; r += 1)
          this.dataProps[r].n !== "o" ? this.renderer === "svg" ? this.dashStr += " " + this.dataProps[r].p.v : this.dashArray[r] = this.dataProps[r].p.v : this.dashoffset[0] = this.dataProps[r].p.v;
      }
    }, extendPrototype([DynamicPropertyContainer], DashProperty), extendPrototype([DynamicPropertyContainer], SVGStrokeStyleData), extendPrototype([DynamicPropertyContainer], SVGFillStyleData), extendPrototype([DynamicPropertyContainer], SVGNoStyleData), GradientProperty.prototype.comparePoints = function(e, r) {
      for (var a = 0, i = this.o.length / 2; a < i; ) {
        if (Math.abs(e[4 * a] - e[4 * r + 2 * a]) > 0.01)
          return !1;
        a += 1;
      }
      return !0;
    }, GradientProperty.prototype.checkCollapsable = function() {
      if (this.o.length / 2 != this.c.length / 4)
        return !1;
      if (this.data.k.k[0].s)
        for (var e = 0, r = this.data.k.k.length; e < r; ) {
          if (!this.comparePoints(this.data.k.k[e].s, this.data.p))
            return !1;
          e += 1;
        }
      else if (!this.comparePoints(this.data.k.k, this.data.p))
        return !1;
      return !0;
    }, GradientProperty.prototype.getValue = function(e) {
      if (this.prop.getValue(), this._mdf = !1, this._cmdf = !1, this._omdf = !1, this.prop._mdf || e) {
        var r, a, i, s = 4 * this.data.p;
        for (r = 0; r < s; r += 1)
          a = r % 4 == 0 ? 100 : 255, i = Math.round(this.prop.v[r] * a), this.c[r] !== i && (this.c[r] = i, this._cmdf = !e);
        if (this.o.length)
          for (s = this.prop.v.length, r = 4 * this.data.p; r < s; r += 1)
            a = r % 2 == 0 ? 100 : 1, i = r % 2 == 0 ? Math.round(100 * this.prop.v[r]) : this.prop.v[r], this.o[r - 4 * this.data.p] !== i && (this.o[r - 4 * this.data.p] = i, this._omdf = !e);
        this._mdf = !e;
      }
    }, extendPrototype([DynamicPropertyContainer], GradientProperty), SVGGradientFillStyleData.prototype.initGradientData = function(e, r, a) {
      this.o = PropertyFactory.getProp(e, r.o, 0, 0.01, this), this.s = PropertyFactory.getProp(e, r.s, 1, null, this), this.e = PropertyFactory.getProp(e, r.e, 1, null, this), this.h = PropertyFactory.getProp(e, r.h || { k: 0 }, 0, 0.01, this), this.a = PropertyFactory.getProp(e, r.a || { k: 0 }, 0, degToRads, this), this.g = new GradientProperty(e, r.g, this), this.style = a, this.stops = [], this.setGradientData(a.pElem, r), this.setGradientOpacity(r, a), this._isAnimated = !!this._isAnimated;
    }, SVGGradientFillStyleData.prototype.setGradientData = function(e, r) {
      var a = createElementID(), i = createNS(r.t === 1 ? "linearGradient" : "radialGradient");
      i.setAttribute("id", a), i.setAttribute("spreadMethod", "pad"), i.setAttribute("gradientUnits", "userSpaceOnUse");
      var s, n, u, p = [];
      for (u = 4 * r.g.p, n = 0; n < u; n += 4)
        s = createNS("stop"), i.appendChild(s), p.push(s);
      e.setAttribute(r.ty === "gf" ? "fill" : "stroke", "url(" + getLocationHref() + "#" + a + ")"), this.gf = i, this.cst = p;
    }, SVGGradientFillStyleData.prototype.setGradientOpacity = function(e, r) {
      if (this.g._hasOpacity && !this.g._collapsable) {
        var a, i, s, n = createNS("mask"), u = createNS("path");
        n.appendChild(u);
        var p = createElementID(), b = createElementID();
        n.setAttribute("id", b);
        var x = createNS(e.t === 1 ? "linearGradient" : "radialGradient");
        x.setAttribute("id", p), x.setAttribute("spreadMethod", "pad"), x.setAttribute("gradientUnits", "userSpaceOnUse"), s = e.g.k.k[0].s ? e.g.k.k[0].s.length : e.g.k.k.length;
        var c = this.stops;
        for (i = 4 * e.g.p; i < s; i += 2)
          (a = createNS("stop")).setAttribute("stop-color", "rgb(255,255,255)"), x.appendChild(a), c.push(a);
        u.setAttribute(e.ty === "gf" ? "fill" : "stroke", "url(" + getLocationHref() + "#" + p + ")"), e.ty === "gs" && (u.setAttribute("stroke-linecap", lineCapEnum[e.lc || 2]), u.setAttribute("stroke-linejoin", lineJoinEnum[e.lj || 2]), e.lj === 1 && u.setAttribute("stroke-miterlimit", e.ml)), this.of = x, this.ms = n, this.ost = c, this.maskId = b, r.msElem = u;
      }
    }, extendPrototype([DynamicPropertyContainer], SVGGradientFillStyleData), extendPrototype([SVGGradientFillStyleData, DynamicPropertyContainer], SVGGradientStrokeStyleData);
    var buildShapeString = function(e, r, a, i) {
      if (r === 0)
        return "";
      var s, n = e.o, u = e.i, p = e.v, b = " M" + i.applyToPointStringified(p[0][0], p[0][1]);
      for (s = 1; s < r; s += 1)
        b += " C" + i.applyToPointStringified(n[s - 1][0], n[s - 1][1]) + " " + i.applyToPointStringified(u[s][0], u[s][1]) + " " + i.applyToPointStringified(p[s][0], p[s][1]);
      return a && r && (b += " C" + i.applyToPointStringified(n[s - 1][0], n[s - 1][1]) + " " + i.applyToPointStringified(u[0][0], u[0][1]) + " " + i.applyToPointStringified(p[0][0], p[0][1]), b += "z"), b;
    }, SVGElementsRenderer = function() {
      var e = new Matrix(), r = new Matrix();
      function a(x, c, f) {
        (f || c.transform.op._mdf) && c.transform.container.setAttribute("opacity", c.transform.op.v), (f || c.transform.mProps._mdf) && c.transform.container.setAttribute("transform", c.transform.mProps.v.to2dCSS());
      }
      function i() {
      }
      function s(x, c, f) {
        var m, y, d, l, o, g, _, S, E, P, k, C = c.styles.length, A = c.lvl;
        for (g = 0; g < C; g += 1) {
          if (l = c.sh._mdf || f, c.styles[g].lvl < A) {
            for (S = r.reset(), P = A - c.styles[g].lvl, k = c.transformers.length - 1; !l && P > 0; )
              l = c.transformers[k].mProps._mdf || l, P -= 1, k -= 1;
            if (l)
              for (P = A - c.styles[g].lvl, k = c.transformers.length - 1; P > 0; )
                E = c.transformers[k].mProps.v.props, S.transform(E[0], E[1], E[2], E[3], E[4], E[5], E[6], E[7], E[8], E[9], E[10], E[11], E[12], E[13], E[14], E[15]), P -= 1, k -= 1;
          } else
            S = e;
          if (y = (_ = c.sh.paths)._length, l) {
            for (d = "", m = 0; m < y; m += 1)
              (o = _.shapes[m]) && o._length && (d += buildShapeString(o, o._length, o.c, S));
            c.caches[g] = d;
          } else
            d = c.caches[g];
          c.styles[g].d += x.hd === !0 ? "" : d, c.styles[g]._mdf = l || c.styles[g]._mdf;
        }
      }
      function n(x, c, f) {
        var m = c.style;
        (c.c._mdf || f) && m.pElem.setAttribute("fill", "rgb(" + bmFloor(c.c.v[0]) + "," + bmFloor(c.c.v[1]) + "," + bmFloor(c.c.v[2]) + ")"), (c.o._mdf || f) && m.pElem.setAttribute("fill-opacity", c.o.v);
      }
      function u(x, c, f) {
        p(x, c, f), b(0, c, f);
      }
      function p(x, c, f) {
        var m, y, d, l, o, g = c.gf, _ = c.g._hasOpacity, S = c.s.v, E = c.e.v;
        if (c.o._mdf || f) {
          var P = x.ty === "gf" ? "fill-opacity" : "stroke-opacity";
          c.style.pElem.setAttribute(P, c.o.v);
        }
        if (c.s._mdf || f) {
          var k = x.t === 1 ? "x1" : "cx", C = k === "x1" ? "y1" : "cy";
          g.setAttribute(k, S[0]), g.setAttribute(C, S[1]), _ && !c.g._collapsable && (c.of.setAttribute(k, S[0]), c.of.setAttribute(C, S[1]));
        }
        if (c.g._cmdf || f) {
          m = c.cst;
          var A = c.g.c;
          for (d = m.length, y = 0; y < d; y += 1)
            (l = m[y]).setAttribute("offset", A[4 * y] + "%"), l.setAttribute("stop-color", "rgb(" + A[4 * y + 1] + "," + A[4 * y + 2] + "," + A[4 * y + 3] + ")");
        }
        if (_ && (c.g._omdf || f)) {
          var M = c.g.o;
          for (d = (m = c.g._collapsable ? c.cst : c.ost).length, y = 0; y < d; y += 1)
            l = m[y], c.g._collapsable || l.setAttribute("offset", M[2 * y] + "%"), l.setAttribute("stop-opacity", M[2 * y + 1]);
        }
        if (x.t === 1)
          (c.e._mdf || f) && (g.setAttribute("x2", E[0]), g.setAttribute("y2", E[1]), _ && !c.g._collapsable && (c.of.setAttribute("x2", E[0]), c.of.setAttribute("y2", E[1])));
        else if ((c.s._mdf || c.e._mdf || f) && (o = Math.sqrt(Math.pow(S[0] - E[0], 2) + Math.pow(S[1] - E[1], 2)), g.setAttribute("r", o), _ && !c.g._collapsable && c.of.setAttribute("r", o)), c.e._mdf || c.h._mdf || c.a._mdf || f) {
          o || (o = Math.sqrt(Math.pow(S[0] - E[0], 2) + Math.pow(S[1] - E[1], 2)));
          var I = Math.atan2(E[1] - S[1], E[0] - S[0]), D = c.h.v;
          D >= 1 ? D = 0.99 : D <= -1 && (D = -0.99);
          var L = o * D, R = Math.cos(I + c.a.v) * L + S[0], V = Math.sin(I + c.a.v) * L + S[1];
          g.setAttribute("fx", R), g.setAttribute("fy", V), _ && !c.g._collapsable && (c.of.setAttribute("fx", R), c.of.setAttribute("fy", V));
        }
      }
      function b(x, c, f) {
        var m = c.style, y = c.d;
        y && (y._mdf || f) && y.dashStr && (m.pElem.setAttribute("stroke-dasharray", y.dashStr), m.pElem.setAttribute("stroke-dashoffset", y.dashoffset[0])), c.c && (c.c._mdf || f) && m.pElem.setAttribute("stroke", "rgb(" + bmFloor(c.c.v[0]) + "," + bmFloor(c.c.v[1]) + "," + bmFloor(c.c.v[2]) + ")"), (c.o._mdf || f) && m.pElem.setAttribute("stroke-opacity", c.o.v), (c.w._mdf || f) && (m.pElem.setAttribute("stroke-width", c.w.v), m.msElem && m.msElem.setAttribute("stroke-width", c.w.v));
      }
      return { createRenderFunction: function(x) {
        switch (x.ty) {
          case "fl":
            return n;
          case "gf":
            return p;
          case "gs":
            return u;
          case "st":
            return b;
          case "sh":
          case "el":
          case "rc":
          case "sr":
            return s;
          case "tr":
            return a;
          case "no":
            return i;
          default:
            return null;
        }
      } };
    }();
    function SVGShapeElement(e, r, a) {
      this.shapes = [], this.shapesData = e.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.initElement(e, r, a), this.prevViewData = [];
    }
    function LetterProps(e, r, a, i, s, n) {
      this.o = e, this.sw = r, this.sc = a, this.fc = i, this.m = s, this.p = n, this._mdf = { o: !0, sw: !!r, sc: !!a, fc: !!i, m: !0, p: !0 };
    }
    function TextProperty(e, r) {
      this._frameId = initialDefaultFrame, this.pv = "", this.v = "", this.kf = !1, this._isFirstFrame = !0, this._mdf = !1, this.data = r, this.elem = e, this.comp = this.elem.comp, this.keysIndex = 0, this.canResize = !1, this.minimumFontSize = 1, this.effectsSequence = [], this.currentData = { ascent: 0, boxWidth: this.defaultBoxWidth, f: "", fStyle: "", fWeight: "", fc: "", j: "", justifyOffset: "", l: [], lh: 0, lineWidths: [], ls: "", of: "", s: "", sc: "", sw: 0, t: 0, tr: 0, sz: 0, ps: null, fillColorAnim: !1, strokeColorAnim: !1, strokeWidthAnim: !1, yOffset: 0, finalSize: 0, finalText: [], finalLineHeight: 0, __complete: !1 }, this.copyData(this.currentData, this.data.d.k[0].s), this.searchProperty() || this.completeTextData(this.currentData);
    }
    extendPrototype([BaseElement, TransformElement, SVGBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableDOMElement], SVGShapeElement), SVGShapeElement.prototype.initSecondaryElement = function() {
    }, SVGShapeElement.prototype.identityMatrix = new Matrix(), SVGShapeElement.prototype.buildExpressionInterface = function() {
    }, SVGShapeElement.prototype.createContent = function() {
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes();
    }, SVGShapeElement.prototype.filterUniqueShapes = function() {
      var e, r, a, i, s = this.shapes.length, n = this.stylesList.length, u = [], p = !1;
      for (a = 0; a < n; a += 1) {
        for (i = this.stylesList[a], p = !1, u.length = 0, e = 0; e < s; e += 1)
          (r = this.shapes[e]).styles.indexOf(i) !== -1 && (u.push(r), p = r._isAnimated || p);
        u.length > 1 && p && this.setShapesAsAnimated(u);
      }
    }, SVGShapeElement.prototype.setShapesAsAnimated = function(e) {
      var r, a = e.length;
      for (r = 0; r < a; r += 1)
        e[r].setAsAnimated();
    }, SVGShapeElement.prototype.createStyleElement = function(e, r) {
      var a, i = new SVGStyleData(e, r), s = i.pElem;
      return e.ty === "st" ? a = new SVGStrokeStyleData(this, e, i) : e.ty === "fl" ? a = new SVGFillStyleData(this, e, i) : e.ty === "gf" || e.ty === "gs" ? (a = new (e.ty === "gf" ? SVGGradientFillStyleData : SVGGradientStrokeStyleData)(this, e, i), this.globalData.defs.appendChild(a.gf), a.maskId && (this.globalData.defs.appendChild(a.ms), this.globalData.defs.appendChild(a.of), s.setAttribute("mask", "url(" + getLocationHref() + "#" + a.maskId + ")"))) : e.ty === "no" && (a = new SVGNoStyleData(this, e, i)), e.ty !== "st" && e.ty !== "gs" || (s.setAttribute("stroke-linecap", lineCapEnum[e.lc || 2]), s.setAttribute("stroke-linejoin", lineJoinEnum[e.lj || 2]), s.setAttribute("fill-opacity", "0"), e.lj === 1 && s.setAttribute("stroke-miterlimit", e.ml)), e.r === 2 && s.setAttribute("fill-rule", "evenodd"), e.ln && s.setAttribute("id", e.ln), e.cl && s.setAttribute("class", e.cl), e.bm && (s.style["mix-blend-mode"] = getBlendMode(e.bm)), this.stylesList.push(i), this.addToAnimatedContents(e, a), a;
    }, SVGShapeElement.prototype.createGroupElement = function(e) {
      var r = new ShapeGroupData();
      return e.ln && r.gr.setAttribute("id", e.ln), e.cl && r.gr.setAttribute("class", e.cl), e.bm && (r.gr.style["mix-blend-mode"] = getBlendMode(e.bm)), r;
    }, SVGShapeElement.prototype.createTransformElement = function(e, r) {
      var a = TransformPropertyFactory.getTransformProperty(this, e, this), i = new SVGTransformData(a, a.o, r);
      return this.addToAnimatedContents(e, i), i;
    }, SVGShapeElement.prototype.createShapeElement = function(e, r, a) {
      var i = 4;
      e.ty === "rc" ? i = 5 : e.ty === "el" ? i = 6 : e.ty === "sr" && (i = 7);
      var s = new SVGShapeData(r, a, ShapePropertyFactory.getShapeProp(this, e, i, this));
      return this.shapes.push(s), this.addShapeToModifiers(s), this.addToAnimatedContents(e, s), s;
    }, SVGShapeElement.prototype.addToAnimatedContents = function(e, r) {
      for (var a = 0, i = this.animatedContents.length; a < i; ) {
        if (this.animatedContents[a].element === r)
          return;
        a += 1;
      }
      this.animatedContents.push({ fn: SVGElementsRenderer.createRenderFunction(e), element: r, data: e });
    }, SVGShapeElement.prototype.setElementStyles = function(e) {
      var r, a = e.styles, i = this.stylesList.length;
      for (r = 0; r < i; r += 1)
        this.stylesList[r].closed || a.push(this.stylesList[r]);
    }, SVGShapeElement.prototype.reloadShapes = function() {
      var e;
      this._isFirstFrame = !0;
      var r = this.itemsData.length;
      for (e = 0; e < r; e += 1)
        this.prevViewData[e] = this.itemsData[e];
      for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes(), r = this.dynamicProperties.length, e = 0; e < r; e += 1)
        this.dynamicProperties[e].getValue();
      this.renderModifiers();
    }, SVGShapeElement.prototype.searchShapes = function(e, r, a, i, s, n, u) {
      var p, b, x, c, f, m, y = [].concat(n), d = e.length - 1, l = [], o = [];
      for (p = d; p >= 0; p -= 1) {
        if ((m = this.searchProcessedElement(e[p])) ? r[p] = a[m - 1] : e[p]._render = u, e[p].ty === "fl" || e[p].ty === "st" || e[p].ty === "gf" || e[p].ty === "gs" || e[p].ty === "no")
          m ? r[p].style.closed = !1 : r[p] = this.createStyleElement(e[p], s), e[p]._render && r[p].style.pElem.parentNode !== i && i.appendChild(r[p].style.pElem), l.push(r[p].style);
        else if (e[p].ty === "gr") {
          if (m)
            for (x = r[p].it.length, b = 0; b < x; b += 1)
              r[p].prevViewData[b] = r[p].it[b];
          else
            r[p] = this.createGroupElement(e[p]);
          this.searchShapes(e[p].it, r[p].it, r[p].prevViewData, r[p].gr, s + 1, y, u), e[p]._render && r[p].gr.parentNode !== i && i.appendChild(r[p].gr);
        } else
          e[p].ty === "tr" ? (m || (r[p] = this.createTransformElement(e[p], i)), c = r[p].transform, y.push(c)) : e[p].ty === "sh" || e[p].ty === "rc" || e[p].ty === "el" || e[p].ty === "sr" ? (m || (r[p] = this.createShapeElement(e[p], y, s)), this.setElementStyles(r[p])) : e[p].ty === "tm" || e[p].ty === "rd" || e[p].ty === "ms" || e[p].ty === "pb" ? (m ? (f = r[p]).closed = !1 : ((f = ShapeModifiers.getModifier(e[p].ty)).init(this, e[p]), r[p] = f, this.shapeModifiers.push(f)), o.push(f)) : e[p].ty === "rp" && (m ? (f = r[p]).closed = !0 : (f = ShapeModifiers.getModifier(e[p].ty), r[p] = f, f.init(this, e, p, r), this.shapeModifiers.push(f), u = !1), o.push(f));
        this.addProcessedElement(e[p], p + 1);
      }
      for (d = l.length, p = 0; p < d; p += 1)
        l[p].closed = !0;
      for (d = o.length, p = 0; p < d; p += 1)
        o[p].closed = !0;
    }, SVGShapeElement.prototype.renderInnerContent = function() {
      var e;
      this.renderModifiers();
      var r = this.stylesList.length;
      for (e = 0; e < r; e += 1)
        this.stylesList[e].reset();
      for (this.renderShape(), e = 0; e < r; e += 1)
        (this.stylesList[e]._mdf || this._isFirstFrame) && (this.stylesList[e].msElem && (this.stylesList[e].msElem.setAttribute("d", this.stylesList[e].d), this.stylesList[e].d = "M0 0" + this.stylesList[e].d), this.stylesList[e].pElem.setAttribute("d", this.stylesList[e].d || "M0 0"));
    }, SVGShapeElement.prototype.renderShape = function() {
      var e, r, a = this.animatedContents.length;
      for (e = 0; e < a; e += 1)
        r = this.animatedContents[e], (this._isFirstFrame || r.element._isAnimated) && r.data !== !0 && r.fn(r.data, r.element, this._isFirstFrame);
    }, SVGShapeElement.prototype.destroy = function() {
      this.destroyBaseElement(), this.shapesData = null, this.itemsData = null;
    }, LetterProps.prototype.update = function(e, r, a, i, s, n) {
      this._mdf.o = !1, this._mdf.sw = !1, this._mdf.sc = !1, this._mdf.fc = !1, this._mdf.m = !1, this._mdf.p = !1;
      var u = !1;
      return this.o !== e && (this.o = e, this._mdf.o = !0, u = !0), this.sw !== r && (this.sw = r, this._mdf.sw = !0, u = !0), this.sc !== a && (this.sc = a, this._mdf.sc = !0, u = !0), this.fc !== i && (this.fc = i, this._mdf.fc = !0, u = !0), this.m !== s && (this.m = s, this._mdf.m = !0, u = !0), !n.length || this.p[0] === n[0] && this.p[1] === n[1] && this.p[4] === n[4] && this.p[5] === n[5] && this.p[12] === n[12] && this.p[13] === n[13] || (this.p = n, this._mdf.p = !0, u = !0), u;
    }, TextProperty.prototype.defaultBoxWidth = [0, 0], TextProperty.prototype.copyData = function(e, r) {
      for (var a in r)
        Object.prototype.hasOwnProperty.call(r, a) && (e[a] = r[a]);
      return e;
    }, TextProperty.prototype.setCurrentData = function(e) {
      e.__complete || this.completeTextData(e), this.currentData = e, this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth, this._mdf = !0;
    }, TextProperty.prototype.searchProperty = function() {
      return this.searchKeyframes();
    }, TextProperty.prototype.searchKeyframes = function() {
      return this.kf = this.data.d.k.length > 1, this.kf && this.addEffect(this.getKeyframeValue.bind(this)), this.kf;
    }, TextProperty.prototype.addEffect = function(e) {
      this.effectsSequence.push(e), this.elem.addDynamicProperty(this);
    }, TextProperty.prototype.getValue = function(e) {
      if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length || e) {
        this.currentData.t = this.data.d.k[this.keysIndex].s.t;
        var r = this.currentData, a = this.keysIndex;
        if (this.lock)
          this.setCurrentData(this.currentData);
        else {
          var i;
          this.lock = !0, this._mdf = !1;
          var s = this.effectsSequence.length, n = e || this.data.d.k[this.keysIndex].s;
          for (i = 0; i < s; i += 1)
            n = a !== this.keysIndex ? this.effectsSequence[i](n, n.t) : this.effectsSequence[i](this.currentData, n.t);
          r !== n && this.setCurrentData(n), this.v = this.currentData, this.pv = this.v, this.lock = !1, this.frameId = this.elem.globalData.frameId;
        }
      }
    }, TextProperty.prototype.getKeyframeValue = function() {
      for (var e = this.data.d.k, r = this.elem.comp.renderedFrame, a = 0, i = e.length; a <= i - 1 && !(a === i - 1 || e[a + 1].t > r); )
        a += 1;
      return this.keysIndex !== a && (this.keysIndex = a), this.data.d.k[this.keysIndex].s;
    }, TextProperty.prototype.buildFinalText = function(e) {
      for (var r, a, i = [], s = 0, n = e.length, u = !1; s < n; )
        r = e.charCodeAt(s), FontManager.isCombinedCharacter(r) ? i[i.length - 1] += e.charAt(s) : r >= 55296 && r <= 56319 ? (a = e.charCodeAt(s + 1)) >= 56320 && a <= 57343 ? (u || FontManager.isModifier(r, a) ? (i[i.length - 1] += e.substr(s, 2), u = !1) : i.push(e.substr(s, 2)), s += 1) : i.push(e.charAt(s)) : r > 56319 ? (a = e.charCodeAt(s + 1), FontManager.isZeroWidthJoiner(r, a) ? (u = !0, i[i.length - 1] += e.substr(s, 2), s += 1) : i.push(e.charAt(s))) : FontManager.isZeroWidthJoiner(r) ? (i[i.length - 1] += e.charAt(s), u = !0) : i.push(e.charAt(s)), s += 1;
      return i;
    }, TextProperty.prototype.completeTextData = function(e) {
      e.__complete = !0;
      var r, a, i, s, n, u, p, b = this.elem.globalData.fontManager, x = this.data, c = [], f = 0, m = x.m.g, y = 0, d = 0, l = 0, o = [], g = 0, _ = 0, S = b.getFontByName(e.f), E = 0, P = getFontProperties(S);
      e.fWeight = P.weight, e.fStyle = P.style, e.finalSize = e.s, e.finalText = this.buildFinalText(e.t), a = e.finalText.length, e.finalLineHeight = e.lh;
      var k, C = e.tr / 1e3 * e.finalSize;
      if (e.sz)
        for (var A, M, I = !0, D = e.sz[0], L = e.sz[1]; I; ) {
          A = 0, g = 0, a = (M = this.buildFinalText(e.t)).length, C = e.tr / 1e3 * e.finalSize;
          var R = -1;
          for (r = 0; r < a; r += 1)
            k = M[r].charCodeAt(0), i = !1, M[r] === " " ? R = r : k !== 13 && k !== 3 || (g = 0, i = !0, A += e.finalLineHeight || 1.2 * e.finalSize), b.chars ? (p = b.getCharData(M[r], S.fStyle, S.fFamily), E = i ? 0 : p.w * e.finalSize / 100) : E = b.measureText(M[r], e.f, e.finalSize), g + E > D && M[r] !== " " ? (R === -1 ? a += 1 : r = R, A += e.finalLineHeight || 1.2 * e.finalSize, M.splice(r, R === r ? 1 : 0, "\r"), R = -1, g = 0) : (g += E, g += C);
          A += S.ascent * e.finalSize / 100, this.canResize && e.finalSize > this.minimumFontSize && L < A ? (e.finalSize -= 1, e.finalLineHeight = e.finalSize * e.lh / e.s) : (e.finalText = M, a = e.finalText.length, I = !1);
        }
      g = -C, E = 0;
      var V, B = 0;
      for (r = 0; r < a; r += 1)
        if (i = !1, (k = (V = e.finalText[r]).charCodeAt(0)) === 13 || k === 3 ? (B = 0, o.push(g), _ = g > _ ? g : _, g = -2 * C, s = "", i = !0, l += 1) : s = V, b.chars ? (p = b.getCharData(V, S.fStyle, b.getFontByName(e.f).fFamily), E = i ? 0 : p.w * e.finalSize / 100) : E = b.measureText(s, e.f, e.finalSize), V === " " ? B += E + C : (g += E + C + B, B = 0), c.push({ l: E, an: E, add: y, n: i, anIndexes: [], val: s, line: l, animatorJustifyOffset: 0 }), m == 2) {
          if (y += E, s === "" || s === " " || r === a - 1) {
            for (s !== "" && s !== " " || (y -= E); d <= r; )
              c[d].an = y, c[d].ind = f, c[d].extra = E, d += 1;
            f += 1, y = 0;
          }
        } else if (m == 3) {
          if (y += E, s === "" || r === a - 1) {
            for (s === "" && (y -= E); d <= r; )
              c[d].an = y, c[d].ind = f, c[d].extra = E, d += 1;
            y = 0, f += 1;
          }
        } else
          c[f].ind = f, c[f].extra = 0, f += 1;
      if (e.l = c, _ = g > _ ? g : _, o.push(g), e.sz)
        e.boxWidth = e.sz[0], e.justifyOffset = 0;
      else
        switch (e.boxWidth = _, e.j) {
          case 1:
            e.justifyOffset = -e.boxWidth;
            break;
          case 2:
            e.justifyOffset = -e.boxWidth / 2;
            break;
          default:
            e.justifyOffset = 0;
        }
      e.lineWidths = o;
      var N, F, T, $, z = x.a;
      u = z.length;
      var j = [];
      for (n = 0; n < u; n += 1) {
        for ((N = z[n]).a.sc && (e.strokeColorAnim = !0), N.a.sw && (e.strokeWidthAnim = !0), (N.a.fc || N.a.fh || N.a.fs || N.a.fb) && (e.fillColorAnim = !0), $ = 0, T = N.s.b, r = 0; r < a; r += 1)
          (F = c[r]).anIndexes[n] = $, (T == 1 && F.val !== "" || T == 2 && F.val !== "" && F.val !== " " || T == 3 && (F.n || F.val == " " || r == a - 1) || T == 4 && (F.n || r == a - 1)) && (N.s.rn === 1 && j.push($), $ += 1);
        x.a[n].s.totalChars = $;
        var W, Y = -1;
        if (N.s.rn === 1)
          for (r = 0; r < a; r += 1)
            Y != (F = c[r]).anIndexes[n] && (Y = F.anIndexes[n], W = j.splice(Math.floor(Math.random() * j.length), 1)[0]), F.anIndexes[n] = W;
      }
      e.yOffset = e.finalLineHeight || 1.2 * e.finalSize, e.ls = e.ls || 0, e.ascent = S.ascent * e.finalSize / 100;
    }, TextProperty.prototype.updateDocumentData = function(e, r) {
      r = r === void 0 ? this.keysIndex : r;
      var a = this.copyData({}, this.data.d.k[r].s);
      a = this.copyData(a, e), this.data.d.k[r].s = a, this.recalculate(r), this.elem.addDynamicProperty(this);
    }, TextProperty.prototype.recalculate = function(e) {
      var r = this.data.d.k[e].s;
      r.__complete = !1, this.keysIndex = 0, this._isFirstFrame = !0, this.getValue(r);
    }, TextProperty.prototype.canResizeFont = function(e) {
      this.canResize = e, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
    }, TextProperty.prototype.setMinimumFontSize = function(e) {
      this.minimumFontSize = Math.floor(e) || 1, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
    };
    var TextSelectorProp = function() {
      var e = Math.max, r = Math.min, a = Math.floor;
      function i(s, n) {
        this._currentTextLength = -1, this.k = !1, this.data = n, this.elem = s, this.comp = s.comp, this.finalS = 0, this.finalE = 0, this.initDynamicPropertyContainer(s), this.s = PropertyFactory.getProp(s, n.s || { k: 0 }, 0, 0, this), this.e = "e" in n ? PropertyFactory.getProp(s, n.e, 0, 0, this) : { v: 100 }, this.o = PropertyFactory.getProp(s, n.o || { k: 0 }, 0, 0, this), this.xe = PropertyFactory.getProp(s, n.xe || { k: 0 }, 0, 0, this), this.ne = PropertyFactory.getProp(s, n.ne || { k: 0 }, 0, 0, this), this.sm = PropertyFactory.getProp(s, n.sm || { k: 100 }, 0, 0, this), this.a = PropertyFactory.getProp(s, n.a, 0, 0.01, this), this.dynamicProperties.length || this.getValue();
      }
      return i.prototype = { getMult: function(s) {
        this._currentTextLength !== this.elem.textProperty.currentData.l.length && this.getValue();
        var n = 0, u = 0, p = 1, b = 1;
        this.ne.v > 0 ? n = this.ne.v / 100 : u = -this.ne.v / 100, this.xe.v > 0 ? p = 1 - this.xe.v / 100 : b = 1 + this.xe.v / 100;
        var x = BezierFactory.getBezierEasing(n, u, p, b).get, c = 0, f = this.finalS, m = this.finalE, y = this.data.sh;
        if (y === 2)
          c = x(c = m === f ? s >= m ? 1 : 0 : e(0, r(0.5 / (m - f) + (s - f) / (m - f), 1)));
        else if (y === 3)
          c = x(c = m === f ? s >= m ? 0 : 1 : 1 - e(0, r(0.5 / (m - f) + (s - f) / (m - f), 1)));
        else if (y === 4)
          m === f ? c = 0 : (c = e(0, r(0.5 / (m - f) + (s - f) / (m - f), 1))) < 0.5 ? c *= 2 : c = 1 - 2 * (c - 0.5), c = x(c);
        else if (y === 5) {
          if (m === f)
            c = 0;
          else {
            var d = m - f, l = -d / 2 + (s = r(e(0, s + 0.5 - f), m - f)), o = d / 2;
            c = Math.sqrt(1 - l * l / (o * o));
          }
          c = x(c);
        } else
          y === 6 ? (m === f ? c = 0 : (s = r(e(0, s + 0.5 - f), m - f), c = (1 + Math.cos(Math.PI + 2 * Math.PI * s / (m - f))) / 2), c = x(c)) : (s >= a(f) && (c = e(0, r(s - f < 0 ? r(m, 1) - (f - s) : m - s, 1))), c = x(c));
        if (this.sm.v !== 100) {
          var g = 0.01 * this.sm.v;
          g === 0 && (g = 1e-8);
          var _ = 0.5 - 0.5 * g;
          c < _ ? c = 0 : (c = (c - _) / g) > 1 && (c = 1);
        }
        return c * this.a.v;
      }, getValue: function(s) {
        this.iterateDynamicProperties(), this._mdf = s || this._mdf, this._currentTextLength = this.elem.textProperty.currentData.l.length || 0, s && this.data.r === 2 && (this.e.v = this._currentTextLength);
        var n = this.data.r === 2 ? 1 : 100 / this.data.totalChars, u = this.o.v / n, p = this.s.v / n + u, b = this.e.v / n + u;
        if (p > b) {
          var x = p;
          p = b, b = x;
        }
        this.finalS = p, this.finalE = b;
      } }, extendPrototype([DynamicPropertyContainer], i), { getTextSelectorProp: function(s, n, u) {
        return new i(s, n);
      } };
    }();
    function TextAnimatorDataProperty(e, r, a) {
      var i = { propType: !1 }, s = PropertyFactory.getProp, n = r.a;
      this.a = { r: n.r ? s(e, n.r, 0, degToRads, a) : i, rx: n.rx ? s(e, n.rx, 0, degToRads, a) : i, ry: n.ry ? s(e, n.ry, 0, degToRads, a) : i, sk: n.sk ? s(e, n.sk, 0, degToRads, a) : i, sa: n.sa ? s(e, n.sa, 0, degToRads, a) : i, s: n.s ? s(e, n.s, 1, 0.01, a) : i, a: n.a ? s(e, n.a, 1, 0, a) : i, o: n.o ? s(e, n.o, 0, 0.01, a) : i, p: n.p ? s(e, n.p, 1, 0, a) : i, sw: n.sw ? s(e, n.sw, 0, 0, a) : i, sc: n.sc ? s(e, n.sc, 1, 0, a) : i, fc: n.fc ? s(e, n.fc, 1, 0, a) : i, fh: n.fh ? s(e, n.fh, 0, 0, a) : i, fs: n.fs ? s(e, n.fs, 0, 0.01, a) : i, fb: n.fb ? s(e, n.fb, 0, 0.01, a) : i, t: n.t ? s(e, n.t, 0, 0, a) : i }, this.s = TextSelectorProp.getTextSelectorProp(e, r.s, a), this.s.t = r.s.t;
    }
    function TextAnimatorProperty(e, r, a) {
      this._isFirstFrame = !0, this._hasMaskedPath = !1, this._frameId = -1, this._textData = e, this._renderType = r, this._elem = a, this._animatorsData = createSizedArray(this._textData.a.length), this._pathData = {}, this._moreOptions = { alignment: {} }, this.renderedLetters = [], this.lettersChangedFlag = !1, this.initDynamicPropertyContainer(a);
    }
    function ITextElement() {
    }
    TextAnimatorProperty.prototype.searchProperties = function() {
      var e, r, a = this._textData.a.length, i = PropertyFactory.getProp;
      for (e = 0; e < a; e += 1)
        r = this._textData.a[e], this._animatorsData[e] = new TextAnimatorDataProperty(this._elem, r, this);
      this._textData.p && "m" in this._textData.p ? (this._pathData = { a: i(this._elem, this._textData.p.a, 0, 0, this), f: i(this._elem, this._textData.p.f, 0, 0, this), l: i(this._elem, this._textData.p.l, 0, 0, this), r: i(this._elem, this._textData.p.r, 0, 0, this), p: i(this._elem, this._textData.p.p, 0, 0, this), m: this._elem.maskManager.getMaskProperty(this._textData.p.m) }, this._hasMaskedPath = !0) : this._hasMaskedPath = !1, this._moreOptions.alignment = i(this._elem, this._textData.m.a, 1, 0, this);
    }, TextAnimatorProperty.prototype.getMeasures = function(e, r) {
      if (this.lettersChangedFlag = r, this._mdf || this._isFirstFrame || r || this._hasMaskedPath && this._pathData.m._mdf) {
        this._isFirstFrame = !1;
        var a, i, s, n, u, p, b, x, c, f, m, y, d, l, o, g, _, S, E, P = this._moreOptions.alignment.v, k = this._animatorsData, C = this._textData, A = this.mHelper, M = this._renderType, I = this.renderedLetters.length, D = e.l;
        if (this._hasMaskedPath) {
          if (E = this._pathData.m, !this._pathData.n || this._pathData._mdf) {
            var L, R = E.v;
            for (this._pathData.r.v && (R = R.reverse()), u = { tLength: 0, segments: [] }, n = R._length - 1, g = 0, s = 0; s < n; s += 1)
              L = bez.buildBezierData(R.v[s], R.v[s + 1], [R.o[s][0] - R.v[s][0], R.o[s][1] - R.v[s][1]], [R.i[s + 1][0] - R.v[s + 1][0], R.i[s + 1][1] - R.v[s + 1][1]]), u.tLength += L.segmentLength, u.segments.push(L), g += L.segmentLength;
            s = n, E.v.c && (L = bez.buildBezierData(R.v[s], R.v[0], [R.o[s][0] - R.v[s][0], R.o[s][1] - R.v[s][1]], [R.i[0][0] - R.v[0][0], R.i[0][1] - R.v[0][1]]), u.tLength += L.segmentLength, u.segments.push(L), g += L.segmentLength), this._pathData.pi = u;
          }
          if (u = this._pathData.pi, p = this._pathData.f.v, m = 0, f = 1, x = 0, c = !0, l = u.segments, p < 0 && E.v.c)
            for (u.tLength < Math.abs(p) && (p = -Math.abs(p) % u.tLength), f = (d = l[m = l.length - 1].points).length - 1; p < 0; )
              p += d[f].partialLength, (f -= 1) < 0 && (f = (d = l[m -= 1].points).length - 1);
          y = (d = l[m].points)[f - 1], o = (b = d[f]).partialLength;
        }
        n = D.length, a = 0, i = 0;
        var V, B, N, F, T, $ = 1.2 * e.finalSize * 0.714, z = !0;
        N = k.length;
        var j, W, Y, H, G, K, q, U, Z, re, Q, ee, O = -1, he = p, pe = m, me = f, oe = -1, ae = "", se = this.defaultPropsArray;
        if (e.j === 2 || e.j === 1) {
          var X = 0, ne = 0, le = e.j === 2 ? -0.5 : -1, J = 0, ie = !0;
          for (s = 0; s < n; s += 1)
            if (D[s].n) {
              for (X && (X += ne); J < s; )
                D[J].animatorJustifyOffset = X, J += 1;
              X = 0, ie = !0;
            } else {
              for (B = 0; B < N; B += 1)
                (V = k[B].a).t.propType && (ie && e.j === 2 && (ne += V.t.v * le), (T = k[B].s.getMult(D[s].anIndexes[B], C.a[B].s.totalChars)).length ? X += V.t.v * T[0] * le : X += V.t.v * T * le);
              ie = !1;
            }
          for (X && (X += ne); J < s; )
            D[J].animatorJustifyOffset = X, J += 1;
        }
        for (s = 0; s < n; s += 1) {
          if (A.reset(), H = 1, D[s].n)
            a = 0, i += e.yOffset, i += z ? 1 : 0, p = he, z = !1, this._hasMaskedPath && (f = me, y = (d = l[m = pe].points)[f - 1], o = (b = d[f]).partialLength, x = 0), ae = "", Q = "", Z = "", ee = "", se = this.defaultPropsArray;
          else {
            if (this._hasMaskedPath) {
              if (oe !== D[s].line) {
                switch (e.j) {
                  case 1:
                    p += g - e.lineWidths[D[s].line];
                    break;
                  case 2:
                    p += (g - e.lineWidths[D[s].line]) / 2;
                }
                oe = D[s].line;
              }
              O !== D[s].ind && (D[O] && (p += D[O].extra), p += D[s].an / 2, O = D[s].ind), p += P[0] * D[s].an * 5e-3;
              var te = 0;
              for (B = 0; B < N; B += 1)
                (V = k[B].a).p.propType && ((T = k[B].s.getMult(D[s].anIndexes[B], C.a[B].s.totalChars)).length ? te += V.p.v[0] * T[0] : te += V.p.v[0] * T), V.a.propType && ((T = k[B].s.getMult(D[s].anIndexes[B], C.a[B].s.totalChars)).length ? te += V.a.v[0] * T[0] : te += V.a.v[0] * T);
              for (c = !0, this._pathData.a.v && (p = 0.5 * D[0].an + (g - this._pathData.f.v - 0.5 * D[0].an - 0.5 * D[D.length - 1].an) * O / (n - 1), p += this._pathData.f.v); c; )
                x + o >= p + te || !d ? (_ = (p + te - x) / b.partialLength, W = y.point[0] + (b.point[0] - y.point[0]) * _, Y = y.point[1] + (b.point[1] - y.point[1]) * _, A.translate(-P[0] * D[s].an * 5e-3, -P[1] * $ * 0.01), c = !1) : d && (x += b.partialLength, (f += 1) >= d.length && (f = 0, l[m += 1] ? d = l[m].points : E.v.c ? (f = 0, d = l[m = 0].points) : (x -= b.partialLength, d = null)), d && (y = b, o = (b = d[f]).partialLength));
              j = D[s].an / 2 - D[s].add, A.translate(-j, 0, 0);
            } else
              j = D[s].an / 2 - D[s].add, A.translate(-j, 0, 0), A.translate(-P[0] * D[s].an * 5e-3, -P[1] * $ * 0.01, 0);
            for (B = 0; B < N; B += 1)
              (V = k[B].a).t.propType && (T = k[B].s.getMult(D[s].anIndexes[B], C.a[B].s.totalChars), a === 0 && e.j === 0 || (this._hasMaskedPath ? T.length ? p += V.t.v * T[0] : p += V.t.v * T : T.length ? a += V.t.v * T[0] : a += V.t.v * T));
            for (e.strokeWidthAnim && (K = e.sw || 0), e.strokeColorAnim && (G = e.sc ? [e.sc[0], e.sc[1], e.sc[2]] : [0, 0, 0]), e.fillColorAnim && e.fc && (q = [e.fc[0], e.fc[1], e.fc[2]]), B = 0; B < N; B += 1)
              (V = k[B].a).a.propType && ((T = k[B].s.getMult(D[s].anIndexes[B], C.a[B].s.totalChars)).length ? A.translate(-V.a.v[0] * T[0], -V.a.v[1] * T[1], V.a.v[2] * T[2]) : A.translate(-V.a.v[0] * T, -V.a.v[1] * T, V.a.v[2] * T));
            for (B = 0; B < N; B += 1)
              (V = k[B].a).s.propType && ((T = k[B].s.getMult(D[s].anIndexes[B], C.a[B].s.totalChars)).length ? A.scale(1 + (V.s.v[0] - 1) * T[0], 1 + (V.s.v[1] - 1) * T[1], 1) : A.scale(1 + (V.s.v[0] - 1) * T, 1 + (V.s.v[1] - 1) * T, 1));
            for (B = 0; B < N; B += 1) {
              if (V = k[B].a, T = k[B].s.getMult(D[s].anIndexes[B], C.a[B].s.totalChars), V.sk.propType && (T.length ? A.skewFromAxis(-V.sk.v * T[0], V.sa.v * T[1]) : A.skewFromAxis(-V.sk.v * T, V.sa.v * T)), V.r.propType && (T.length ? A.rotateZ(-V.r.v * T[2]) : A.rotateZ(-V.r.v * T)), V.ry.propType && (T.length ? A.rotateY(V.ry.v * T[1]) : A.rotateY(V.ry.v * T)), V.rx.propType && (T.length ? A.rotateX(V.rx.v * T[0]) : A.rotateX(V.rx.v * T)), V.o.propType && (T.length ? H += (V.o.v * T[0] - H) * T[0] : H += (V.o.v * T - H) * T), e.strokeWidthAnim && V.sw.propType && (T.length ? K += V.sw.v * T[0] : K += V.sw.v * T), e.strokeColorAnim && V.sc.propType)
                for (U = 0; U < 3; U += 1)
                  T.length ? G[U] += (V.sc.v[U] - G[U]) * T[0] : G[U] += (V.sc.v[U] - G[U]) * T;
              if (e.fillColorAnim && e.fc) {
                if (V.fc.propType)
                  for (U = 0; U < 3; U += 1)
                    T.length ? q[U] += (V.fc.v[U] - q[U]) * T[0] : q[U] += (V.fc.v[U] - q[U]) * T;
                V.fh.propType && (q = T.length ? addHueToRGB(q, V.fh.v * T[0]) : addHueToRGB(q, V.fh.v * T)), V.fs.propType && (q = T.length ? addSaturationToRGB(q, V.fs.v * T[0]) : addSaturationToRGB(q, V.fs.v * T)), V.fb.propType && (q = T.length ? addBrightnessToRGB(q, V.fb.v * T[0]) : addBrightnessToRGB(q, V.fb.v * T));
              }
            }
            for (B = 0; B < N; B += 1)
              (V = k[B].a).p.propType && (T = k[B].s.getMult(D[s].anIndexes[B], C.a[B].s.totalChars), this._hasMaskedPath ? T.length ? A.translate(0, V.p.v[1] * T[0], -V.p.v[2] * T[1]) : A.translate(0, V.p.v[1] * T, -V.p.v[2] * T) : T.length ? A.translate(V.p.v[0] * T[0], V.p.v[1] * T[1], -V.p.v[2] * T[2]) : A.translate(V.p.v[0] * T, V.p.v[1] * T, -V.p.v[2] * T));
            if (e.strokeWidthAnim && (Z = K < 0 ? 0 : K), e.strokeColorAnim && (re = "rgb(" + Math.round(255 * G[0]) + "," + Math.round(255 * G[1]) + "," + Math.round(255 * G[2]) + ")"), e.fillColorAnim && e.fc && (Q = "rgb(" + Math.round(255 * q[0]) + "," + Math.round(255 * q[1]) + "," + Math.round(255 * q[2]) + ")"), this._hasMaskedPath) {
              if (A.translate(0, -e.ls), A.translate(0, P[1] * $ * 0.01 + i, 0), this._pathData.p.v) {
                S = (b.point[1] - y.point[1]) / (b.point[0] - y.point[0]);
                var ce = 180 * Math.atan(S) / Math.PI;
                b.point[0] < y.point[0] && (ce += 180), A.rotate(-ce * Math.PI / 180);
              }
              A.translate(W, Y, 0), p -= P[0] * D[s].an * 5e-3, D[s + 1] && O !== D[s + 1].ind && (p += D[s].an / 2, p += 1e-3 * e.tr * e.finalSize);
            } else {
              switch (A.translate(a, i, 0), e.ps && A.translate(e.ps[0], e.ps[1] + e.ascent, 0), e.j) {
                case 1:
                  A.translate(D[s].animatorJustifyOffset + e.justifyOffset + (e.boxWidth - e.lineWidths[D[s].line]), 0, 0);
                  break;
                case 2:
                  A.translate(D[s].animatorJustifyOffset + e.justifyOffset + (e.boxWidth - e.lineWidths[D[s].line]) / 2, 0, 0);
              }
              A.translate(0, -e.ls), A.translate(j, 0, 0), A.translate(P[0] * D[s].an * 5e-3, P[1] * $ * 0.01, 0), a += D[s].l + 1e-3 * e.tr * e.finalSize;
            }
            M === "html" ? ae = A.toCSS() : M === "svg" ? ae = A.to2dCSS() : se = [A.props[0], A.props[1], A.props[2], A.props[3], A.props[4], A.props[5], A.props[6], A.props[7], A.props[8], A.props[9], A.props[10], A.props[11], A.props[12], A.props[13], A.props[14], A.props[15]], ee = H;
          }
          I <= s ? (F = new LetterProps(ee, Z, re, Q, ae, se), this.renderedLetters.push(F), I += 1, this.lettersChangedFlag = !0) : (F = this.renderedLetters[s], this.lettersChangedFlag = F.update(ee, Z, re, Q, ae, se) || this.lettersChangedFlag);
        }
      }
    }, TextAnimatorProperty.prototype.getValue = function() {
      this._elem.globalData.frameId !== this._frameId && (this._frameId = this._elem.globalData.frameId, this.iterateDynamicProperties());
    }, TextAnimatorProperty.prototype.mHelper = new Matrix(), TextAnimatorProperty.prototype.defaultPropsArray = [], extendPrototype([DynamicPropertyContainer], TextAnimatorProperty), ITextElement.prototype.initElement = function(e, r, a) {
      this.lettersChangedFlag = !0, this.initFrame(), this.initBaseData(e, r, a), this.textProperty = new TextProperty(this, e.t, this.dynamicProperties), this.textAnimator = new TextAnimatorProperty(e.t, this.renderType, this), this.initTransform(e, r, a), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide(), this.textAnimator.searchProperties(this.dynamicProperties);
    }, ITextElement.prototype.prepareFrame = function(e) {
      this._mdf = !1, this.prepareRenderableFrame(e), this.prepareProperties(e, this.isInRange), (this.textProperty._mdf || this.textProperty._isFirstFrame) && (this.buildNewText(), this.textProperty._isFirstFrame = !1, this.textProperty._mdf = !1);
    }, ITextElement.prototype.createPathShape = function(e, r) {
      var a, i, s = r.length, n = "";
      for (a = 0; a < s; a += 1)
        r[a].ty === "sh" && (i = r[a].ks.k, n += buildShapeString(i, i.i.length, !0, e));
      return n;
    }, ITextElement.prototype.updateDocumentData = function(e, r) {
      this.textProperty.updateDocumentData(e, r);
    }, ITextElement.prototype.canResizeFont = function(e) {
      this.textProperty.canResizeFont(e);
    }, ITextElement.prototype.setMinimumFontSize = function(e) {
      this.textProperty.setMinimumFontSize(e);
    }, ITextElement.prototype.applyTextPropertiesToMatrix = function(e, r, a, i, s) {
      switch (e.ps && r.translate(e.ps[0], e.ps[1] + e.ascent, 0), r.translate(0, -e.ls, 0), e.j) {
        case 1:
          r.translate(e.justifyOffset + (e.boxWidth - e.lineWidths[a]), 0, 0);
          break;
        case 2:
          r.translate(e.justifyOffset + (e.boxWidth - e.lineWidths[a]) / 2, 0, 0);
      }
      r.translate(i, s, 0);
    }, ITextElement.prototype.buildColor = function(e) {
      return "rgb(" + Math.round(255 * e[0]) + "," + Math.round(255 * e[1]) + "," + Math.round(255 * e[2]) + ")";
    }, ITextElement.prototype.emptyProp = new LetterProps(), ITextElement.prototype.destroy = function() {
    };
    var emptyShapeData = { shapes: [] };
    function SVGTextLottieElement(e, r, a) {
      this.textSpans = [], this.renderType = "svg", this.initElement(e, r, a);
    }
    function ISolidElement(e, r, a) {
      this.initElement(e, r, a);
    }
    function NullElement(e, r, a) {
      this.initFrame(), this.initBaseData(e, r, a), this.initFrame(), this.initTransform(e, r, a), this.initHierarchy();
    }
    function SVGRendererBase() {
    }
    function ICompElement() {
    }
    function SVGCompElement(e, r, a) {
      this.layers = e.layers, this.supports3d = !0, this.completeLayers = !1, this.pendingElements = [], this.elements = this.layers ? createSizedArray(this.layers.length) : [], this.initElement(e, r, a), this.tm = e.tm ? PropertyFactory.getProp(this, e.tm, 0, r.frameRate, this) : { _placeholder: !0 };
    }
    function SVGRenderer(e, r) {
      this.animationItem = e, this.layers = null, this.renderedFrame = -1, this.svgElement = createNS("svg");
      var a = "";
      if (r && r.title) {
        var i = createNS("title"), s = createElementID();
        i.setAttribute("id", s), i.textContent = r.title, this.svgElement.appendChild(i), a += s;
      }
      if (r && r.description) {
        var n = createNS("desc"), u = createElementID();
        n.setAttribute("id", u), n.textContent = r.description, this.svgElement.appendChild(n), a += " " + u;
      }
      a && this.svgElement.setAttribute("aria-labelledby", a);
      var p = createNS("defs");
      this.svgElement.appendChild(p);
      var b = createNS("g");
      this.svgElement.appendChild(b), this.layerElement = b, this.renderConfig = { preserveAspectRatio: r && r.preserveAspectRatio || "xMidYMid meet", imagePreserveAspectRatio: r && r.imagePreserveAspectRatio || "xMidYMid slice", contentVisibility: r && r.contentVisibility || "visible", progressiveLoad: r && r.progressiveLoad || !1, hideOnTransparent: !(r && r.hideOnTransparent === !1), viewBoxOnly: r && r.viewBoxOnly || !1, viewBoxSize: r && r.viewBoxSize || !1, className: r && r.className || "", id: r && r.id || "", focusable: r && r.focusable, filterSize: { width: r && r.filterSize && r.filterSize.width || "100%", height: r && r.filterSize && r.filterSize.height || "100%", x: r && r.filterSize && r.filterSize.x || "0%", y: r && r.filterSize && r.filterSize.y || "0%" }, width: r && r.width, height: r && r.height }, this.globalData = { _mdf: !1, frameNum: -1, defs: p, renderConfig: this.renderConfig }, this.elements = [], this.pendingElements = [], this.destroyed = !1, this.rendererType = "svg";
    }
    function CVContextData() {
      var e;
      for (this.saved = [], this.cArrPos = 0, this.cTr = new Matrix(), this.cO = 1, this.savedOp = createTypedArray("float32", 15), e = 0; e < 15; e += 1)
        this.saved[e] = createTypedArray("float32", 16);
      this._length = 15;
    }
    function ShapeTransformManager() {
      this.sequences = {}, this.sequenceList = [], this.transform_key_count = 0;
    }
    function CVEffects() {
    }
    function CVMaskElement(e, r) {
      var a;
      this.data = e, this.element = r, this.masksProperties = this.data.masksProperties || [], this.viewData = createSizedArray(this.masksProperties.length);
      var i = this.masksProperties.length, s = !1;
      for (a = 0; a < i; a += 1)
        this.masksProperties[a].mode !== "n" && (s = !0), this.viewData[a] = ShapePropertyFactory.getShapeProp(this.element, this.masksProperties[a], 3);
      this.hasMasks = s, s && this.element.addRenderableComponent(this);
    }
    function CVBaseElement() {
    }
    function CVShapeData(e, r, a, i) {
      this.styledShapes = [], this.tr = [0, 0, 0, 0, 0, 0];
      var s, n = 4;
      r.ty === "rc" ? n = 5 : r.ty === "el" ? n = 6 : r.ty === "sr" && (n = 7), this.sh = ShapePropertyFactory.getShapeProp(e, r, n, e);
      var u, p = a.length;
      for (s = 0; s < p; s += 1)
        a[s].closed || (u = { transforms: i.addTransformSequence(a[s].transforms), trNodes: [] }, this.styledShapes.push(u), a[s].elements.push(u));
    }
    function CVShapeElement(e, r, a) {
      this.shapes = [], this.shapesData = e.shapes, this.stylesList = [], this.itemsData = [], this.prevViewData = [], this.shapeModifiers = [], this.processedElements = [], this.transformsManager = new ShapeTransformManager(), this.initElement(e, r, a);
    }
    function CVTextElement(e, r, a) {
      this.textSpans = [], this.yOffset = 0, this.fillColorAnim = !1, this.strokeColorAnim = !1, this.strokeWidthAnim = !1, this.stroke = !1, this.fill = !1, this.justifyOffset = 0, this.currentRender = null, this.renderType = "canvas", this.values = { fill: "rgba(0,0,0,0)", stroke: "rgba(0,0,0,0)", sWidth: 0, fValue: "" }, this.initElement(e, r, a);
    }
    function CVImageElement(e, r, a) {
      this.assetData = r.getAssetData(e.refId), this.img = r.imageLoader.getAsset(this.assetData), this.initElement(e, r, a);
    }
    function CVSolidElement(e, r, a) {
      this.initElement(e, r, a);
    }
    function CanvasRendererBase(e, r) {
      this.animationItem = e, this.renderConfig = { clearCanvas: !r || r.clearCanvas === void 0 || r.clearCanvas, context: r && r.context || null, progressiveLoad: r && r.progressiveLoad || !1, preserveAspectRatio: r && r.preserveAspectRatio || "xMidYMid meet", imagePreserveAspectRatio: r && r.imagePreserveAspectRatio || "xMidYMid slice", contentVisibility: r && r.contentVisibility || "visible", className: r && r.className || "", id: r && r.id || "" }, this.renderConfig.dpr = r && r.dpr || 1, this.animationItem.wrapper && (this.renderConfig.dpr = r && r.dpr || window.devicePixelRatio || 1), this.renderedFrame = -1, this.globalData = { frameNum: -1, _mdf: !1, renderConfig: this.renderConfig, currentGlobalAlpha: -1 }, this.contextData = new CVContextData(), this.elements = [], this.pendingElements = [], this.transformMat = new Matrix(), this.completeLayers = !1, this.rendererType = "canvas";
    }
    function CVCompElement(e, r, a) {
      this.completeLayers = !1, this.layers = e.layers, this.pendingElements = [], this.elements = createSizedArray(this.layers.length), this.initElement(e, r, a), this.tm = e.tm ? PropertyFactory.getProp(this, e.tm, 0, r.frameRate, this) : { _placeholder: !0 };
    }
    function CanvasRenderer(e, r) {
      this.animationItem = e, this.renderConfig = { clearCanvas: !r || r.clearCanvas === void 0 || r.clearCanvas, context: r && r.context || null, progressiveLoad: r && r.progressiveLoad || !1, preserveAspectRatio: r && r.preserveAspectRatio || "xMidYMid meet", imagePreserveAspectRatio: r && r.imagePreserveAspectRatio || "xMidYMid slice", contentVisibility: r && r.contentVisibility || "visible", className: r && r.className || "", id: r && r.id || "" }, this.renderConfig.dpr = r && r.dpr || 1, this.animationItem.wrapper && (this.renderConfig.dpr = r && r.dpr || window.devicePixelRatio || 1), this.renderedFrame = -1, this.globalData = { frameNum: -1, _mdf: !1, renderConfig: this.renderConfig, currentGlobalAlpha: -1 }, this.contextData = new CVContextData(), this.elements = [], this.pendingElements = [], this.transformMat = new Matrix(), this.completeLayers = !1, this.rendererType = "canvas";
    }
    function HBaseElement() {
    }
    function HSolidElement(e, r, a) {
      this.initElement(e, r, a);
    }
    function HShapeElement(e, r, a) {
      this.shapes = [], this.shapesData = e.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.shapesContainer = createNS("g"), this.initElement(e, r, a), this.prevViewData = [], this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 };
    }
    function HTextElement(e, r, a) {
      this.textSpans = [], this.textPaths = [], this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 }, this.renderType = "svg", this.isMasked = !1, this.initElement(e, r, a);
    }
    function HCameraElement(e, r, a) {
      this.initFrame(), this.initBaseData(e, r, a), this.initHierarchy();
      var i = PropertyFactory.getProp;
      if (this.pe = i(this, e.pe, 0, 0, this), e.ks.p.s ? (this.px = i(this, e.ks.p.x, 1, 0, this), this.py = i(this, e.ks.p.y, 1, 0, this), this.pz = i(this, e.ks.p.z, 1, 0, this)) : this.p = i(this, e.ks.p, 1, 0, this), e.ks.a && (this.a = i(this, e.ks.a, 1, 0, this)), e.ks.or.k.length && e.ks.or.k[0].to) {
        var s, n = e.ks.or.k.length;
        for (s = 0; s < n; s += 1)
          e.ks.or.k[s].to = null, e.ks.or.k[s].ti = null;
      }
      this.or = i(this, e.ks.or, 1, degToRads, this), this.or.sh = !0, this.rx = i(this, e.ks.rx, 0, degToRads, this), this.ry = i(this, e.ks.ry, 0, degToRads, this), this.rz = i(this, e.ks.rz, 0, degToRads, this), this.mat = new Matrix(), this._prevMat = new Matrix(), this._isFirstFrame = !0, this.finalTransform = { mProp: this };
    }
    function HImageElement(e, r, a) {
      this.assetData = r.getAssetData(e.refId), this.initElement(e, r, a);
    }
    function HybridRendererBase(e, r) {
      this.animationItem = e, this.layers = null, this.renderedFrame = -1, this.renderConfig = { className: r && r.className || "", imagePreserveAspectRatio: r && r.imagePreserveAspectRatio || "xMidYMid slice", hideOnTransparent: !(r && r.hideOnTransparent === !1), filterSize: { width: r && r.filterSize && r.filterSize.width || "400%", height: r && r.filterSize && r.filterSize.height || "400%", x: r && r.filterSize && r.filterSize.x || "-100%", y: r && r.filterSize && r.filterSize.y || "-100%" } }, this.globalData = { _mdf: !1, frameNum: -1, renderConfig: this.renderConfig }, this.pendingElements = [], this.elements = [], this.threeDElements = [], this.destroyed = !1, this.camera = null, this.supports3d = !0, this.rendererType = "html";
    }
    function HCompElement(e, r, a) {
      this.layers = e.layers, this.supports3d = !e.hasMask, this.completeLayers = !1, this.pendingElements = [], this.elements = this.layers ? createSizedArray(this.layers.length) : [], this.initElement(e, r, a), this.tm = e.tm ? PropertyFactory.getProp(this, e.tm, 0, r.frameRate, this) : { _placeholder: !0 };
    }
    function HybridRenderer(e, r) {
      this.animationItem = e, this.layers = null, this.renderedFrame = -1, this.renderConfig = { className: r && r.className || "", imagePreserveAspectRatio: r && r.imagePreserveAspectRatio || "xMidYMid slice", hideOnTransparent: !(r && r.hideOnTransparent === !1), filterSize: { width: r && r.filterSize && r.filterSize.width || "400%", height: r && r.filterSize && r.filterSize.height || "400%", x: r && r.filterSize && r.filterSize.x || "-100%", y: r && r.filterSize && r.filterSize.y || "-100%" } }, this.globalData = { _mdf: !1, frameNum: -1, renderConfig: this.renderConfig }, this.pendingElements = [], this.elements = [], this.threeDElements = [], this.destroyed = !1, this.camera = null, this.supports3d = !0, this.rendererType = "html";
    }
    extendPrototype([BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement, ITextElement], SVGTextLottieElement), SVGTextLottieElement.prototype.createContent = function() {
      this.data.singleShape && !this.globalData.fontManager.chars && (this.textContainer = createNS("text"));
    }, SVGTextLottieElement.prototype.buildTextContents = function(e) {
      for (var r = 0, a = e.length, i = [], s = ""; r < a; )
        e[r] === String.fromCharCode(13) || e[r] === String.fromCharCode(3) ? (i.push(s), s = "") : s += e[r], r += 1;
      return i.push(s), i;
    }, SVGTextLottieElement.prototype.buildShapeData = function(e, r) {
      if (e.shapes && e.shapes.length) {
        var a = e.shapes[0];
        if (a.it) {
          var i = a.it[a.it.length - 1];
          i.s && (i.s.k[0] = r, i.s.k[1] = r);
        }
      }
      return e;
    }, SVGTextLottieElement.prototype.buildNewText = function() {
      var e, r;
      this.addDynamicProperty(this);
      var a = this.textProperty.currentData;
      this.renderedLetters = createSizedArray(a ? a.l.length : 0), a.fc ? this.layerElement.setAttribute("fill", this.buildColor(a.fc)) : this.layerElement.setAttribute("fill", "rgba(0,0,0,0)"), a.sc && (this.layerElement.setAttribute("stroke", this.buildColor(a.sc)), this.layerElement.setAttribute("stroke-width", a.sw)), this.layerElement.setAttribute("font-size", a.finalSize);
      var i = this.globalData.fontManager.getFontByName(a.f);
      if (i.fClass)
        this.layerElement.setAttribute("class", i.fClass);
      else {
        this.layerElement.setAttribute("font-family", i.fFamily);
        var s = a.fWeight, n = a.fStyle;
        this.layerElement.setAttribute("font-style", n), this.layerElement.setAttribute("font-weight", s);
      }
      this.layerElement.setAttribute("aria-label", a.t);
      var u, p = a.l || [], b = !!this.globalData.fontManager.chars;
      r = p.length;
      var x = this.mHelper, c = this.data.singleShape, f = 0, m = 0, y = !0, d = 1e-3 * a.tr * a.finalSize;
      if (!c || b || a.sz) {
        var l, o = this.textSpans.length;
        for (e = 0; e < r; e += 1) {
          if (this.textSpans[e] || (this.textSpans[e] = { span: null, childSpan: null, glyph: null }), !b || !c || e === 0) {
            if (u = o > e ? this.textSpans[e].span : createNS(b ? "g" : "text"), o <= e) {
              if (u.setAttribute("stroke-linecap", "butt"), u.setAttribute("stroke-linejoin", "round"), u.setAttribute("stroke-miterlimit", "4"), this.textSpans[e].span = u, b) {
                var g = createNS("g");
                u.appendChild(g), this.textSpans[e].childSpan = g;
              }
              this.textSpans[e].span = u, this.layerElement.appendChild(u);
            }
            u.style.display = "inherit";
          }
          if (x.reset(), c && (p[e].n && (f = -d, m += a.yOffset, m += y ? 1 : 0, y = !1), this.applyTextPropertiesToMatrix(a, x, p[e].line, f, m), f += p[e].l || 0, f += d), b) {
            var _;
            if ((l = this.globalData.fontManager.getCharData(a.finalText[e], i.fStyle, this.globalData.fontManager.getFontByName(a.f).fFamily)).t === 1)
              _ = new SVGCompElement(l.data, this.globalData, this);
            else {
              var S = emptyShapeData;
              l.data && l.data.shapes && (S = this.buildShapeData(l.data, a.finalSize)), _ = new SVGShapeElement(S, this.globalData, this);
            }
            if (this.textSpans[e].glyph) {
              var E = this.textSpans[e].glyph;
              this.textSpans[e].childSpan.removeChild(E.layerElement), E.destroy();
            }
            this.textSpans[e].glyph = _, _._debug = !0, _.prepareFrame(0), _.renderFrame(), this.textSpans[e].childSpan.appendChild(_.layerElement), l.t === 1 && this.textSpans[e].childSpan.setAttribute("transform", "scale(" + a.finalSize / 100 + "," + a.finalSize / 100 + ")");
          } else
            c && u.setAttribute("transform", "translate(" + x.props[12] + "," + x.props[13] + ")"), u.textContent = p[e].val, u.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
        }
        c && u && u.setAttribute("d", "");
      } else {
        var P = this.textContainer, k = "start";
        switch (a.j) {
          case 1:
            k = "end";
            break;
          case 2:
            k = "middle";
            break;
          default:
            k = "start";
        }
        P.setAttribute("text-anchor", k), P.setAttribute("letter-spacing", d);
        var C = this.buildTextContents(a.finalText);
        for (r = C.length, m = a.ps ? a.ps[1] + a.ascent : 0, e = 0; e < r; e += 1)
          (u = this.textSpans[e].span || createNS("tspan")).textContent = C[e], u.setAttribute("x", 0), u.setAttribute("y", m), u.style.display = "inherit", P.appendChild(u), this.textSpans[e] || (this.textSpans[e] = { span: null, glyph: null }), this.textSpans[e].span = u, m += a.finalLineHeight;
        this.layerElement.appendChild(P);
      }
      for (; e < this.textSpans.length; )
        this.textSpans[e].span.style.display = "none", e += 1;
      this._sizeChanged = !0;
    }, SVGTextLottieElement.prototype.sourceRectAtTime = function() {
      if (this.prepareFrame(this.comp.renderedFrame - this.data.st), this.renderInnerContent(), this._sizeChanged) {
        this._sizeChanged = !1;
        var e = this.layerElement.getBBox();
        this.bbox = { top: e.y, left: e.x, width: e.width, height: e.height };
      }
      return this.bbox;
    }, SVGTextLottieElement.prototype.getValue = function() {
      var e, r, a = this.textSpans.length;
      for (this.renderedFrame = this.comp.renderedFrame, e = 0; e < a; e += 1)
        (r = this.textSpans[e].glyph) && (r.prepareFrame(this.comp.renderedFrame - this.data.st), r._mdf && (this._mdf = !0));
    }, SVGTextLottieElement.prototype.renderInnerContent = function() {
      if ((!this.data.singleShape || this._mdf) && (this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag), this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)) {
        var e, r;
        this._sizeChanged = !0;
        var a, i, s, n = this.textAnimator.renderedLetters, u = this.textProperty.currentData.l;
        for (r = u.length, e = 0; e < r; e += 1)
          u[e].n || (a = n[e], i = this.textSpans[e].span, (s = this.textSpans[e].glyph) && s.renderFrame(), a._mdf.m && i.setAttribute("transform", a.m), a._mdf.o && i.setAttribute("opacity", a.o), a._mdf.sw && i.setAttribute("stroke-width", a.sw), a._mdf.sc && i.setAttribute("stroke", a.sc), a._mdf.fc && i.setAttribute("fill", a.fc));
      }
    }, extendPrototype([IImageElement], ISolidElement), ISolidElement.prototype.createContent = function() {
      var e = createNS("rect");
      e.setAttribute("width", this.data.sw), e.setAttribute("height", this.data.sh), e.setAttribute("fill", this.data.sc), this.layerElement.appendChild(e);
    }, NullElement.prototype.prepareFrame = function(e) {
      this.prepareProperties(e, !0);
    }, NullElement.prototype.renderFrame = function() {
    }, NullElement.prototype.getBaseElement = function() {
      return null;
    }, NullElement.prototype.destroy = function() {
    }, NullElement.prototype.sourceRectAtTime = function() {
    }, NullElement.prototype.hide = function() {
    }, extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement], NullElement), extendPrototype([BaseRenderer], SVGRendererBase), SVGRendererBase.prototype.createNull = function(e) {
      return new NullElement(e, this.globalData, this);
    }, SVGRendererBase.prototype.createShape = function(e) {
      return new SVGShapeElement(e, this.globalData, this);
    }, SVGRendererBase.prototype.createText = function(e) {
      return new SVGTextLottieElement(e, this.globalData, this);
    }, SVGRendererBase.prototype.createImage = function(e) {
      return new IImageElement(e, this.globalData, this);
    }, SVGRendererBase.prototype.createSolid = function(e) {
      return new ISolidElement(e, this.globalData, this);
    }, SVGRendererBase.prototype.configAnimation = function(e) {
      this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.renderConfig.viewBoxSize ? this.svgElement.setAttribute("viewBox", this.renderConfig.viewBoxSize) : this.svgElement.setAttribute("viewBox", "0 0 " + e.w + " " + e.h), this.renderConfig.viewBoxOnly || (this.svgElement.setAttribute("width", e.w), this.svgElement.setAttribute("height", e.h), this.svgElement.style.width = "100%", this.svgElement.style.height = "100%", this.svgElement.style.transform = "translate3d(0,0,0)", this.svgElement.style.contentVisibility = this.renderConfig.contentVisibility), this.renderConfig.width && this.svgElement.setAttribute("width", this.renderConfig.width), this.renderConfig.height && this.svgElement.setAttribute("height", this.renderConfig.height), this.renderConfig.className && this.svgElement.setAttribute("class", this.renderConfig.className), this.renderConfig.id && this.svgElement.setAttribute("id", this.renderConfig.id), this.renderConfig.focusable !== void 0 && this.svgElement.setAttribute("focusable", this.renderConfig.focusable), this.svgElement.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio), this.animationItem.wrapper.appendChild(this.svgElement);
      var r = this.globalData.defs;
      this.setupGlobalData(e, r), this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.data = e;
      var a = createNS("clipPath"), i = createNS("rect");
      i.setAttribute("width", e.w), i.setAttribute("height", e.h), i.setAttribute("x", 0), i.setAttribute("y", 0);
      var s = createElementID();
      a.setAttribute("id", s), a.appendChild(i), this.layerElement.setAttribute("clip-path", "url(" + getLocationHref() + "#" + s + ")"), r.appendChild(a), this.layers = e.layers, this.elements = createSizedArray(e.layers.length);
    }, SVGRendererBase.prototype.destroy = function() {
      var e;
      this.animationItem.wrapper && (this.animationItem.wrapper.innerText = ""), this.layerElement = null, this.globalData.defs = null;
      var r = this.layers ? this.layers.length : 0;
      for (e = 0; e < r; e += 1)
        this.elements[e] && this.elements[e].destroy();
      this.elements.length = 0, this.destroyed = !0, this.animationItem = null;
    }, SVGRendererBase.prototype.updateContainerSize = function() {
    }, SVGRendererBase.prototype.buildItem = function(e) {
      var r = this.elements;
      if (!r[e] && this.layers[e].ty !== 99) {
        r[e] = !0;
        var a = this.createItem(this.layers[e]);
        r[e] = a, getExpressionsPlugin() && (this.layers[e].ty === 0 && this.globalData.projectInterface.registerComposition(a), a.initExpressions()), this.appendElementInPos(a, e), this.layers[e].tt && (this.elements[e - 1] && this.elements[e - 1] !== !0 ? a.setMatte(r[e - 1].layerId) : (this.buildItem(e - 1), this.addPendingElement(a)));
      }
    }, SVGRendererBase.prototype.checkPendingElements = function() {
      for (; this.pendingElements.length; ) {
        var e = this.pendingElements.pop();
        if (e.checkParenting(), e.data.tt)
          for (var r = 0, a = this.elements.length; r < a; ) {
            if (this.elements[r] === e) {
              e.setMatte(this.elements[r - 1].layerId);
              break;
            }
            r += 1;
          }
      }
    }, SVGRendererBase.prototype.renderFrame = function(e) {
      if (this.renderedFrame !== e && !this.destroyed) {
        var r;
        e === null ? e = this.renderedFrame : this.renderedFrame = e, this.globalData.frameNum = e, this.globalData.frameId += 1, this.globalData.projectInterface.currentFrame = e, this.globalData._mdf = !1;
        var a = this.layers.length;
        for (this.completeLayers || this.checkLayers(e), r = a - 1; r >= 0; r -= 1)
          (this.completeLayers || this.elements[r]) && this.elements[r].prepareFrame(e - this.layers[r].st);
        if (this.globalData._mdf)
          for (r = 0; r < a; r += 1)
            (this.completeLayers || this.elements[r]) && this.elements[r].renderFrame();
      }
    }, SVGRendererBase.prototype.appendElementInPos = function(e, r) {
      var a = e.getBaseElement();
      if (a) {
        for (var i, s = 0; s < r; )
          this.elements[s] && this.elements[s] !== !0 && this.elements[s].getBaseElement() && (i = this.elements[s].getBaseElement()), s += 1;
        i ? this.layerElement.insertBefore(a, i) : this.layerElement.appendChild(a);
      }
    }, SVGRendererBase.prototype.hide = function() {
      this.layerElement.style.display = "none";
    }, SVGRendererBase.prototype.show = function() {
      this.layerElement.style.display = "block";
    }, extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement, RenderableDOMElement], ICompElement), ICompElement.prototype.initElement = function(e, r, a) {
      this.initFrame(), this.initBaseData(e, r, a), this.initTransform(e, r, a), this.initRenderable(), this.initHierarchy(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), !this.data.xt && r.progressiveLoad || this.buildAllItems(), this.hide();
    }, ICompElement.prototype.prepareFrame = function(e) {
      if (this._mdf = !1, this.prepareRenderableFrame(e), this.prepareProperties(e, this.isInRange), this.isInRange || this.data.xt) {
        if (this.tm._placeholder)
          this.renderedFrame = e / this.data.sr;
        else {
          var r = this.tm.v;
          r === this.data.op && (r = this.data.op - 1), this.renderedFrame = r;
        }
        var a, i = this.elements.length;
        for (this.completeLayers || this.checkLayers(this.renderedFrame), a = i - 1; a >= 0; a -= 1)
          (this.completeLayers || this.elements[a]) && (this.elements[a].prepareFrame(this.renderedFrame - this.layers[a].st), this.elements[a]._mdf && (this._mdf = !0));
      }
    }, ICompElement.prototype.renderInnerContent = function() {
      var e, r = this.layers.length;
      for (e = 0; e < r; e += 1)
        (this.completeLayers || this.elements[e]) && this.elements[e].renderFrame();
    }, ICompElement.prototype.setElements = function(e) {
      this.elements = e;
    }, ICompElement.prototype.getElements = function() {
      return this.elements;
    }, ICompElement.prototype.destroyElements = function() {
      var e, r = this.layers.length;
      for (e = 0; e < r; e += 1)
        this.elements[e] && this.elements[e].destroy();
    }, ICompElement.prototype.destroy = function() {
      this.destroyElements(), this.destroyBaseElement();
    }, extendPrototype([SVGRendererBase, ICompElement, SVGBaseElement], SVGCompElement), SVGCompElement.prototype.createComp = function(e) {
      return new SVGCompElement(e, this.globalData, this);
    }, extendPrototype([SVGRendererBase], SVGRenderer), SVGRenderer.prototype.createComp = function(e) {
      return new SVGCompElement(e, this.globalData, this);
    }, CVContextData.prototype.duplicate = function() {
      var e = 2 * this._length, r = this.savedOp;
      this.savedOp = createTypedArray("float32", e), this.savedOp.set(r);
      var a = 0;
      for (a = this._length; a < e; a += 1)
        this.saved[a] = createTypedArray("float32", 16);
      this._length = e;
    }, CVContextData.prototype.reset = function() {
      this.cArrPos = 0, this.cTr.reset(), this.cO = 1;
    }, ShapeTransformManager.prototype = { addTransformSequence: function(e) {
      var r, a = e.length, i = "_";
      for (r = 0; r < a; r += 1)
        i += e[r].transform.key + "_";
      var s = this.sequences[i];
      return s || (s = { transforms: [].concat(e), finalTransform: new Matrix(), _mdf: !1 }, this.sequences[i] = s, this.sequenceList.push(s)), s;
    }, processSequence: function(e, r) {
      for (var a, i = 0, s = e.transforms.length, n = r; i < s && !r; ) {
        if (e.transforms[i].transform.mProps._mdf) {
          n = !0;
          break;
        }
        i += 1;
      }
      if (n)
        for (e.finalTransform.reset(), i = s - 1; i >= 0; i -= 1)
          a = e.transforms[i].transform.mProps.v.props, e.finalTransform.transform(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
      e._mdf = n;
    }, processSequences: function(e) {
      var r, a = this.sequenceList.length;
      for (r = 0; r < a; r += 1)
        this.processSequence(this.sequenceList[r], e);
    }, getNewKey: function() {
      return this.transform_key_count += 1, "_" + this.transform_key_count;
    } }, CVEffects.prototype.renderFrame = function() {
    }, CVMaskElement.prototype.renderFrame = function() {
      if (this.hasMasks) {
        var e, r, a, i, s = this.element.finalTransform.mat, n = this.element.canvasContext, u = this.masksProperties.length;
        for (n.beginPath(), e = 0; e < u; e += 1)
          if (this.masksProperties[e].mode !== "n") {
            var p;
            this.masksProperties[e].inv && (n.moveTo(0, 0), n.lineTo(this.element.globalData.compSize.w, 0), n.lineTo(this.element.globalData.compSize.w, this.element.globalData.compSize.h), n.lineTo(0, this.element.globalData.compSize.h), n.lineTo(0, 0)), i = this.viewData[e].v, r = s.applyToPointArray(i.v[0][0], i.v[0][1], 0), n.moveTo(r[0], r[1]);
            var b = i._length;
            for (p = 1; p < b; p += 1)
              a = s.applyToTriplePoints(i.o[p - 1], i.i[p], i.v[p]), n.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]);
            a = s.applyToTriplePoints(i.o[p - 1], i.i[0], i.v[0]), n.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]);
          }
        this.element.globalData.renderer.save(!0), n.clip();
      }
    }, CVMaskElement.prototype.getMaskProperty = MaskElement.prototype.getMaskProperty, CVMaskElement.prototype.destroy = function() {
      this.element = null;
    }, CVBaseElement.prototype = { createElements: function() {
    }, initRendererElement: function() {
    }, createContainerElements: function() {
      this.canvasContext = this.globalData.canvasContext, this.renderableEffectsManager = new CVEffects();
    }, createContent: function() {
    }, setBlendMode: function() {
      var e = this.globalData;
      if (e.blendMode !== this.data.bm) {
        e.blendMode = this.data.bm;
        var r = getBlendMode(this.data.bm);
        e.canvasContext.globalCompositeOperation = r;
      }
    }, createRenderableComponents: function() {
      this.maskManager = new CVMaskElement(this.data, this);
    }, hideElement: function() {
      this.hidden || this.isInRange && !this.isTransparent || (this.hidden = !0);
    }, showElement: function() {
      this.isInRange && !this.isTransparent && (this.hidden = !1, this._isFirstFrame = !0, this.maskManager._isFirstFrame = !0);
    }, renderFrame: function() {
      if (!this.hidden && !this.data.hd) {
        this.renderTransform(), this.renderRenderable(), this.setBlendMode();
        var e = this.data.ty === 0;
        this.globalData.renderer.save(e), this.globalData.renderer.ctxTransform(this.finalTransform.mat.props), this.globalData.renderer.ctxOpacity(this.finalTransform.mProp.o.v), this.renderInnerContent(), this.globalData.renderer.restore(e), this.maskManager.hasMasks && this.globalData.renderer.restore(!0), this._isFirstFrame && (this._isFirstFrame = !1);
      }
    }, destroy: function() {
      this.canvasContext = null, this.data = null, this.globalData = null, this.maskManager.destroy();
    }, mHelper: new Matrix() }, CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement, CVBaseElement.prototype.show = CVBaseElement.prototype.showElement, CVShapeData.prototype.setAsAnimated = SVGShapeData.prototype.setAsAnimated, extendPrototype([BaseElement, TransformElement, CVBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableElement], CVShapeElement), CVShapeElement.prototype.initElement = RenderableDOMElement.prototype.initElement, CVShapeElement.prototype.transformHelper = { opacity: 1, _opMdf: !1 }, CVShapeElement.prototype.dashResetter = [], CVShapeElement.prototype.createContent = function() {
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, !0, []);
    }, CVShapeElement.prototype.createStyleElement = function(e, r) {
      var a = { data: e, type: e.ty, preTransforms: this.transformsManager.addTransformSequence(r), transforms: [], elements: [], closed: e.hd === !0 }, i = {};
      if (e.ty === "fl" || e.ty === "st" ? (i.c = PropertyFactory.getProp(this, e.c, 1, 255, this), i.c.k || (a.co = "rgb(" + bmFloor(i.c.v[0]) + "," + bmFloor(i.c.v[1]) + "," + bmFloor(i.c.v[2]) + ")")) : e.ty !== "gf" && e.ty !== "gs" || (i.s = PropertyFactory.getProp(this, e.s, 1, null, this), i.e = PropertyFactory.getProp(this, e.e, 1, null, this), i.h = PropertyFactory.getProp(this, e.h || { k: 0 }, 0, 0.01, this), i.a = PropertyFactory.getProp(this, e.a || { k: 0 }, 0, degToRads, this), i.g = new GradientProperty(this, e.g, this)), i.o = PropertyFactory.getProp(this, e.o, 0, 0.01, this), e.ty === "st" || e.ty === "gs") {
        if (a.lc = lineCapEnum[e.lc || 2], a.lj = lineJoinEnum[e.lj || 2], e.lj == 1 && (a.ml = e.ml), i.w = PropertyFactory.getProp(this, e.w, 0, null, this), i.w.k || (a.wi = i.w.v), e.d) {
          var s = new DashProperty(this, e.d, "canvas", this);
          i.d = s, i.d.k || (a.da = i.d.dashArray, a.do = i.d.dashoffset[0]);
        }
      } else
        a.r = e.r === 2 ? "evenodd" : "nonzero";
      return this.stylesList.push(a), i.style = a, i;
    }, CVShapeElement.prototype.createGroupElement = function() {
      return { it: [], prevViewData: [] };
    }, CVShapeElement.prototype.createTransformElement = function(e) {
      return { transform: { opacity: 1, _opMdf: !1, key: this.transformsManager.getNewKey(), op: PropertyFactory.getProp(this, e.o, 0, 0.01, this), mProps: TransformPropertyFactory.getTransformProperty(this, e, this) } };
    }, CVShapeElement.prototype.createShapeElement = function(e) {
      var r = new CVShapeData(this, e, this.stylesList, this.transformsManager);
      return this.shapes.push(r), this.addShapeToModifiers(r), r;
    }, CVShapeElement.prototype.reloadShapes = function() {
      var e;
      this._isFirstFrame = !0;
      var r = this.itemsData.length;
      for (e = 0; e < r; e += 1)
        this.prevViewData[e] = this.itemsData[e];
      for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, !0, []), r = this.dynamicProperties.length, e = 0; e < r; e += 1)
        this.dynamicProperties[e].getValue();
      this.renderModifiers(), this.transformsManager.processSequences(this._isFirstFrame);
    }, CVShapeElement.prototype.addTransformToStyleList = function(e) {
      var r, a = this.stylesList.length;
      for (r = 0; r < a; r += 1)
        this.stylesList[r].closed || this.stylesList[r].transforms.push(e);
    }, CVShapeElement.prototype.removeTransformFromStyleList = function() {
      var e, r = this.stylesList.length;
      for (e = 0; e < r; e += 1)
        this.stylesList[e].closed || this.stylesList[e].transforms.pop();
    }, CVShapeElement.prototype.closeStyles = function(e) {
      var r, a = e.length;
      for (r = 0; r < a; r += 1)
        e[r].closed = !0;
    }, CVShapeElement.prototype.searchShapes = function(e, r, a, i, s) {
      var n, u, p, b, x, c, f = e.length - 1, m = [], y = [], d = [].concat(s);
      for (n = f; n >= 0; n -= 1) {
        if ((b = this.searchProcessedElement(e[n])) ? r[n] = a[b - 1] : e[n]._shouldRender = i, e[n].ty === "fl" || e[n].ty === "st" || e[n].ty === "gf" || e[n].ty === "gs")
          b ? r[n].style.closed = !1 : r[n] = this.createStyleElement(e[n], d), m.push(r[n].style);
        else if (e[n].ty === "gr") {
          if (b)
            for (p = r[n].it.length, u = 0; u < p; u += 1)
              r[n].prevViewData[u] = r[n].it[u];
          else
            r[n] = this.createGroupElement(e[n]);
          this.searchShapes(e[n].it, r[n].it, r[n].prevViewData, i, d);
        } else
          e[n].ty === "tr" ? (b || (c = this.createTransformElement(e[n]), r[n] = c), d.push(r[n]), this.addTransformToStyleList(r[n])) : e[n].ty === "sh" || e[n].ty === "rc" || e[n].ty === "el" || e[n].ty === "sr" ? b || (r[n] = this.createShapeElement(e[n])) : e[n].ty === "tm" || e[n].ty === "rd" || e[n].ty === "pb" ? (b ? (x = r[n]).closed = !1 : ((x = ShapeModifiers.getModifier(e[n].ty)).init(this, e[n]), r[n] = x, this.shapeModifiers.push(x)), y.push(x)) : e[n].ty === "rp" && (b ? (x = r[n]).closed = !0 : (x = ShapeModifiers.getModifier(e[n].ty), r[n] = x, x.init(this, e, n, r), this.shapeModifiers.push(x), i = !1), y.push(x));
        this.addProcessedElement(e[n], n + 1);
      }
      for (this.removeTransformFromStyleList(), this.closeStyles(m), f = y.length, n = 0; n < f; n += 1)
        y[n].closed = !0;
    }, CVShapeElement.prototype.renderInnerContent = function() {
      this.transformHelper.opacity = 1, this.transformHelper._opMdf = !1, this.renderModifiers(), this.transformsManager.processSequences(this._isFirstFrame), this.renderShape(this.transformHelper, this.shapesData, this.itemsData, !0);
    }, CVShapeElement.prototype.renderShapeTransform = function(e, r) {
      (e._opMdf || r.op._mdf || this._isFirstFrame) && (r.opacity = e.opacity, r.opacity *= r.op.v, r._opMdf = !0);
    }, CVShapeElement.prototype.drawLayer = function() {
      var e, r, a, i, s, n, u, p, b, x = this.stylesList.length, c = this.globalData.renderer, f = this.globalData.canvasContext;
      for (e = 0; e < x; e += 1)
        if (((p = (b = this.stylesList[e]).type) !== "st" && p !== "gs" || b.wi !== 0) && b.data._shouldRender && b.coOp !== 0 && this.globalData.currentGlobalAlpha !== 0) {
          for (c.save(), n = b.elements, p === "st" || p === "gs" ? (f.strokeStyle = p === "st" ? b.co : b.grd, f.lineWidth = b.wi, f.lineCap = b.lc, f.lineJoin = b.lj, f.miterLimit = b.ml || 0) : f.fillStyle = p === "fl" ? b.co : b.grd, c.ctxOpacity(b.coOp), p !== "st" && p !== "gs" && f.beginPath(), c.ctxTransform(b.preTransforms.finalTransform.props), a = n.length, r = 0; r < a; r += 1) {
            for (p !== "st" && p !== "gs" || (f.beginPath(), b.da && (f.setLineDash(b.da), f.lineDashOffset = b.do)), s = (u = n[r].trNodes).length, i = 0; i < s; i += 1)
              u[i].t === "m" ? f.moveTo(u[i].p[0], u[i].p[1]) : u[i].t === "c" ? f.bezierCurveTo(u[i].pts[0], u[i].pts[1], u[i].pts[2], u[i].pts[3], u[i].pts[4], u[i].pts[5]) : f.closePath();
            p !== "st" && p !== "gs" || (f.stroke(), b.da && f.setLineDash(this.dashResetter));
          }
          p !== "st" && p !== "gs" && f.fill(b.r), c.restore();
        }
    }, CVShapeElement.prototype.renderShape = function(e, r, a, i) {
      var s, n;
      for (n = e, s = r.length - 1; s >= 0; s -= 1)
        r[s].ty === "tr" ? (n = a[s].transform, this.renderShapeTransform(e, n)) : r[s].ty === "sh" || r[s].ty === "el" || r[s].ty === "rc" || r[s].ty === "sr" ? this.renderPath(r[s], a[s]) : r[s].ty === "fl" ? this.renderFill(r[s], a[s], n) : r[s].ty === "st" ? this.renderStroke(r[s], a[s], n) : r[s].ty === "gf" || r[s].ty === "gs" ? this.renderGradientFill(r[s], a[s], n) : r[s].ty === "gr" ? this.renderShape(n, r[s].it, a[s].it) : r[s].ty;
      i && this.drawLayer();
    }, CVShapeElement.prototype.renderStyledShape = function(e, r) {
      if (this._isFirstFrame || r._mdf || e.transforms._mdf) {
        var a, i, s, n = e.trNodes, u = r.paths, p = u._length;
        n.length = 0;
        var b = e.transforms.finalTransform;
        for (s = 0; s < p; s += 1) {
          var x = u.shapes[s];
          if (x && x.v) {
            for (i = x._length, a = 1; a < i; a += 1)
              a === 1 && n.push({ t: "m", p: b.applyToPointArray(x.v[0][0], x.v[0][1], 0) }), n.push({ t: "c", pts: b.applyToTriplePoints(x.o[a - 1], x.i[a], x.v[a]) });
            i === 1 && n.push({ t: "m", p: b.applyToPointArray(x.v[0][0], x.v[0][1], 0) }), x.c && i && (n.push({ t: "c", pts: b.applyToTriplePoints(x.o[a - 1], x.i[0], x.v[0]) }), n.push({ t: "z" }));
          }
        }
        e.trNodes = n;
      }
    }, CVShapeElement.prototype.renderPath = function(e, r) {
      if (e.hd !== !0 && e._shouldRender) {
        var a, i = r.styledShapes.length;
        for (a = 0; a < i; a += 1)
          this.renderStyledShape(r.styledShapes[a], r.sh);
      }
    }, CVShapeElement.prototype.renderFill = function(e, r, a) {
      var i = r.style;
      (r.c._mdf || this._isFirstFrame) && (i.co = "rgb(" + bmFloor(r.c.v[0]) + "," + bmFloor(r.c.v[1]) + "," + bmFloor(r.c.v[2]) + ")"), (r.o._mdf || a._opMdf || this._isFirstFrame) && (i.coOp = r.o.v * a.opacity);
    }, CVShapeElement.prototype.renderGradientFill = function(e, r, a) {
      var i, s = r.style;
      if (!s.grd || r.g._mdf || r.s._mdf || r.e._mdf || e.t !== 1 && (r.h._mdf || r.a._mdf)) {
        var n, u = this.globalData.canvasContext, p = r.s.v, b = r.e.v;
        if (e.t === 1)
          i = u.createLinearGradient(p[0], p[1], b[0], b[1]);
        else {
          var x = Math.sqrt(Math.pow(p[0] - b[0], 2) + Math.pow(p[1] - b[1], 2)), c = Math.atan2(b[1] - p[1], b[0] - p[0]), f = r.h.v;
          f >= 1 ? f = 0.99 : f <= -1 && (f = -0.99);
          var m = x * f, y = Math.cos(c + r.a.v) * m + p[0], d = Math.sin(c + r.a.v) * m + p[1];
          i = u.createRadialGradient(y, d, 0, p[0], p[1], x);
        }
        var l = e.g.p, o = r.g.c, g = 1;
        for (n = 0; n < l; n += 1)
          r.g._hasOpacity && r.g._collapsable && (g = r.g.o[2 * n + 1]), i.addColorStop(o[4 * n] / 100, "rgba(" + o[4 * n + 1] + "," + o[4 * n + 2] + "," + o[4 * n + 3] + "," + g + ")");
        s.grd = i;
      }
      s.coOp = r.o.v * a.opacity;
    }, CVShapeElement.prototype.renderStroke = function(e, r, a) {
      var i = r.style, s = r.d;
      s && (s._mdf || this._isFirstFrame) && (i.da = s.dashArray, i.do = s.dashoffset[0]), (r.c._mdf || this._isFirstFrame) && (i.co = "rgb(" + bmFloor(r.c.v[0]) + "," + bmFloor(r.c.v[1]) + "," + bmFloor(r.c.v[2]) + ")"), (r.o._mdf || a._opMdf || this._isFirstFrame) && (i.coOp = r.o.v * a.opacity), (r.w._mdf || this._isFirstFrame) && (i.wi = r.w.v);
    }, CVShapeElement.prototype.destroy = function() {
      this.shapesData = null, this.globalData = null, this.canvasContext = null, this.stylesList.length = 0, this.itemsData.length = 0;
    }, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement, ITextElement], CVTextElement), CVTextElement.prototype.tHelper = createTag("canvas").getContext("2d"), CVTextElement.prototype.buildNewText = function() {
      var e = this.textProperty.currentData;
      this.renderedLetters = createSizedArray(e.l ? e.l.length : 0);
      var r = !1;
      e.fc ? (r = !0, this.values.fill = this.buildColor(e.fc)) : this.values.fill = "rgba(0,0,0,0)", this.fill = r;
      var a = !1;
      e.sc && (a = !0, this.values.stroke = this.buildColor(e.sc), this.values.sWidth = e.sw);
      var i, s, n, u, p, b, x, c, f, m, y, d, l = this.globalData.fontManager.getFontByName(e.f), o = e.l, g = this.mHelper;
      this.stroke = a, this.values.fValue = e.finalSize + "px " + this.globalData.fontManager.getFontByName(e.f).fFamily, s = e.finalText.length;
      var _ = this.data.singleShape, S = 1e-3 * e.tr * e.finalSize, E = 0, P = 0, k = !0, C = 0;
      for (i = 0; i < s; i += 1) {
        u = (n = this.globalData.fontManager.getCharData(e.finalText[i], l.fStyle, this.globalData.fontManager.getFontByName(e.f).fFamily)) && n.data || {}, g.reset(), _ && o[i].n && (E = -S, P += e.yOffset, P += k ? 1 : 0, k = !1), f = (x = u.shapes ? u.shapes[0].it : []).length, g.scale(e.finalSize / 100, e.finalSize / 100), _ && this.applyTextPropertiesToMatrix(e, g, o[i].line, E, P), y = createSizedArray(f - 1);
        var A = 0;
        for (c = 0; c < f; c += 1)
          if (x[c].ty === "sh") {
            for (b = x[c].ks.k.i.length, m = x[c].ks.k, d = [], p = 1; p < b; p += 1)
              p === 1 && d.push(g.applyToX(m.v[0][0], m.v[0][1], 0), g.applyToY(m.v[0][0], m.v[0][1], 0)), d.push(g.applyToX(m.o[p - 1][0], m.o[p - 1][1], 0), g.applyToY(m.o[p - 1][0], m.o[p - 1][1], 0), g.applyToX(m.i[p][0], m.i[p][1], 0), g.applyToY(m.i[p][0], m.i[p][1], 0), g.applyToX(m.v[p][0], m.v[p][1], 0), g.applyToY(m.v[p][0], m.v[p][1], 0));
            d.push(g.applyToX(m.o[p - 1][0], m.o[p - 1][1], 0), g.applyToY(m.o[p - 1][0], m.o[p - 1][1], 0), g.applyToX(m.i[0][0], m.i[0][1], 0), g.applyToY(m.i[0][0], m.i[0][1], 0), g.applyToX(m.v[0][0], m.v[0][1], 0), g.applyToY(m.v[0][0], m.v[0][1], 0)), y[A] = d, A += 1;
          }
        _ && (E += o[i].l, E += S), this.textSpans[C] ? this.textSpans[C].elem = y : this.textSpans[C] = { elem: y }, C += 1;
      }
    }, CVTextElement.prototype.renderInnerContent = function() {
      var e, r, a, i, s, n, u = this.canvasContext;
      u.font = this.values.fValue, u.lineCap = "butt", u.lineJoin = "miter", u.miterLimit = 4, this.data.singleShape || this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag);
      var p, b = this.textAnimator.renderedLetters, x = this.textProperty.currentData.l;
      r = x.length;
      var c, f, m = null, y = null, d = null;
      for (e = 0; e < r; e += 1)
        if (!x[e].n) {
          if ((p = b[e]) && (this.globalData.renderer.save(), this.globalData.renderer.ctxTransform(p.p), this.globalData.renderer.ctxOpacity(p.o)), this.fill) {
            for (p && p.fc ? m !== p.fc && (m = p.fc, u.fillStyle = p.fc) : m !== this.values.fill && (m = this.values.fill, u.fillStyle = this.values.fill), i = (c = this.textSpans[e].elem).length, this.globalData.canvasContext.beginPath(), a = 0; a < i; a += 1)
              for (n = (f = c[a]).length, this.globalData.canvasContext.moveTo(f[0], f[1]), s = 2; s < n; s += 6)
                this.globalData.canvasContext.bezierCurveTo(f[s], f[s + 1], f[s + 2], f[s + 3], f[s + 4], f[s + 5]);
            this.globalData.canvasContext.closePath(), this.globalData.canvasContext.fill();
          }
          if (this.stroke) {
            for (p && p.sw ? d !== p.sw && (d = p.sw, u.lineWidth = p.sw) : d !== this.values.sWidth && (d = this.values.sWidth, u.lineWidth = this.values.sWidth), p && p.sc ? y !== p.sc && (y = p.sc, u.strokeStyle = p.sc) : y !== this.values.stroke && (y = this.values.stroke, u.strokeStyle = this.values.stroke), i = (c = this.textSpans[e].elem).length, this.globalData.canvasContext.beginPath(), a = 0; a < i; a += 1)
              for (n = (f = c[a]).length, this.globalData.canvasContext.moveTo(f[0], f[1]), s = 2; s < n; s += 6)
                this.globalData.canvasContext.bezierCurveTo(f[s], f[s + 1], f[s + 2], f[s + 3], f[s + 4], f[s + 5]);
            this.globalData.canvasContext.closePath(), this.globalData.canvasContext.stroke();
          }
          p && this.globalData.renderer.restore();
        }
    }, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVImageElement), CVImageElement.prototype.initElement = SVGShapeElement.prototype.initElement, CVImageElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame, CVImageElement.prototype.createContent = function() {
      if (this.img.width && (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height)) {
        var e = createTag("canvas");
        e.width = this.assetData.w, e.height = this.assetData.h;
        var r, a, i = e.getContext("2d"), s = this.img.width, n = this.img.height, u = s / n, p = this.assetData.w / this.assetData.h, b = this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio;
        u > p && b === "xMidYMid slice" || u < p && b !== "xMidYMid slice" ? r = (a = n) * p : a = (r = s) / p, i.drawImage(this.img, (s - r) / 2, (n - a) / 2, r, a, 0, 0, this.assetData.w, this.assetData.h), this.img = e;
      }
    }, CVImageElement.prototype.renderInnerContent = function() {
      this.canvasContext.drawImage(this.img, 0, 0);
    }, CVImageElement.prototype.destroy = function() {
      this.img = null;
    }, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVSolidElement), CVSolidElement.prototype.initElement = SVGShapeElement.prototype.initElement, CVSolidElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame, CVSolidElement.prototype.renderInnerContent = function() {
      var e = this.canvasContext;
      e.fillStyle = this.data.sc, e.fillRect(0, 0, this.data.sw, this.data.sh);
    }, extendPrototype([BaseRenderer], CanvasRendererBase), CanvasRendererBase.prototype.createShape = function(e) {
      return new CVShapeElement(e, this.globalData, this);
    }, CanvasRendererBase.prototype.createText = function(e) {
      return new CVTextElement(e, this.globalData, this);
    }, CanvasRendererBase.prototype.createImage = function(e) {
      return new CVImageElement(e, this.globalData, this);
    }, CanvasRendererBase.prototype.createSolid = function(e) {
      return new CVSolidElement(e, this.globalData, this);
    }, CanvasRendererBase.prototype.createNull = SVGRenderer.prototype.createNull, CanvasRendererBase.prototype.ctxTransform = function(e) {
      if (e[0] !== 1 || e[1] !== 0 || e[4] !== 0 || e[5] !== 1 || e[12] !== 0 || e[13] !== 0)
        if (this.renderConfig.clearCanvas) {
          this.transformMat.cloneFromProps(e);
          var r = this.contextData.cTr.props;
          this.transformMat.transform(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]), this.contextData.cTr.cloneFromProps(this.transformMat.props);
          var a = this.contextData.cTr.props;
          this.canvasContext.setTransform(a[0], a[1], a[4], a[5], a[12], a[13]);
        } else
          this.canvasContext.transform(e[0], e[1], e[4], e[5], e[12], e[13]);
    }, CanvasRendererBase.prototype.ctxOpacity = function(e) {
      if (!this.renderConfig.clearCanvas)
        return this.canvasContext.globalAlpha *= e < 0 ? 0 : e, void (this.globalData.currentGlobalAlpha = this.contextData.cO);
      this.contextData.cO *= e < 0 ? 0 : e, this.globalData.currentGlobalAlpha !== this.contextData.cO && (this.canvasContext.globalAlpha = this.contextData.cO, this.globalData.currentGlobalAlpha = this.contextData.cO);
    }, CanvasRendererBase.prototype.reset = function() {
      this.renderConfig.clearCanvas ? this.contextData.reset() : this.canvasContext.restore();
    }, CanvasRendererBase.prototype.save = function(e) {
      if (this.renderConfig.clearCanvas) {
        e && this.canvasContext.save();
        var r, a = this.contextData.cTr.props;
        this.contextData._length <= this.contextData.cArrPos && this.contextData.duplicate();
        var i = this.contextData.saved[this.contextData.cArrPos];
        for (r = 0; r < 16; r += 1)
          i[r] = a[r];
        this.contextData.savedOp[this.contextData.cArrPos] = this.contextData.cO, this.contextData.cArrPos += 1;
      } else
        this.canvasContext.save();
    }, CanvasRendererBase.prototype.restore = function(e) {
      if (this.renderConfig.clearCanvas) {
        e && (this.canvasContext.restore(), this.globalData.blendMode = "source-over"), this.contextData.cArrPos -= 1;
        var r, a = this.contextData.saved[this.contextData.cArrPos], i = this.contextData.cTr.props;
        for (r = 0; r < 16; r += 1)
          i[r] = a[r];
        this.canvasContext.setTransform(a[0], a[1], a[4], a[5], a[12], a[13]), a = this.contextData.savedOp[this.contextData.cArrPos], this.contextData.cO = a, this.globalData.currentGlobalAlpha !== a && (this.canvasContext.globalAlpha = a, this.globalData.currentGlobalAlpha = a);
      } else
        this.canvasContext.restore();
    }, CanvasRendererBase.prototype.configAnimation = function(e) {
      if (this.animationItem.wrapper) {
        this.animationItem.container = createTag("canvas");
        var r = this.animationItem.container.style;
        r.width = "100%", r.height = "100%";
        var a = "0px 0px 0px";
        r.transformOrigin = a, r.mozTransformOrigin = a, r.webkitTransformOrigin = a, r["-webkit-transform"] = a, r.contentVisibility = this.renderConfig.contentVisibility, this.animationItem.wrapper.appendChild(this.animationItem.container), this.canvasContext = this.animationItem.container.getContext("2d"), this.renderConfig.className && this.animationItem.container.setAttribute("class", this.renderConfig.className), this.renderConfig.id && this.animationItem.container.setAttribute("id", this.renderConfig.id);
      } else
        this.canvasContext = this.renderConfig.context;
      this.data = e, this.layers = e.layers, this.transformCanvas = { w: e.w, h: e.h, sx: 0, sy: 0, tx: 0, ty: 0 }, this.setupGlobalData(e, document.body), this.globalData.canvasContext = this.canvasContext, this.globalData.renderer = this, this.globalData.isDashed = !1, this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.globalData.transformCanvas = this.transformCanvas, this.elements = createSizedArray(e.layers.length), this.updateContainerSize();
    }, CanvasRendererBase.prototype.updateContainerSize = function() {
      var e, r, a, i;
      if (this.reset(), this.animationItem.wrapper && this.animationItem.container ? (e = this.animationItem.wrapper.offsetWidth, r = this.animationItem.wrapper.offsetHeight, this.animationItem.container.setAttribute("width", e * this.renderConfig.dpr), this.animationItem.container.setAttribute("height", r * this.renderConfig.dpr)) : (e = this.canvasContext.canvas.width * this.renderConfig.dpr, r = this.canvasContext.canvas.height * this.renderConfig.dpr), this.renderConfig.preserveAspectRatio.indexOf("meet") !== -1 || this.renderConfig.preserveAspectRatio.indexOf("slice") !== -1) {
        var s = this.renderConfig.preserveAspectRatio.split(" "), n = s[1] || "meet", u = s[0] || "xMidYMid", p = u.substr(0, 4), b = u.substr(4);
        a = e / r, (i = this.transformCanvas.w / this.transformCanvas.h) > a && n === "meet" || i < a && n === "slice" ? (this.transformCanvas.sx = e / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.sy = e / (this.transformCanvas.w / this.renderConfig.dpr)) : (this.transformCanvas.sx = r / (this.transformCanvas.h / this.renderConfig.dpr), this.transformCanvas.sy = r / (this.transformCanvas.h / this.renderConfig.dpr)), this.transformCanvas.tx = p === "xMid" && (i < a && n === "meet" || i > a && n === "slice") ? (e - this.transformCanvas.w * (r / this.transformCanvas.h)) / 2 * this.renderConfig.dpr : p === "xMax" && (i < a && n === "meet" || i > a && n === "slice") ? (e - this.transformCanvas.w * (r / this.transformCanvas.h)) * this.renderConfig.dpr : 0, this.transformCanvas.ty = b === "YMid" && (i > a && n === "meet" || i < a && n === "slice") ? (r - this.transformCanvas.h * (e / this.transformCanvas.w)) / 2 * this.renderConfig.dpr : b === "YMax" && (i > a && n === "meet" || i < a && n === "slice") ? (r - this.transformCanvas.h * (e / this.transformCanvas.w)) * this.renderConfig.dpr : 0;
      } else
        this.renderConfig.preserveAspectRatio === "none" ? (this.transformCanvas.sx = e / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.sy = r / (this.transformCanvas.h / this.renderConfig.dpr), this.transformCanvas.tx = 0, this.transformCanvas.ty = 0) : (this.transformCanvas.sx = this.renderConfig.dpr, this.transformCanvas.sy = this.renderConfig.dpr, this.transformCanvas.tx = 0, this.transformCanvas.ty = 0);
      this.transformCanvas.props = [this.transformCanvas.sx, 0, 0, 0, 0, this.transformCanvas.sy, 0, 0, 0, 0, 1, 0, this.transformCanvas.tx, this.transformCanvas.ty, 0, 1], this.ctxTransform(this.transformCanvas.props), this.canvasContext.beginPath(), this.canvasContext.rect(0, 0, this.transformCanvas.w, this.transformCanvas.h), this.canvasContext.closePath(), this.canvasContext.clip(), this.renderFrame(this.renderedFrame, !0);
    }, CanvasRendererBase.prototype.destroy = function() {
      var e;
      for (this.renderConfig.clearCanvas && this.animationItem.wrapper && (this.animationItem.wrapper.innerText = ""), e = (this.layers ? this.layers.length : 0) - 1; e >= 0; e -= 1)
        this.elements[e] && this.elements[e].destroy();
      this.elements.length = 0, this.globalData.canvasContext = null, this.animationItem.container = null, this.destroyed = !0;
    }, CanvasRendererBase.prototype.renderFrame = function(e, r) {
      if ((this.renderedFrame !== e || this.renderConfig.clearCanvas !== !0 || r) && !this.destroyed && e !== -1) {
        var a;
        this.renderedFrame = e, this.globalData.frameNum = e - this.animationItem._isFirstFrame, this.globalData.frameId += 1, this.globalData._mdf = !this.renderConfig.clearCanvas || r, this.globalData.projectInterface.currentFrame = e;
        var i = this.layers.length;
        for (this.completeLayers || this.checkLayers(e), a = 0; a < i; a += 1)
          (this.completeLayers || this.elements[a]) && this.elements[a].prepareFrame(e - this.layers[a].st);
        if (this.globalData._mdf) {
          for (this.renderConfig.clearCanvas === !0 ? this.canvasContext.clearRect(0, 0, this.transformCanvas.w, this.transformCanvas.h) : this.save(), a = i - 1; a >= 0; a -= 1)
            (this.completeLayers || this.elements[a]) && this.elements[a].renderFrame();
          this.renderConfig.clearCanvas !== !0 && this.restore();
        }
      }
    }, CanvasRendererBase.prototype.buildItem = function(e) {
      var r = this.elements;
      if (!r[e] && this.layers[e].ty !== 99) {
        var a = this.createItem(this.layers[e], this, this.globalData);
        r[e] = a, a.initExpressions();
      }
    }, CanvasRendererBase.prototype.checkPendingElements = function() {
      for (; this.pendingElements.length; )
        this.pendingElements.pop().checkParenting();
    }, CanvasRendererBase.prototype.hide = function() {
      this.animationItem.container.style.display = "none";
    }, CanvasRendererBase.prototype.show = function() {
      this.animationItem.container.style.display = "block";
    }, extendPrototype([CanvasRendererBase, ICompElement, CVBaseElement], CVCompElement), CVCompElement.prototype.renderInnerContent = function() {
      var e, r = this.canvasContext;
      for (r.beginPath(), r.moveTo(0, 0), r.lineTo(this.data.w, 0), r.lineTo(this.data.w, this.data.h), r.lineTo(0, this.data.h), r.lineTo(0, 0), r.clip(), e = this.layers.length - 1; e >= 0; e -= 1)
        (this.completeLayers || this.elements[e]) && this.elements[e].renderFrame();
    }, CVCompElement.prototype.destroy = function() {
      var e;
      for (e = this.layers.length - 1; e >= 0; e -= 1)
        this.elements[e] && this.elements[e].destroy();
      this.layers = null, this.elements = null;
    }, CVCompElement.prototype.createComp = function(e) {
      return new CVCompElement(e, this.globalData, this);
    }, extendPrototype([CanvasRendererBase], CanvasRenderer), CanvasRenderer.prototype.createComp = function(e) {
      return new CVCompElement(e, this.globalData, this);
    }, HBaseElement.prototype = { checkBlendMode: function() {
    }, initRendererElement: function() {
      this.baseElement = createTag(this.data.tg || "div"), this.data.hasMask ? (this.svgElement = createNS("svg"), this.layerElement = createNS("g"), this.maskedElement = this.layerElement, this.svgElement.appendChild(this.layerElement), this.baseElement.appendChild(this.svgElement)) : this.layerElement = this.baseElement, styleDiv(this.baseElement);
    }, createContainerElements: function() {
      this.renderableEffectsManager = new CVEffects(), this.transformedElement = this.baseElement, this.maskedElement = this.layerElement, this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), this.data.bm !== 0 && this.setBlendMode();
    }, renderElement: function() {
      var e = this.transformedElement ? this.transformedElement.style : {};
      if (this.finalTransform._matMdf) {
        var r = this.finalTransform.mat.toCSS();
        e.transform = r, e.webkitTransform = r;
      }
      this.finalTransform._opMdf && (e.opacity = this.finalTransform.mProp.o.v);
    }, renderFrame: function() {
      this.data.hd || this.hidden || (this.renderTransform(), this.renderRenderable(), this.renderElement(), this.renderInnerContent(), this._isFirstFrame && (this._isFirstFrame = !1));
    }, destroy: function() {
      this.layerElement = null, this.transformedElement = null, this.matteElement && (this.matteElement = null), this.maskManager && (this.maskManager.destroy(), this.maskManager = null);
    }, createRenderableComponents: function() {
      this.maskManager = new MaskElement(this.data, this, this.globalData);
    }, addEffects: function() {
    }, setMatte: function() {
    } }, HBaseElement.prototype.getBaseElement = SVGBaseElement.prototype.getBaseElement, HBaseElement.prototype.destroyBaseElement = HBaseElement.prototype.destroy, HBaseElement.prototype.buildElementParenting = BaseRenderer.prototype.buildElementParenting, extendPrototype([BaseElement, TransformElement, HBaseElement, HierarchyElement, FrameElement, RenderableDOMElement], HSolidElement), HSolidElement.prototype.createContent = function() {
      var e;
      this.data.hasMask ? ((e = createNS("rect")).setAttribute("width", this.data.sw), e.setAttribute("height", this.data.sh), e.setAttribute("fill", this.data.sc), this.svgElement.setAttribute("width", this.data.sw), this.svgElement.setAttribute("height", this.data.sh)) : ((e = createTag("div")).style.width = this.data.sw + "px", e.style.height = this.data.sh + "px", e.style.backgroundColor = this.data.sc), this.layerElement.appendChild(e);
    }, extendPrototype([BaseElement, TransformElement, HSolidElement, SVGShapeElement, HBaseElement, HierarchyElement, FrameElement, RenderableElement], HShapeElement), HShapeElement.prototype._renderShapeFrame = HShapeElement.prototype.renderInnerContent, HShapeElement.prototype.createContent = function() {
      var e;
      if (this.baseElement.style.fontSize = 0, this.data.hasMask)
        this.layerElement.appendChild(this.shapesContainer), e = this.svgElement;
      else {
        e = createNS("svg");
        var r = this.comp.data ? this.comp.data : this.globalData.compSize;
        e.setAttribute("width", r.w), e.setAttribute("height", r.h), e.appendChild(this.shapesContainer), this.layerElement.appendChild(e);
      }
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.shapesContainer, 0, [], !0), this.filterUniqueShapes(), this.shapeCont = e;
    }, HShapeElement.prototype.getTransformedPoint = function(e, r) {
      var a, i = e.length;
      for (a = 0; a < i; a += 1)
        r = e[a].mProps.v.applyToPointArray(r[0], r[1], 0);
      return r;
    }, HShapeElement.prototype.calculateShapeBoundingBox = function(e, r) {
      var a, i, s, n, u, p = e.sh.v, b = e.transformers, x = p._length;
      if (!(x <= 1)) {
        for (a = 0; a < x - 1; a += 1)
          i = this.getTransformedPoint(b, p.v[a]), s = this.getTransformedPoint(b, p.o[a]), n = this.getTransformedPoint(b, p.i[a + 1]), u = this.getTransformedPoint(b, p.v[a + 1]), this.checkBounds(i, s, n, u, r);
        p.c && (i = this.getTransformedPoint(b, p.v[a]), s = this.getTransformedPoint(b, p.o[a]), n = this.getTransformedPoint(b, p.i[0]), u = this.getTransformedPoint(b, p.v[0]), this.checkBounds(i, s, n, u, r));
      }
    }, HShapeElement.prototype.checkBounds = function(e, r, a, i, s) {
      this.getBoundsOfCurve(e, r, a, i);
      var n = this.shapeBoundingBox;
      s.x = bmMin(n.left, s.x), s.xMax = bmMax(n.right, s.xMax), s.y = bmMin(n.top, s.y), s.yMax = bmMax(n.bottom, s.yMax);
    }, HShapeElement.prototype.shapeBoundingBox = { left: 0, right: 0, top: 0, bottom: 0 }, HShapeElement.prototype.tempBoundingBox = { x: 0, xMax: 0, y: 0, yMax: 0, width: 0, height: 0 }, HShapeElement.prototype.getBoundsOfCurve = function(e, r, a, i) {
      for (var s, n, u, p, b, x, c, f = [[e[0], i[0]], [e[1], i[1]]], m = 0; m < 2; ++m)
        n = 6 * e[m] - 12 * r[m] + 6 * a[m], s = -3 * e[m] + 9 * r[m] - 9 * a[m] + 3 * i[m], u = 3 * r[m] - 3 * e[m], n |= 0, u |= 0, (s |= 0) == 0 && n === 0 || (s === 0 ? (p = -u / n) > 0 && p < 1 && f[m].push(this.calculateF(p, e, r, a, i, m)) : (b = n * n - 4 * u * s) >= 0 && ((x = (-n + bmSqrt(b)) / (2 * s)) > 0 && x < 1 && f[m].push(this.calculateF(x, e, r, a, i, m)), (c = (-n - bmSqrt(b)) / (2 * s)) > 0 && c < 1 && f[m].push(this.calculateF(c, e, r, a, i, m))));
      this.shapeBoundingBox.left = bmMin.apply(null, f[0]), this.shapeBoundingBox.top = bmMin.apply(null, f[1]), this.shapeBoundingBox.right = bmMax.apply(null, f[0]), this.shapeBoundingBox.bottom = bmMax.apply(null, f[1]);
    }, HShapeElement.prototype.calculateF = function(e, r, a, i, s, n) {
      return bmPow(1 - e, 3) * r[n] + 3 * bmPow(1 - e, 2) * e * a[n] + 3 * (1 - e) * bmPow(e, 2) * i[n] + bmPow(e, 3) * s[n];
    }, HShapeElement.prototype.calculateBoundingBox = function(e, r) {
      var a, i = e.length;
      for (a = 0; a < i; a += 1)
        e[a] && e[a].sh ? this.calculateShapeBoundingBox(e[a], r) : e[a] && e[a].it ? this.calculateBoundingBox(e[a].it, r) : e[a] && e[a].style && e[a].w && this.expandStrokeBoundingBox(e[a].w, r);
    }, HShapeElement.prototype.expandStrokeBoundingBox = function(e, r) {
      var a = 0;
      if (e.keyframes) {
        for (var i = 0; i < e.keyframes.length; i += 1) {
          var s = e.keyframes[i].s;
          s > a && (a = s);
        }
        a *= e.mult;
      } else
        a = e.v * e.mult;
      r.x -= a, r.xMax += a, r.y -= a, r.yMax += a;
    }, HShapeElement.prototype.currentBoxContains = function(e) {
      return this.currentBBox.x <= e.x && this.currentBBox.y <= e.y && this.currentBBox.width + this.currentBBox.x >= e.x + e.width && this.currentBBox.height + this.currentBBox.y >= e.y + e.height;
    }, HShapeElement.prototype.renderInnerContent = function() {
      if (this._renderShapeFrame(), !this.hidden && (this._isFirstFrame || this._mdf)) {
        var e = this.tempBoundingBox, r = 999999;
        if (e.x = r, e.xMax = -r, e.y = r, e.yMax = -r, this.calculateBoundingBox(this.itemsData, e), e.width = e.xMax < e.x ? 0 : e.xMax - e.x, e.height = e.yMax < e.y ? 0 : e.yMax - e.y, this.currentBoxContains(e))
          return;
        var a = !1;
        if (this.currentBBox.w !== e.width && (this.currentBBox.w = e.width, this.shapeCont.setAttribute("width", e.width), a = !0), this.currentBBox.h !== e.height && (this.currentBBox.h = e.height, this.shapeCont.setAttribute("height", e.height), a = !0), a || this.currentBBox.x !== e.x || this.currentBBox.y !== e.y) {
          this.currentBBox.w = e.width, this.currentBBox.h = e.height, this.currentBBox.x = e.x, this.currentBBox.y = e.y, this.shapeCont.setAttribute("viewBox", this.currentBBox.x + " " + this.currentBBox.y + " " + this.currentBBox.w + " " + this.currentBBox.h);
          var i = this.shapeCont.style, s = "translate(" + this.currentBBox.x + "px," + this.currentBBox.y + "px)";
          i.transform = s, i.webkitTransform = s;
        }
      }
    }, extendPrototype([BaseElement, TransformElement, HBaseElement, HierarchyElement, FrameElement, RenderableDOMElement, ITextElement], HTextElement), HTextElement.prototype.createContent = function() {
      if (this.isMasked = this.checkMasks(), this.isMasked) {
        this.renderType = "svg", this.compW = this.comp.data.w, this.compH = this.comp.data.h, this.svgElement.setAttribute("width", this.compW), this.svgElement.setAttribute("height", this.compH);
        var e = createNS("g");
        this.maskedElement.appendChild(e), this.innerElem = e;
      } else
        this.renderType = "html", this.innerElem = this.layerElement;
      this.checkParenting();
    }, HTextElement.prototype.buildNewText = function() {
      var e = this.textProperty.currentData;
      this.renderedLetters = createSizedArray(e.l ? e.l.length : 0);
      var r = this.innerElem.style, a = e.fc ? this.buildColor(e.fc) : "rgba(0,0,0,0)";
      r.fill = a, r.color = a, e.sc && (r.stroke = this.buildColor(e.sc), r.strokeWidth = e.sw + "px");
      var i, s, n = this.globalData.fontManager.getFontByName(e.f);
      if (!this.globalData.fontManager.chars)
        if (r.fontSize = e.finalSize + "px", r.lineHeight = e.finalSize + "px", n.fClass)
          this.innerElem.className = n.fClass;
        else {
          r.fontFamily = n.fFamily;
          var u = e.fWeight, p = e.fStyle;
          r.fontStyle = p, r.fontWeight = u;
        }
      var b, x, c, f = e.l;
      s = f.length;
      var m, y = this.mHelper, d = "", l = 0;
      for (i = 0; i < s; i += 1) {
        if (this.globalData.fontManager.chars ? (this.textPaths[l] ? b = this.textPaths[l] : ((b = createNS("path")).setAttribute("stroke-linecap", lineCapEnum[1]), b.setAttribute("stroke-linejoin", lineJoinEnum[2]), b.setAttribute("stroke-miterlimit", "4")), this.isMasked || (this.textSpans[l] ? c = (x = this.textSpans[l]).children[0] : ((x = createTag("div")).style.lineHeight = 0, (c = createNS("svg")).appendChild(b), styleDiv(x)))) : this.isMasked ? b = this.textPaths[l] ? this.textPaths[l] : createNS("text") : this.textSpans[l] ? (x = this.textSpans[l], b = this.textPaths[l]) : (styleDiv(x = createTag("span")), styleDiv(b = createTag("span")), x.appendChild(b)), this.globalData.fontManager.chars) {
          var o, g = this.globalData.fontManager.getCharData(e.finalText[i], n.fStyle, this.globalData.fontManager.getFontByName(e.f).fFamily);
          if (o = g ? g.data : null, y.reset(), o && o.shapes && o.shapes.length && (m = o.shapes[0].it, y.scale(e.finalSize / 100, e.finalSize / 100), d = this.createPathShape(y, m), b.setAttribute("d", d)), this.isMasked)
            this.innerElem.appendChild(b);
          else {
            if (this.innerElem.appendChild(x), o && o.shapes) {
              document.body.appendChild(c);
              var _ = c.getBBox();
              c.setAttribute("width", _.width + 2), c.setAttribute("height", _.height + 2), c.setAttribute("viewBox", _.x - 1 + " " + (_.y - 1) + " " + (_.width + 2) + " " + (_.height + 2));
              var S = c.style, E = "translate(" + (_.x - 1) + "px," + (_.y - 1) + "px)";
              S.transform = E, S.webkitTransform = E, f[i].yOffset = _.y - 1;
            } else
              c.setAttribute("width", 1), c.setAttribute("height", 1);
            x.appendChild(c);
          }
        } else if (b.textContent = f[i].val, b.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"), this.isMasked)
          this.innerElem.appendChild(b);
        else {
          this.innerElem.appendChild(x);
          var P = b.style, k = "translate3d(0," + -e.finalSize / 1.2 + "px,0)";
          P.transform = k, P.webkitTransform = k;
        }
        this.isMasked ? this.textSpans[l] = b : this.textSpans[l] = x, this.textSpans[l].style.display = "block", this.textPaths[l] = b, l += 1;
      }
      for (; l < this.textSpans.length; )
        this.textSpans[l].style.display = "none", l += 1;
    }, HTextElement.prototype.renderInnerContent = function() {
      var e;
      if (this.data.singleShape) {
        if (!this._isFirstFrame && !this.lettersChangedFlag)
          return;
        if (this.isMasked && this.finalTransform._matMdf) {
          this.svgElement.setAttribute("viewBox", -this.finalTransform.mProp.p.v[0] + " " + -this.finalTransform.mProp.p.v[1] + " " + this.compW + " " + this.compH), e = this.svgElement.style;
          var r = "translate(" + -this.finalTransform.mProp.p.v[0] + "px," + -this.finalTransform.mProp.p.v[1] + "px)";
          e.transform = r, e.webkitTransform = r;
        }
      }
      if (this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag), this.lettersChangedFlag || this.textAnimator.lettersChangedFlag) {
        var a, i, s, n, u, p = 0, b = this.textAnimator.renderedLetters, x = this.textProperty.currentData.l;
        for (i = x.length, a = 0; a < i; a += 1)
          x[a].n ? p += 1 : (n = this.textSpans[a], u = this.textPaths[a], s = b[p], p += 1, s._mdf.m && (this.isMasked ? n.setAttribute("transform", s.m) : (n.style.webkitTransform = s.m, n.style.transform = s.m)), n.style.opacity = s.o, s.sw && s._mdf.sw && u.setAttribute("stroke-width", s.sw), s.sc && s._mdf.sc && u.setAttribute("stroke", s.sc), s.fc && s._mdf.fc && (u.setAttribute("fill", s.fc), u.style.color = s.fc));
        if (this.innerElem.getBBox && !this.hidden && (this._isFirstFrame || this._mdf)) {
          var c = this.innerElem.getBBox();
          if (this.currentBBox.w !== c.width && (this.currentBBox.w = c.width, this.svgElement.setAttribute("width", c.width)), this.currentBBox.h !== c.height && (this.currentBBox.h = c.height, this.svgElement.setAttribute("height", c.height)), this.currentBBox.w !== c.width + 2 || this.currentBBox.h !== c.height + 2 || this.currentBBox.x !== c.x - 1 || this.currentBBox.y !== c.y - 1) {
            this.currentBBox.w = c.width + 2, this.currentBBox.h = c.height + 2, this.currentBBox.x = c.x - 1, this.currentBBox.y = c.y - 1, this.svgElement.setAttribute("viewBox", this.currentBBox.x + " " + this.currentBBox.y + " " + this.currentBBox.w + " " + this.currentBBox.h), e = this.svgElement.style;
            var f = "translate(" + this.currentBBox.x + "px," + this.currentBBox.y + "px)";
            e.transform = f, e.webkitTransform = f;
          }
        }
      }
    }, extendPrototype([BaseElement, FrameElement, HierarchyElement], HCameraElement), HCameraElement.prototype.setup = function() {
      var e, r, a, i, s = this.comp.threeDElements.length;
      for (e = 0; e < s; e += 1)
        if ((r = this.comp.threeDElements[e]).type === "3d") {
          a = r.perspectiveElem.style, i = r.container.style;
          var n = this.pe.v + "px", u = "0px 0px 0px", p = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
          a.perspective = n, a.webkitPerspective = n, i.transformOrigin = u, i.mozTransformOrigin = u, i.webkitTransformOrigin = u, a.transform = p, a.webkitTransform = p;
        }
    }, HCameraElement.prototype.createElements = function() {
    }, HCameraElement.prototype.hide = function() {
    }, HCameraElement.prototype.renderFrame = function() {
      var e, r, a = this._isFirstFrame;
      if (this.hierarchy)
        for (r = this.hierarchy.length, e = 0; e < r; e += 1)
          a = this.hierarchy[e].finalTransform.mProp._mdf || a;
      if (a || this.pe._mdf || this.p && this.p._mdf || this.px && (this.px._mdf || this.py._mdf || this.pz._mdf) || this.rx._mdf || this.ry._mdf || this.rz._mdf || this.or._mdf || this.a && this.a._mdf) {
        if (this.mat.reset(), this.hierarchy)
          for (e = r = this.hierarchy.length - 1; e >= 0; e -= 1) {
            var i = this.hierarchy[e].finalTransform.mProp;
            this.mat.translate(-i.p.v[0], -i.p.v[1], i.p.v[2]), this.mat.rotateX(-i.or.v[0]).rotateY(-i.or.v[1]).rotateZ(i.or.v[2]), this.mat.rotateX(-i.rx.v).rotateY(-i.ry.v).rotateZ(i.rz.v), this.mat.scale(1 / i.s.v[0], 1 / i.s.v[1], 1 / i.s.v[2]), this.mat.translate(i.a.v[0], i.a.v[1], i.a.v[2]);
          }
        if (this.p ? this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2]) : this.mat.translate(-this.px.v, -this.py.v, this.pz.v), this.a) {
          var s;
          s = this.p ? [this.p.v[0] - this.a.v[0], this.p.v[1] - this.a.v[1], this.p.v[2] - this.a.v[2]] : [this.px.v - this.a.v[0], this.py.v - this.a.v[1], this.pz.v - this.a.v[2]];
          var n = Math.sqrt(Math.pow(s[0], 2) + Math.pow(s[1], 2) + Math.pow(s[2], 2)), u = [s[0] / n, s[1] / n, s[2] / n], p = Math.sqrt(u[2] * u[2] + u[0] * u[0]), b = Math.atan2(u[1], p), x = Math.atan2(u[0], -u[2]);
          this.mat.rotateY(x).rotateX(-b);
        }
        this.mat.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v), this.mat.rotateX(-this.or.v[0]).rotateY(-this.or.v[1]).rotateZ(this.or.v[2]), this.mat.translate(this.globalData.compSize.w / 2, this.globalData.compSize.h / 2, 0), this.mat.translate(0, 0, this.pe.v);
        var c = !this._prevMat.equals(this.mat);
        if ((c || this.pe._mdf) && this.comp.threeDElements) {
          var f, m, y;
          for (r = this.comp.threeDElements.length, e = 0; e < r; e += 1)
            if ((f = this.comp.threeDElements[e]).type === "3d") {
              if (c) {
                var d = this.mat.toCSS();
                (y = f.container.style).transform = d, y.webkitTransform = d;
              }
              this.pe._mdf && ((m = f.perspectiveElem.style).perspective = this.pe.v + "px", m.webkitPerspective = this.pe.v + "px");
            }
          this.mat.clone(this._prevMat);
        }
      }
      this._isFirstFrame = !1;
    }, HCameraElement.prototype.prepareFrame = function(e) {
      this.prepareProperties(e, !0);
    }, HCameraElement.prototype.destroy = function() {
    }, HCameraElement.prototype.getBaseElement = function() {
      return null;
    }, extendPrototype([BaseElement, TransformElement, HBaseElement, HSolidElement, HierarchyElement, FrameElement, RenderableElement], HImageElement), HImageElement.prototype.createContent = function() {
      var e = this.globalData.getAssetsPath(this.assetData), r = new Image();
      this.data.hasMask ? (this.imageElem = createNS("image"), this.imageElem.setAttribute("width", this.assetData.w + "px"), this.imageElem.setAttribute("height", this.assetData.h + "px"), this.imageElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", e), this.layerElement.appendChild(this.imageElem), this.baseElement.setAttribute("width", this.assetData.w), this.baseElement.setAttribute("height", this.assetData.h)) : this.layerElement.appendChild(r), r.crossOrigin = "anonymous", r.src = e, this.data.ln && this.baseElement.setAttribute("id", this.data.ln);
    }, extendPrototype([BaseRenderer], HybridRendererBase), HybridRendererBase.prototype.buildItem = SVGRenderer.prototype.buildItem, HybridRendererBase.prototype.checkPendingElements = function() {
      for (; this.pendingElements.length; )
        this.pendingElements.pop().checkParenting();
    }, HybridRendererBase.prototype.appendElementInPos = function(e, r) {
      var a = e.getBaseElement();
      if (a) {
        var i = this.layers[r];
        if (i.ddd && this.supports3d)
          this.addTo3dContainer(a, r);
        else if (this.threeDElements)
          this.addTo3dContainer(a, r);
        else {
          for (var s, n, u = 0; u < r; )
            this.elements[u] && this.elements[u] !== !0 && this.elements[u].getBaseElement && (n = this.elements[u], s = (this.layers[u].ddd ? this.getThreeDContainerByPos(u) : n.getBaseElement()) || s), u += 1;
          s ? i.ddd && this.supports3d || this.layerElement.insertBefore(a, s) : i.ddd && this.supports3d || this.layerElement.appendChild(a);
        }
      }
    }, HybridRendererBase.prototype.createShape = function(e) {
      return this.supports3d ? new HShapeElement(e, this.globalData, this) : new SVGShapeElement(e, this.globalData, this);
    }, HybridRendererBase.prototype.createText = function(e) {
      return this.supports3d ? new HTextElement(e, this.globalData, this) : new SVGTextLottieElement(e, this.globalData, this);
    }, HybridRendererBase.prototype.createCamera = function(e) {
      return this.camera = new HCameraElement(e, this.globalData, this), this.camera;
    }, HybridRendererBase.prototype.createImage = function(e) {
      return this.supports3d ? new HImageElement(e, this.globalData, this) : new IImageElement(e, this.globalData, this);
    }, HybridRendererBase.prototype.createSolid = function(e) {
      return this.supports3d ? new HSolidElement(e, this.globalData, this) : new ISolidElement(e, this.globalData, this);
    }, HybridRendererBase.prototype.createNull = SVGRenderer.prototype.createNull, HybridRendererBase.prototype.getThreeDContainerByPos = function(e) {
      for (var r = 0, a = this.threeDElements.length; r < a; ) {
        if (this.threeDElements[r].startPos <= e && this.threeDElements[r].endPos >= e)
          return this.threeDElements[r].perspectiveElem;
        r += 1;
      }
      return null;
    }, HybridRendererBase.prototype.createThreeDContainer = function(e, r) {
      var a, i, s = createTag("div");
      styleDiv(s);
      var n = createTag("div");
      if (styleDiv(n), r === "3d") {
        (a = s.style).width = this.globalData.compSize.w + "px", a.height = this.globalData.compSize.h + "px";
        var u = "50% 50%";
        a.webkitTransformOrigin = u, a.mozTransformOrigin = u, a.transformOrigin = u;
        var p = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
        (i = n.style).transform = p, i.webkitTransform = p;
      }
      s.appendChild(n);
      var b = { container: n, perspectiveElem: s, startPos: e, endPos: e, type: r };
      return this.threeDElements.push(b), b;
    }, HybridRendererBase.prototype.build3dContainers = function() {
      var e, r, a = this.layers.length, i = "";
      for (e = 0; e < a; e += 1)
        this.layers[e].ddd && this.layers[e].ty !== 3 ? (i !== "3d" && (i = "3d", r = this.createThreeDContainer(e, "3d")), r.endPos = Math.max(r.endPos, e)) : (i !== "2d" && (i = "2d", r = this.createThreeDContainer(e, "2d")), r.endPos = Math.max(r.endPos, e));
      for (e = (a = this.threeDElements.length) - 1; e >= 0; e -= 1)
        this.resizerElem.appendChild(this.threeDElements[e].perspectiveElem);
    }, HybridRendererBase.prototype.addTo3dContainer = function(e, r) {
      for (var a = 0, i = this.threeDElements.length; a < i; ) {
        if (r <= this.threeDElements[a].endPos) {
          for (var s, n = this.threeDElements[a].startPos; n < r; )
            this.elements[n] && this.elements[n].getBaseElement && (s = this.elements[n].getBaseElement()), n += 1;
          s ? this.threeDElements[a].container.insertBefore(e, s) : this.threeDElements[a].container.appendChild(e);
          break;
        }
        a += 1;
      }
    }, HybridRendererBase.prototype.configAnimation = function(e) {
      var r = createTag("div"), a = this.animationItem.wrapper, i = r.style;
      i.width = e.w + "px", i.height = e.h + "px", this.resizerElem = r, styleDiv(r), i.transformStyle = "flat", i.mozTransformStyle = "flat", i.webkitTransformStyle = "flat", this.renderConfig.className && r.setAttribute("class", this.renderConfig.className), a.appendChild(r), i.overflow = "hidden";
      var s = createNS("svg");
      s.setAttribute("width", "1"), s.setAttribute("height", "1"), styleDiv(s), this.resizerElem.appendChild(s);
      var n = createNS("defs");
      s.appendChild(n), this.data = e, this.setupGlobalData(e, s), this.globalData.defs = n, this.layers = e.layers, this.layerElement = this.resizerElem, this.build3dContainers(), this.updateContainerSize();
    }, HybridRendererBase.prototype.destroy = function() {
      var e;
      this.animationItem.wrapper && (this.animationItem.wrapper.innerText = ""), this.animationItem.container = null, this.globalData.defs = null;
      var r = this.layers ? this.layers.length : 0;
      for (e = 0; e < r; e += 1)
        this.elements[e].destroy();
      this.elements.length = 0, this.destroyed = !0, this.animationItem = null;
    }, HybridRendererBase.prototype.updateContainerSize = function() {
      var e, r, a, i, s = this.animationItem.wrapper.offsetWidth, n = this.animationItem.wrapper.offsetHeight, u = s / n;
      this.globalData.compSize.w / this.globalData.compSize.h > u ? (e = s / this.globalData.compSize.w, r = s / this.globalData.compSize.w, a = 0, i = (n - this.globalData.compSize.h * (s / this.globalData.compSize.w)) / 2) : (e = n / this.globalData.compSize.h, r = n / this.globalData.compSize.h, a = (s - this.globalData.compSize.w * (n / this.globalData.compSize.h)) / 2, i = 0);
      var p = this.resizerElem.style;
      p.webkitTransform = "matrix3d(" + e + ",0,0,0,0," + r + ",0,0,0,0,1,0," + a + "," + i + ",0,1)", p.transform = p.webkitTransform;
    }, HybridRendererBase.prototype.renderFrame = SVGRenderer.prototype.renderFrame, HybridRendererBase.prototype.hide = function() {
      this.resizerElem.style.display = "none";
    }, HybridRendererBase.prototype.show = function() {
      this.resizerElem.style.display = "block";
    }, HybridRendererBase.prototype.initItems = function() {
      if (this.buildAllItems(), this.camera)
        this.camera.setup();
      else {
        var e, r = this.globalData.compSize.w, a = this.globalData.compSize.h, i = this.threeDElements.length;
        for (e = 0; e < i; e += 1) {
          var s = this.threeDElements[e].perspectiveElem.style;
          s.webkitPerspective = Math.sqrt(Math.pow(r, 2) + Math.pow(a, 2)) + "px", s.perspective = s.webkitPerspective;
        }
      }
    }, HybridRendererBase.prototype.searchExtraCompositions = function(e) {
      var r, a = e.length, i = createTag("div");
      for (r = 0; r < a; r += 1)
        if (e[r].xt) {
          var s = this.createComp(e[r], i, this.globalData.comp, null);
          s.initExpressions(), this.globalData.projectInterface.registerComposition(s);
        }
    }, extendPrototype([HybridRendererBase, ICompElement, HBaseElement], HCompElement), HCompElement.prototype._createBaseContainerElements = HCompElement.prototype.createContainerElements, HCompElement.prototype.createContainerElements = function() {
      this._createBaseContainerElements(), this.data.hasMask ? (this.svgElement.setAttribute("width", this.data.w), this.svgElement.setAttribute("height", this.data.h), this.transformedElement = this.baseElement) : this.transformedElement = this.layerElement;
    }, HCompElement.prototype.addTo3dContainer = function(e, r) {
      for (var a, i = 0; i < r; )
        this.elements[i] && this.elements[i].getBaseElement && (a = this.elements[i].getBaseElement()), i += 1;
      a ? this.layerElement.insertBefore(e, a) : this.layerElement.appendChild(e);
    }, HCompElement.prototype.createComp = function(e) {
      return this.supports3d ? new HCompElement(e, this.globalData, this) : new SVGCompElement(e, this.globalData, this);
    }, extendPrototype([HybridRendererBase], HybridRenderer), HybridRenderer.prototype.createComp = function(e) {
      return this.supports3d ? new HCompElement(e, this.globalData, this) : new SVGCompElement(e, this.globalData, this);
    };
    var Expressions = function() {
      var e = { initExpressions: function(r) {
        var a = 0, i = [];
        r.renderer.compInterface = CompExpressionInterface(r.renderer), r.renderer.globalData.projectInterface.registerComposition(r.renderer), r.renderer.globalData.pushExpression = function() {
          a += 1;
        }, r.renderer.globalData.popExpression = function() {
          (a -= 1) == 0 && function() {
            var s, n = i.length;
            for (s = 0; s < n; s += 1)
              i[s].release();
            i.length = 0;
          }();
        }, r.renderer.globalData.registerExpressionProperty = function(s) {
          i.indexOf(s) === -1 && i.push(s);
        };
      } };
      return e;
    }();
    function _typeof$1(e) {
      return _typeof$1 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
        return typeof r;
      } : function(r) {
        return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
      }, _typeof$1(e);
    }
    function seedRandom(e, r) {
      var a = this, i = 256, s = r.pow(i, 6), n = r.pow(2, 52), u = 2 * n, p = 255;
      function b(y) {
        var d, l = y.length, o = this, g = 0, _ = o.i = o.j = 0, S = o.S = [];
        for (l || (y = [l++]); g < i; )
          S[g] = g++;
        for (g = 0; g < i; g++)
          S[g] = S[_ = p & _ + y[g % l] + (d = S[g])], S[_] = d;
        o.g = function(E) {
          for (var P, k = 0, C = o.i, A = o.j, M = o.S; E--; )
            P = M[C = p & C + 1], k = k * i + M[p & (M[C] = M[A = p & A + P]) + (M[A] = P)];
          return o.i = C, o.j = A, k;
        };
      }
      function x(y, d) {
        return d.i = y.i, d.j = y.j, d.S = y.S.slice(), d;
      }
      function c(y, d) {
        var l, o = [], g = _typeof$1(y);
        if (d && g == "object")
          for (l in y)
            try {
              o.push(c(y[l], d - 1));
            } catch {
            }
        return o.length ? o : g == "string" ? y : y + "\0";
      }
      function f(y, d) {
        for (var l, o = y + "", g = 0; g < o.length; )
          d[p & g] = p & (l ^= 19 * d[p & g]) + o.charCodeAt(g++);
        return m(d);
      }
      function m(y) {
        return String.fromCharCode.apply(0, y);
      }
      r.seedrandom = function(y, d, l) {
        var o = [], g = f(c((d = d === !0 ? { entropy: !0 } : d || {}).entropy ? [y, m(e)] : y === null ? function() {
          try {
            var E = new Uint8Array(i);
            return (a.crypto || a.msCrypto).getRandomValues(E), m(E);
          } catch {
            var P = a.navigator, k = P && P.plugins;
            return [+new Date(), a, k, a.screen, m(e)];
          }
        }() : y, 3), o), _ = new b(o), S = function() {
          for (var E = _.g(6), P = s, k = 0; E < n; )
            E = (E + k) * i, P *= i, k = _.g(1);
          for (; E >= u; )
            E /= 2, P /= 2, k >>>= 1;
          return (E + k) / P;
        };
        return S.int32 = function() {
          return 0 | _.g(4);
        }, S.quick = function() {
          return _.g(4) / 4294967296;
        }, S.double = S, f(m(_.S), e), (d.pass || l || function(E, P, k, C) {
          return C && (C.S && x(C, _), E.state = function() {
            return x(_, {});
          }), k ? (r.random = E, P) : E;
        })(S, g, "global" in d ? d.global : this == r, d.state);
      }, f(r.random(), e);
    }
    function initialize$2(e) {
      seedRandom([], e);
    }
    var propTypes = { SHAPE: "shape" };
    function _typeof(e) {
      return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
        return typeof r;
      } : function(r) {
        return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
      }, _typeof(e);
    }
    var ExpressionManager = function() {
      var ob = {}, Math = BMMath, window = null, document = null, XMLHttpRequest = null, fetch = null, frames = null;
      function $bm_isInstanceOfArray(e) {
        return e.constructor === Array || e.constructor === Float32Array;
      }
      function isNumerable(e, r) {
        return e === "number" || e === "boolean" || e === "string" || r instanceof Number;
      }
      function $bm_neg(e) {
        var r = _typeof(e);
        if (r === "number" || r === "boolean" || e instanceof Number)
          return -e;
        if ($bm_isInstanceOfArray(e)) {
          var a, i = e.length, s = [];
          for (a = 0; a < i; a += 1)
            s[a] = -e[a];
          return s;
        }
        return e.propType ? e.v : -e;
      }
      initialize$2(BMMath);
      var easeInBez = BezierFactory.getBezierEasing(0.333, 0, 0.833, 0.833, "easeIn").get, easeOutBez = BezierFactory.getBezierEasing(0.167, 0.167, 0.667, 1, "easeOut").get, easeInOutBez = BezierFactory.getBezierEasing(0.33, 0, 0.667, 1, "easeInOut").get;
      function sum(e, r) {
        var a = _typeof(e), i = _typeof(r);
        if (a === "string" || i === "string" || isNumerable(a, e) && isNumerable(i, r))
          return e + r;
        if ($bm_isInstanceOfArray(e) && isNumerable(i, r))
          return (e = e.slice(0))[0] += r, e;
        if (isNumerable(a, e) && $bm_isInstanceOfArray(r))
          return (r = r.slice(0))[0] = e + r[0], r;
        if ($bm_isInstanceOfArray(e) && $bm_isInstanceOfArray(r)) {
          for (var s = 0, n = e.length, u = r.length, p = []; s < n || s < u; )
            (typeof e[s] == "number" || e[s] instanceof Number) && (typeof r[s] == "number" || r[s] instanceof Number) ? p[s] = e[s] + r[s] : p[s] = r[s] === void 0 ? e[s] : e[s] || r[s], s += 1;
          return p;
        }
        return 0;
      }
      var add = sum;
      function sub(e, r) {
        var a = _typeof(e), i = _typeof(r);
        if (isNumerable(a, e) && isNumerable(i, r))
          return a === "string" && (e = parseInt(e, 10)), i === "string" && (r = parseInt(r, 10)), e - r;
        if ($bm_isInstanceOfArray(e) && isNumerable(i, r))
          return (e = e.slice(0))[0] -= r, e;
        if (isNumerable(a, e) && $bm_isInstanceOfArray(r))
          return (r = r.slice(0))[0] = e - r[0], r;
        if ($bm_isInstanceOfArray(e) && $bm_isInstanceOfArray(r)) {
          for (var s = 0, n = e.length, u = r.length, p = []; s < n || s < u; )
            (typeof e[s] == "number" || e[s] instanceof Number) && (typeof r[s] == "number" || r[s] instanceof Number) ? p[s] = e[s] - r[s] : p[s] = r[s] === void 0 ? e[s] : e[s] || r[s], s += 1;
          return p;
        }
        return 0;
      }
      function mul(e, r) {
        var a, i, s, n = _typeof(e), u = _typeof(r);
        if (isNumerable(n, e) && isNumerable(u, r))
          return e * r;
        if ($bm_isInstanceOfArray(e) && isNumerable(u, r)) {
          for (s = e.length, a = createTypedArray("float32", s), i = 0; i < s; i += 1)
            a[i] = e[i] * r;
          return a;
        }
        if (isNumerable(n, e) && $bm_isInstanceOfArray(r)) {
          for (s = r.length, a = createTypedArray("float32", s), i = 0; i < s; i += 1)
            a[i] = e * r[i];
          return a;
        }
        return 0;
      }
      function div(e, r) {
        var a, i, s, n = _typeof(e), u = _typeof(r);
        if (isNumerable(n, e) && isNumerable(u, r))
          return e / r;
        if ($bm_isInstanceOfArray(e) && isNumerable(u, r)) {
          for (s = e.length, a = createTypedArray("float32", s), i = 0; i < s; i += 1)
            a[i] = e[i] / r;
          return a;
        }
        if (isNumerable(n, e) && $bm_isInstanceOfArray(r)) {
          for (s = r.length, a = createTypedArray("float32", s), i = 0; i < s; i += 1)
            a[i] = e / r[i];
          return a;
        }
        return 0;
      }
      function mod(e, r) {
        return typeof e == "string" && (e = parseInt(e, 10)), typeof r == "string" && (r = parseInt(r, 10)), e % r;
      }
      var $bm_sum = sum, $bm_sub = sub, $bm_mul = mul, $bm_div = div, $bm_mod = mod;
      function clamp(e, r, a) {
        if (r > a) {
          var i = a;
          a = r, r = i;
        }
        return Math.min(Math.max(e, r), a);
      }
      function radiansToDegrees(e) {
        return e / degToRads;
      }
      var radians_to_degrees = radiansToDegrees;
      function degreesToRadians(e) {
        return e * degToRads;
      }
      var degrees_to_radians = radiansToDegrees, helperLengthArray = [0, 0, 0, 0, 0, 0];
      function length(e, r) {
        if (typeof e == "number" || e instanceof Number)
          return r = r || 0, Math.abs(e - r);
        var a;
        r || (r = helperLengthArray);
        var i = Math.min(e.length, r.length), s = 0;
        for (a = 0; a < i; a += 1)
          s += Math.pow(r[a] - e[a], 2);
        return Math.sqrt(s);
      }
      function normalize(e) {
        return div(e, length(e));
      }
      function rgbToHsl(e) {
        var r, a, i = e[0], s = e[1], n = e[2], u = Math.max(i, s, n), p = Math.min(i, s, n), b = (u + p) / 2;
        if (u === p)
          r = 0, a = 0;
        else {
          var x = u - p;
          switch (a = b > 0.5 ? x / (2 - u - p) : x / (u + p), u) {
            case i:
              r = (s - n) / x + (s < n ? 6 : 0);
              break;
            case s:
              r = (n - i) / x + 2;
              break;
            case n:
              r = (i - s) / x + 4;
          }
          r /= 6;
        }
        return [r, a, b, e[3]];
      }
      function hue2rgb(e, r, a) {
        return a < 0 && (a += 1), a > 1 && (a -= 1), a < 1 / 6 ? e + 6 * (r - e) * a : a < 0.5 ? r : a < 2 / 3 ? e + (r - e) * (2 / 3 - a) * 6 : e;
      }
      function hslToRgb(e) {
        var r, a, i, s = e[0], n = e[1], u = e[2];
        if (n === 0)
          r = u, i = u, a = u;
        else {
          var p = u < 0.5 ? u * (1 + n) : u + n - u * n, b = 2 * u - p;
          r = hue2rgb(b, p, s + 1 / 3), a = hue2rgb(b, p, s), i = hue2rgb(b, p, s - 1 / 3);
        }
        return [r, a, i, e[3]];
      }
      function linear(e, r, a, i, s) {
        if (i !== void 0 && s !== void 0 || (i = r, s = a, r = 0, a = 1), a < r) {
          var n = a;
          a = r, r = n;
        }
        if (e <= r)
          return i;
        if (e >= a)
          return s;
        var u, p = a === r ? 0 : (e - r) / (a - r);
        if (!i.length)
          return i + (s - i) * p;
        var b = i.length, x = createTypedArray("float32", b);
        for (u = 0; u < b; u += 1)
          x[u] = i[u] + (s[u] - i[u]) * p;
        return x;
      }
      function random(e, r) {
        if (r === void 0 && (e === void 0 ? (e = 0, r = 1) : (r = e, e = void 0)), r.length) {
          var a, i = r.length;
          e || (e = createTypedArray("float32", i));
          var s = createTypedArray("float32", i), n = BMMath.random();
          for (a = 0; a < i; a += 1)
            s[a] = e[a] + n * (r[a] - e[a]);
          return s;
        }
        return e === void 0 && (e = 0), e + BMMath.random() * (r - e);
      }
      function createPath(e, r, a, i) {
        var s, n = e.length, u = shapePool.newElement();
        u.setPathData(!!i, n);
        var p, b, x = [0, 0];
        for (s = 0; s < n; s += 1)
          p = r && r[s] ? r[s] : x, b = a && a[s] ? a[s] : x, u.setTripleAt(e[s][0], e[s][1], b[0] + e[s][0], b[1] + e[s][1], p[0] + e[s][0], p[1] + e[s][1], s, !0);
        return u;
      }
      function initiateExpression(elem, data, property) {
        var val = data.x, needsVelocity = /velocity(?![\w\d])/.test(val), _needsRandom = val.indexOf("random") !== -1, elemType = elem.data.ty, transform, $bm_transform, content, effect, thisProperty = property;
        thisProperty.valueAtTime = thisProperty.getValueAtTime, Object.defineProperty(thisProperty, "value", { get: function() {
          return thisProperty.v;
        } }), elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate, elem.comp.displayStartTime = 0;
        var inPoint = elem.data.ip / elem.comp.globalData.frameRate, outPoint = elem.data.op / elem.comp.globalData.frameRate, width = elem.data.sw ? elem.data.sw : 0, height = elem.data.sh ? elem.data.sh : 0, name = elem.data.nm, loopIn, loop_in, loopOut, loop_out, smooth, toWorld, fromWorld, fromComp, toComp, fromCompToSurface, position, rotation, anchorPoint, scale, thisLayer, thisComp, mask, valueAtTime, velocityAtTime, scoped_bm_rt, expression_function = eval("[function _expression_function(){" + val + ";scoped_bm_rt=$bm_rt}]")[0], numKeys = property.kf ? data.k.length : 0, active = !this.data || this.data.hd !== !0, wiggle = function(e, r) {
          var a, i, s = this.pv.length ? this.pv.length : 1, n = createTypedArray("float32", s), u = Math.floor(5 * time);
          for (a = 0, i = 0; a < u; ) {
            for (i = 0; i < s; i += 1)
              n[i] += -r + 2 * r * BMMath.random();
            a += 1;
          }
          var p = 5 * time, b = p - Math.floor(p), x = createTypedArray("float32", s);
          if (s > 1) {
            for (i = 0; i < s; i += 1)
              x[i] = this.pv[i] + n[i] + (-r + 2 * r * BMMath.random()) * b;
            return x;
          }
          return this.pv + n[0] + (-r + 2 * r * BMMath.random()) * b;
        }.bind(this);
        function loopInDuration(e, r) {
          return loopIn(e, r, !0);
        }
        function loopOutDuration(e, r) {
          return loopOut(e, r, !0);
        }
        thisProperty.loopIn && (loopIn = thisProperty.loopIn.bind(thisProperty), loop_in = loopIn), thisProperty.loopOut && (loopOut = thisProperty.loopOut.bind(thisProperty), loop_out = loopOut), thisProperty.smooth && (smooth = thisProperty.smooth.bind(thisProperty)), this.getValueAtTime && (valueAtTime = this.getValueAtTime.bind(this)), this.getVelocityAtTime && (velocityAtTime = this.getVelocityAtTime.bind(this));
        var comp = elem.comp.globalData.projectInterface.bind(elem.comp.globalData.projectInterface), time, velocity, value, text, textIndex, textTotal, selectorValue;
        function lookAt(e, r) {
          var a = [r[0] - e[0], r[1] - e[1], r[2] - e[2]], i = Math.atan2(a[0], Math.sqrt(a[1] * a[1] + a[2] * a[2])) / degToRads;
          return [-Math.atan2(a[1], a[2]) / degToRads, i, 0];
        }
        function easeOut(e, r, a, i, s) {
          return applyEase(easeOutBez, e, r, a, i, s);
        }
        function easeIn(e, r, a, i, s) {
          return applyEase(easeInBez, e, r, a, i, s);
        }
        function ease(e, r, a, i, s) {
          return applyEase(easeInOutBez, e, r, a, i, s);
        }
        function applyEase(e, r, a, i, s, n) {
          s === void 0 ? (s = a, n = i) : r = (r - a) / (i - a), r > 1 ? r = 1 : r < 0 && (r = 0);
          var u = e(r);
          if ($bm_isInstanceOfArray(s)) {
            var p, b = s.length, x = createTypedArray("float32", b);
            for (p = 0; p < b; p += 1)
              x[p] = (n[p] - s[p]) * u + s[p];
            return x;
          }
          return (n - s) * u + s;
        }
        function nearestKey(e) {
          var r, a, i, s = data.k.length;
          if (data.k.length && typeof data.k[0] != "number")
            if (a = -1, (e *= elem.comp.globalData.frameRate) < data.k[0].t)
              a = 1, i = data.k[0].t;
            else {
              for (r = 0; r < s - 1; r += 1) {
                if (e === data.k[r].t) {
                  a = r + 1, i = data.k[r].t;
                  break;
                }
                if (e > data.k[r].t && e < data.k[r + 1].t) {
                  e - data.k[r].t > data.k[r + 1].t - e ? (a = r + 2, i = data.k[r + 1].t) : (a = r + 1, i = data.k[r].t);
                  break;
                }
              }
              a === -1 && (a = r + 1, i = data.k[r].t);
            }
          else
            a = 0, i = 0;
          var n = {};
          return n.index = a, n.time = i / elem.comp.globalData.frameRate, n;
        }
        function key(e) {
          var r, a, i;
          if (!data.k.length || typeof data.k[0] == "number")
            throw new Error("The property has no keyframe at index " + e);
          e -= 1, r = { time: data.k[e].t / elem.comp.globalData.frameRate, value: [] };
          var s = Object.prototype.hasOwnProperty.call(data.k[e], "s") ? data.k[e].s : data.k[e - 1].e;
          for (i = s.length, a = 0; a < i; a += 1)
            r[a] = s[a], r.value[a] = s[a];
          return r;
        }
        function framesToTime(e, r) {
          return r || (r = elem.comp.globalData.frameRate), e / r;
        }
        function timeToFrames(e, r) {
          return e || e === 0 || (e = time), r || (r = elem.comp.globalData.frameRate), e * r;
        }
        function seedRandom(e) {
          BMMath.seedrandom(randSeed + e);
        }
        function sourceRectAtTime() {
          return elem.sourceRectAtTime();
        }
        function substring(e, r) {
          return typeof value == "string" ? r === void 0 ? value.substring(e) : value.substring(e, r) : "";
        }
        function substr(e, r) {
          return typeof value == "string" ? r === void 0 ? value.substr(e) : value.substr(e, r) : "";
        }
        function posterizeTime(e) {
          time = e === 0 ? 0 : Math.floor(time * e) / e, value = valueAtTime(time);
        }
        var index = elem.data.ind, hasParent = !(!elem.hierarchy || !elem.hierarchy.length), parent, randSeed = Math.floor(1e6 * Math.random()), globalData = elem.globalData;
        function executeExpression(e) {
          return value = e, this.frameExpressionId === elem.globalData.frameId && this.propType !== "textSelector" ? value : (this.propType === "textSelector" && (textIndex = this.textIndex, textTotal = this.textTotal, selectorValue = this.selectorValue), thisLayer || (text = elem.layerInterface.text, thisLayer = elem.layerInterface, thisComp = elem.comp.compInterface, toWorld = thisLayer.toWorld.bind(thisLayer), fromWorld = thisLayer.fromWorld.bind(thisLayer), fromComp = thisLayer.fromComp.bind(thisLayer), toComp = thisLayer.toComp.bind(thisLayer), mask = thisLayer.mask ? thisLayer.mask.bind(thisLayer) : null, fromCompToSurface = fromComp), transform || (transform = elem.layerInterface("ADBE Transform Group"), $bm_transform = transform, transform && (anchorPoint = transform.anchorPoint)), elemType !== 4 || content || (content = thisLayer("ADBE Root Vectors Group")), effect || (effect = thisLayer(4)), (hasParent = !(!elem.hierarchy || !elem.hierarchy.length)) && !parent && (parent = elem.hierarchy[0].layerInterface), time = this.comp.renderedFrame / this.comp.globalData.frameRate, _needsRandom && seedRandom(randSeed + time), needsVelocity && (velocity = velocityAtTime(time)), expression_function(), this.frameExpressionId = elem.globalData.frameId, scoped_bm_rt = scoped_bm_rt.propType === propTypes.SHAPE ? scoped_bm_rt.v : scoped_bm_rt);
        }
        return executeExpression.__preventDeadCodeRemoval = [$bm_transform, anchorPoint, time, velocity, inPoint, outPoint, width, height, name, loop_in, loop_out, smooth, toComp, fromCompToSurface, toWorld, fromWorld, mask, position, rotation, scale, thisComp, numKeys, active, wiggle, loopInDuration, loopOutDuration, comp, lookAt, easeOut, easeIn, ease, nearestKey, key, text, textIndex, textTotal, selectorValue, framesToTime, timeToFrames, sourceRectAtTime, substring, substr, posterizeTime, index, globalData], executeExpression;
      }
      return ob.initiateExpression = initiateExpression, ob.__preventDeadCodeRemoval = [window, document, XMLHttpRequest, fetch, frames, $bm_neg, add, $bm_sum, $bm_sub, $bm_mul, $bm_div, $bm_mod, clamp, radians_to_degrees, degreesToRadians, degrees_to_radians, normalize, rgbToHsl, hslToRgb, linear, random, createPath], ob;
    }(), expressionHelpers = { searchExpressions: function(e, r, a) {
      r.x && (a.k = !0, a.x = !0, a.initiateExpression = ExpressionManager.initiateExpression, a.effectsSequence.push(a.initiateExpression(e, r, a).bind(a)));
    }, getSpeedAtTime: function(e) {
      var r = this.getValueAtTime(e), a = this.getValueAtTime(e + -0.01), i = 0;
      if (r.length) {
        var s;
        for (s = 0; s < r.length; s += 1)
          i += Math.pow(a[s] - r[s], 2);
        i = 100 * Math.sqrt(i);
      } else
        i = 0;
      return i;
    }, getVelocityAtTime: function(e) {
      if (this.vel !== void 0)
        return this.vel;
      var r, a, i = -1e-3, s = this.getValueAtTime(e), n = this.getValueAtTime(e + i);
      if (s.length)
        for (r = createTypedArray("float32", s.length), a = 0; a < s.length; a += 1)
          r[a] = (n[a] - s[a]) / i;
      else
        r = (n - s) / i;
      return r;
    }, getValueAtTime: function(e) {
      return e *= this.elem.globalData.frameRate, (e -= this.offsetTime) !== this._cachingAtTime.lastFrame && (this._cachingAtTime.lastIndex = this._cachingAtTime.lastFrame < e ? this._cachingAtTime.lastIndex : 0, this._cachingAtTime.value = this.interpolateValue(e, this._cachingAtTime), this._cachingAtTime.lastFrame = e), this._cachingAtTime.value;
    }, getStaticValueAtTime: function() {
      return this.pv;
    }, setGroupProperty: function(e) {
      this.propertyGroup = e;
    } };
    function addPropertyDecorator() {
      function e(f, m, y) {
        if (!this.k || !this.keyframes)
          return this.pv;
        f = f ? f.toLowerCase() : "";
        var d, l, o, g, _, S = this.comp.renderedFrame, E = this.keyframes, P = E[E.length - 1].t;
        if (S <= P)
          return this.pv;
        if (y ? l = P - (d = m ? Math.abs(P - this.elem.comp.globalData.frameRate * m) : Math.max(0, P - this.elem.data.ip)) : ((!m || m > E.length - 1) && (m = E.length - 1), d = P - (l = E[E.length - 1 - m].t)), f === "pingpong") {
          if (Math.floor((S - l) / d) % 2 != 0)
            return this.getValueAtTime((d - (S - l) % d + l) / this.comp.globalData.frameRate, 0);
        } else {
          if (f === "offset") {
            var k = this.getValueAtTime(l / this.comp.globalData.frameRate, 0), C = this.getValueAtTime(P / this.comp.globalData.frameRate, 0), A = this.getValueAtTime(((S - l) % d + l) / this.comp.globalData.frameRate, 0), M = Math.floor((S - l) / d);
            if (this.pv.length) {
              for (g = (_ = new Array(k.length)).length, o = 0; o < g; o += 1)
                _[o] = (C[o] - k[o]) * M + A[o];
              return _;
            }
            return (C - k) * M + A;
          }
          if (f === "continue") {
            var I = this.getValueAtTime(P / this.comp.globalData.frameRate, 0), D = this.getValueAtTime((P - 1e-3) / this.comp.globalData.frameRate, 0);
            if (this.pv.length) {
              for (g = (_ = new Array(I.length)).length, o = 0; o < g; o += 1)
                _[o] = I[o] + (I[o] - D[o]) * ((S - P) / this.comp.globalData.frameRate) / 5e-4;
              return _;
            }
            return I + (S - P) / 1e-3 * (I - D);
          }
        }
        return this.getValueAtTime(((S - l) % d + l) / this.comp.globalData.frameRate, 0);
      }
      function r(f, m, y) {
        if (!this.k)
          return this.pv;
        f = f ? f.toLowerCase() : "";
        var d, l, o, g, _, S = this.comp.renderedFrame, E = this.keyframes, P = E[0].t;
        if (S >= P)
          return this.pv;
        if (y ? l = P + (d = m ? Math.abs(this.elem.comp.globalData.frameRate * m) : Math.max(0, this.elem.data.op - P)) : ((!m || m > E.length - 1) && (m = E.length - 1), d = (l = E[m].t) - P), f === "pingpong") {
          if (Math.floor((P - S) / d) % 2 == 0)
            return this.getValueAtTime(((P - S) % d + P) / this.comp.globalData.frameRate, 0);
        } else {
          if (f === "offset") {
            var k = this.getValueAtTime(P / this.comp.globalData.frameRate, 0), C = this.getValueAtTime(l / this.comp.globalData.frameRate, 0), A = this.getValueAtTime((d - (P - S) % d + P) / this.comp.globalData.frameRate, 0), M = Math.floor((P - S) / d) + 1;
            if (this.pv.length) {
              for (g = (_ = new Array(k.length)).length, o = 0; o < g; o += 1)
                _[o] = A[o] - (C[o] - k[o]) * M;
              return _;
            }
            return A - (C - k) * M;
          }
          if (f === "continue") {
            var I = this.getValueAtTime(P / this.comp.globalData.frameRate, 0), D = this.getValueAtTime((P + 1e-3) / this.comp.globalData.frameRate, 0);
            if (this.pv.length) {
              for (g = (_ = new Array(I.length)).length, o = 0; o < g; o += 1)
                _[o] = I[o] + (I[o] - D[o]) * (P - S) / 1e-3;
              return _;
            }
            return I + (I - D) * (P - S) / 1e-3;
          }
        }
        return this.getValueAtTime((d - ((P - S) % d + P)) / this.comp.globalData.frameRate, 0);
      }
      function a(f, m) {
        if (!this.k)
          return this.pv;
        if (f = 0.5 * (f || 0.4), (m = Math.floor(m || 5)) <= 1)
          return this.pv;
        var y, d, l = this.comp.renderedFrame / this.comp.globalData.frameRate, o = l - f, g = m > 1 ? (l + f - o) / (m - 1) : 1, _ = 0, S = 0;
        for (y = this.pv.length ? createTypedArray("float32", this.pv.length) : 0; _ < m; ) {
          if (d = this.getValueAtTime(o + _ * g), this.pv.length)
            for (S = 0; S < this.pv.length; S += 1)
              y[S] += d[S];
          else
            y += d;
          _ += 1;
        }
        if (this.pv.length)
          for (S = 0; S < this.pv.length; S += 1)
            y[S] /= m;
        else
          y /= m;
        return y;
      }
      function i(f) {
        this._transformCachingAtTime || (this._transformCachingAtTime = { v: new Matrix() });
        var m = this._transformCachingAtTime.v;
        if (m.cloneFromProps(this.pre.props), this.appliedTransformations < 1) {
          var y = this.a.getValueAtTime(f);
          m.translate(-y[0] * this.a.mult, -y[1] * this.a.mult, y[2] * this.a.mult);
        }
        if (this.appliedTransformations < 2) {
          var d = this.s.getValueAtTime(f);
          m.scale(d[0] * this.s.mult, d[1] * this.s.mult, d[2] * this.s.mult);
        }
        if (this.sk && this.appliedTransformations < 3) {
          var l = this.sk.getValueAtTime(f), o = this.sa.getValueAtTime(f);
          m.skewFromAxis(-l * this.sk.mult, o * this.sa.mult);
        }
        if (this.r && this.appliedTransformations < 4) {
          var g = this.r.getValueAtTime(f);
          m.rotate(-g * this.r.mult);
        } else if (!this.r && this.appliedTransformations < 4) {
          var _ = this.rz.getValueAtTime(f), S = this.ry.getValueAtTime(f), E = this.rx.getValueAtTime(f), P = this.or.getValueAtTime(f);
          m.rotateZ(-_ * this.rz.mult).rotateY(S * this.ry.mult).rotateX(E * this.rx.mult).rotateZ(-P[2] * this.or.mult).rotateY(P[1] * this.or.mult).rotateX(P[0] * this.or.mult);
        }
        if (this.data.p && this.data.p.s) {
          var k = this.px.getValueAtTime(f), C = this.py.getValueAtTime(f);
          if (this.data.p.z) {
            var A = this.pz.getValueAtTime(f);
            m.translate(k * this.px.mult, C * this.py.mult, -A * this.pz.mult);
          } else
            m.translate(k * this.px.mult, C * this.py.mult, 0);
        } else {
          var M = this.p.getValueAtTime(f);
          m.translate(M[0] * this.p.mult, M[1] * this.p.mult, -M[2] * this.p.mult);
        }
        return m;
      }
      function s() {
        return this.v.clone(new Matrix());
      }
      var n = TransformPropertyFactory.getTransformProperty;
      TransformPropertyFactory.getTransformProperty = function(f, m, y) {
        var d = n(f, m, y);
        return d.dynamicProperties.length ? d.getValueAtTime = i.bind(d) : d.getValueAtTime = s.bind(d), d.setGroupProperty = expressionHelpers.setGroupProperty, d;
      };
      var u = PropertyFactory.getProp;
      PropertyFactory.getProp = function(f, m, y, d, l) {
        var o = u(f, m, y, d, l);
        o.kf ? o.getValueAtTime = expressionHelpers.getValueAtTime.bind(o) : o.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(o), o.setGroupProperty = expressionHelpers.setGroupProperty, o.loopOut = e, o.loopIn = r, o.smooth = a, o.getVelocityAtTime = expressionHelpers.getVelocityAtTime.bind(o), o.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(o), o.numKeys = m.a === 1 ? m.k.length : 0, o.propertyIndex = m.ix;
        var g = 0;
        return y !== 0 && (g = createTypedArray("float32", m.a === 1 ? m.k[0].s.length : m.k.length)), o._cachingAtTime = { lastFrame: initialDefaultFrame, lastIndex: 0, value: g }, expressionHelpers.searchExpressions(f, m, o), o.k && l.addDynamicProperty(o), o;
      };
      var p = ShapePropertyFactory.getConstructorFunction(), b = ShapePropertyFactory.getKeyframedConstructorFunction();
      function x() {
      }
      x.prototype = { vertices: function(f, m) {
        this.k && this.getValue();
        var y, d = this.v;
        m !== void 0 && (d = this.getValueAtTime(m, 0));
        var l = d._length, o = d[f], g = d.v, _ = createSizedArray(l);
        for (y = 0; y < l; y += 1)
          _[y] = f === "i" || f === "o" ? [o[y][0] - g[y][0], o[y][1] - g[y][1]] : [o[y][0], o[y][1]];
        return _;
      }, points: function(f) {
        return this.vertices("v", f);
      }, inTangents: function(f) {
        return this.vertices("i", f);
      }, outTangents: function(f) {
        return this.vertices("o", f);
      }, isClosed: function() {
        return this.v.c;
      }, pointOnPath: function(f, m) {
        var y = this.v;
        m !== void 0 && (y = this.getValueAtTime(m, 0)), this._segmentsLength || (this._segmentsLength = bez.getSegmentsLength(y));
        for (var d, l = this._segmentsLength, o = l.lengths, g = l.totalLength * f, _ = 0, S = o.length, E = 0; _ < S; ) {
          if (E + o[_].addedLength > g) {
            var P = _, k = y.c && _ === S - 1 ? 0 : _ + 1, C = (g - E) / o[_].addedLength;
            d = bez.getPointInSegment(y.v[P], y.v[k], y.o[P], y.i[k], C, o[_]);
            break;
          }
          E += o[_].addedLength, _ += 1;
        }
        return d || (d = y.c ? [y.v[0][0], y.v[0][1]] : [y.v[y._length - 1][0], y.v[y._length - 1][1]]), d;
      }, vectorOnPath: function(f, m, y) {
        f == 1 ? f = this.v.c : f == 0 && (f = 0.999);
        var d = this.pointOnPath(f, m), l = this.pointOnPath(f + 1e-3, m), o = l[0] - d[0], g = l[1] - d[1], _ = Math.sqrt(Math.pow(o, 2) + Math.pow(g, 2));
        return _ === 0 ? [0, 0] : y === "tangent" ? [o / _, g / _] : [-g / _, o / _];
      }, tangentOnPath: function(f, m) {
        return this.vectorOnPath(f, m, "tangent");
      }, normalOnPath: function(f, m) {
        return this.vectorOnPath(f, m, "normal");
      }, setGroupProperty: expressionHelpers.setGroupProperty, getValueAtTime: expressionHelpers.getStaticValueAtTime }, extendPrototype([x], p), extendPrototype([x], b), b.prototype.getValueAtTime = function(f) {
        return this._cachingAtTime || (this._cachingAtTime = { shapeValue: shapePool.clone(this.pv), lastIndex: 0, lastTime: initialDefaultFrame }), f *= this.elem.globalData.frameRate, (f -= this.offsetTime) !== this._cachingAtTime.lastTime && (this._cachingAtTime.lastIndex = this._cachingAtTime.lastTime < f ? this._caching.lastIndex : 0, this._cachingAtTime.lastTime = f, this.interpolateShape(f, this._cachingAtTime.shapeValue, this._cachingAtTime)), this._cachingAtTime.shapeValue;
      }, b.prototype.initiateExpression = ExpressionManager.initiateExpression;
      var c = ShapePropertyFactory.getShapeProp;
      ShapePropertyFactory.getShapeProp = function(f, m, y, d, l) {
        var o = c(f, m, y, d, l);
        return o.propertyIndex = m.ix, o.lock = !1, y === 3 ? expressionHelpers.searchExpressions(f, m.pt, o) : y === 4 && expressionHelpers.searchExpressions(f, m.ks, o), o.k && f.addDynamicProperty(o), o;
      };
    }
    function initialize$1() {
      addPropertyDecorator();
    }
    function addDecorator() {
      TextProperty.prototype.getExpressionValue = function(e, r) {
        var a = this.calculateExpression(r);
        if (e.t !== a) {
          var i = {};
          return this.copyData(i, e), i.t = a.toString(), i.__complete = !1, i;
        }
        return e;
      }, TextProperty.prototype.searchProperty = function() {
        var e = this.searchKeyframes(), r = this.searchExpressions();
        return this.kf = e || r, this.kf;
      }, TextProperty.prototype.searchExpressions = function() {
        return this.data.d.x ? (this.calculateExpression = ExpressionManager.initiateExpression.bind(this)(this.elem, this.data.d, this), this.addEffect(this.getExpressionValue.bind(this)), !0) : null;
      };
    }
    function initialize() {
      addDecorator();
    }
    function SVGComposableEffect() {
    }
    function SVGTintFilter(e, r, a, i, s) {
      this.filterManager = r;
      var n = createNS("feColorMatrix");
      n.setAttribute("type", "matrix"), n.setAttribute("color-interpolation-filters", "linearRGB"), n.setAttribute("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"), n.setAttribute("result", i + "_tint_1"), e.appendChild(n), (n = createNS("feColorMatrix")).setAttribute("type", "matrix"), n.setAttribute("color-interpolation-filters", "sRGB"), n.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"), n.setAttribute("result", i + "_tint_2"), e.appendChild(n), this.matrixFilter = n;
      var u = this.createMergeNode(i, [s, i + "_tint_1", i + "_tint_2"]);
      e.appendChild(u);
    }
    function SVGFillFilter(e, r, a, i) {
      this.filterManager = r;
      var s = createNS("feColorMatrix");
      s.setAttribute("type", "matrix"), s.setAttribute("color-interpolation-filters", "sRGB"), s.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"), s.setAttribute("result", i), e.appendChild(s), this.matrixFilter = s;
    }
    function SVGStrokeEffect(e, r, a) {
      this.initialized = !1, this.filterManager = r, this.elem = a, this.paths = [];
    }
    function SVGTritoneFilter(e, r, a, i) {
      this.filterManager = r;
      var s = createNS("feColorMatrix");
      s.setAttribute("type", "matrix"), s.setAttribute("color-interpolation-filters", "linearRGB"), s.setAttribute("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"), e.appendChild(s);
      var n = createNS("feComponentTransfer");
      n.setAttribute("color-interpolation-filters", "sRGB"), n.setAttribute("result", i), this.matrixFilter = n;
      var u = createNS("feFuncR");
      u.setAttribute("type", "table"), n.appendChild(u), this.feFuncR = u;
      var p = createNS("feFuncG");
      p.setAttribute("type", "table"), n.appendChild(p), this.feFuncG = p;
      var b = createNS("feFuncB");
      b.setAttribute("type", "table"), n.appendChild(b), this.feFuncB = b, e.appendChild(n);
    }
    function SVGProLevelsFilter(e, r, a, i) {
      this.filterManager = r;
      var s = this.filterManager.effectElements, n = createNS("feComponentTransfer");
      (s[10].p.k || s[10].p.v !== 0 || s[11].p.k || s[11].p.v !== 1 || s[12].p.k || s[12].p.v !== 1 || s[13].p.k || s[13].p.v !== 0 || s[14].p.k || s[14].p.v !== 1) && (this.feFuncR = this.createFeFunc("feFuncR", n)), (s[17].p.k || s[17].p.v !== 0 || s[18].p.k || s[18].p.v !== 1 || s[19].p.k || s[19].p.v !== 1 || s[20].p.k || s[20].p.v !== 0 || s[21].p.k || s[21].p.v !== 1) && (this.feFuncG = this.createFeFunc("feFuncG", n)), (s[24].p.k || s[24].p.v !== 0 || s[25].p.k || s[25].p.v !== 1 || s[26].p.k || s[26].p.v !== 1 || s[27].p.k || s[27].p.v !== 0 || s[28].p.k || s[28].p.v !== 1) && (this.feFuncB = this.createFeFunc("feFuncB", n)), (s[31].p.k || s[31].p.v !== 0 || s[32].p.k || s[32].p.v !== 1 || s[33].p.k || s[33].p.v !== 1 || s[34].p.k || s[34].p.v !== 0 || s[35].p.k || s[35].p.v !== 1) && (this.feFuncA = this.createFeFunc("feFuncA", n)), (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) && (n.setAttribute("color-interpolation-filters", "sRGB"), e.appendChild(n)), (s[3].p.k || s[3].p.v !== 0 || s[4].p.k || s[4].p.v !== 1 || s[5].p.k || s[5].p.v !== 1 || s[6].p.k || s[6].p.v !== 0 || s[7].p.k || s[7].p.v !== 1) && ((n = createNS("feComponentTransfer")).setAttribute("color-interpolation-filters", "sRGB"), n.setAttribute("result", i), e.appendChild(n), this.feFuncRComposed = this.createFeFunc("feFuncR", n), this.feFuncGComposed = this.createFeFunc("feFuncG", n), this.feFuncBComposed = this.createFeFunc("feFuncB", n));
    }
    function SVGDropShadowEffect(e, r, a, i, s) {
      var n = r.container.globalData.renderConfig.filterSize, u = r.data.fs || n;
      e.setAttribute("x", u.x || n.x), e.setAttribute("y", u.y || n.y), e.setAttribute("width", u.width || n.width), e.setAttribute("height", u.height || n.height), this.filterManager = r;
      var p = createNS("feGaussianBlur");
      p.setAttribute("in", "SourceAlpha"), p.setAttribute("result", i + "_drop_shadow_1"), p.setAttribute("stdDeviation", "0"), this.feGaussianBlur = p, e.appendChild(p);
      var b = createNS("feOffset");
      b.setAttribute("dx", "25"), b.setAttribute("dy", "0"), b.setAttribute("in", i + "_drop_shadow_1"), b.setAttribute("result", i + "_drop_shadow_2"), this.feOffset = b, e.appendChild(b);
      var x = createNS("feFlood");
      x.setAttribute("flood-color", "#00ff00"), x.setAttribute("flood-opacity", "1"), x.setAttribute("result", i + "_drop_shadow_3"), this.feFlood = x, e.appendChild(x);
      var c = createNS("feComposite");
      c.setAttribute("in", i + "_drop_shadow_3"), c.setAttribute("in2", i + "_drop_shadow_2"), c.setAttribute("operator", "in"), c.setAttribute("result", i + "_drop_shadow_4"), e.appendChild(c);
      var f = this.createMergeNode(i, [i + "_drop_shadow_4", s]);
      e.appendChild(f);
    }
    SVGComposableEffect.prototype = { createMergeNode: function(e, r) {
      var a, i, s = createNS("feMerge");
      for (s.setAttribute("result", e), i = 0; i < r.length; i += 1)
        (a = createNS("feMergeNode")).setAttribute("in", r[i]), s.appendChild(a), s.appendChild(a);
      return s;
    } }, extendPrototype([SVGComposableEffect], SVGTintFilter), SVGTintFilter.prototype.renderFrame = function(e) {
      if (e || this.filterManager._mdf) {
        var r = this.filterManager.effectElements[0].p.v, a = this.filterManager.effectElements[1].p.v, i = this.filterManager.effectElements[2].p.v / 100;
        this.matrixFilter.setAttribute("values", a[0] - r[0] + " 0 0 0 " + r[0] + " " + (a[1] - r[1]) + " 0 0 0 " + r[1] + " " + (a[2] - r[2]) + " 0 0 0 " + r[2] + " 0 0 0 " + i + " 0");
      }
    }, SVGFillFilter.prototype.renderFrame = function(e) {
      if (e || this.filterManager._mdf) {
        var r = this.filterManager.effectElements[2].p.v, a = this.filterManager.effectElements[6].p.v;
        this.matrixFilter.setAttribute("values", "0 0 0 0 " + r[0] + " 0 0 0 0 " + r[1] + " 0 0 0 0 " + r[2] + " 0 0 0 " + a + " 0");
      }
    }, SVGStrokeEffect.prototype.initialize = function() {
      var e, r, a, i, s = this.elem.layerElement.children || this.elem.layerElement.childNodes;
      for (this.filterManager.effectElements[1].p.v === 1 ? (i = this.elem.maskManager.masksProperties.length, a = 0) : i = 1 + (a = this.filterManager.effectElements[0].p.v - 1), (r = createNS("g")).setAttribute("fill", "none"), r.setAttribute("stroke-linecap", "round"), r.setAttribute("stroke-dashoffset", 1); a < i; a += 1)
        e = createNS("path"), r.appendChild(e), this.paths.push({ p: e, m: a });
      if (this.filterManager.effectElements[10].p.v === 3) {
        var n = createNS("mask"), u = createElementID();
        n.setAttribute("id", u), n.setAttribute("mask-type", "alpha"), n.appendChild(r), this.elem.globalData.defs.appendChild(n);
        var p = createNS("g");
        for (p.setAttribute("mask", "url(" + getLocationHref() + "#" + u + ")"); s[0]; )
          p.appendChild(s[0]);
        this.elem.layerElement.appendChild(p), this.masker = n, r.setAttribute("stroke", "#fff");
      } else if (this.filterManager.effectElements[10].p.v === 1 || this.filterManager.effectElements[10].p.v === 2) {
        if (this.filterManager.effectElements[10].p.v === 2)
          for (s = this.elem.layerElement.children || this.elem.layerElement.childNodes; s.length; )
            this.elem.layerElement.removeChild(s[0]);
        this.elem.layerElement.appendChild(r), this.elem.layerElement.removeAttribute("mask"), r.setAttribute("stroke", "#fff");
      }
      this.initialized = !0, this.pathMasker = r;
    }, SVGStrokeEffect.prototype.renderFrame = function(e) {
      var r;
      this.initialized || this.initialize();
      var a, i, s = this.paths.length;
      for (r = 0; r < s; r += 1)
        if (this.paths[r].m !== -1 && (a = this.elem.maskManager.viewData[this.paths[r].m], i = this.paths[r].p, (e || this.filterManager._mdf || a.prop._mdf) && i.setAttribute("d", a.lastPath), e || this.filterManager.effectElements[9].p._mdf || this.filterManager.effectElements[4].p._mdf || this.filterManager.effectElements[7].p._mdf || this.filterManager.effectElements[8].p._mdf || a.prop._mdf)) {
          var n;
          if (this.filterManager.effectElements[7].p.v !== 0 || this.filterManager.effectElements[8].p.v !== 100) {
            var u = 0.01 * Math.min(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v), p = 0.01 * Math.max(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v), b = i.getTotalLength();
            n = "0 0 0 " + b * u + " ";
            var x, c = b * (p - u), f = 1 + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v * 0.01, m = Math.floor(c / f);
            for (x = 0; x < m; x += 1)
              n += "1 " + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v * 0.01 + " ";
            n += "0 " + 10 * b + " 0 0";
          } else
            n = "1 " + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v * 0.01;
          i.setAttribute("stroke-dasharray", n);
        }
      if ((e || this.filterManager.effectElements[4].p._mdf) && this.pathMasker.setAttribute("stroke-width", 2 * this.filterManager.effectElements[4].p.v), (e || this.filterManager.effectElements[6].p._mdf) && this.pathMasker.setAttribute("opacity", this.filterManager.effectElements[6].p.v), (this.filterManager.effectElements[10].p.v === 1 || this.filterManager.effectElements[10].p.v === 2) && (e || this.filterManager.effectElements[3].p._mdf)) {
        var y = this.filterManager.effectElements[3].p.v;
        this.pathMasker.setAttribute("stroke", "rgb(" + bmFloor(255 * y[0]) + "," + bmFloor(255 * y[1]) + "," + bmFloor(255 * y[2]) + ")");
      }
    }, SVGTritoneFilter.prototype.renderFrame = function(e) {
      if (e || this.filterManager._mdf) {
        var r = this.filterManager.effectElements[0].p.v, a = this.filterManager.effectElements[1].p.v, i = this.filterManager.effectElements[2].p.v, s = i[0] + " " + a[0] + " " + r[0], n = i[1] + " " + a[1] + " " + r[1], u = i[2] + " " + a[2] + " " + r[2];
        this.feFuncR.setAttribute("tableValues", s), this.feFuncG.setAttribute("tableValues", n), this.feFuncB.setAttribute("tableValues", u);
      }
    }, SVGProLevelsFilter.prototype.createFeFunc = function(e, r) {
      var a = createNS(e);
      return a.setAttribute("type", "table"), r.appendChild(a), a;
    }, SVGProLevelsFilter.prototype.getTableValue = function(e, r, a, i, s) {
      for (var n, u, p = 0, b = Math.min(e, r), x = Math.max(e, r), c = Array.call(null, { length: 256 }), f = 0, m = s - i, y = r - e; p <= 256; )
        u = (n = p / 256) <= b ? y < 0 ? s : i : n >= x ? y < 0 ? i : s : i + m * Math.pow((n - e) / y, 1 / a), c[f] = u, f += 1, p += 256 / 255;
      return c.join(" ");
    }, SVGProLevelsFilter.prototype.renderFrame = function(e) {
      if (e || this.filterManager._mdf) {
        var r, a = this.filterManager.effectElements;
        this.feFuncRComposed && (e || a[3].p._mdf || a[4].p._mdf || a[5].p._mdf || a[6].p._mdf || a[7].p._mdf) && (r = this.getTableValue(a[3].p.v, a[4].p.v, a[5].p.v, a[6].p.v, a[7].p.v), this.feFuncRComposed.setAttribute("tableValues", r), this.feFuncGComposed.setAttribute("tableValues", r), this.feFuncBComposed.setAttribute("tableValues", r)), this.feFuncR && (e || a[10].p._mdf || a[11].p._mdf || a[12].p._mdf || a[13].p._mdf || a[14].p._mdf) && (r = this.getTableValue(a[10].p.v, a[11].p.v, a[12].p.v, a[13].p.v, a[14].p.v), this.feFuncR.setAttribute("tableValues", r)), this.feFuncG && (e || a[17].p._mdf || a[18].p._mdf || a[19].p._mdf || a[20].p._mdf || a[21].p._mdf) && (r = this.getTableValue(a[17].p.v, a[18].p.v, a[19].p.v, a[20].p.v, a[21].p.v), this.feFuncG.setAttribute("tableValues", r)), this.feFuncB && (e || a[24].p._mdf || a[25].p._mdf || a[26].p._mdf || a[27].p._mdf || a[28].p._mdf) && (r = this.getTableValue(a[24].p.v, a[25].p.v, a[26].p.v, a[27].p.v, a[28].p.v), this.feFuncB.setAttribute("tableValues", r)), this.feFuncA && (e || a[31].p._mdf || a[32].p._mdf || a[33].p._mdf || a[34].p._mdf || a[35].p._mdf) && (r = this.getTableValue(a[31].p.v, a[32].p.v, a[33].p.v, a[34].p.v, a[35].p.v), this.feFuncA.setAttribute("tableValues", r));
      }
    }, extendPrototype([SVGComposableEffect], SVGDropShadowEffect), SVGDropShadowEffect.prototype.renderFrame = function(e) {
      if (e || this.filterManager._mdf) {
        if ((e || this.filterManager.effectElements[4].p._mdf) && this.feGaussianBlur.setAttribute("stdDeviation", this.filterManager.effectElements[4].p.v / 4), e || this.filterManager.effectElements[0].p._mdf) {
          var r = this.filterManager.effectElements[0].p.v;
          this.feFlood.setAttribute("flood-color", rgbToHex(Math.round(255 * r[0]), Math.round(255 * r[1]), Math.round(255 * r[2])));
        }
        if ((e || this.filterManager.effectElements[1].p._mdf) && this.feFlood.setAttribute("flood-opacity", this.filterManager.effectElements[1].p.v / 255), e || this.filterManager.effectElements[2].p._mdf || this.filterManager.effectElements[3].p._mdf) {
          var a = this.filterManager.effectElements[3].p.v, i = (this.filterManager.effectElements[2].p.v - 90) * degToRads, s = a * Math.cos(i), n = a * Math.sin(i);
          this.feOffset.setAttribute("dx", s), this.feOffset.setAttribute("dy", n);
        }
      }
    };
    var _svgMatteSymbols = [];
    function SVGMatte3Effect(e, r, a) {
      this.initialized = !1, this.filterManager = r, this.filterElem = e, this.elem = a, a.matteElement = createNS("g"), a.matteElement.appendChild(a.layerElement), a.matteElement.appendChild(a.transformedElement), a.baseElement = a.matteElement;
    }
    function SVGGaussianBlurEffect(e, r, a, i) {
      e.setAttribute("x", "-100%"), e.setAttribute("y", "-100%"), e.setAttribute("width", "300%"), e.setAttribute("height", "300%"), this.filterManager = r;
      var s = createNS("feGaussianBlur");
      s.setAttribute("result", i), e.appendChild(s), this.feGaussianBlur = s;
    }
    return SVGMatte3Effect.prototype.findSymbol = function(e) {
      for (var r = 0, a = _svgMatteSymbols.length; r < a; ) {
        if (_svgMatteSymbols[r] === e)
          return _svgMatteSymbols[r];
        r += 1;
      }
      return null;
    }, SVGMatte3Effect.prototype.replaceInParent = function(e, r) {
      var a = e.layerElement.parentNode;
      if (a) {
        for (var i, s = a.children, n = 0, u = s.length; n < u && s[n] !== e.layerElement; )
          n += 1;
        n <= u - 2 && (i = s[n + 1]);
        var p = createNS("use");
        p.setAttribute("href", "#" + r), i ? a.insertBefore(p, i) : a.appendChild(p);
      }
    }, SVGMatte3Effect.prototype.setElementAsMask = function(e, r) {
      if (!this.findSymbol(r)) {
        var a = createElementID(), i = createNS("mask");
        i.setAttribute("id", r.layerId), i.setAttribute("mask-type", "alpha"), _svgMatteSymbols.push(r);
        var s = e.globalData.defs;
        s.appendChild(i);
        var n = createNS("symbol");
        n.setAttribute("id", a), this.replaceInParent(r, a), n.appendChild(r.layerElement), s.appendChild(n);
        var u = createNS("use");
        u.setAttribute("href", "#" + a), i.appendChild(u), r.data.hd = !1, r.show();
      }
      e.setMatte(r.layerId);
    }, SVGMatte3Effect.prototype.initialize = function() {
      for (var e = this.filterManager.effectElements[0].p.v, r = this.elem.comp.elements, a = 0, i = r.length; a < i; )
        r[a] && r[a].data.ind === e && this.setElementAsMask(this.elem, r[a]), a += 1;
      this.initialized = !0;
    }, SVGMatte3Effect.prototype.renderFrame = function() {
      this.initialized || this.initialize();
    }, SVGGaussianBlurEffect.prototype.renderFrame = function(e) {
      if (e || this.filterManager._mdf) {
        var r = 0.3 * this.filterManager.effectElements[0].p.v, a = this.filterManager.effectElements[1].p.v, i = a == 3 ? 0 : r, s = a == 2 ? 0 : r;
        this.feGaussianBlur.setAttribute("stdDeviation", i + " " + s);
        var n = this.filterManager.effectElements[2].p.v == 1 ? "wrap" : "duplicate";
        this.feGaussianBlur.setAttribute("edgeMode", n);
      }
    }, registerRenderer("canvas", CanvasRenderer), registerRenderer("html", HybridRenderer), registerRenderer("svg", SVGRenderer), ShapeModifiers.registerModifier("tm", TrimModifier), ShapeModifiers.registerModifier("pb", PuckerAndBloatModifier), ShapeModifiers.registerModifier("rp", RepeaterModifier), ShapeModifiers.registerModifier("rd", RoundCornersModifier), setExpressionsPlugin(Expressions), initialize$1(), initialize(), registerEffect(20, SVGTintFilter, !0), registerEffect(21, SVGFillFilter, !0), registerEffect(22, SVGStrokeEffect, !1), registerEffect(23, SVGTritoneFilter, !0), registerEffect(24, SVGProLevelsFilter, !0), registerEffect(25, SVGDropShadowEffect, !0), registerEffect(28, SVGMatte3Effect, !1), registerEffect(29, SVGGaussianBlurEffect, !0), lottie;
  }, module.exports = factory());
})(lottie$1, lottie$1.exports);
const lottie = lottie$1.exports, _export_sfc = (e, r) => {
  const a = e.__vccOpts || e;
  for (const [i, s] of r)
    a[i] = s;
  return a;
}, _sfc_main$5 = { props: { className: String, options: { type: Object, required: !0 }, height: String, width: String }, components: {}, data: () => ({ anim: null }), computed: {}, watch: {}, created() {
}, mounted() {
  const e = { container: this.$refs.lotContainer, renderer: "svg", loop: !0, autoplay: !0 };
  this.anim = lottie.loadAnimation(Object.assign(e, this.options)), this.anim.resize(), this.$emit("animCreated", this.anim);
}, beforeDestroy() {
}, methods: { click() {
  this.$emit("click");
} } };
function _sfc_render(e, r, a, i, s, n) {
  return openBlock(), createElementBlock("div", { class: normalizeClass(["container", [a.className]]), style: normalizeStyle({ width: a.width, height: a.height }), ref: "lotContainer", onClick: r[0] || (r[0] = (...u) => n.click && n.click(...u)) }, null, 6);
}
const VueLottie = _export_sfc(_sfc_main$5, [["render", _sfc_render]]), v$1 = "5.7.1", fr$1 = 30, ip$1 = 0, op$1 = 30, w$1 = 800, h$1 = 800, nm$1 = "wifi 2", ddd$1 = 0, assets$1 = [{ id: "comp_0", layers: [{ ddd: 0, ind: 1, ty: 4, nm: "\u201C\u56FE\u5C42 3\u201D\u8F6E\u5ED3", sr: 1, ks: { o: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: -1, s: [100] }, { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 5, s: [0] }, { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 11, s: [0] }, { t: 17, s: [100] }], ix: 11 }, r: { a: 0, k: 90, ix: 10 }, p: { a: 0, k: [370, 422, 0], ix: 2 }, a: { a: 0, k: [400, 400, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, shapes: [{ ty: "gr", it: [{ ind: 0, ty: "sh", ix: 1, ks: { a: 0, k: { i: [[121.063, -121.063], [0.221, -0.222], [0, 0], [-0.222, 0.222], [-104.391, -99.51], [0, 0]], o: [[-0.222, 0.222], [0, 0], [0.22, -0.222], [102.538, -102.538], [0, 0], [-121.063, -121.063]], v: [[-218.875, 42.518], [-219.53, 43.19], [-184.174, 78.544], [-183.52, 77.874], [188.712, 73.336], [219.53, 42.518]], c: !0 }, ix: 2 }, nm: "\u8DEF\u5F84 1", mn: "ADBE Vector Shape - Group", hd: !1 }, { ty: "fl", c: { a: 0, k: [0, 0, 0, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: "\u586B\u5145 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [379.412, 266.589], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "\u53D8\u6362" }], nm: "\u7EC4 1", np: 2, cix: 2, bm: 0, ix: 1, mn: "ADBE Vector Group", hd: !1 }], ip: -1, op: 91, st: -1, bm: 0 }, { ddd: 0, ind: 2, ty: 4, nm: "\u201C\u56FE\u5C42 2\u201D\u8F6E\u5ED3", sr: 1, ks: { o: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100] }, { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 6, s: [0] }, { t: 12, s: [100] }], ix: 11 }, r: { a: 0, k: 90, ix: 10 }, p: { a: 0, k: [370, 422, 0], ix: 2 }, a: { a: 0, k: [400, 400, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, shapes: [{ ty: "gr", it: [{ ind: 0, ty: "sh", ix: 1, ks: { a: 0, k: { i: [[74.112, -74.112], [0.019, -0.019], [0, 0], [-0.019, 0.018], [-58.76, -54.147], [0, 0]], o: [[-0.019, 0.018], [0, 0], [0.019, -0.019], [57.019, -57.02], [0, 0], [-75.397, -72.014]], v: [[-134.48, 21.839], [-134.535, 21.895], [-103.113, 53.317], [-103.058, 53.261], [104.269, 48.962], [134.534, 18.697]], c: !0 }, ix: 2 }, nm: "\u8DEF\u5F84 1", mn: "ADBE Vector Shape - Group", hd: !1 }, { ty: "fl", c: { a: 0, k: [0, 0, 0, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: "\u586B\u5145 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [383.504, 375.558], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "\u53D8\u6362" }], nm: "\u7EC4 1", np: 2, cix: 2, bm: 0, ix: 1, mn: "ADBE Vector Group", hd: !1 }], ip: 0, op: 92, st: 0, bm: 0 }, { ddd: 0, ind: 3, ty: 4, nm: "\u201C\u56FE\u5C42 4\u201D\u8F6E\u5ED3", sr: 1, ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 90, ix: 10 }, p: { a: 0, k: [370, 422, 0], ix: 2 }, a: { a: 0, k: [400, 400, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, shapes: [{ ty: "gr", it: [{ ind: 0, ty: "sh", ix: 1, ks: { a: 0, k: { i: [[25.887, 0], [0, -25.888], [-25.889, 0], [0, 25.89]], o: [[-25.889, 0], [0, 25.89], [25.887, 0], [0, -25.888]], v: [[1e-3, -46.87], [-46.87, -1e-3], [1e-3, 46.87], [46.87, -1e-3]], c: !0 }, ix: 2 }, nm: "\u8DEF\u5F84 1", mn: "ADBE Vector Shape - Group", hd: !1 }, { ty: "fl", c: { a: 0, k: [0, 0, 0, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: "\u586B\u5145 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [379.13, 489.055], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "\u53D8\u6362" }], nm: "\u7EC4 1", np: 2, cix: 2, bm: 0, ix: 1, mn: "ADBE Vector Group", hd: !1 }], ip: 0, op: 30, st: 0, bm: 0 }] }], layers$1 = [{ ddd: 0, ind: 1, ty: 0, nm: "wifi", refId: "comp_0", sr: 1, ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [400, 400, 0], ix: 2 }, a: { a: 0, k: [400, 400, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, w: 800, h: 800, ip: 0, op: 30, st: 0, bm: 0 }], markers$1 = [], wifiJSON = { v: v$1, fr: fr$1, ip: ip$1, op: op$1, w: w$1, h: h$1, nm: nm$1, ddd: ddd$1, assets: assets$1, layers: layers$1, markers: markers$1 }, _hoisted_1$7 = { xmlns: "http://www.w3.org/2000/svg", width: "200", height: "200", class: "icon", viewBox: "0 0 1024 1024" }, _hoisted_2$7 = createStaticVNode('<path fill="#BED8FB" d="M235.467 195.356v249.397H39.549v-179.51c0-38.59 31.296-69.887 69.888-69.887h35.726z"></path><path fill="#DDEAFB" d="M984.451 393.055v548.777c0 45.39-36.778 82.168-82.146 82.168H227.331c-38.776 0-71.268-26.868-79.902-63.006l-.33-46.976-1.916-279.755V82.168C145.185 36.778 181.963 0 227.33 0h364.065c32.718 0 138.682 90.346 232.345 185.494 85.466 86.843 160.71 177.685 160.71 207.561z"></path><path fill="#BED8FB" d="M701.398 693.929v184.277c0 59.606-48.316 107.922-107.922 107.922H158.123a81.72 81.72 0 0 1-10.714-25.136l-.308-46.976-1.916-279.755v-48.254h448.293c59.606 0 107.92 48.316 107.92 107.922z"></path><path fill="#CBE2FF" d="M984.451 393.055v201.03c0-.226-.02-.454-.02-.7-6.182-246.666-207.108-258.08-272.811-323.786l112.123-84.103c85.464 86.841 160.708 177.683 160.708 207.56z"></path><path fill="#CBE2FF" d="M591.386 0h-201.03c.226 0 .454.02.7.02 246.666 6.182 258.08 207.108 323.786 272.811l84.103-112.123C712.102 75.244 621.26 0 591.385 0z"></path><path fill="#BED8FB" d="M984.45 393.065v34.754c0-73.172-59.337-132.506-132.507-132.506h-80.648c-45.367 0-82.161-36.794-82.161-82.161v-80.646C689.134 59.334 629.8 0 556.628 0h34.754a236.014 236.014 0 0 1 166.866 69.114L915.333 226.2a236.008 236.008 0 0 1 69.116 166.865z"></path><path fill="#CBE2FF" d="M701.412 621.817v184.277c0 59.606-48.316 107.922-107.922 107.922H147.093l-1.916-279.755V513.895H593.49c59.606 0 107.922 48.314 107.922 107.922z"></path><path fill="#DD636E" d="M771.297 443.051v375.383c0 59.606-48.315 107.922-107.921 107.922H109.449c-2.08 0-4.12-.082-6.16-.288-35.706-3.09-63.726-33.068-63.726-69.6V265.243c0 19.286 7.83 36.756 20.48 49.408 11.27 11.29 26.394 18.75 43.246 20.192 2.04.206 4.08.288 6.16.288h553.927c59.608-.002 107.921 48.314 107.921 107.92z"></path><path fill="#617881" d="M142.579 773.482V488.005c0-27.536 22.322-49.858 49.858-49.858H613.52c30.244 0 54.76 24.518 54.76 54.76v275.671c0 30.244-24.518 54.762-54.762 54.762H192.437c-27.536 0-49.858-22.322-49.858-49.858z"></path><path fill="#DA4A54" d="M103.289 334.841v591.227c-35.706-3.09-63.726-33.068-63.726-69.6V265.243c0 19.286 7.83 36.756 20.48 49.408 11.27 11.29 26.392 18.748 43.246 20.19z"></path><path fill="#DD636E" d="m495.912 600.297-104.274-60.204c-23.438-13.532-52.736 3.384-52.736 30.448v120.406c0 27.064 29.298 43.98 52.736 30.448l104.274-60.204c23.438-13.532 23.438-47.362 0-60.894z"></path>', 11), _hoisted_13$2 = [_hoisted_2$7];
function render$4(e, r) {
  return openBlock(), createElementBlock("svg", _hoisted_1$7, _hoisted_13$2);
}
const videoImage = { render: render$4 }, COMMENT_PANEL_SWITCH = "COMMENT_PANEL_SWITCH", MESSAGES_CLICK = "MESSAGES_CLICK", COMMENT_SUBMIT = "COMMENT_SUBMIT", RECORD_START = "RECORD_START", RECORD_CANCEL = "RECORD_CANCEL", RECORD_STOP = "RECORD_STOP", CLICK_AVATAR = "CLICK_AVATAR", CLICK_PANEL_ITEM = "CLICK_PANEL_ITEM", CLICK_MAP_SEND = "CLICK_MAP_SEND", CLICK_MAP_CANCEL = "CLICK_MAP_CANCEL";
class EventCenter {
  constructor(r) {
    xe(this, "el");
    xe(this, "customEvents", ["press"]);
    xe(this, "acticeEvents", []);
    this.el = r;
  }
  on(r, a) {
    this.customEvents.includes(r) || (this.el.addEventListener(r, a), this.acticeEvents.push({ name: r, func: a }), console.log(r, "\u4E8B\u4EF6\u6CE8\u518C\u6210\u529F"));
  }
  off(r) {
    const a = this.acticeEvents.findIndex((i) => i.name == r);
    a != -1 && (this.el.removeEventListener(r, this.acticeEvents[a].func), this.acticeEvents.splice(a, 1));
  }
  destroy() {
    this.acticeEvents.forEach((r) => {
      this.customEvents.includes(r.name) || this.el.removeEventListener(r.name, r.func), console.log(r.name, "\u4E8B\u4EF6\u9500\u6BC1\u6210\u529F");
    }), this.acticeEvents = [];
  }
}
function isOutElement(e, r) {
  const { height: a, width: i, x: s, y: n } = r.getBoundingClientRect(), { clientX: u, clientY: p } = e;
  return p > n + a || p < n || u < s || u > s + i;
}
const join = (e, r) => e.join(r), isWeixin = () => navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger", urlEncode = (e) => (e = (e + "").toString(), encodeURIComponent(e).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+")), dowanload = (e, r) => {
  var a = new XMLHttpRequest();
  a.open("GET", e, !0), a.responseType = "blob", a.onload = function(i) {
    var s = window.URL.createObjectURL(a.response), n = document.createElement("a");
    n.href = s, n.download = r, n.click();
  }, a.send();
};
var MessageType = ((e) => (e.text = "text", e.image = "image", e.file = "file", e.video = "video", e.audio = "audio", e.location = "location", e.custom = "custom", e))(MessageType || {});
const __default__$4 = defineComponent({ name: "SvgIcon" }), _sfc_main$4 = defineComponent({ ...__default__$4, props: { color: { type: String, defualt: "#000" }, classes: { type: Array, defualt: () => [] } }, setup: (e) => (r, a) => (openBlock(), createElementBlock("div", { class: normalizeClass(["m-chat-svg-icon", [...e.classes]]), style: normalizeStyle({ color: e.color }) }, [renderSlot(r.$slots, "default")], 6)) }), SvgIcon_vue_vue_type_style_index_0_lang = "", _hoisted_1$6 = { xmlns: "http://www.w3.org/2000/svg", width: "200", height: "200", class: "icon", viewBox: "0 0 1024 1024" }, _hoisted_2$6 = createElementVNode("path", { d: "M512 938.667c-53.333 0-384-257.259-384-469.334s171.925-384 384-384 384 171.926 384 384-330.667 469.334-384 469.334zm0-352c64.8 0 117.333-52.534 117.333-117.334S576.8 352 512 352s-117.333 52.533-117.333 117.333S447.2 586.667 512 586.667z" }, null, -1), _hoisted_3$6 = [_hoisted_2$6];
function render$3(e, r) {
  return openBlock(), createElementBlock("svg", _hoisted_1$6, _hoisted_3$6);
}
const locationSvg = { render: render$3 }, _hoisted_1$5 = { key: 0, class: "mc-msg__time" }, _hoisted_2$5 = { class: "mc-msg__avatar" }, _hoisted_3$5 = { class: "mc-msg__main" }, _hoisted_4$3 = { class: "mc-msg__name" }, _hoisted_5$2 = { class: "mc-msg__content-wrap" }, _hoisted_6$2 = { key: 0, class: "mc-msg__content arrow" }, _hoisted_7$2 = ["onClick"], _hoisted_8$2 = { key: 1, class: "mc-msg__file" }, _hoisted_9$1 = { class: "mc-msg__file-thumb" }, _hoisted_10$1 = { class: "mc-msg__file-right" }, _hoisted_11$1 = ["onClick"], _hoisted_12$1 = { class: "mc-msg__file-size" }, _hoisted_13$1 = ["onClick"], _hoisted_14$1 = ["onClick"], _hoisted_15$1 = { key: 0 }, _hoisted_16$1 = { key: 4, class: "mc-msg__custom" }, _hoisted_17$1 = ["onClick"], _hoisted_18$1 = ["onClick"], _hoisted_19$1 = { class: "mc-msg__location-title" }, _hoisted_20 = { class: "mc-audio" }, _hoisted_21 = { class: "mc-video" }, _hoisted_22 = { class: "mc-video__btns" }, __default__$3 = defineComponent({ name: "MChat" }), _sfc_main$3 = defineComponent({ ...__default__$3, props: { data: { type: Object }, messages: { type: Object }, refresh: { type: Function } }, setup(e) {
  const r = e, a = reactive({ loading: !1, showVideo: !1, audioAnimOptions: { animationData: wifiJSON, autoplay: !1 }, playAudio: !1 }), i = inject("emitter"), s = inject("config");
  let n;
  const u = ref(), p = ref(), b = ref(), x = ref(), c = ref(""), f = /* @__PURE__ */ new Map(), m = "ANIM_", y = computed(() => {
    if (!!u.value)
      return f.get(m + u.value.id);
  }), d = () => {
  }, l = () => {
    console.log("initScoller", p.value.scrollTop, p.value.scrollHeight), p.value && (p.value.scrollTop = p.value.scrollHeight);
  }, o = (E, P) => {
    console.log(E, P);
    const k = u.value, C = u.value = P;
    switch (E) {
      case "image":
        let A = Object.assign({ images: [P.content.imageUrl] }, s.vanImagePreview);
        ImagePreview(A);
        break;
      case "video":
        b.value.src = P.content.videoUrl, a.showVideo = !0;
        break;
      case "audio":
        if (k && k.id == C.id) {
          const M = f.get(m + k.id);
          a.playAudio ? (M.stop(), x.value.pause(), a.playAudio = !1) : (M.play(), x.value.play(), a.playAudio = !0);
        } else {
          k && k.id != C.id && (f.get(m + k.id).stop(), x.value.pause());
          const M = f.get(m + C.id);
          x.value.src = P.content.audioUrl;
          const I = () => {
            console.log("\u97F3\u9891\u7ED3\u675F\u56DE\u8C03"), a.playAudio = !1, y.value.stop();
          };
          n.off("ended"), n.on("ended", I), x.value.play(), M.play(), a.playAudio = !0;
        }
        break;
      case "location":
        window.location.href = `https://uri.amap.com/marker?position=${P.content.locationLonLat.join(",")}`;
    }
  }, g = () => {
    a.showVideo = !1, b.value.pause(), b.value.src = null;
  }, _ = async () => {
    try {
      a.loading = !0, await r.refresh(), a.loading = !1;
    } catch (E) {
      Toast.fail({ message: E.message, onClose: () => {
        a.loading = !1;
      } });
    }
  }, S = (E) => E.type != MessageType.image && E.type != MessageType.location;
  return watch(() => a.playAudio, (E) => {
    y.value && (E ? y.value.play() : y.value.stop());
  }, { immediate: !0 }), onMounted(() => {
    c.value = "calc(100% - 16vw)", i.on(COMMENT_PANEL_SWITCH, (E) => {
      c.value = E ? "calc(100% - 69vw)" : "calc(100% - 16vw)", nextTick(() => {
        l();
      });
    }), nextTick(() => {
      l(), ((E = !1) => {
        const P = (k) => {
          i.emit(MESSAGES_CLICK);
        };
        E ? (p.value.removeEventListener("click", P, !0), console.log("\u5DF2\u9500\u6BC1messages\u4E8B\u4EF6")) : (p.value.addEventListener("click", P, !0), console.log("\u5DF2\u6CE8\u518Cmessages\u4E8B\u4EF6"));
      })(), n = new EventCenter(x.value);
    });
  }), onUnmounted(() => {
    n.destroy();
  }), (E, P) => (openBlock(), createElementBlock("div", { class: "mc-msgs", style: normalizeStyle({ height: c.value }), ref_key: "mchatScoller", ref: p }, [createVNode(unref(PullRefresh), { modelValue: a.loading, "onUpdate:modelValue": P[0] || (P[0] = (k) => a.loading = k), onRefresh: _ }, { default: withCtx(() => [(openBlock(!0), createElementBlock(Fragment, null, renderList(e.messages, (k) => {
    return openBlock(), createElementBlock("div", { class: "mc-msg", key: k.id }, [k.time ? (openBlock(), createElementBlock("div", _hoisted_1$5, toDisplayString(k.time), 1)) : createCommentVNode("", !0), createElementVNode("div", { class: normalizeClass(["mc-msg__row", ["mc-msg--" + (k.self ? "self" : "person")]]) }, [createElementVNode("div", _hoisted_2$5, [createVNode(unref(Image$1), { src: k.avatar, onClick: (A) => ((M) => {
      i.emit(CLICK_AVATAR, M);
    })(k), round: "", width: "10vw", height: "10vw" }, null, 8, ["src", "onClick"])]), createElementVNode("div", _hoisted_3$5, [createElementVNode("div", _hoisted_4$3, toDisplayString(k.name), 1), createElementVNode("div", _hoisted_5$2, [S(k) ? (openBlock(), createElementBlock("div", _hoisted_6$2, [k.type && k.type != unref(MessageType).text ? createCommentVNode("", !0) : (openBlock(), createElementBlock("div", { key: 0, class: "mc-msg__text", onClick: withModifiers((A) => o("text", k), ["stop"]) }, toDisplayString(k.content.text), 9, _hoisted_7$2)), k.type == unref(MessageType).file ? (openBlock(), createElementBlock("div", _hoisted_8$2, [createElementVNode("div", _hoisted_9$1, toDisplayString(k.content.fileExt), 1), createElementVNode("div", _hoisted_10$1, [createElementVNode("div", { class: "mc-msg__file-name", onClick: (A) => ((M) => {
      if (isWeixin() && s.leadPage) {
        const I = `${s.leadPage}?url=${urlEncode(M.content.fileUrl)}&name=${urlEncode(M.content.fileName)}`;
        console.log(I), window.location.href = I;
      } else
        dowanload(M.content.fileUrl, M.content.fileName);
    })(k) }, toDisplayString(k.content.fileName), 9, _hoisted_11$1), createElementVNode("span", _hoisted_12$1, toDisplayString(k.content.fileSize), 1)])])) : createCommentVNode("", !0), k.type == unref(MessageType).video ? (openBlock(), createElementBlock("div", { key: 2, class: "mc-msg__video", onClick: (A) => o("video", k) }, [createVNode(unref(videoImage), { style: { width: "8vw", height: "8vw" } })], 8, _hoisted_13$1)) : createCommentVNode("", !0), k.type == unref(MessageType).audio ? (openBlock(), createElementBlock("div", { key: 3, class: normalizeClass(["mc-msg__audio", [k.self ? "mc-start" : "mc-reverse"]]), onClick: (A) => o("audio", k) }, [k.content.duration ? (openBlock(), createElementBlock("span", _hoisted_15$1, toDisplayString(k.content.duration) + ' "', 1)) : createCommentVNode("", !0), createVNode(VueLottie, { options: a.audioAnimOptions, onAnimCreated: (A) => ((M, I) => {
      f.set(m + I.id, M);
    })(A, k), className: "mc-audio--" + (k.self ? "right" : "left"), width: "7vw", height: "7vw" }, null, 8, ["options", "onAnimCreated", "className"])], 10, _hoisted_14$1)) : createCommentVNode("", !0), (C = k.type, Object.values(MessageType).includes(C) ? createCommentVNode("", !0) : (openBlock(), createElementBlock("div", _hoisted_16$1, [renderSlot(E.$slots, k.type, { item: k })])))])) : createCommentVNode("", !0), k.type == unref(MessageType).image ? (openBlock(), createElementBlock("div", { key: 1, class: "mc-msg__image-wrap", onClick: (A) => o("image", k) }, [createVNode(unref(Image$1), { class: "mc-msg__image", src: k.content.imageUrl, onClick: withModifiers(d, ["self"]), radius: 5 }, null, 8, ["src", "onClick"])], 8, _hoisted_17$1)) : createCommentVNode("", !0), k.type == unref(MessageType).location ? (openBlock(), createElementBlock("div", { key: 2, class: "mc-msg__location", onClick: (A) => o("location", k) }, [createElementVNode("div", _hoisted_19$1, toDisplayString(k.content.location), 1), createVNode(_sfc_main$4, { classes: ["mc-msg__location-icon"] }, { default: withCtx(() => [createVNode(unref(locationSvg))]), _: 1 })], 8, _hoisted_18$1)) : createCommentVNode("", !0)])])], 2)]);
    var C;
  }), 128))]), _: 3 }, 8, ["modelValue"]), createElementVNode("div", _hoisted_20, [createElementVNode("audio", { ref_key: "mChatAudio", ref: x }, null, 512)]), withDirectives(createElementVNode("div", _hoisted_21, [createElementVNode("video", { ref_key: "mChatVideo", ref: b, controls: "" }, null, 512), createElementVNode("div", _hoisted_22, [createVNode(unref(Icon), { class: "mc-video__btn", name: "close", size: "7vw", color: "#fff", onClick: g })])], 512), [[vShow, a.showVideo]])], 4));
} }), Messages_vue_vue_type_style_index_0_lang = "", _hoisted_1$4 = { xmlns: "http://www.w3.org/2000/svg", width: "200", height: "200", class: "icon", viewBox: "0 0 1024 1024" }, _hoisted_2$4 = createElementVNode("path", { fill: "#333", d: "M512 64a448 448 0 1 0 448 448A448.5 448.5 0 0 0 512 64zm0 832a384 384 0 1 1 384-384 384.5 384.5 0 0 1-384 384z" }, null, -1), _hoisted_3$4 = createElementVNode("path", { fill: "#333", d: "M272 400a48 48 0 1 0 96 0 48 48 0 1 0-96 0ZM448 448a48 48 0 1 0-48-48 48 48 0 0 0 48 48zm128-96a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm128 0a48 48 0 1 0 48 48 48 48 0 0 0-48-48zM272 528a48 48 0 1 0 96 0 48 48 0 1 0-96 0ZM448 576a48 48 0 1 0-48-48 48 48 0 0 0 48 48zm128 64H448a48 48 0 0 0 0 96h128a48 48 0 1 0 0-96zm0-160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm128 0a48 48 0 1 0 48 48 48 48 0 0 0-48-48z" }, null, -1), _hoisted_4$2 = [_hoisted_2$4, _hoisted_3$4];
function render$2(e, r) {
  return openBlock(), createElementBlock("svg", _hoisted_1$4, _hoisted_4$2);
}
const keyboardSvg = { render: render$2 }, _hoisted_1$3 = { xmlns: "http://www.w3.org/2000/svg", width: "64", height: "64", class: "icon", viewBox: "0 0 1024 1024" }, _hoisted_2$3 = createElementVNode("path", { fill: "#8a8a8a", d: "M491 50c257.917 0 467 209.083 467 467 0 257.917-209.083 467-467 467-257.917 0-467-209.083-467-467C24 259.083 233.083 50 491 50zm0 59.813C266.117 109.813 83.813 292.117 83.813 517S266.117 924.187 491 924.187 898.187 741.883 898.187 517 715.883 109.813 491 109.813zm1.15 94.32c16.281 0 29.523 13.01 29.898 29.2l.009.706v566.043c0 16.517-13.39 29.906-29.907 29.906-16.28 0-29.523-13.01-29.898-29.2l-.008-.706V234.039c0-16.516 13.39-29.906 29.906-29.906zM363.323 323.641c16.28 0 29.523 13.01 29.898 29.2l.008.706v328.97c0 16.518-13.39 29.907-29.906 29.907-16.281 0-29.524-13.01-29.899-29.2l-.008-.706v-328.97c0-16.517 13.39-29.907 29.907-29.907zm259.955 0c16.281 0 29.524 13.01 29.899 29.2l.008.706v328.97c0 16.518-13.39 29.907-29.907 29.907-16.28 0-29.523-13.01-29.898-29.2l-.008-.706v-328.97c0-16.517 13.39-29.907 29.906-29.907zm-388.783 77.184c16.281 0 29.523 13.01 29.898 29.2l.008.707v172.536c0 16.517-13.39 29.907-29.906 29.907-16.28 0-29.523-13.01-29.898-29.2l-.008-.707V430.732c0-16.517 13.39-29.907 29.906-29.907zm519.911 0c16.281 0 29.524 13.01 29.899 29.2l.008.707v172.536c0 16.517-13.39 29.907-29.907 29.907-16.28 0-29.523-13.01-29.898-29.2l-.008-.707V430.732c0-16.517 13.39-29.907 29.906-29.907z" }, null, -1), _hoisted_3$3 = [_hoisted_2$3];
function render$1(e, r) {
  return openBlock(), createElementBlock("svg", _hoisted_1$3, _hoisted_3$3);
}
const voiceSvg = { render: render$1 }, _hoisted_1$2 = { xmlns: "http://www.w3.org/2000/svg", width: "200", height: "200", class: "icon", viewBox: "0 0 1024 1024" }, _hoisted_2$2 = createElementVNode("path", { fill: "#fff", d: "M622.9 512 879.09 255.808c19.258-19.264 22.547-47.213 7.347-62.406l-55.859-55.86c-15.2-15.2-43.11-11.865-62.406 7.386L512.006 401.114l-256.185-256.18c-19.264-19.283-47.213-22.592-62.413-7.372l-55.86 55.865c-15.193 15.175-11.903 43.123 7.386 62.387L401.126 512 144.934 768.205c-19.257 19.251-22.592 47.18-7.385 62.38l55.859 55.866c15.2 15.2 43.149 11.904 62.413-7.353l256.198-256.205 256.16 256.166c19.296 19.303 47.207 22.592 62.407 7.392l55.859-55.865c15.193-15.2 11.904-43.13-7.347-62.407L622.899 512zm0 0" }, null, -1), _hoisted_3$2 = [_hoisted_2$2];
function render(e, r) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, _hoisted_3$2);
}
const closeSvg = { render }, index$1 = "", v = "5.5.2", fr = 30, ip = 0, op = 60, w = 488, h = 488, nm = "recording spectrum_MAIN", ddd = 0, assets = [], layers = [{ ddd: 0, ind: 1, ty: 4, nm: "Shape Layer 7", sr: 1, ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [360.5, 249.00000000000003, 0], ix: 2 }, a: { a: 0, k: [-73, 8.5, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, shapes: [{ ty: "gr", it: [{ ty: "rc", d: 1, s: { a: 1, k: [{ i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 0, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 5, s: [30, 163] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 10, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 15, s: [30, 45] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 20, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 25, s: [30, 104] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 30, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 35, s: [30, 42] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 40, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 45, s: [30, 83] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 50, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 55, s: [30, 37] }, { t: 60.0000024438501, s: [30, 100] }], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 50, ix: 4 }, nm: "Rectangle Path 1", mn: "ADBE Vector Shape - Rect", hd: !1 }, { ty: "st", c: { a: 0, k: [1, 1, 1, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 0, ix: 5 }, lc: 1, lj: 1, ml: 4, bm: 0, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "fl", c: { a: 0, k: [1, 1, 1, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [-73.472, 8.472], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Rectangle 1", np: 3, cix: 2, bm: 0, ix: 1, mn: "ADBE Vector Group", hd: !1 }], ip: 0, op: 60.0000024438501, st: 0, bm: 0 }, { ddd: 0, ind: 2, ty: 4, nm: "Shape Layer 6", sr: 1, ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [300.5, 249.00000000000003, 0], ix: 2 }, a: { a: 0, k: [-73, 8.5, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, shapes: [{ ty: "gr", it: [{ ty: "rc", d: 1, s: { a: 1, k: [{ i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 0, s: [30, 63] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 5, s: [30, 211] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 10, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 15, s: [30, 128] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 20, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 25, s: [30, 160] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 30, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 35, s: [30, 126] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 40, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 45, s: [30, 154] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 50, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 55, s: [30, 83] }, { t: 60.0000024438501, s: [30, 63] }], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 50, ix: 4 }, nm: "Rectangle Path 1", mn: "ADBE Vector Shape - Rect", hd: !1 }, { ty: "st", c: { a: 0, k: [1, 1, 1, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 0, ix: 5 }, lc: 1, lj: 1, ml: 4, bm: 0, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "fl", c: { a: 0, k: [1, 1, 1, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [-73.472, 8.472], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Rectangle 1", np: 3, cix: 2, bm: 0, ix: 1, mn: "ADBE Vector Group", hd: !1 }, { ty: "gr", it: [{ ty: "rc", d: 1, s: { a: 0, k: [30, 63], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 0, ix: 4 }, nm: "Rectangle Path 1", mn: "ADBE Vector Shape - Rect", hd: !1 }, { ty: "tr", p: { a: 0, k: [0, 0], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Group 1", np: 1, cix: 2, bm: 0, ix: 2, mn: "ADBE Vector Group", hd: !1 }], ip: 0, op: 60.0000024438501, st: 0, bm: 0 }, { ddd: 0, ind: 3, ty: 4, nm: "Shape Layer 5", sr: 1, ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [240.49999999999997, 249.00000000000003, 0], ix: 2 }, a: { a: 0, k: [-73, 8.5, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, shapes: [{ ty: "gr", it: [{ ty: "rc", d: 1, s: { a: 1, k: [{ i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 0, s: [30, 63] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 5, s: [30, 155] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 10, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 15, s: [30, 91] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 20, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 25, s: [30, 186] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 30, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 35, s: [30, 256] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 40, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 45, s: [30, 209] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 50, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 55, s: [30, 124] }, { t: 60.0000024438501, s: [30, 63] }], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 50, ix: 4 }, nm: "Rectangle Path 1", mn: "ADBE Vector Shape - Rect", hd: !1 }, { ty: "st", c: { a: 0, k: [1, 1, 1, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 0, ix: 5 }, lc: 1, lj: 1, ml: 4, bm: 0, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "fl", c: { a: 0, k: [1, 1, 1, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [-73.472, 8.472], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Rectangle 1", np: 3, cix: 2, bm: 0, ix: 1, mn: "ADBE Vector Group", hd: !1 }, { ty: "gr", it: [{ ty: "rc", d: 1, s: { a: 0, k: [30, 63], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 0, ix: 4 }, nm: "Rectangle Path 1", mn: "ADBE Vector Shape - Rect", hd: !1 }, { ty: "tr", p: { a: 0, k: [0, 0], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Group 1", np: 1, cix: 2, bm: 0, ix: 2, mn: "ADBE Vector Group", hd: !1 }], ip: 0, op: 60.0000024438501, st: 0, bm: 0 }, { ddd: 0, ind: 4, ty: 4, nm: "Shape Layer 4", sr: 1, ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [180.5, 249.00000000000003, 0], ix: 2 }, a: { a: 0, k: [-73, 8.5, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, shapes: [{ ty: "gr", it: [{ ty: "rc", d: 1, s: { a: 1, k: [{ i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 0, s: [30, 63] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 5, s: [30, 83] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 10, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 15, s: [30, 154] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 20, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 25, s: [30, 126] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 30, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 35, s: [30, 160] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 40, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 45, s: [30, 128] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 50, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 55, s: [30, 211] }, { t: 60.0000024438501, s: [30, 63] }], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 50, ix: 4 }, nm: "Rectangle Path 1", mn: "ADBE Vector Shape - Rect", hd: !1 }, { ty: "st", c: { a: 0, k: [1, 1, 1, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 0, ix: 5 }, lc: 1, lj: 1, ml: 4, bm: 0, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "fl", c: { a: 0, k: [1, 1, 1, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [-73.472, 8.472], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Rectangle 1", np: 3, cix: 2, bm: 0, ix: 1, mn: "ADBE Vector Group", hd: !1 }, { ty: "gr", it: [{ ty: "rc", d: 1, s: { a: 0, k: [30, 63], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 0, ix: 4 }, nm: "Rectangle Path 1", mn: "ADBE Vector Shape - Rect", hd: !1 }, { ty: "tr", p: { a: 0, k: [0, 0], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Group 1", np: 1, cix: 2, bm: 0, ix: 2, mn: "ADBE Vector Group", hd: !1 }], ip: 0, op: 60.0000024438501, st: 0, bm: 0 }, { ddd: 0, ind: 5, ty: 4, nm: "Shape Layer 3", sr: 1, ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [120.5, 249.00000000000003, 0], ix: 2 }, a: { a: 0, k: [-73, 8.5, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, shapes: [{ ty: "gr", it: [{ ty: "rc", d: 1, s: { a: 1, k: [{ i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 0, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 5, s: [30, 37] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 10, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 15, s: [30, 83] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 20, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 25, s: [30, 42] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 30, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 35, s: [30, 104] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 40, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 45, s: [30, 45] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 50, s: [30, 100] }, { i: { x: [0.833, 0.833], y: [0.833, 0.833] }, o: { x: [0.167, 0.167], y: [0.167, 0.167] }, t: 55, s: [30, 163] }, { t: 60.0000024438501, s: [30, 100] }], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 50, ix: 4 }, nm: "Rectangle Path 1", mn: "ADBE Vector Shape - Rect", hd: !1 }, { ty: "st", c: { a: 0, k: [1, 1, 1, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 0, ix: 5 }, lc: 1, lj: 1, ml: 4, bm: 0, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "fl", c: { a: 0, k: [1, 1, 1, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [-73.472, 8.472], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Rectangle 1", np: 3, cix: 2, bm: 0, ix: 1, mn: "ADBE Vector Group", hd: !1 }], ip: 0, op: 60.0000024438501, st: 0, bm: 0 }], markers = [], recordingJson = { v, fr, ip, op, w, h, nm, ddd, assets, layers, markers }, emojiList = [{ codes: "1F603", char: "\u{1F603}", name: "grinning face with big eyes", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F604", char: "\u{1F604}", name: "grinning face with smiling eyes", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F601", char: "\u{1F601}", name: "beaming face with smiling eyes", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F606", char: "\u{1F606}", name: "grinning squinting face", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F605", char: "\u{1F605}", name: "grinning face with sweat", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F923", char: "\u{1F923}", name: "rolling on the floor laughing", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F602", char: "\u{1F602}", name: "face with tears of joy", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F642", char: "\u{1F642}", name: "slightly smiling face", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F643", char: "\u{1F643}", name: "upside-down face", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F609", char: "\u{1F609}", name: "winking face", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F60A", char: "\u{1F60A}", name: "smiling face with smiling eyes", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F607", char: "\u{1F607}", name: "smiling face with halo", category: "Smileys & Emotion (face-smiling)", group: "Smileys & Emotion", subgroup: "face-smiling" }, { codes: "1F970", char: "\u{1F970}", name: "smiling face with hearts", category: "Smileys & Emotion (face-affection)", group: "Smileys & Emotion", subgroup: "face-affection" }, { codes: "1F60D", char: "\u{1F60D}", name: "smiling face with heart-eyes", category: "Smileys & Emotion (face-affection)", group: "Smileys & Emotion", subgroup: "face-affection" }, { codes: "1F929", char: "\u{1F929}", name: "star-struck", category: "Smileys & Emotion (face-affection)", group: "Smileys & Emotion", subgroup: "face-affection" }, { codes: "1F618", char: "\u{1F618}", name: "face blowing a kiss", category: "Smileys & Emotion (face-affection)", group: "Smileys & Emotion", subgroup: "face-affection" }, { codes: "1F617", char: "\u{1F617}", name: "kissing face", category: "Smileys & Emotion (face-affection)", group: "Smileys & Emotion", subgroup: "face-affection" }, { codes: "1F61A", char: "\u{1F61A}", name: "kissing face with closed eyes", category: "Smileys & Emotion (face-affection)", group: "Smileys & Emotion", subgroup: "face-affection" }, { codes: "1F619", char: "\u{1F619}", name: "kissing face with smiling eyes", category: "Smileys & Emotion (face-affection)", group: "Smileys & Emotion", subgroup: "face-affection" }, { codes: "1F60B", char: "\u{1F60B}", name: "face savoring food", category: "Smileys & Emotion (face-tongue)", group: "Smileys & Emotion", subgroup: "face-tongue" }, { codes: "1F61B", char: "\u{1F61B}", name: "face with tongue", category: "Smileys & Emotion (face-tongue)", group: "Smileys & Emotion", subgroup: "face-tongue" }, { codes: "1F61C", char: "\u{1F61C}", name: "winking face with tongue", category: "Smileys & Emotion (face-tongue)", group: "Smileys & Emotion", subgroup: "face-tongue" }, { codes: "1F92A", char: "\u{1F92A}", name: "zany face", category: "Smileys & Emotion (face-tongue)", group: "Smileys & Emotion", subgroup: "face-tongue" }, { codes: "1F61D", char: "\u{1F61D}", name: "squinting face with tongue", category: "Smileys & Emotion (face-tongue)", group: "Smileys & Emotion", subgroup: "face-tongue" }, { codes: "1F911", char: "\u{1F911}", name: "money-mouth face", category: "Smileys & Emotion (face-tongue)", group: "Smileys & Emotion", subgroup: "face-tongue" }, { codes: "1F917", char: "\u{1F917}", name: "hugging face", category: "Smileys & Emotion (face-hand)", group: "Smileys & Emotion", subgroup: "face-hand" }, { codes: "1F92D", char: "\u{1F92D}", name: "face with hand over mouth", category: "Smileys & Emotion (face-hand)", group: "Smileys & Emotion", subgroup: "face-hand" }, { codes: "1F92B", char: "\u{1F92B}", name: "shushing face", category: "Smileys & Emotion (face-hand)", group: "Smileys & Emotion", subgroup: "face-hand" }, { codes: "1F914", char: "\u{1F914}", name: "thinking face", category: "Smileys & Emotion (face-hand)", group: "Smileys & Emotion", subgroup: "face-hand" }, { codes: "1F910", char: "\u{1F910}", name: "zipper-mouth face", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F928", char: "\u{1F928}", name: "face with raised eyebrow", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F610", char: "\u{1F610}", name: "neutral face", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F611", char: "\u{1F611}", name: "expressionless face", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F636", char: "\u{1F636}", name: "face without mouth", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F636 200D 1F32B FE0F", char: "\u{1F636}", name: "face in clouds", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F636 200D 1F32B", char: "\u{1F636}", name: "face in clouds", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F60F", char: "\u{1F60F}", name: "smirking face", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F612", char: "\u{1F612}", name: "unamused face", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F644", char: "\u{1F644}", name: "face with rolling eyes", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F62C", char: "\u{1F62C}", name: "grimacing face", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F62E 200D 1F4A8", char: "\u{1F62E}", name: "face exhaling", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F925", char: "\u{1F925}", name: "lying face", category: "Smileys & Emotion (face-neutral-skeptical)", group: "Smileys & Emotion", subgroup: "face-neutral-skeptical" }, { codes: "1F60C", char: "\u{1F60C}", name: "relieved face", category: "Smileys & Emotion (face-sleepy)", group: "Smileys & Emotion", subgroup: "face-sleepy" }, { codes: "1F614", char: "\u{1F614}", name: "pensive face", category: "Smileys & Emotion (face-sleepy)", group: "Smileys & Emotion", subgroup: "face-sleepy" }, { codes: "1F62A", char: "\u{1F62A}", name: "sleepy face", category: "Smileys & Emotion (face-sleepy)", group: "Smileys & Emotion", subgroup: "face-sleepy" }, { codes: "1F924", char: "\u{1F924}", name: "drooling face", category: "Smileys & Emotion (face-sleepy)", group: "Smileys & Emotion", subgroup: "face-sleepy" }, { codes: "1F634", char: "\u{1F634}", name: "sleeping face", category: "Smileys & Emotion (face-sleepy)", group: "Smileys & Emotion", subgroup: "face-sleepy" }, { codes: "1F637", char: "\u{1F637}", name: "face with medical mask", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F912", char: "\u{1F912}", name: "face with thermometer", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F915", char: "\u{1F915}", name: "face with head-bandage", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F922", char: "\u{1F922}", name: "nauseated face", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F92E", char: "\u{1F92E}", name: "face vomiting", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F927", char: "\u{1F927}", name: "sneezing face", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F975", char: "\u{1F975}", name: "hot face", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F976", char: "\u{1F976}", name: "cold face", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F974", char: "\u{1F974}", name: "woozy face", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F635", char: "\u{1F635}", name: "knocked-out face", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F635 200D 1F4AB", char: "\u{1F635}", name: "face with spiral eyes", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F92F", char: "\u{1F92F}", name: "exploding head", category: "Smileys & Emotion (face-unwell)", group: "Smileys & Emotion", subgroup: "face-unwell" }, { codes: "1F920", char: "\u{1F920}", name: "cowboy hat face", category: "Smileys & Emotion (face-hat)", group: "Smileys & Emotion", subgroup: "face-hat" }, { codes: "1F973", char: "\u{1F973}", name: "partying face", category: "Smileys & Emotion (face-hat)", group: "Smileys & Emotion", subgroup: "face-hat" }, { codes: "1F60E", char: "\u{1F60E}", name: "smiling face with sunglasses", category: "Smileys & Emotion (face-glasses)", group: "Smileys & Emotion", subgroup: "face-glasses" }, { codes: "1F913", char: "\u{1F913}", name: "nerd face", category: "Smileys & Emotion (face-glasses)", group: "Smileys & Emotion", subgroup: "face-glasses" }, { codes: "1F9D0", char: "\u{1F9D0}", name: "face with monocle", category: "Smileys & Emotion (face-glasses)", group: "Smileys & Emotion", subgroup: "face-glasses" }, { codes: "1F615", char: "\u{1F615}", name: "confused face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F61F", char: "\u{1F61F}", name: "worried face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F641", char: "\u{1F641}", name: "slightly frowning face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "2639 FE0F", char: "\u2639\uFE0F", name: "frowning face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F62E", char: "\u{1F62E}", name: "face with open mouth", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F62F", char: "\u{1F62F}", name: "hushed face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F632", char: "\u{1F632}", name: "astonished face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F633", char: "\u{1F633}", name: "flushed face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F97A", char: "\u{1F97A}", name: "pleading face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F626", char: "\u{1F626}", name: "frowning face with open mouth", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F627", char: "\u{1F627}", name: "anguished face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F628", char: "\u{1F628}", name: "fearful face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F630", char: "\u{1F630}", name: "anxious face with sweat", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F625", char: "\u{1F625}", name: "sad but relieved face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F622", char: "\u{1F622}", name: "crying face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F62D", char: "\u{1F62D}", name: "loudly crying face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F631", char: "\u{1F631}", name: "face screaming in fear", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F616", char: "\u{1F616}", name: "confounded face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F623", char: "\u{1F623}", name: "persevering face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F61E", char: "\u{1F61E}", name: "disappointed face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F613", char: "\u{1F613}", name: "downcast face with sweat", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F629", char: "\u{1F629}", name: "weary face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F62B", char: "\u{1F62B}", name: "tired face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F971", char: "\u{1F971}", name: "yawning face", category: "Smileys & Emotion (face-concerned)", group: "Smileys & Emotion", subgroup: "face-concerned" }, { codes: "1F624", char: "\u{1F624}", name: "face with steam from nose", category: "Smileys & Emotion (face-negative)", group: "Smileys & Emotion", subgroup: "face-negative" }, { codes: "1F621", char: "\u{1F621}", name: "pouting face", category: "Smileys & Emotion (face-negative)", group: "Smileys & Emotion", subgroup: "face-negative" }, { codes: "1F620", char: "\u{1F620}", name: "angry face", category: "Smileys & Emotion (face-negative)", group: "Smileys & Emotion", subgroup: "face-negative" }, { codes: "1F92C", char: "\u{1F92C}", name: "face with symbols on mouth", category: "Smileys & Emotion (face-negative)", group: "Smileys & Emotion", subgroup: "face-negative" }, { codes: "1F608", char: "\u{1F608}", name: "smiling face with horns", category: "Smileys & Emotion (face-negative)", group: "Smileys & Emotion", subgroup: "face-negative" }, { codes: "1F47F", char: "\u{1F47F}", name: "angry face with horns", category: "Smileys & Emotion (face-negative)", group: "Smileys & Emotion", subgroup: "face-negative" }, { codes: "1F480", char: "\u{1F480}", name: "skull", category: "Smileys & Emotion (face-negative)", group: "Smileys & Emotion", subgroup: "face-negative" }, { codes: "2620 FE0F", char: "\u2620\uFE0F", name: "skull and crossbones", category: "Smileys & Emotion (face-negative)", group: "Smileys & Emotion", subgroup: "face-negative" }, { codes: "1F921", char: "\u{1F921}", name: "clown face", category: "Smileys & Emotion (face-costume)", group: "Smileys & Emotion", subgroup: "face-costume" }];
var dist = { exports: {} };
dist.exports = function() {
  function e(c) {
    var f = [];
    return c.AMapUI && f.push(r(c.AMapUI)), c.Loca && f.push(a(c.Loca)), Promise.all(f);
  }
  function r(c) {
    return new Promise(function(f, m) {
      var y = [];
      if (c.plugins)
        for (var d = 0; d < c.plugins.length; d += 1)
          n.AMapUI.plugins.indexOf(c.plugins[d]) == -1 && y.push(c.plugins[d]);
      if (u.AMapUI === i.failed)
        m("\u524D\u6B21\u8BF7\u6C42 AMapUI \u5931\u8D25");
      else if (u.AMapUI === i.notload) {
        u.AMapUI = i.loading, n.AMapUI.version = c.version || n.AMapUI.version, d = n.AMapUI.version;
        var l = document.body || document.head, o = document.createElement("script");
        o.type = "text/javascript", o.src = "https://webapi.amap.com/ui/" + d + "/main.js", o.onerror = function(g) {
          u.AMapUI = i.failed, m("\u8BF7\u6C42 AMapUI \u5931\u8D25");
        }, o.onload = function() {
          if (u.AMapUI = i.loaded, y.length)
            window.AMapUI.loadUI(y, function() {
              for (var g = 0, _ = y.length; g < _; g++) {
                var S = y[g].split("/").slice(-1)[0];
                window.AMapUI[S] = arguments[g];
              }
              for (f(); p.AMapUI.length; )
                p.AMapUI.splice(0, 1)[0]();
            });
          else
            for (f(); p.AMapUI.length; )
              p.AMapUI.splice(0, 1)[0]();
        }, l.appendChild(o);
      } else
        u.AMapUI === i.loaded ? c.version && c.version !== n.AMapUI.version ? m("\u4E0D\u5141\u8BB8\u591A\u4E2A\u7248\u672C AMapUI \u6DF7\u7528") : y.length ? window.AMapUI.loadUI(y, function() {
          for (var g = 0, _ = y.length; g < _; g++) {
            var S = y[g].split("/").slice(-1)[0];
            window.AMapUI[S] = arguments[g];
          }
          f();
        }) : f() : c.version && c.version !== n.AMapUI.version ? m("\u4E0D\u5141\u8BB8\u591A\u4E2A\u7248\u672C AMapUI \u6DF7\u7528") : p.AMapUI.push(function(g) {
          g ? m(g) : y.length ? window.AMapUI.loadUI(y, function() {
            for (var _ = 0, S = y.length; _ < S; _++) {
              var E = y[_].split("/").slice(-1)[0];
              window.AMapUI[E] = arguments[_];
            }
            f();
          }) : f();
        });
    });
  }
  function a(c) {
    return new Promise(function(f, m) {
      if (u.Loca === i.failed)
        m("\u524D\u6B21\u8BF7\u6C42 Loca \u5931\u8D25");
      else if (u.Loca === i.notload) {
        u.Loca = i.loading, n.Loca.version = c.version || n.Loca.version;
        var y = n.Loca.version, d = n.AMap.version.startsWith("2"), l = y.startsWith("2");
        if (d && !l || !d && l)
          m("JSAPI \u4E0E Loca \u7248\u672C\u4E0D\u5BF9\u5E94\uFF01\uFF01");
        else {
          d = n.key, l = document.body || document.head;
          var o = document.createElement("script");
          o.type = "text/javascript", o.src = "https://webapi.amap.com/loca?v=" + y + "&key=" + d, o.onerror = function(g) {
            u.Loca = i.failed, m("\u8BF7\u6C42 AMapUI \u5931\u8D25");
          }, o.onload = function() {
            for (u.Loca = i.loaded, f(); p.Loca.length; )
              p.Loca.splice(0, 1)[0]();
          }, l.appendChild(o);
        }
      } else
        u.Loca === i.loaded ? c.version && c.version !== n.Loca.version ? m("\u4E0D\u5141\u8BB8\u591A\u4E2A\u7248\u672C Loca \u6DF7\u7528") : f() : c.version && c.version !== n.Loca.version ? m("\u4E0D\u5141\u8BB8\u591A\u4E2A\u7248\u672C Loca \u6DF7\u7528") : p.Loca.push(function(g) {
          g ? m(g) : m();
        });
    });
  }
  if (!window)
    throw Error("AMap JSAPI can only be used in Browser.");
  var i, s;
  (s = i || (i = {})).notload = "notload", s.loading = "loading", s.loaded = "loaded", s.failed = "failed";
  var n = { key: "", AMap: { version: "1.4.15", plugins: [] }, AMapUI: { version: "1.1", plugins: [] }, Loca: { version: "1.3.2" } }, u = { AMap: i.notload, AMapUI: i.notload, Loca: i.notload }, p = { AMap: [], AMapUI: [], Loca: [] }, b = [], x = function(c) {
    typeof c == "function" && (u.AMap === i.loaded ? c(window.AMap) : b.push(c));
  };
  return { load: function(c) {
    return new Promise(function(f, m) {
      if (u.AMap == i.failed)
        m("");
      else if (u.AMap == i.notload) {
        var y = c.key, d = c.version, l = c.plugins;
        y ? (window.AMap && location.host !== "lbs.amap.com" && m("\u7981\u6B62\u591A\u79CDAPI\u52A0\u8F7D\u65B9\u5F0F\u6DF7\u7528"), n.key = y, n.AMap.version = d || n.AMap.version, n.AMap.plugins = l || n.AMap.plugins, u.AMap = i.loading, d = document.body || document.head, window.___onAPILoaded = function(g) {
          if (delete window.___onAPILoaded, g)
            u.AMap = i.failed, m(g);
          else
            for (u.AMap = i.loaded, e(c).then(function() {
              f(window.AMap);
            }).catch(m); b.length; )
              b.splice(0, 1)[0]();
        }, (l = document.createElement("script")).type = "text/javascript", l.src = "https://webapi.amap.com/maps?callback=___onAPILoaded&v=" + n.AMap.version + "&key=" + y + "&plugin=" + n.AMap.plugins.join(","), l.onerror = function(g) {
          u.AMap = i.failed, m(g);
        }, d.appendChild(l)) : m("\u8BF7\u586B\u5199key");
      } else if (u.AMap == i.loaded)
        if (c.key && c.key !== n.key)
          m("\u591A\u4E2A\u4E0D\u4E00\u81F4\u7684 key");
        else if (c.version && c.version !== n.AMap.version)
          m("\u4E0D\u5141\u8BB8\u591A\u4E2A\u7248\u672C JSAPI \u6DF7\u7528");
        else {
          if (y = [], c.plugins)
            for (d = 0; d < c.plugins.length; d += 1)
              n.AMap.plugins.indexOf(c.plugins[d]) == -1 && y.push(c.plugins[d]);
          y.length ? window.AMap.plugin(y, function() {
            e(c).then(function() {
              f(window.AMap);
            }).catch(m);
          }) : e(c).then(function() {
            f(window.AMap);
          }).catch(m);
        }
      else if (c.key && c.key !== n.key)
        m("\u591A\u4E2A\u4E0D\u4E00\u81F4\u7684 key");
      else if (c.version && c.version !== n.AMap.version)
        m("\u4E0D\u5141\u8BB8\u591A\u4E2A\u7248\u672C JSAPI \u6DF7\u7528");
      else {
        var o = [];
        if (c.plugins)
          for (d = 0; d < c.plugins.length; d += 1)
            n.AMap.plugins.indexOf(c.plugins[d]) == -1 && o.push(c.plugins[d]);
        x(function() {
          o.length ? window.AMap.plugin(o, function() {
            e(c).then(function() {
              f(window.AMap);
            }).catch(m);
          }) : e(c).then(function() {
            f(window.AMap);
          }).catch(m);
        });
      }
    });
  }, reset: function() {
    delete window.AMap, delete window.AMapUI, delete window.Loca, n = { key: "", AMap: { version: "1.4.15", plugins: [] }, AMapUI: { version: "1.1", plugins: [] }, Loca: { version: "1.3.2" } }, u = { AMap: i.notload, AMapUI: i.notload, Loca: i.notload }, p = { AMap: [], AMapUI: [], Loca: [] };
  } };
}();
const AMapLoader = dist.exports, index = "", _hoisted_1$1 = { class: "mc-map" }, _hoisted_2$1 = { class: "mc-map__tools" }, _hoisted_3$1 = createTextVNode("\u53D6\u6D88"), _hoisted_4$1 = createTextVNode("\u53D1\u9001"), _hoisted_5$1 = createElementVNode("div", { id: "mChatMap" }, null, -1), _hoisted_6$1 = { class: "mc-map__panel" }, _hoisted_7$1 = { class: "mc-map__panel-item" }, _hoisted_8$1 = { class: "mc-map__address" }, __default__$2 = defineComponent({ name: "McMap" }), _sfc_main$2 = defineComponent({ ...__default__$2, setup(e) {
  const r = reactive({ location: { lonlat: [113.86697, 22.567978], address: "\u5E7F\u4E1C\u7701\u6DF1\u5733\u5E02\u5B9D\u5B89\u533A\u897F\u4E61\u8857\u9053\u5B9D\u6E90\u8DEF177\u53F7\u534E\u6E90\u79D1\u6280\u521B\u65B0\u56ED " }, infos: [] }), a = inject("emitter");
  let i, s;
  const n = () => {
    a.emit(CLICK_MAP_SEND, r.location);
  }, u = () => {
    a.emit(CLICK_MAP_CANCEL);
  };
  return onMounted(async () => {
    const p = await AMapLoader.load({ key: "599dfe6bbe92b35d34d4e3d3f40aac6b", version: "2.0", plugins: ["AMap.Geolocation"], AMapUI: { version: "1.1", plugins: ["misc/PositionPicker"] } });
    i = new p.Map("mChatMap"), p.plugin("AMap.Geocoder", function() {
      s = new p.Geocoder();
    });
    const b = new p.Geolocation({ enableHighAccuracy: !0, timeout: 1e4, position: "RB", offset: [10, 20], zoomToAccuracy: !0 });
    i.addControl(b), b.getCurrentPosition(function(x, c) {
      var f;
      x == "complete" ? (f = c, console.log("\u5B9A\u4F4D\u6210\u529F:", f), r.location.lonlat = [f.position.lng, f.position.lat], s.getAddress(f.position, function(m, y) {
        if (m === "complete" && y.regeocode) {
          var d = y.regeocode.formattedAddress;
          r.location.address = d;
        } else
          console.error("\u6839\u636E\u7ECF\u7EAC\u5EA6\u67E5\u8BE2\u5730\u5740\u5931\u8D25");
      })) : function(m) {
        console.log("\u5B9A\u4F4D\u5931\u8D25:", m), Toast.fail("\u5B9A\u4F4D\u5931\u8D25");
      }(c);
    });
  }), (p, b) => (openBlock(), createElementBlock("div", _hoisted_1$1, [createElementVNode("div", _hoisted_2$1, [createVNode(unref(Button), { class: "mc-map__tools-btn calcel", onClick: u }, { default: withCtx(() => [_hoisted_3$1]), _: 1 }), createVNode(unref(Button), { class: "mc-map__tools-btn submit", type: "success", onClick: n }, { default: withCtx(() => [_hoisted_4$1]), _: 1 })]), _hoisted_5$1, createElementVNode("div", _hoisted_6$1, [createElementVNode("div", _hoisted_7$1, [createElementVNode("div", _hoisted_8$1, toDisplayString(r.location.address), 1)])])]));
} }), Map_vue_vue_type_style_index_0_lang = "", _hoisted_1 = { class: "mc-comment" }, _hoisted_2 = { class: "mc-comment__default" }, _hoisted_3 = { class: "mc-comment__left" }, _hoisted_4 = ["onSubmit"], _hoisted_5 = { class: "mc-comment__right" }, _hoisted_6 = { key: 0, class: "mc-comment__panel panel-background" }, _hoisted_7 = { key: 0, class: "mc-emoji" }, _hoisted_8 = { key: 1, class: "mc-emoji__wrap" }, _hoisted_9 = ["onClick"], _hoisted_10 = { key: 1, class: "mc-comment-grid" }, _hoisted_11 = ["onClick"], _hoisted_12 = { class: "mc-comment-grid__item-icon" }, _hoisted_13 = { class: "mc-comment-grid__item-text" }, _hoisted_14 = { key: 1, class: "record-overlay" }, _hoisted_15 = { key: 0, class: "record-overlay__item" }, _hoisted_16 = createElementVNode("div", { class: "record-overlay__text" }, "\u624B\u6307\u4E0A\u5212,\u53D6\u6D88\u53D1\u9001", -1), _hoisted_17 = { key: 1, class: "record-overlay__item" }, _hoisted_18 = { class: "record-overlay__icon-wrap" }, _hoisted_19 = createElementVNode("div", { class: "record-overlay__text" }, "\u677E\u5F00\u53D6\u6D88\u53D1\u9001\u5F55\u97F3", -1), __default__$1 = defineComponent({ name: "MchatComment" }), _sfc_main$1 = defineComponent({ ...__default__$1, setup(e) {
  useSlots();
  const r = reactive({ content: "", showPanel: !1, showSubmitBtn: !1, showEmo: !1, showMap: !1, currentType: 0, recordCode: 0, recordAnimOptions: { animationData: recordingJson, autoplay: !0 } }), a = inject("emitter"), i = ref(), s = ref(), n = ref(), u = ref(), p = ref();
  let b;
  const x = ref([{ type: "image", text: "\u56FE\u7247", icon: "photo-o", classPrefix: "" }, { type: "video", text: "\u89C6\u9891", icon: "video-o" }, { type: "file", text: "\u6587\u4EF6", icon: "description" }, { type: "location", text: "\u5B9A\u4F4D", icon: "location-o" }]), c = inject("config"), f = computed(() => [...x.value.filter((P) => c.open.includes(P.type)), ...c.extPanelItems]), m = () => {
  }, y = () => {
    r.showSubmitBtn = !0;
  }, d = (P) => {
  }, l = () => {
    if (!r.content)
      return;
    const P = { type: "text", content: r.content };
    a.emit(COMMENT_SUBMIT, P), a.emit(COMMENT_PANEL_SWITCH, !1), console.log(P), r.content = "";
  }, o = () => {
    l();
  }, g = (P) => c.open.includes(P), _ = (P) => {
    switch (P) {
      case "panel":
        r.showEmo ? r.showEmo = !1 : r.showPanel = !r.showPanel, a.emit(COMMENT_PANEL_SWITCH, r.showPanel);
        break;
      case "record":
        r.currentType = 1;
        break;
      case "text":
        r.currentType = 0;
        break;
      case "emoji":
        r.showPanel ? r.showEmo ? (r.showEmo = !1, r.showPanel = !1) : r.showEmo = !0 : (r.showPanel = !0, r.currentType = 0, r.showEmo = !0), a.emit(COMMENT_PANEL_SWITCH, r.showPanel);
    }
  }, S = (P, k) => {
    console.log("afterRead", k);
    const C = c, A = { type: "", content: k };
    switch (P) {
      case "image":
        if (!(C.imageUploader.accept.includes("image/*") && k.file.type.includes("image/") || C.imageUploader.accept.includes(k.file.type)))
          return void Toast.fail("\u56FE\u7247\u683C\u5F0F\u4E0D\u652F\u6301\u4E0A\u4F20");
        A.type = "image";
        break;
      case "file":
        if (!C.fileUploader.accept.includes("*") && !C.fileUploader.accept.includes(k.file.type))
          return void Toast.fail("\u6587\u4EF6\u683C\u5F0F\u4E0D\u652F\u6301\u4E0A\u4F20");
        A.type = "file";
        break;
      case "video":
        if (!(C.videoUploader.accept.includes("video/*") && k.file.type.includes("video/") || C.videoUploader.accept.includes(k.file.type)))
          return void Toast.fail("\u89C6\u9891\u683C\u5F0F\u4E0D\u652F\u6301\u4E0A\u4F20");
        A.type = "video";
    }
    a.emit(COMMENT_SUBMIT, A), a.emit(COMMENT_PANEL_SWITCH, !1);
  }, E = (P, k) => {
    console.log(k);
    const C = c;
    switch (P) {
      case "image":
        Toast.fail(`\u56FE\u7247\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC7 ${C.imageUploader.maxSize}kb`);
        break;
      case "file":
        Toast.fail(`\u6587\u4EF6\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC7 ${C.fileUploader.maxSize}kb`);
        break;
      case "video":
        Toast.fail(`\u89C6\u9891\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC7 ${C.videoUploader.maxSize}kb`);
    }
  };
  return watch(() => r.content, (P) => {
    r.content ? r.showSubmitBtn = !0 : r.showSubmitBtn = !1;
  }), onMounted(() => {
    a.on(COMMENT_PANEL_SWITCH, (P) => {
      console.log(`comment ${COMMENT_PANEL_SWITCH}:`, P), P != null ? P != r.showPanel && (r.showPanel = P) : r.showPanel = !r.showPanel;
    }), a.on(MESSAGES_CLICK, (P) => {
      console.log(`comment ${MESSAGES_CLICK}:`, P), r.showPanel && (r.showPanel = !1, r.showEmo = !1, a.emit(COMMENT_PANEL_SWITCH, r.showPanel));
    }), a.on(CLICK_MAP_SEND, (P) => {
      console.log(`comment ${CLICK_MAP_SEND}:`, P), r.showMap = !1;
      const k = { type: "location", content: P };
      a.emit(COMMENT_SUBMIT, k), a.emit(COMMENT_PANEL_SWITCH, !1);
    }), a.on(CLICK_MAP_CANCEL, (P) => {
      console.log(`comment ${CLICK_MAP_CANCEL}:`, P), r.showMap = !1;
    }), nextTick(() => {
      b = new EventCenter(s.value), b.on("touchstart", (P) => {
        P.preventDefault(), r.recordCode = 1, a.emit(RECORD_START);
      }), b.on("touchmove", (P) => {
        P.preventDefault(), isOutElement(P.changedTouches[0], s.value) ? r.recordCode = 2 : r.recordCode = 1;
      }), b.on("touchend", (P) => {
        if (P.preventDefault(), r.recordCode == 2)
          return r.recordCode = 0, void a.emit(RECORD_CANCEL);
        r.recordCode == 1 && (r.recordCode = 0, a.emit(RECORD_STOP));
      });
    });
  }), onUnmounted(() => {
    b.destroy();
  }), (P, k) => (openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", _hoisted_2, [createElementVNode("div", _hoisted_3, [r.currentType == 0 && g("audio") ? (openBlock(), createBlock(_sfc_main$4, { key: 0, classes: ["mc-comment__icon"], onClick: k[0] || (k[0] = (C) => _("record")) }, { default: withCtx(() => [createVNode(unref(voiceSvg))]), _: 1 })) : createCommentVNode("", !0), r.currentType == 1 && g("text") ? (openBlock(), createBlock(_sfc_main$4, { key: 1, classes: ["mc-comment__icon"], onClick: k[1] || (k[1] = (C) => _("text")) }, { default: withCtx(() => [createVNode(unref(keyboardSvg))]), _: 1 })) : createCommentVNode("", !0)]), withDirectives(createElementVNode("div", { class: "mc-comment__record", ref_key: "mChatRecord", ref: s }, [withDirectives(createElementVNode("span", null, "\u6309\u4F4F\u5F00\u59CB\u5F55\u97F3", 512), [[vShow, r.recordCode == 0]]), withDirectives(createElementVNode("span", null, "\u677E\u5F00 \u53D1\u9001", 512), [[vShow, r.recordCode == 1]]), withDirectives(createElementVNode("span", null, "\u677E\u5F00 \u53D6\u6D88", 512), [[vShow, r.recordCode == 2]])], 512), [[vShow, r.currentType == 1]]), withDirectives(createElementVNode("form", { class: "mc-comment__form", onSubmit: withModifiers(l, ["prevent"]) }, [withDirectives(createElementVNode("input", { ref_key: "mChatInput", ref: i, class: "mc-comment__form-input", onFocus: y, onBlur: m, "onUpdate:modelValue": k[2] || (k[2] = (C) => r.content = C), onInput: d, type: "text" }, null, 544), [[vModelText, r.content]])], 40, _hoisted_4), [[vShow, r.currentType == 0 && g("text")]]), createElementVNode("div", _hoisted_5, [g("emoji") ? (openBlock(), createBlock(unref(Icon), { key: 0, class: "mc-comment__icon", name: "smile-o", onClick: k[3] || (k[3] = (C) => _("emoji")) })) : createCommentVNode("", !0), r.currentType == 0 && r.showSubmitBtn ? (openBlock(), createElementBlock("button", { key: 1, onClick: o, class: "mc-comment__submit-btn" }, " \u53D1\u9001 ")) : (openBlock(), createBlock(unref(Icon), { key: 2, class: "mc-comment__icon", name: "add-o", onClick: k[4] || (k[4] = (C) => _("panel")) }))])]), r.showPanel ? (openBlock(), createElementBlock("div", _hoisted_6, [r.showEmo ? (openBlock(), createElementBlock("div", _hoisted_7, [P.$slots.emoji ? renderSlot(P.$slots, "emoji", { key: 0 }) : (openBlock(), createElementBlock("div", _hoisted_8, [(openBlock(!0), createElementBlock(Fragment, null, renderList(unref(emojiList), (C, A) => (openBlock(), createElementBlock("div", { class: "mc-emoji__item", key: A, onClick: (M) => ((I) => {
    r.content += I.char + " ", i.value.focus(), r.showSubmitBtn = !0;
  })(C) }, toDisplayString(C.char), 9, _hoisted_9))), 128))]))])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [P.$slots.panel ? renderSlot(P.$slots, "panel", { key: 0 }) : (openBlock(), createElementBlock("div", _hoisted_10, [(openBlock(!0), createElementBlock(Fragment, null, renderList(unref(f), (C, A) => (openBlock(), createElementBlock("div", { class: "mc-comment-grid__item", key: A, onClick: (M) => ((I) => {
    switch (I.type) {
      case "image":
        n.value.chooseFile();
        break;
      case "video":
        p.value.chooseFile();
        break;
      case "file":
        u.value.chooseFile();
        break;
      case "location":
        if (!c.amap || !c.amap.key)
          return void Toast.fail("\u7F3A\u5C11\u9AD8\u5FB7\u5730\u56FEkey");
        r.showMap = !0;
    }
    a.emit(CLICK_PANEL_ITEM, I);
  })(C) }, [createElementVNode("div", _hoisted_12, [createVNode(unref(Icon), { name: C.icon }, null, 8, ["name"])]), createElementVNode("div", _hoisted_13, toDisplayString(C.text), 1)], 8, _hoisted_11))), 128))]))], 64))])) : createCommentVNode("", !0), r.recordCode != 0 ? (openBlock(), createElementBlock("div", _hoisted_14, [r.recordCode == 1 ? (openBlock(), createElementBlock("div", _hoisted_15, [createVNode(VueLottie, { options: r.recordAnimOptions, width: "20vw", height: "20vw" }, null, 8, ["options"]), _hoisted_16])) : createCommentVNode("", !0), r.recordCode == 2 ? (openBlock(), createElementBlock("div", _hoisted_17, [createElementVNode("div", _hoisted_18, [createVNode(_sfc_main$4, { classes: ["record-overlay__icon"] }, { default: withCtx(() => [createVNode(unref(closeSvg))]), _: 1 })]), _hoisted_19])) : createCommentVNode("", !0)])) : createCommentVNode("", !0), g("image") ? (openBlock(), createBlock(unref(Uploader), mergeProps({ key: 2 }, unref(c).vanImageUploader, { ref_key: "mChatImgUploader", ref: n, maxSize: 1024 * unref(c).imageUploader.maxSize, accept: unref(join)(unref(c).imageUploader.accept, ","), "after-read": (C) => S("image", C), onOversize: k[5] || (k[5] = (C) => E("image", C)), style: { display: "none" } }), null, 16, ["maxSize", "accept", "after-read"])) : createCommentVNode("", !0), g("file") ? (openBlock(), createBlock(unref(Uploader), mergeProps({ key: 3 }, unref(c).vanFileUploader, { ref_key: "mChatFileUploader", ref: u, maxSize: 1024 * unref(c).fileUploader.maxSize, accept: unref(join)(unref(c).fileUploader.accept, ","), "after-read": (C) => S("file", C), onOversize: k[6] || (k[6] = (C) => E("file", C)), style: { display: "none" } }), null, 16, ["maxSize", "accept", "after-read"])) : createCommentVNode("", !0), g("video") ? (openBlock(), createBlock(unref(Uploader), mergeProps({ key: 4 }, unref(c).vanVideoUploader, { ref_key: "mChatVideoUploader", ref: p, maxSize: 1024 * unref(c).videoUploader.maxSize, accept: unref(join)(unref(c).videoUploader.accept, ","), "after-read": (C) => S("video", C), onOversize: k[7] || (k[7] = (C) => E("video", C)), style: { display: "none" } }), null, 16, ["maxSize", "accept", "after-read"])) : createCommentVNode("", !0), r.showMap ? (openBlock(), createBlock(_sfc_main$2, { key: 5 })) : createCommentVNode("", !0)]));
} }), Comment_vue_vue_type_style_index_0_lang = "";
var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal, _freeGlobal = freeGlobal$1, freeGlobal = _freeGlobal, freeSelf = typeof self == "object" && self && self.Object === Object && self, root$2 = freeGlobal || freeSelf || Function("return this")(), _root = root$2, root$1 = _root, Symbol$3 = root$1.Symbol, _Symbol = Symbol$3, Symbol$2 = _Symbol, objectProto$7 = Object.prototype, hasOwnProperty$5 = objectProto$7.hasOwnProperty, nativeObjectToString$1 = objectProto$7.toString, symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag$1(e) {
  var r = hasOwnProperty$5.call(e, symToStringTag$1), a = e[symToStringTag$1];
  try {
    e[symToStringTag$1] = void 0;
    var i = !0;
  } catch {
  }
  var s = nativeObjectToString$1.call(e);
  return i && (r ? e[symToStringTag$1] = a : delete e[symToStringTag$1]), s;
}
var _getRawTag = getRawTag$1, objectProto$6 = Object.prototype, nativeObjectToString = objectProto$6.toString;
function objectToString$1(e) {
  return nativeObjectToString.call(e);
}
var _objectToString = objectToString$1, Symbol$1 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString, nullTag = "[object Null]", undefinedTag = "[object Undefined]", symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
function baseGetTag$3(e) {
  return e == null ? e === void 0 ? undefinedTag : nullTag : symToStringTag && symToStringTag in Object(e) ? getRawTag(e) : objectToString(e);
}
var _baseGetTag = baseGetTag$3;
function isObject$4(e) {
  var r = typeof e;
  return e != null && (r == "object" || r == "function");
}
var isObject_1 = isObject$4, baseGetTag$2 = _baseGetTag, isObject$3 = isObject_1, asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction$2(e) {
  if (!isObject$3(e))
    return !1;
  var r = baseGetTag$2(e);
  return r == funcTag$1 || r == genTag || r == asyncTag || r == proxyTag;
}
var isFunction_1 = isFunction$2, root = _root, coreJsData$1 = root["__core-js_shared__"], _coreJsData = coreJsData$1, coreJsData = _coreJsData, maskSrcKey = (uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || ""), uid ? "Symbol(src)_1." + uid : ""), uid;
function isMasked$1(e) {
  return !!maskSrcKey && maskSrcKey in e;
}
var _isMasked = isMasked$1, funcProto$1 = Function.prototype, funcToString$1 = funcProto$1.toString;
function toSource$1(e) {
  if (e != null) {
    try {
      return funcToString$1.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var _toSource = toSource$1, isFunction$1 = isFunction_1, isMasked = _isMasked, isObject$2 = isObject_1, toSource = _toSource, reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reIsHostCtor = /^\[object .+?Constructor\]$/, funcProto = Function.prototype, objectProto$5 = Object.prototype, funcToString = funcProto.toString, hasOwnProperty$4 = objectProto$5.hasOwnProperty, reIsNative = RegExp("^" + funcToString.call(hasOwnProperty$4).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
function baseIsNative$1(e) {
  return !(!isObject$2(e) || isMasked(e)) && (isFunction$1(e) ? reIsNative : reIsHostCtor).test(toSource(e));
}
var _baseIsNative = baseIsNative$1;
function getValue$1(e, r) {
  return e == null ? void 0 : e[r];
}
var _getValue = getValue$1, baseIsNative = _baseIsNative, getValue = _getValue;
function getNative$1(e, r) {
  var a = getValue(e, r);
  return baseIsNative(a) ? a : void 0;
}
var _getNative = getNative$1, getNative = _getNative, defineProperty$2 = function() {
  try {
    var e = getNative(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
}(), _defineProperty = defineProperty$2, defineProperty$1 = _defineProperty;
function baseAssignValue$2(e, r, a) {
  r == "__proto__" && defineProperty$1 ? defineProperty$1(e, r, { configurable: !0, enumerable: !0, value: a, writable: !0 }) : e[r] = a;
}
var _baseAssignValue = baseAssignValue$2;
function eq$2(e, r) {
  return e === r || e != e && r != r;
}
var eq_1 = eq$2, baseAssignValue$1 = _baseAssignValue, eq$1 = eq_1, objectProto$4 = Object.prototype, hasOwnProperty$3 = objectProto$4.hasOwnProperty;
function assignValue$1(e, r, a) {
  var i = e[r];
  hasOwnProperty$3.call(e, r) && eq$1(i, a) && (a !== void 0 || r in e) || baseAssignValue$1(e, r, a);
}
var _assignValue = assignValue$1, assignValue = _assignValue, baseAssignValue = _baseAssignValue;
function copyObject$1(e, r, a, i) {
  var s = !a;
  a || (a = {});
  for (var n = -1, u = r.length; ++n < u; ) {
    var p = r[n], b = i ? i(a[p], e[p], p, a, e) : void 0;
    b === void 0 && (b = e[p]), s ? baseAssignValue(a, p, b) : assignValue(a, p, b);
  }
  return a;
}
var _copyObject = copyObject$1;
function identity$2(e) {
  return e;
}
var identity_1 = identity$2;
function apply$1(e, r, a) {
  switch (a.length) {
    case 0:
      return e.call(r);
    case 1:
      return e.call(r, a[0]);
    case 2:
      return e.call(r, a[0], a[1]);
    case 3:
      return e.call(r, a[0], a[1], a[2]);
  }
  return e.apply(r, a);
}
var _apply = apply$1, apply = _apply, nativeMax = Math.max;
function overRest$1(e, r, a) {
  return r = nativeMax(r === void 0 ? e.length - 1 : r, 0), function() {
    for (var i = arguments, s = -1, n = nativeMax(i.length - r, 0), u = Array(n); ++s < n; )
      u[s] = i[r + s];
    s = -1;
    for (var p = Array(r + 1); ++s < r; )
      p[s] = i[s];
    return p[r] = a(u), apply(e, this, p);
  };
}
var _overRest = overRest$1;
function constant$1(e) {
  return function() {
    return e;
  };
}
var constant_1 = constant$1, constant = constant_1, defineProperty = _defineProperty, identity$1 = identity_1, baseSetToString$1 = defineProperty ? function(e, r) {
  return defineProperty(e, "toString", { configurable: !0, enumerable: !1, value: constant(r), writable: !0 });
} : identity$1, _baseSetToString = baseSetToString$1, HOT_COUNT = 800, HOT_SPAN = 16, nativeNow = Date.now;
function shortOut$1(e) {
  var r = 0, a = 0;
  return function() {
    var i = nativeNow(), s = HOT_SPAN - (i - a);
    if (a = i, s > 0) {
      if (++r >= HOT_COUNT)
        return arguments[0];
    } else
      r = 0;
    return e.apply(void 0, arguments);
  };
}
var _shortOut = shortOut$1, baseSetToString = _baseSetToString, shortOut = _shortOut, setToString$1 = shortOut(baseSetToString), _setToString = setToString$1, identity = identity_1, overRest = _overRest, setToString = _setToString;
function baseRest$1(e, r) {
  return setToString(overRest(e, r, identity), e + "");
}
var _baseRest = baseRest$1, MAX_SAFE_INTEGER$1 = 9007199254740991;
function isLength$2(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= MAX_SAFE_INTEGER$1;
}
var isLength_1 = isLength$2, isFunction = isFunction_1, isLength$1 = isLength_1;
function isArrayLike$2(e) {
  return e != null && isLength$1(e.length) && !isFunction(e);
}
var isArrayLike_1 = isArrayLike$2, MAX_SAFE_INTEGER = 9007199254740991, reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex$2(e, r) {
  var a = typeof e;
  return !!(r = r == null ? MAX_SAFE_INTEGER : r) && (a == "number" || a != "symbol" && reIsUint.test(e)) && e > -1 && e % 1 == 0 && e < r;
}
var _isIndex = isIndex$2, eq = eq_1, isArrayLike$1 = isArrayLike_1, isIndex$1 = _isIndex, isObject$1 = isObject_1;
function isIterateeCall$1(e, r, a) {
  if (!isObject$1(a))
    return !1;
  var i = typeof r;
  return !!(i == "number" ? isArrayLike$1(a) && isIndex$1(r, a.length) : i == "string" && r in a) && eq(a[r], e);
}
var _isIterateeCall = isIterateeCall$1, baseRest = _baseRest, isIterateeCall = _isIterateeCall;
function createAssigner$1(e) {
  return baseRest(function(r, a) {
    var i = -1, s = a.length, n = s > 1 ? a[s - 1] : void 0, u = s > 2 ? a[2] : void 0;
    for (n = e.length > 3 && typeof n == "function" ? (s--, n) : void 0, u && isIterateeCall(a[0], a[1], u) && (n = s < 3 ? void 0 : n, s = 1), r = Object(r); ++i < s; ) {
      var p = a[i];
      p && e(r, p, i, n);
    }
    return r;
  });
}
var _createAssigner = createAssigner$1;
function baseTimes$1(e, r) {
  for (var a = -1, i = Array(e); ++a < e; )
    i[a] = r(a);
  return i;
}
var _baseTimes = baseTimes$1;
function isObjectLike$3(e) {
  return e != null && typeof e == "object";
}
var isObjectLike_1 = isObjectLike$3, baseGetTag$1 = _baseGetTag, isObjectLike$2 = isObjectLike_1, argsTag$1 = "[object Arguments]";
function baseIsArguments$1(e) {
  return isObjectLike$2(e) && baseGetTag$1(e) == argsTag$1;
}
var _baseIsArguments = baseIsArguments$1, baseIsArguments = _baseIsArguments, isObjectLike$1 = isObjectLike_1, objectProto$3 = Object.prototype, hasOwnProperty$2 = objectProto$3.hasOwnProperty, propertyIsEnumerable = objectProto$3.propertyIsEnumerable, isArguments$1 = baseIsArguments(function() {
  return arguments;
}()) ? baseIsArguments : function(e) {
  return isObjectLike$1(e) && hasOwnProperty$2.call(e, "callee") && !propertyIsEnumerable.call(e, "callee");
}, isArguments_1 = isArguments$1, isArray$1 = Array.isArray, isArray_1 = isArray$1, isBuffer$1 = { exports: {} };
function stubFalse() {
  return !1;
}
var stubFalse_1 = stubFalse;
(function(e, r) {
  var a = _root, i = stubFalse_1, s = r && !r.nodeType && r, n = s && e && !e.nodeType && e, u = n && n.exports === s ? a.Buffer : void 0, p = (u ? u.isBuffer : void 0) || i;
  e.exports = p;
})(isBuffer$1, isBuffer$1.exports);
var baseGetTag = _baseGetTag, isLength = isLength_1, isObjectLike = isObjectLike_1, argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]", arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]", typedArrayTags = {};
function baseIsTypedArray$1(e) {
  return isObjectLike(e) && isLength(e.length) && !!typedArrayTags[baseGetTag(e)];
}
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = !0, typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = !1;
var _baseIsTypedArray = baseIsTypedArray$1;
function baseUnary$1(e) {
  return function(r) {
    return e(r);
  };
}
var _baseUnary = baseUnary$1, _nodeUtil = { exports: {} };
(function(e, r) {
  var a = _freeGlobal, i = r && !r.nodeType && r, s = i && e && !e.nodeType && e, n = s && s.exports === i && a.process, u = function() {
    try {
      var p = s && s.require && s.require("util").types;
      return p || n && n.binding && n.binding("util");
    } catch {
    }
  }();
  e.exports = u;
})(_nodeUtil, _nodeUtil.exports);
var baseIsTypedArray = _baseIsTypedArray, baseUnary = _baseUnary, nodeUtil = _nodeUtil.exports, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray, isTypedArray$1 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray, isTypedArray_1 = isTypedArray$1, baseTimes = _baseTimes, isArguments = isArguments_1, isArray = isArray_1, isBuffer = isBuffer$1.exports, isIndex = _isIndex, isTypedArray = isTypedArray_1, objectProto$2 = Object.prototype, hasOwnProperty$1 = objectProto$2.hasOwnProperty;
function arrayLikeKeys$1(e, r) {
  var a = isArray(e), i = !a && isArguments(e), s = !a && !i && isBuffer(e), n = !a && !i && !s && isTypedArray(e), u = a || i || s || n, p = u ? baseTimes(e.length, String) : [], b = p.length;
  for (var x in e)
    !r && !hasOwnProperty$1.call(e, x) || u && (x == "length" || s && (x == "offset" || x == "parent") || n && (x == "buffer" || x == "byteLength" || x == "byteOffset") || isIndex(x, b)) || p.push(x);
  return p;
}
var _arrayLikeKeys = arrayLikeKeys$1, objectProto$1 = Object.prototype;
function isPrototype$1(e) {
  var r = e && e.constructor;
  return e === (typeof r == "function" && r.prototype || objectProto$1);
}
var _isPrototype = isPrototype$1;
function nativeKeysIn$1(e) {
  var r = [];
  if (e != null)
    for (var a in Object(e))
      r.push(a);
  return r;
}
var _nativeKeysIn = nativeKeysIn$1, isObject = isObject_1, isPrototype = _isPrototype, nativeKeysIn = _nativeKeysIn, objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty;
function baseKeysIn$1(e) {
  if (!isObject(e))
    return nativeKeysIn(e);
  var r = isPrototype(e), a = [];
  for (var i in e)
    (i != "constructor" || !r && hasOwnProperty.call(e, i)) && a.push(i);
  return a;
}
var _baseKeysIn = baseKeysIn$1, arrayLikeKeys = _arrayLikeKeys, baseKeysIn = _baseKeysIn, isArrayLike = isArrayLike_1;
function keysIn$1(e) {
  return isArrayLike(e) ? arrayLikeKeys(e, !0) : baseKeysIn(e);
}
var keysIn_1 = keysIn$1, copyObject = _copyObject, createAssigner = _createAssigner, keysIn = keysIn_1, assignIn = createAssigner(function(e, r) {
  copyObject(r, keysIn(r), e);
}), assignIn_1 = assignIn;
const __default__ = defineComponent({ name: "m-chat" }), _sfc_main = defineComponent({ ...__default__, props: { messages: { type: Array }, height: { type: String, default: "100vh" }, config: { type: Object, default: () => ({}) }, refresh: { type: Function } }, emits: ["submit", "recordStart", "recordCancel", "recordStop", "clickAvatar", "clickPanelItem"], setup(e, { expose: r, emit: a }) {
  const i = e, s = mitt(), n = useSlots();
  Object.keys(n).map((b) => n[b]), console.log("slots", n);
  const u = Object.keys(n).map((b) => ({ name: b, slot: n[b] }));
  console.log("slotsList", u);
  const p = computed(() => {
    const b = i.config;
    return assignIn_1({ theme: "light", vanImageUploader: {}, imageUploader: { maxSize: 500, accept: ["image/*"] }, fileUploader: { maxSize: 500, accept: ["*"] }, videoUploader: { maxSize: 500, accept: ["video/*"] }, open: ["text", "emoji", "image", "audio", "file", "video", "location"], extPanelItems: [] }, b);
  });
  return provide("parentHeight", i.height), provide("config", p.value), provide("emitter", s), r({ switchPanel: (b) => {
    s.emit(COMMENT_PANEL_SWITCH, b);
  } }), onMounted(() => {
    s.on(COMMENT_SUBMIT, (b) => {
      a("submit", b);
    }), s.on(RECORD_START, (b) => {
      a("recordStart", b);
    }), s.on(RECORD_CANCEL, (b) => {
      a("recordCancel", b);
    }), s.on(RECORD_STOP, (b) => {
      a("recordStop", b);
    }), s.on(CLICK_AVATAR, (b) => {
      a("clickAvatar", b);
    }), s.on(CLICK_PANEL_ITEM, (b) => {
      a("clickPanelItem", b);
    });
  }), (b, x) => (openBlock(), createElementBlock("div", { class: normalizeClass(["m-chat", [`theme-${unref(p).theme}`]]), style: normalizeStyle({ height: e.height }) }, [createVNode(_sfc_main$3, { messages: e.messages, refresh: e.refresh }, createSlots({ _: 2 }, [renderList(unref(u), (c) => ({ name: c.name, fn: withCtx(({ item: f }) => [renderSlot(b.$slots, c.name, { key: c.name, item: f })]) }))]), 1032, ["messages", "refresh"]), createVNode(_sfc_main$1, null, createSlots({ _: 2 }, [b.$slots.panel ? { name: "panel", fn: withCtx(() => [renderSlot(b.$slots, "panel")]), key: "0" } : void 0, b.$slots.emoji ? { name: "emoji", fn: withCtx(() => [renderSlot(b.$slots, "emoji")]), key: "1" } : void 0]), 1024)], 6));
} }), MChat_vue_vue_type_style_index_0_lang = "";
function withInstall(e) {
  return e.install = (r, a) => {
    const { name: i } = e;
    r.component(i, e);
  }, e;
}
const MChat = withInstall(_sfc_main);
export {
  MessageType,
  MChat as default
};
//# sourceMappingURL=m-chat.js.map

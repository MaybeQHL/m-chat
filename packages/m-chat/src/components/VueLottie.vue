<template>
  <div class="container" :class="[className]" :style="{ width, height }" ref="lotContainer" @click="click"></div>
</template>

<script>
/**
 * VueLottie
 * @description  lottie-web动画库vue封装组件
 * @author maybe
 * @doc lottie-web https://github.com/airbnb/lottie-web
 */

import lottie from "lottie-web";

export default {
  props: {
    className: String,
    options: {
      type: Object,
      required: true,
    },
    height: String,
    width: String,
  },
  components: {},
  data() {
    return {
      anim: null,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    const defaultOptions = {
      container: this.$refs.lotContainer, // 容器
      renderer: "svg",
      loop: true,
      autoplay: true,
    };
    this.anim = lottie.loadAnimation(
      Object.assign(defaultOptions, this.options)
    );
    this.anim.resize();
    this.$emit("animCreated", this.anim);
  },
  beforeDestroy() { },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped lang="scss"></style>

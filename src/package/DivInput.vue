<template>
  <div
    class="div-input"
    ref="divInput"
    contenteditable
    @keydown="changeTxt"
    @keyup.enter="keyupEnter"
    :class="classes"
    :style="{ height, width }"
  ></div>
</template>

<script>
let emjoyReg = /<img src=['"].*?img-code=['"](.*?)['"][^>]*?>/i;
export default {
  name: "DivInput",
  props: {
    value: String,
    height: {
      type: String,
      default: "5vw",
    },
    width: {
      type: String,
      default: "auto",
    },
    classes: Array,
  },
  data() {
    return {
      txt: "",
    };
  },
  watch: {
    value() {
      this.$el.innerHTML = this.value;
    },
  },
  methods: {
    changeTxt() {
      let _t = this.$el.innerHTML;
      let match = _t.match(emjoyReg);
      while (match) {
        _t = _t.replace(match[0], `[${match[1]}]`);
        match = _t.match(emjoyReg);
      }
      this.txt = _t;
      console.log(this.txt);
      this.$emit("input", this.txt);

      this.$nextTick(() => {
        var range = window.getSelection(); //创建range
        range.selectAllChildren(this.$el); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
      });
    },
    keyupEnter() {
      this.$emit("keyupEnter");
      this.$el.innerHTML = "";
    },
  },
};
</script>
<style lang="scss" scoped>
.div-input {
  outline: none;
  padding: 2vw;
  caret-color: #9eea6a;
  white-space: nowrap;
  background-color: #fff;
  overflow-x: auto;
  overflow-y: hidden;
  //   display: flex;
  //   flex-direction: row;
  //   flex-wrap: nowrap;
}
</style>

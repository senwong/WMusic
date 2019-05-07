<template>
  <div class="wrapper">
    <input type="checkbox" :checked="!!isClose" id="left" name="btn" />
    <label for="left" @click="$emit('toggle')"></label>
    <div class="rot"></div>
    <div class="bg"></div>
  </div>
</template>
<script>
export default {
  name: "AwesomeButton",
  props: ["isClose"],
  watch: {
    isClose(val) {}
  }
};
</script>
<style lang="sass" scoped>
@import 'config.sass';
.wrapper
  display: inline-block;
  background-color: $whitegray2;
  width: 50px;
  height: 20px;
  position: relative;
  font-size: 0;
  border-radius: 20px;
  border: 1px solid $whitegray3;
  z-index: 1;
  overflow: hidden;

.bg
  background-color: $orange;
  border-radius: 20px;
  position: absolute;
  top: 0;
  right: 100%;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
  transition: right 0.3s linear;

input
  display: none;

.rot
  display: inline-block;
  width: 30px;
  height: 100%;
  background-color: white;
  border-radius: 20px;
  transition: margin-left 0.3s linear;

label[for="left"]
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 2;

input:checked ~ .rot
  margin-left: 20px;

input:checked ~ .bg
  right: 0;
</style>

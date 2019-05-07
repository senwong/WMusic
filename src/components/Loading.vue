<template>
  <div class="wrapper">
    <svg
      width="80"
      height="80"
      viewBox="0 0 200 200"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1"
      v-for="(_, i) in count"
      :key="_"
      :style="{ 'animation-delay': (i * 1) / 5 + 's' }"
    >
      <circle cx="100" cy="15" r="15"></circle>
    </svg>
  </div>
</template>
<script>
export default {
  name: "Loading",
  data() {
    return {
      count: new Array(5)
    };
  }
};
</script>
<style lang="sass" scoped>
@import "./config.sass";
.wrapper
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%);

svg
  position: absolute;
  animation-name: rotate;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  fill: $orange
  stroke: $orange

@keyframes rotate
  from
    transform: rotate(0deg);
  to
    transform: rotate(360deg);
</style>

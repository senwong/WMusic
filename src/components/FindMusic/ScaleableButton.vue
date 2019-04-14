<template>
  <Motion :value="scale" tag="div" class="wrapper">
    <div class="svg-wrapper" slot-scope="props" :style="{ transform: `scale(${props.value})` }" @mouseenter="zoomIn" @mouseleave="zoomOut" @touchstart="zoomIn" @touchend="zoomOut">
      <svg v-if="position == 'left'"  viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M20 30 L8 16 20 2"></path>
      </svg>
      <svg v-if="position == 'right'" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M12 30 L24 16 12 2"></path>
      </svg>
    </div>
  </Motion>
</template>
<script>
import { Motion } from 'vue-motion'

export default {
  name: 'scaleable-button-wrapper',
  data() {
    return {
      scale: 1.0,
    };
  },
  props: {
    position: String,
  },
  components: { Motion },
  methods: {
    zoomIn: function() {
      this.scale = 1.2;
    },
    zoomOut: function() {
      this.scale = 1.0;
    }
  }
}
</script>
<style lang="sass" scoped>
.wrapper
  display: flex;
  align-items: center;
  height: 100%;
  
  color: white;
  background-color: transparent;
  cursor: pointer;
.svg-wrapper
  display: flex;
  padding: 0 10px;
  align-items: center;
  height: 100%;
  transform-origin: center;
</style>


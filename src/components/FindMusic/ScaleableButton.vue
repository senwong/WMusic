<template>
  <Motion :value="scale" tag="div" class="wrapper">
    <div
      class="svg-wrapper"
      slot-scope="props"
      :style="{ transform: `scale(${props.value})` }"
      @mouseenter="zoomIn"
      @mouseleave="zoomOut"
      @touchstart="zoomIn"
      @touchend="zoomOut"
    >
      <Button noborder svglarge v-if="position == 'left'">
        <LeftArrowIcon />
      </Button>
      <Button noborder svglarge v-if="position == 'right'">
        <RightArrowIcon />
      </Button>
    </div>
  </Motion>
</template>
<script>
import { Motion } from "vue-motion";
import LeftArrowIcon from "@/components/SVGIcons/LeftArrowIcon";
import RightArrowIcon from "@/components/SVGIcons/RightArrowIcon";
import Button from "@/components/globals/Button";

export default {
  data() {
    return {
      scale: 1.0
    };
  },
  props: {
    position: String
  },
  components: {
    Motion,
    LeftArrowIcon,
    RightArrowIcon,
    Button
  },
  methods: {
    zoomIn() {
      this.scale = 1.2;
    },
    zoomOut() {
      this.scale = 1.0;
    }
  }
};
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

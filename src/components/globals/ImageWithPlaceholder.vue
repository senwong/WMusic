<template>
  <div class="img-placeholder-container">
    <div class="img-wrapper" :style="{ paddingBottom }">
      <FadeTransition>
        <img v-if="showImg" :src="src" :alt="alt" />
      </FadeTransition>
    </div>
  </div>
</template>

<script>
import FadeTransition from "./FadeTransition";

export default {
  data() {
    return {
      showImg: false
    };
  },
  props: {
    src: String,
    alt: String,
    // 16:9 1:1
    ratio: String
  },
  computed: {
    paddingBottom() {
      const [width, height] = this.ratio.split(":");
      return `${(height / width) * 100}%`;
    }
  },
  components: { FadeTransition },
  created() {
    this.downloadImage();
  },
  methods: {
    downloadImage() {
      const img = new Image();
      img.onload = () => {
        this.showImg = true;
      };
      img.src = this.src;
    }
  }
};
</script>

<style lang="sass" scoped>
.img-placeholder-container
  position: relative;
  width: 100%;
.img-wrapper
  position: relative;
  font-size: 0;
  // 1:1
  padding-bottom: 100%;
  // 16:9
  padding-bottom: 56.52%;
  background-color: rgba(0, 0, 0, 0.1);
  img
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: auto;
</style>

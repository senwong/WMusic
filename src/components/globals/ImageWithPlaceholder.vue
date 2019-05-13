<template>
  <div class="img-placeholder-container">
    <Placeholder class="img-wrapper" :style="{ paddingBottom }">
      <FadeTransition>
        <img v-show="showImg" :src="src" :alt="alt" />
      </FadeTransition>
    </Placeholder>
  </div>
</template>

<script>
import FadeTransition from "@/components/globals/FadeTransition.vue";
import Placeholder from "@/components/globals/Placeholder.vue";

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
  components: { FadeTransition, Placeholder },
  created() {
    this.downloadImage();
  },
  watch: {
    src(val) {
      this.showImg = false;
      if (val.length > 0) {
        this.downloadImage();
      }
    }
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
  position: relative
  width: 100%
.img-wrapper
  position: relative
  font-size: 0
  // 1:1
  padding-bottom: 100%
  // 16:9
  padding-bottom: 56.52%
  background-color: rgba(0, 0, 0, 0.1)
  img
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: auto
.angled-gradient
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%)
  animation: loading 1.4s ease infinite
  background-size: 400% 100%

@keyframes loading
  0%
    background-position: 0% 50%

  100%
    background-position: 100% 50%
</style>

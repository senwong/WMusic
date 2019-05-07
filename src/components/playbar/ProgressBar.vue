<template>
  <div class="progress-bar-container" ref="container" @click="handleClick">
    <div class="bar">
      <div
        class="bg"
        :style="{ transform: `translateX(${bgAccTranslateX}px)`, left: `${-bgTotalWidth}px` }"
      />
    </div>
    <div
      class="circle"
      ref="circle"
      :style="{ transform: `translate(${circleAccTranslateX}px, -50%)` }"
    />
  </div>
</template>

<script>
const msPerFrame = 1000 / 60;
export default {
  data() {
    return {
      animationId: null,
      prevTime: 0,
      circleAccTranslateX: 0,
      circleTotalWidth: 0,
      bgAccTranslateX: 0,
      bgTotalWidth: 0
    };
  },
  props: {
    totalTime: Number,
    isPlaying: Boolean
  },
  computed: {
    circleTranslateXPerMs() {
      return this.circleTotalWidth / (this.totalTime * 1000);
    },
    bgTranslateXPerMs() {
      return this.bgTotalWidth / (this.totalTime * 1000);
    }
  },
  watch: {
    isPlaying(newVal, oldVal) {
      if (newVal && !oldVal) {
        // start animation
        this.animatable = true;
        this.prevTime = performance.now();
        this.startAnimation();
      }
      if (!newVal && oldVal) {
        // stop animation
        this.stopAnimation();
      }
    },
    totalTime() {
      this.circleAccTranslateX = 0;
      this.bgAccTranslateX = 0;
    }
  },
  methods: {
    updateTotalWidth() {
      const containerWidth = this.$refs.container.clientWidth;
      const circleWidth = this.$refs.circle.clientWidth;
      this.circleTotalWidth = containerWidth - circleWidth;
      this.bgTotalWidth = containerWidth;
    },
    startAnimation(timestamp) {
      if (!this.animatable) return;
      if (
        this.circleAccTranslateX >= this.circleTotalWidth ||
        this.bgAccTranslateX >= this.bgTotalWidth
      ) {
        this.circleAccTranslateX = 0;
        this.bgAccTranslateX = 0;
        return;
      }
      // timeDelta
      const currentTime = timestamp || performance.now();
      const timeDelta = currentTime - this.prevTime;
      this.prevTime = currentTime;

      this.circleAccTranslateX += timeDelta * this.circleTranslateXPerMs;
      this.bgAccTranslateX += timeDelta * this.bgTranslateXPerMs;

      this.animationId = requestAnimationFrame(this.startAnimation);
    },
    stopAnimation() {
      this.animatable = false;
    },
    handleAudioEnded() {
      this.stopAnimation();
      this.circleAccTranslateX = 0;
      this.bgAccTranslateX = 0;
    },
    handleClick({ clientX }) {
      const { container } = this.$refs;
      const { left } = container.getBoundingClientRect();

      this.bgAccTranslateX = clientX - left;
      this.circleAccTranslateX = clientX - left;
      const percent = (clientX - left) / container.clientWidth;
      this.$emit("jumpTo", percent);
    }
  },
  mounted() {
    this.updateTotalWidth();
    window.addEventListener("resize", this.updateTotalWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateTotalWidth);
  }
};
</script>

<style scoped>
.progress-bar-container {
  height: 12px;
  width: 100%;
  position: relative;
}
.bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 5px;
  width: 100%;
  border-radius: 9999px;
  background: rgb(213, 216, 220);
  box-sizing: border-box;
  overflow: hidden;
}
.circle {
  position: absolute;
  left: 0;
  top: 50%;
  width: 12px;
  height: 100%;
  border-radius: 9999px;
  background-color: lightpink;
  transform-origin: left center;
  opacity: 0;
}
.bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: rgb(171, 178, 185);
  transform-origin: left center;
  /* transition-property: background-color;
  transition-duration: 0.25s; */
}
.progress-bar-container:hover .bg {
  background: tomato;
}
.progress-bar-container:hover .circle {
  opacity: 1;
}
</style>

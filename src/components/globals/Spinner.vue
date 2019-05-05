<template>
  <svg viewBox="0 0 32 32" fill="currentColor" width="100%" height="100%">
    <circle
      cx="16"
      cy="4"
      r="4"
      class="circle"
      v-for="(_, idx ) in new Array(this.numberOfCircle)"
      :key="idx"
      ref="circles"
    ></circle>
  </svg>
</template>

<script>
export default {
  data() {
    return {
      numberOfCircle: 4
    };
  },
  methods: {
    startAnimation(element) {
      let currentRad = 0;
      let gravityForce = 0.01;
      let velocity = 0; // angle add per 1/60second
      let a = 0.01;
      function step() {
        velocity += a;
        currentRad += velocity;
        currentRad %= Math.PI * 2;
        element.style.transform = `rotateZ(${currentRad}rad)`;
        a = gravityForce * Math.sin(currentRad);
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  },
  mounted() {
    this.$refs.circles.forEach((circle, idx) => {
      setTimeout(() => {
        this.startAnimation(circle);
      }, 200 * idx);
    });
  }
};
</script>

<style scoped>
.circle {
  transform-origin: center;
}
</style>

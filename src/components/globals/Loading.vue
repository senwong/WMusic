<template>
  <svg
    viewBox="0 0 300 150"
    width="100%"
    height="100%"
    stroke="currentColor"
    fill="currentColor"
  >
    <circle ref="left" cx="25%" cy="50%" r="10%"></circle>
    <circle ref="middle" cx="50%" cy="50%" r="10%"></circle>
    <circle ref="right" cx="75%" cy="50%" r="10%"></circle>
  </svg>
</template>

<script>
const cy = 75;
const lastRafTime = {
  left: (Math.PI * 3) / 2,
  middle: Math.PI,
  right: Math.PI / 2
};
export default {
  data() {
    return {
      animationId: null
    };
  },
  mounted() {
    const { left, middle, right } = this.$refs;
    this.left = left;
    this.middle = middle;
    this.right = right;
    this.animationId = requestAnimationFrame(this.animate);
  },
  methods: {
    animate() {
      this.left.setAttribute("cy", cy + 20 * Math.sin(lastRafTime.left));
      this.middle.setAttribute("cy", cy + 20 * Math.sin(lastRafTime.middle));
      this.right.setAttribute("cy", cy + 20 * Math.sin(lastRafTime.right));
      lastRafTime.left += 0.15;
      lastRafTime.middle += 0.15;
      lastRafTime.right += 0.15;
      this.animationId = requestAnimationFrame(this.animate);
    }
  },
  beforeDestroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
};
</script>

<style></style>

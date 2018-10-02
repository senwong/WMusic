<template>
  <button class="ripple-button" ref="button" @click="$emit('click')" @mousedown="triggerRipple" @mouseup="cancelRipple">
    <slot></slot>
    <div class="ripple-circle" ref="circle"></div>
  </button>
</template>
<script>
import { addEventListenerOnce } from "@/utilitys.js"
  export default {
    name: "RippleButton",
    data() {
      return {
        isAnimating: false,
      }
    },
    methods: {
      triggerRipple(e) {
        this.isAnimating = true
        const parent = this.$refs.button
        let div = this.$refs.circle
        const d = Math.max(parent.clientWidth, parent.clientHeight);
        div.style.width = div.style.height = d + "px";
        div.style.left = e.offsetX - d / 2 + "px";
        div.style.top = e.offsetY - d / 2 + "px";
        div.classList.remove("ripple-animation")
        void div.offsetWidth;
        div.classList.add("ripple-animation")
        console.log("mouse down")
        div.addEventListener("animationend", () => {
          this.isAnimating = false
        })
        e.preventDefault();
      },
      cancelRipple(e) {
        const parent = this.$refs.button
        let div = this.$refs.circle
        if (this.isAnimating) {
          addEventListenerOnce(div, "animationend", () => {
            div.classList.remove("ripple-animation")
          })
        } else {
          div.classList.remove("ripple-animation")
        }
        console.log("mouseup")
        void div.offsetWidth;
        e.preventDefault();
      }
    }
  }
</script>
<style lang="sass" scoped>
@import "@/style/colors.sass";
.ripple-button
  background-color: transparent;
  font-size: 14px;
  padding: 9px 15px;
  border: 1px solid $primary;
  border-radius: 2px;
  color: $primary;
  position: relative;
  overflow: hidden;
  &:focus, &:hover
    outline: none;

.ripple-circle
  position: absolute;
  background: rgba(160, 160, 160, 0.3);
  transform: scale(0);
  border-radius: 50%;

.ripple-animation
  animation: ripple 0.4s linear forwards;

@keyframes ripple
  to
    transform: scale(2.5);
@keyframes ripple-2
  to
    transform: scale(2.5);
</style>


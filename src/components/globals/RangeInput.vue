<template>
  <div>
    <div class="wrapper">
      <div class="fill-lower-wrapper">
        <div
          class="fill-lower"
          ref='fillLower'
          :style="{transform: `translateX(${percent})`}"
        />
      </div>
      <input type="range" :min="min" :max="max" step="0.1" v-model="value">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 50,
    }
  },
  props: {
    min: Number,
    max: Number,
  },
  computed: {
    percent() {
      if (this.$refs.fillLower) {
        const width = this.$refs.fillLower.clientWidth;
        if (this.value / (this.max - this.min) * width < 7) {
          return 'clac(-100% + 7px)';
        }
      }
      return 100 * this.value / (this.max - this.min) - 100 + '%';
    }
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  watch: {
    value(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang='sass' scoped>
.wrapper
  position: relative
  height: 14px
  display: flex
  align-items: center


input[type="range"]
  -webkit-appearance: none
  width: 100%
  height: 50%
  box-sizing: border-box
  background-color: transparent
  border-radius: 9999px
  margin: 0
  position: relative
  

input[type="range"]:focus
  outline: none

// remove firefox focus dotted border
// https://stackoverflow.com/questions/18794026/remove-dotted-outline-from-range-input-element-in-firefox
input[type=range]::-moz-focus-outer
  border: 0
    

input[type="range"]::-webkit-slider-thumb
  -webkit-appearance: none
  border-radius: 9999px
  background: tomato
  width: 14px
  height: 14px
  cursor: pointer
  z-index: 1
  position: relative
input[type="range"]::-moz-range-thumb
  border-radius: 9999px
  background: tomato
  width: 14px
  height: 14px
  cursor: pointer
  z-index: 1
  position: relative
  border: none
input[type="range"]::-ms-thumb
  border-radius: 9999px
  background: tomato
  width: 14px
  height: 14px
  cursor: pointer
  z-index: 1
  position: relative

.fill-lower-wrapper
  width: 100%
  height: 50%
  position: absolute
  top: 50%
  transform: translateY(-50%)
  left: 0
  border-radius: 9999px
  overflow: hidden
  z-index: 0
  background-color: #ddd

.fill-lower
  width: calc(100% - 7px)
  height: 100%
  background: tomato
  transform-origin: left center
</style>

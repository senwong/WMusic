<template>
  <div class="search-container" :class="{ spread: isSpread }">
    <div class="search-icon" @click="$emit('keyup.enter')">
      <SearchIcon />
    </div>
    <input
      type="text"
      class="input"
      @focus="$emit('focus', $event)"
      @input="$emit('input', $event.target.value)"
      v-model="value"
      v-on:keyup.enter="$emit('enter')"
      :placeholder="placeholder"
    />
    <div
      class="clear-icon"
      v-show="value && value.length > 0"
      @click="handleClear"
    >
      <ClearIcon />
    </div>
  </div>
</template>
<script>
import SearchIcon from "@/components/SVGIcons/SearchIcon";
import ClearIcon from "@/components/SVGIcons/ClearIcon";

export default {
  data() {
    return {
      value: null
    };
  },
  model: {
    prop: "value",
    event: "input"
  },
  components: {
    SearchIcon,
    ClearIcon
  },
  props: ["placeholder", "isSpread"],
  methods: {
    handleClear() {
      this.value = null;
      this.$emit("input", null);
    }
  }
};
</script>
<style lang="sass" scoped>
@import "../config.sass"
@import "@/style/theme.sass"

.search-container
  padding: 0 1em;
  border-radius: 17.5px;
  display: flex;
  flex-directon: row;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid;
  border-color: transparent;
  border-bottom: none;
  transition-property: background border;
  transition-duration: 250ms;
  @include themify($themes)
    color: themed('text-color')
    background-color: themed('secondary-background-color')
  &.spread
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
    @include themify($themes)
      border-color: themed('secondary-border-color')
.search-icon, .clear-icon
  height: 1.2em;
  width: 1.2em;
  flex: 0 0 auto;
  padding: 0.5em;
  margin: -0.5em;
  cursor: pointer;
  color: inherit
.search-icon
  margin-right: 0;

.input
  flex: 1 1 auto;
  border: none;
  padding: 0;
  margin: 0;
  background: transparent;
  font-size: 14px;
  color: inherit
  &:focus
    outline: none;
</style>

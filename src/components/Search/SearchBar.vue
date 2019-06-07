<template>
  <div class="search-container" :class="{ spread: isSpread }">
    <div class="search-icon" @click="$emit('keyup.enter')">
      <SearchIcon />
    </div>
    <input
      type="text"
      class="input"
      @focus="$emit('focus', $event)"
      @input="handleInput"
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
<script lang="ts">
import SearchIcon from "@/components/SVGIcons/SearchIcon.vue";
import ClearIcon from "@/components/SVGIcons/ClearIcon.vue";
import { Vue, Component, Prop, Model } from "vue-property-decorator";

@Component({
  components: { SearchIcon, ClearIcon }
})
export default class SearchBar extends Vue {
  @Model("input", { type: String }) readonly value!: string;
  @Prop(String) readonly placeholder!: string;
  @Prop(Boolean) readonly isSpread!: boolean;
  handleClear() {
    this.$emit("input", "");
  }
  handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.$emit("input", target.value);
  }
}
</script>
<style lang="sass" scoped>
@import "searchbar.scss"
@import "@/style/themify.sass"

.search-container
  padding: 0 1em
  border-radius: 17.5px
  display: flex
  flex-direction: row
  width: 100%
  align-items: center
  box-sizing: border-box
  border: 1px solid
  border-color: transparent
  border-bottom: none
  transition-property: background, border
  transition-duration: 250ms
  color: inherit
  &.spread
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
  @include themify($themes)
    background-color: themed("background-color")
    border-color: themed('border-color')
    &.spread
      background-color: themed("background-color-focus")
      border-color: themed('border-color-focus')

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

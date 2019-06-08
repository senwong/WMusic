<template>
  <div class="search-bar" :class="{ 'search-bar--spread': isSpread }">
    <SvgBtn @click.native="$emit('keyup.enter')" class="search-bar__search">
      <SearchIcon />
    </SvgBtn>
    <input
      type="text"
      class="search-bar__input"
      @focus="$emit('focus', $event)"
      v-model="value"
      v-on:keyup.enter="$emit('enter')"
      :placeholder="placeholder"
      spellcheck="false"
    />
    <SvgBtn v-show="value && value.length > 0" @click.native="handleClear">
      <ClearIcon />
    </SvgBtn>
  </div>
</template>
<script lang="ts">
import SearchIcon from "@/components/SVGIcons/SearchIcon.vue";
import ClearIcon from "@/components/SVGIcons/ClearIcon.vue";
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import SvgBtn from "@/components/globals/SvgBtn.vue";

@Component({
  components: { SearchIcon, ClearIcon, SvgBtn }
})
export default class SearchBar extends Vue {
  @Model("input", { type: String }) readonly value!: string;
  @Prop(String) readonly placeholder!: string;
  @Prop(Boolean) readonly isSpread!: boolean;
  handleClear() {
    this.$emit("input", "");
  }
  @Watch("value")
  onValueChange(val: string) {
    this.$emit("input", val);
  }
}
</script>
<style lang="sass" scoped>
@import "searchbar.scss"
@import "@/style/themify.sass"

.search-bar
  padding: 0 0.5em
  border-radius: 17.5px
  display: flex
  flex-direction: row
  width: 100%
  align-items: center
  box-sizing: border-box
  border: 1px solid
  border-color: transparent
  transition-property: background, border
  transition-duration: 250ms
  color: inherit
  &--spread
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
  @include themify($themes)
    background-color: themed("background-color")
    border-color: themed('border-color')
    &--spread
      background-color: themed("background-color-focus")
      border-color: themed('border-color-focus')
  &__search
    margin-right: 0.5em
  &__input
    flex: 1 1 auto
    border: none
    padding: 0
    margin: 0
    background: transparent
    font-size: 14px
    color: inherit
    &:focus
      outline: none
</style>

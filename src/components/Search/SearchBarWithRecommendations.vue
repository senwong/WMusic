<template>
  <div class="srh-bar-recmd">
    <SearchBar
      @focus="handleFocus"
      :value="value"
      @input="handleInput"
      @enter="handleEnter"
      :placeholder="placeholder"
      :isSpread="showRecommendations"
      class="search-bar"
    />
    <SearchRecommendations
      :show="showRecommendations"
      class="srh-recmd"
      :keywords="value"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import SearchBar from "./SearchBar.vue";
import SearchRecommendations from "./recommendations/index.vue";

@Component({
  components: {
    SearchBar,
    SearchRecommendations
  }
})
export default class SearchBarWithRecommendations extends Vue {
  showRecommendations: boolean = false;
  @Model("input", { type: String }) readonly value!: string;
  @Prop(String) readonly placeholder!: string;
  @Watch("value")
  onValueChange(val: string) {
    this.$emit("input", val);
  }
  handleFocus() {
    this.showRecommendations = true;
    this.$emit("focus");
  }
  handleEnter() {
    this.showRecommendations = false;
    this.$emit("enter");
  }
  handleInput(val: string) {
    this.$emit("input", val);
  }
  handleWindowClick({ target }: MouseEvent) {
    const selfEle = this.$el as HTMLElement;
    if (!selfEle || !target) return;
    if (!(target == selfEle || selfEle.contains(target as Node))) {
      this.showRecommendations = false;
    }
  }
  mounted() {
    window.addEventListener("click", this.handleWindowClick);
  }
  beforeDestroy() {
    window.removeEventListener("click", this.handleWindowClick);
  }
}
</script>

<style lang="sass" scoped>
@import "@/style/themify.sass"
@import "searchbar.scss"
.srh-bar-recmd
  position: relative
  max-width: 450px
  z-index: 1
.search-bar
  height: 35px
  z-index: 1
  position: relative
  z-index: 1
  transform: translateZ(0)
.srh-recmd
  position: absolute
  top: 35px
  left: 0
  width: 100%
  z-index: 0
  transform: translateZ(0)
  @include themify($themes)
    background-color: themed('background-color')
    border-color: themed('border-color-focus')
    box-shadow: 0 8px 6px 3px adjust-color(themed('background-color-focus'), $alpha: -0.8)
</style>

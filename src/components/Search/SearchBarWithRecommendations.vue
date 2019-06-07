<template>
  <div class="srh-bar-recmd" ref="container">
    <SearchBar
      @focus="handleFocus"
      @input="handleInput"
      v-model="value"
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

<script>
import SearchBar from "./SearchBar";
import SearchRecommendations from "./SearchRecommendations";

export default {
  data() {
    return {
      showRecommendations: false,
      value: null
    };
  },
  model: {
    prop: "value",
    event: "input"
  },
  props: ["placeholder"],
  components: {
    SearchBar,
    SearchRecommendations
  },
  methods: {
    handleFocus() {
      this.showRecommendations = true;
      this.$emit("focus");
    },
    handleEnter() {
      this.showRecommendations = false;
      this.$emit("enter");
    },
    handleInput(val) {
      this.$emit("input", val);
    },
    handleClick({ target }) {
      if (!this.$refs.container) return;
      if (
        !(
          target == this.$refs.container ||
          this.$refs.container.contains(target)
        )
      ) {
        this.showRecommendations = false;
      }
    }
  },
  mounted() {
    window.addEventListener("click", this.handleClick);
  },
  beforeDestroy() {
    window.removeEventListener("click", this.handleClick);
  }
};
</script>

<style lang="sass" scoped>
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
</style>

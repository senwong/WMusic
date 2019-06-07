<template>
  <ul class="pagination">
    <li
      class="pagination__item"
      v-for="p in pagination"
      :key="p.pageIdx"
      @click="handleClick(p)"
      :class="{
        'pagination__item--active': p.pageIdx == currentPageIdx,
        'pagination__item--disabled': disabled
      }"
    >
      {{ p.symbol }}
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      // start from 0
      currentPageIdx: 0
    };
  },
  props: {
    // how many pages
    total: Number,
    disabled: Boolean
  },
  computed: {
    pagination() {
      const result = [];
      new Array(this.total).fill(true).map((_, idx) => {
        if (this.isPageNum(idx)) {
          result.push({ symbol: idx + 1, pageIdx: idx });
        } else if (this.isPageSpread(idx)) {
          result.push({ symbol: "...", pageIdx: idx });
        }
      });
      return result;
    }
  },
  methods: {
    // 0, n-1, idx-2, idx -1 idx idx+1 idx+2
    isPageNum(pageIdx) {
      const lastPageIdx = this.total - 1;
      return (
        pageIdx == 0 ||
        pageIdx == lastPageIdx ||
        (pageIdx < Math.min(lastPageIdx, this.currentPageIdx + 3) &&
          pageIdx > Math.max(0, this.currentPageIdx - 3))
      );
    },
    isPageSpread(pageIdx) {
      return (
        pageIdx == this.currentPageIdx + 3 || pageIdx == this.currentPageIdx - 3
      );
    },
    handleClick({ pageIdx }) {
      if (this.disabled) {
        return;
      }
      this.currentPageIdx = pageIdx;
      this.$emit("change", this.currentPageIdx);
    }
  }
};
</script>

<style lang="sass" scoped>
@import '@/style/colors.sass'
@import "@/style/themify.sass"
@import "Pagination.scss"

.pagination
  padding: 0
  text-align: center
  &__item
    display: inline-block
    margin: 1em
    width: 2em
    height: 2em
    padding: 0.5em
    cursor: pointer
    border-radius: 0.4em
    transition: all .5s
    user-select: none
    -webkit-user-select: none
    @include themify($themes)
      background-color: themed("bg")
      &:not(&--disabled):hover
        background-color: themed("bg-hover")
    &--active
      color: $primary-color
    &--disabled
      cursor: not-allowed
</style>

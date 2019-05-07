<template>
  <ul class="pagination__list">
    <li
      class="pagination__item"
      v-for="p in pagination"
      :key="p.pageIdx"
      @click="handleClick(p)"
      :class="{ active: p.pageIdx == currentPageIdx }"
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
    total: Number
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
      return pageIdx == this.currentPageIdx + 3 || pageIdx == this.currentPageIdx - 3;
    },
    handleClick({ pageIdx }) {
      this.currentPageIdx = pageIdx;
      this.$emit("change", this.currentPageIdx);
    }
  }
};
</script>

<style lang="sass" scoped>
@import '@/style/colors.sass';

.pagination__list
  padding: 0;
  text-align: center;
.pagination__item
  display: inline-block;
  margin: 1em;
  padding: 0.5em;
  cursor: pointer;
  &.active
    color: $primary;
</style>

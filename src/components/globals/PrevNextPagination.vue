<template>
  <div class="pagination-btns" v-if="!(offset <= 0 && hasMore == false)">
    <Button class="prev__btn" :disabled="offset == 0" @click.native="handlePrev"
      >上一页</Button
    >
    <Button class="next_-btn" :disabled="!hasMore" @click.native="handleNext"
      >下一页</Button
    >
  </div>
</template>

<script>
import Button from "@/components/globals/Button";

export default {
  props: {
    offset: {
      required: true,
      type: Number
    },
    limit: {
      required: true,
      type: Number
    },
    hasMore: {
      required: true,
      type: Boolean
    }
  },
  components: { Button },
  methods: {
    handlePrev() {
      if (this.offset <= 0) return;
      this.$emit("offsetChange", Math.max(0, this.offset - this.limit));
    },
    handleNext() {
      if (!this.hasMore) return;
      this.$emit("offsetChange", this.offset + this.limit);
    }
  }
};
</script>

<style lang="sass" scoped>
.pagination-btns
  text-align: center
  margin-top: 2em
  .prev__btn
    margin-right: 1em
</style>

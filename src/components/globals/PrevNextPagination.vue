<template>
  <div class="prev-next-pagination" v-if="!(offset <= 0 && hasMore == false)">
    <Button
      class="prev-next-pagination__prev-btn"
      :disabled="offset == 0"
      @click.native="handlePrev"
      >上一页</Button
    >
    <Button :disabled="!hasMore" @click.native="handleNext">下一页</Button>
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
.prev-next-pagination
  text-align: center
  margin-top: 2em
  &__prev-btn
    margin-right: 1em
</style>

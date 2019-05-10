<template>
  <div class="user-media-card-grid" v-if="users">
    <div class="user-media-card-grid__container" v-if="users.length > 0">
      <UserMediaCard v-for="user in users" :key="user.userId" :user="user"/>
    </div>
    <div class="user-media-card-grid__container" v-else>
      <Placeholder class="placeholder" v-for="(_, idx) in new Array(20)" :key="idx"/>
    </div>
    <div class="pagination">
      <Button
        class="pagination__back-btn"
        :disabled="backBtnDisabled"
        @click.native="handleBack"
      >上一页</Button>
      <Button
        class="pagination__forward-btn"
        :disabled="forwardBtnDisabled"
        @click.native="handleForward"
      >下一页</Button>
    </div>
  </div>
</template>

<script>
import UserMediaCard from "./UserMediaCard";
import Button from "@/components/globals/Button";
import Placeholder from "@/components/globals/Placeholder.vue";

export default {
  props: {
    users: {
      required: true,
      type: Array
    },
    more: {
      required: true,
      type: Boolean
    },
    offset: {
      required: true,
      type: Number
    },
    limit: {
      required: true,
      type: Number
    }
  },
  components: { UserMediaCard, Button, Placeholder },
  computed: {
    backBtnDisabled() {
      return this.offset <= 0;
    },
    forwardBtnDisabled() {
      return !this.more;
    }
  },
  methods: {
    handleBack() {
      if (this.offset <= 0) return;
      this.$emit("offsetChange", Math.max(0, this.offset - this.limit));
    },
    handleForward() {
      if (!this.more) return;
      this.$emit("offsetChange", this.offset + this.limit);
    }
  }
};
</script>

<style lang="sass" scoped>
.user-media-card-grid
  font-size: 16px
  padding: 2em
  .user-media-card-grid__container
    display: grid
    row-gap: 2em
    column-gap: 1em
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
    justify-content: space-around
  .pagination
    text-align: center
    margin-top: 2em
    .pagination__back-btn
      margin-right: 2em
.placeholder
  height: 4.125em
</style>

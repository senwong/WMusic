<template>
  <div class="user-media-card-grid" v-if="users">
    <div class="user-media-card-grid__container" v-if="users.length > 0">
      <UserMediaCard v-for="user in users" :key="user.userId" :user="user" />
    </div>
    <div class="user-media-card-grid__container" v-else>
      <Placeholder
        class="placeholder"
        v-for="(_, idx) in new Array(20)"
        :key="idx"
      />
    </div>
    <div class="pagination">
      <Button
        class="pagination__back-btn"
        :disabled="backBtnDisabled"
        @click.native="handleBack"
        >上一页</Button
      >
      <Button
        class="pagination__forward-btn"
        :disabled="forwardBtnDisabled"
        @click.native="handleForward"
        >下一页</Button
      >
    </div>
  </div>
</template>

<script lang='ts'>
import UserMediaCard from "./UserMediaCard.vue";
import Button from "@/components/globals/Button.vue";
import Placeholder from "@/components/globals/Placeholder.vue";
import { Vue, Component, Prop } from 'vue-property-decorator';
import { User } from '@/types';

@Component({
  components: { UserMediaCard, Button, Placeholder}
})
export default class UserMediaCardGrid extends Vue {
  @Prop() users!: User[]; 
  @Prop(Boolean) more!: boolean;
  @Prop(Number) offset!: number;
  @Prop(Number) limit!: number;

  get backBtnDisabled(): boolean {
    return this.offset <= 0;
  }
  get forwardBtnDisabled(): boolean {
    return !this.more;
  }
  handleBack() {
    if (this.offset <= 0) return;
    this.$emit("offsetChange", Math.max(0, this.offset - this.limit));
  }
  handleForward() {
    if (!this.more) return;
    this.$emit("offsetChange", this.offset + this.limit);
  }
}
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

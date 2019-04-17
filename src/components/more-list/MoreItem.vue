<template>
  <div class="more-item__wrapper">
    <div class="more-item">
      <div class="item-wrapper">
        <!-- 靠左显示 -->
        <div class="item__left">
          <div class="icon">
            <slot name="icon"></slot>
          </div>
          <slot name="txt"></slot>
        </div>
        <!-- 靠右显示 -->
        <div class="item__right">
          <svg v-show="!!spread" class="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M12 30 L24 16 12 2"></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="spread-list" :style="styleObj">
      <slot name="spread-list"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: "MoreItem",
    props: ['spread'],
    data() {
      return {
        styleObj: { }
      }
    },
    mounted() {
      this.$nextTick(() => {
        const property = this.spread && this.spread.slice(1, -1);
        property === "right" && (this.styleObj = {left: '100%'});
        property === "left" && (this.styleObj = {right: '100%'});
      })
    }
  }
</script>
<style lang="sass" scoped>
@import "../config.sass";
.more-item__wrapper
  position: relative;  
  border-radius: inherit;
.more-item
  position: relative;
  background-color: $whitegray2;
  // padding: 6px;
  overflow: visible;
  border-radius: inherit;
  cursor: pointer;
  &:hover
    .item-wrapper
      background-color: $orange;
      color: white;
    .icon
      color: inherit;
  &:hover ~ .spread-list
      display: block;
  .item-wrapper
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 6px;
    border-radius: 2px;
  .item__left
    display: flex;
    flex-direction: row;
    align-items: center;
    .icon
      margin-right: 6px;
  .item__right
    width: 16px;
    height: 16px;
  .icon
    display: flex;
    width: 16px;
    height: 16px;
    color: $gray;
    *
      width: 100%;
      height: 100%;
  .txt
    white-space: nowrap;
.spread-list
  display: none;
  position: absolute;
  top: 0;
  &:hover
    display: block
</style>


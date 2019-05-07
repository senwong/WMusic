<template>
  <!--
    +---------------------------------+
    | avatar | input element          |
    +--------+------------+-----------+
    |        | cancel btn | reply btn |
    +--------+------------+-----------+
  -->
  <div class="comment-reply__container">
    <!-- first row -->
    <div class="comment-reply__avatar-input">
      <!-- avatar -->
      <img src="" alt="" class="comment-reply__avatar" :class="{ large: isMain }" />
      <div class="comment-reply__input__wrapper">
        <textarea
          type="text"
          class="comment-reply__input"
          placeholder="添加回复"
          @focus="handleFocus"
          @blur="isFocused = false"
          :autofocus="!isMain"
          @keydown="autoAdjustHeight"
        />
        <div class="comment-reply__input__fake-bot-border" :class="{ show: isFocused }" />
      </div>
    </div>
    <!-- second row -->
    <div class="comment-reply__actions" v-if="isShowActions">
      <button class="comment-reply__actions__btn secondary" @click="$emit('hide')">取消</button>
      <button class="comment-reply__actions__btn primary" @click="handleReply">回复</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFocused: false,
      isShowActions: true
    };
  },
  props: {
    isMain: {
      type: Boolean,
      default: false
    }
  },
  created() {
    if (this.isMain) {
      this.isShowActions = false;
    }
  },
  methods: {
    handleReply() {
      // TODO
    },
    handleFocus() {
      this.isFocused = true;
      if (!this.isShowActions) {
        this.isShowActions = true;
      }
    },
    autoAdjustHeight({ target }) {
      target.style.cssText = "height:auto; padding:0";
      // for box-sizing other than "content-box" use:
      // el.style.cssText = '-moz-box-sizing:content-box';
      target.style.cssText = `height:${target.scrollHeight}px`;
    }
  }
};
</script>

<style lang="sass" scoped>
.comment-reply__container
  padding-top: 0.5em;
.comment-reply__avatar-input
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
.comment-reply__avatar
  flex: 0 0 1.5em;
  height: 1.5em;
  border-radius: 9999px;
  margin-right: 0.5em;
  display: inline-block;
  background: #eee;
  &.large
    flex: 0 0 2.5em;
    height: 2.5em;

.comment-reply__input__wrapper
  flex: 1 1 auto;
  display: inline-block;
  position: relative;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
.comment-reply__input
  padding: 0;
  display: block;
  height: 100%;
  width: 100%;
  border: none;
  font-size: 14px;
  resize: none;
  &:focus
    outline: none;
.comment-reply__input__fake-bot-border
  height: 2px;
  transition: all 250ms;
  background-color: #666;
  tranform-origin: center;
  transform: scaleX(0);
  position: absolute;
  bottom: -1px
  left: 0;
  width: 100%;
  &.show
    transform: scaleX(1);

.comment-reply__actions
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: 0.5em;
.comment-reply__actions__btn
  padding: 4px 9px;
  font-size: 16px;
  line-height: 20px;
  border: none;
  margin-left: 0.6em;
  cursor: pointer;
  font-weight: bolder;
  &:focus, &:active
    outline: none;
  &.secondary
    color: #777;
    background: white;
  &.primary
    color: #fff;
    background: #aaa;
    border-radius: 2px;
</style>

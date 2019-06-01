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
      <img
        :src="avatarUrl"
        :alt="nickname"
        class="comment-reply__avatar"
        :class="{ large: isMain }"
      />
      <div class="comment-reply__input__wrapper">
        <textarea
          type="text"
          class="comment-reply__input"
          placeholder="添加回复"
          v-model.trim="content"
          @focus="handleFocus"
          @blur="isFocused = false"
          :autofocus="!isMain"
          @keydown="autoAdjustHeight"
        />
        <div
          class="comment-reply__input__fake-bot-border"
          :class="{ show: isFocused }"
        />
      </div>
    </div>
    <!-- second row -->
    <div class="comment-reply__actions" v-if="isShowActions">
      <Button @click.native="$emit('hide')">
        取消
      </Button>
      <Button
        primary
        class="comment-reply__actions__reply"
        :disabled="replyDisabled"
        @click.native="handleReply"
      >
        回复
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace, State } from "vuex-class";
import { getUserDetail, sentComment } from "@/service";
import { CommentType } from "@/types";
import { isUndef } from "@/utilitys";
import Button from "@/components/globals/Button.vue";

const currentUser = namespace("currentUser");
const notification = namespace("notification");
@Component({
  components: { Button }
})
export default class CommentReplyEditor extends Vue {
  @Prop({ default: false, type: Boolean }) isMain!: boolean;
  // 资源id
  @Prop(Number) id!: number;
  // 资源类型
  @Prop() type!: CommentType;

  isFocused: boolean = false;
  isShowActions: boolean = true;
  avatarUrl: string = "";
  nickname: string = "";
  content: string = "";
  @currentUser.State("userId") currentUserId!: number;
  @notification.Mutation setMsg!: (msg: string) => void;

  get replyDisabled(): boolean {
    return isUndef(this.id) || isUndef(this.type) || this.content.length < 1;
  }
  created() {
    this.updateUserData();
    if (this.isMain) {
      this.isShowActions = false;
    }
  }
  updateUserData() {
    if (!this.currentUserId) return;
    getUserDetail(this.currentUserId).then(
      res => {
        this.avatarUrl = res.data.profile.avatarUrl;
        this.nickname = res.data.profile.nickname;
      },
      error => {
        const msg =
          "获取当前用户信息错误" +
          (error && error.msg ? error.msg + "！" : "！");
        this.setMsg(msg);
      }
    );
  }
  handleReply() {
    if (this.replyDisabled) return;
    sentComment(this.id, this.type, this.content).then(
      res => {
        this.setMsg("评论成功！");
        this.content = "";
        this.$emit("sentComment", res.data.comment as Comment);
      },
      error => {
        this.setMsg("评论失败！");
        this.content = "";
      }
    );
  }
  handleFocus() {
    this.isFocused = true;
    if (!this.isShowActions) {
      this.isShowActions = true;
    }
  }
  autoAdjustHeight({ target }: { target: HTMLElement }) {
    target.style.cssText = "height:auto; padding:0";
    // for box-sizing other than "content-box" use:
    // el.style.cssText = '-moz-box-sizing:content-box';
    target.style.cssText = `height:${target.scrollHeight}px`;
  }
}
</script>

<style lang="sass" scoped>
@import "../../style/theme.sass"

.comment-reply__container
  padding-top: 0.5em
.comment-reply__avatar-input
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: flex-start
.comment-reply__avatar
  flex: 0 0 1.5em
  height: 1.5em
  border-radius: 9999px
  margin-right: 0.5em
  display: inline-block
  background: #eee
  &.large
    flex: 0 0 2.5em
    height: 2.5em

.comment-reply__input__wrapper
  flex: 1 1 auto
  display: inline-block
  position: relative
  border-bottom: 1px solid #eee
  box-sizing: border-box
.comment-reply__input
  padding: 0
  display: block
  height: 100%
  width: 100%
  border: none
  font-size: 14px
  resize: none
  &:focus
    outline: none
  @include themify($themes)
    color: themed('text-color')
    background-color: themed("background-color")
.comment-reply__input__fake-bot-border
  height: 2px
  transition: all 250ms
  @include themify($themes)
    background-color: themed('text-color')
  tranform-origin: center
  transform: scaleX(0)
  position: absolute
  bottom: -1px
  left: 0
  width: 100%
  &.show
    transform: scaleX(1)

.comment-reply__actions
  display: flex
  flex-direction: row
  justify-content: flex-end
  padding-top: 0.5em
.comment-reply__actions__reply
  margin-left: 0.6em
</style>

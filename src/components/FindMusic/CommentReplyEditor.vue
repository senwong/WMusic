<template>
  <!--
    +---------------------------------+
    | avatar | input element          |
    +--------+------------+-----------+
    |        | cancel btn | reply btn |
    +--------+------------+-----------+
  -->
  <div class="comment-reply-editor">
    <!-- first row -->
    <div class="comment-reply-editor__top">
      <!-- avatar -->
      <Avatar
        class="comment-reply-editor__top__left"
        user
        :id="Number(0)"
        :imgSrc="avatarUrl"
        :name="nickname"
        :large="isMain"
      />
      <TextareaInput
        class="comment-reply-editor__top__right"
        placeholder="添加回复"
        v-model.trim="content"
        @focus="handleFocus"
        :autofocus="!isMain"
        @keydown="autoAdjustHeight"
      />
    </div>
    <!-- second row -->
    <div class="comment-reply-editor__bottom" v-if="isShowActions">
      <Button @click.native="$emit('hide')">
        取消
      </Button>
      <Button
        primary
        class="comment-reply-editor__bottom__reply"
        :disabled="replyDisabled"
        @click.native="handleReply"
      >
        回复
      </Button>
    </div>
    <div class="comment-reply-editor__mask" v-if="!isLoggedin">
      <Button
        as="a"
        href="/login"
        primary
        class="comment-reply-editor__mask__login"
        >登录</Button
      >
      <Button
        as="a"
        href="/signup"
        secondary
        class="comment-reply-editor__mask__signup"
        >注册</Button
      >
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
import Avatar from "@/components/globals/Avatar.vue";
import TextareaInput from "@/components/globals/TextareaInput.vue";

const currentUser = namespace("currentUser");
const notification = namespace("notification");
@Component({
  components: { Button, Avatar, TextareaInput }
})
export default class CommentReplyEditor extends Vue {
  @Prop({ default: false, type: Boolean }) isMain!: boolean;
  // 资源id
  @Prop(Number) id!: number;
  // 资源类型
  @Prop() type!: CommentType;

  isShowActions: boolean = true;
  avatarUrl: string = "";
  nickname: string = "";
  content: string = "";

  @currentUser.State("userId") currentUserId!: number;
  @notification.Mutation setMsg!: (msg: string) => void;

  get replyDisabled(): boolean {
    return isUndef(this.id) || isUndef(this.type) || this.content.length < 1;
  }
  get isLoggedin(): boolean {
    return !isUndef(this.currentUserId);
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
@import "@/style/themify.sass"
@import "CommentReplyEditor"

.comment-reply-editor
  padding-top: 0.5em
  position: relative
  &__top
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: flex-start
    &__left
      flex: 0 0 auto
      margin-right: 0.5em
    &__right
      flex: 1 1 auto
  &__bottom
    display: flex
    flex-direction: row
    justify-content: flex-end
    padding-top: 0.5em
    &__reply
      margin-left: 0.6em
  &__mask
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    @include themify($themes)
      background-color: themed("mask-bg")
    display: flex
    justify-content: center
    align-items: center
    &__login
      margin-right: 1em
</style>

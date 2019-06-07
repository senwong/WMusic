<template>
  <!--
  +--------+---------+----------------+
  |        | usename | datetime           |
  |        +---------+----------------+
  | avatar | content                  |
  |        +--------------------------+
  |        | actions                  |
  +--------+--------------------------+
  |        | reply editor(foldable)   |
  +--------+--------------------------+
  |        | view replys              |
  +--------+--------------------------+
  |        | replys(foldable)         |
  +--------+--------------------------+

  -->
  <div class="comment-item">
    <!-- left avatar -->
    <Avatar
      class="comment-item__left"
      user
      large
      :imgSrc="comment.user.avatarUrl | convert2Https | clipImage(100, 100)"
      :alt="comment.user.nickname"
      :id="comment.user.userId"
    />
    <!-- right info -->
    <div class="comment-item__info">
      <!-- usename and datetime -->
      <div>
        <router-link
          class="comment-item__username"
          :to="'/user/' + comment.user.userId"
        >
          {{ comment.user.nickname }}
        </router-link>
        <span class="comment-item__date" v-if="comment.time">
          {{ formatDateToBefore(comment.time) }}
        </span>
      </div>
      <!-- comment content -->
      <div class="comment-item__content">{{ comment.content }}</div>
      <!-- actions: like and reply button -->
      <div class="comment-item__actions">
        <div class="comment-item__liked">
          <span class="comment-item__liked__icon">
            <LikeIcon />
          </span>
          <span
            class="comment-item__liked__count"
            v-if="comment.likedCount > 0"
            >{{ formatCount(comment.likedCount) }}</span
          >
          <SvgBtn
            class="comment-item__actions__reply"
            @click.native="isShowReplyEditor = !isShowReplyEditor"
          >
            <CommentIcon />
          </SvgBtn>
          <Button
            small
            noborder
            class="comment-item__actions__delete"
            @click.native="deleteComment"
            v-if="deleteable"
          >
            删除
          </Button>
        </div>
      </div>
      <!-- reply editor -->
      <CommentReplyEditor
        v-if="isShowReplyEditor"
        @hide="isShowReplyEditor = false"
        :id="id"
        :type="type"
        @sentComment="$emit('sentComment')"
      />
      <!-- view replys toggle button -->
      <div
        class="comment-item__replys"
        v-if="comment.beReplied && comment.beReplied.length"
      >
        <Button @click.native="handleViewReplys" small noborder>
          <span v-if="replysFolded"
            >查看{{ formatCount(comment.beReplied.length) }}条回复</span
          >
          <span v-else>隐藏回复</span>
          <span
            class="comment-item__replys__icon"
            :class="{ rotate: !replysFolded }"
          >
            <RightArrowIcon />
          </span>
        </Button>
      </div>
      <!-- replys -->
      <div v-if="!replysFolded">
        <CommentItem
          v-for="c in comment.beReplied"
          :key="c.beRepliedCommentId"
          :comment="c"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  formatDay,
  formatCount,
  formatDateToBefore,
  isUndef
} from "@/utilitys";
import LikeIcon from "@/components/SVGIcons/LikeIcon.vue";
import RightArrowIcon from "@/components/SVGIcons/RightArrowIcon.vue";
import CommentReplyEditor from "./CommentReplyEditor.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Comment, CommentType } from "@/types";
import { namespace, State } from "vuex-class";
import { sentComment, deleteComment } from "@/service";
import Button from "@/components/globals/Button.vue";
import CommentIcon from "@/components/SVGIcons/Comment.vue";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";
import Avatar from "@/components/globals/Avatar.vue";

const currentUser = namespace("currentUser");
const notification = namespace("notification");
@Component({
  components: {
    LikeIcon,
    RightArrowIcon,
    CommentReplyEditor,
    Button,
    CommentIcon,
    SvgBtn,
    ImageWithPlaceholder,
    Avatar
  }
})
export default class CommentItem extends Vue {
  @Prop() comment!: Comment;
  // 资源id
  @Prop(Number) id!: number;
  // 资源类型
  @Prop() type!: CommentType;
  replysFolded: boolean = true;

  isShowReplyEditor: boolean = false;

  formatDay = formatDay;

  formatCount = formatCount;

  formatDateToBefore = formatDateToBefore;

  @currentUser.State("userId") currentUserId!: number;
  @notification.Mutation setMsg!: (msg: string) => void;

  get deleteable(): boolean {
    return (
      !isUndef(this.currentUserId) &&
      this.comment.user.userId === this.currentUserId
    );
  }
  deleteComment() {
    deleteComment(this.id, this.type, this.comment.commentId).then(
      res => {
        this.setMsg("已删除评论！");
        this.$emit("deleteComment", this.comment);
      },
      error => {
        this.setMsg(`删除评论失败${error && error.msg ? error.msg : ""}！`);
      }
    );
  }

  handleViewReplys() {
    this.replysFolded = !this.replysFolded;
  }
}
</script>
<style lang="sass" scoped>
@import "@/style/theme.sass"

// 歌曲评论样式
a
  text-decoration: none
  color: inherit
  &:hover
    text-decoration: underline
.comment-item
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: flex-start
  margin-top: 20px
  &__left
    margin-right: 1em
  &__info
    flex: 1 1 auto
  &__username
    display: inline-block
    margin-right: 8px
    font-weight: bolder
    font-size: 0.875em
  &__date
    display: inline-block
    font-size: 0.875em
    @include themify($themes)
      color: themed("secondary-text-color")
  &__content
    margin-top: 8px
    font-size: 0.875em
  &__actions
    margin-top: 8px
    &__reply
      margin-left: 0.5em
    &__delete
      margin-left: 0.5em
  &__liked
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    font-size: 0.875em
    color: #777
    &__icon
      margin-right: 0.5em
      height: 16px
      width: 16px
      fill: currentColor
      cursor: pointer
      &:hover
        color: #333
    &__count
      white-space: nowrap
  &__replys
    margin-top: 0.5em
    &__icon
      width: 1em
      height: 1em
      display: inline-block
      transform: rotate(-90deg)
      vertical-align: bottom
      &.rotate
        transform: rotate(90deg)
      svg
        stroke-width: 4px
</style>

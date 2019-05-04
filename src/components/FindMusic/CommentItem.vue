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
<div class="comment__container">
  <!-- left avatar -->
  <router-link class="comment__avatar avatar" :to="'/user/'+comment.user.userId">
    <img :src="comment.user.avatarUrl | convert2Https | clipImage(100, 100)" :alt="comment.user.nickname">
  </router-link>
  <!-- right info -->
  <div class="comment__info">
    <!-- usename and datetime -->
    <div>
      <router-link class="comment__username username" :to="'/user/'+comment.user.userId">
        {{comment.user.nickname}}
      </router-link>
      <span class="comment__datetime datetime" v-if="comment.time">
        {{formatDateToBefore(comment.time)}}
      </span>
    </div>
    <!-- comment content -->
    <div class="comment__content content">
      {{comment.content}}
    </div>
    <!-- actions: like and reply button -->
    <div class="comment__actions">
      <div class="liked__count">
        <span class="icon">
          <LikeIcon  />
        </span>
        <span class="count" v-if="comment.likedCount > 0">{{ formatCount(comment.likedCount) }}</span>
        <button class="reply" @click="isShowReplyEditor = true">回复</button>
      </div>
    </div>
    <!-- reply editor -->
    <CommentReplyEditor v-if="isShowReplyEditor" @hide="isShowReplyEditor = false" />
    <!-- view replys toggle button -->
    <div class="comment__view-replys" v-if="comment.beReplied && comment.beReplied.length">
      <button @click="handleViewReplys" class="view-replys__btn">
        <span v-if="replysFolded">
          查看{{ formatCount(comment.beReplied.length) }}条回复
        </span>
        <span v-else>
          隐藏回复
        </span>
        <span class="view-replys__icon" :class="{rotate: !replysFolded}">
          <RightArrowIcon />
        </span>
      </button>
    </div>
    <!-- replys -->
    <div class="view-replys__comment-list" v-if="!replysFolded">
      <CommentItem v-for="c in comment.beReplied" :key="c.beRepliedCommentId" :comment="c" />
    </div>
  </div>
</div>
</template>
<script lang='ts'>
import { formatDay, formatCount, formatDateToBefore } from '@/utilitys';
import LikeIcon from '@/components/SVGIcons/LikeIcon.vue';
import RightArrowIcon from '@/components/SVGIcons/RightArrowIcon.vue';
import CommentReplyEditor from './CommentReplyEditor.vue';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Comment } from '@/types';

@Component({
  components: { LikeIcon, RightArrowIcon, CommentReplyEditor },
})
export default class CommentItem extends Vue {
  @Prop() comment!: Comment;
  replysFolded: boolean =  true;
  isShowReplyEditor: boolean = false
  
  
  formatDay = formatDay;
  formatCount = formatCount;
  formatDateToBefore = formatDateToBefore;
  handleViewReplys() {
    this.replysFolded = !this.replysFolded;
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"
@import "@/style/colors.sass"

// 歌曲评论样式
a
  text-decoration: none
  color: inherit
  &:hover
    text-decoration: underline
.comment__container
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: flex-start
  margin-top: 20px
.comment__avatar
  flex: 0 0 50px
  display: block
  margin-right: 1rem
.comment__info
  flex: 1 1 auto
.comment__username
  display: inline-block
  margin-right: 8px
.comment__datetime
  display: inline-block
.comment__content
  margin-top: 8px
.comment__actions
  margin-top: 8px


.avatar
  display: block
  font-size: 0
  border-radius: 9999px
  overflow: hidden
  img
    width: 100%
    height: auto
.username
  font-weight: bolder
  font-size: 14px
.datetime
  color: rgba(0, 0, 0, 0.4)
  font-size: 14px
.content
  font-size: 14px

.liked__count
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
  font-size: 0.875em
  color: $gray
  .icon
    margin-right: 0.5em
    height: 16px
    width: 16px
    fill: currentColor
    cursor: pointer
    &:hover
      color: #333
  .count
    white-space: nowrap
  .reply
    display: inline-block
    cursor: pointer
    border: none
    font-size: 14px
    border-radius: 2px
    padding: 4px 8px
    color: #999
    &:focus, &:active
      outline: none
    &:active
      background-color: #eee
    &:hover
      color: #222

.view-replys__btn
  display: inline-block
  cursor: pointer
  border: none
  font-size: 14px
  border-radius: 2px
  padding: 4px 8px 4px 0
  font-weight: bolder
  &:focus, &:active
    outline: none

.view-replys__icon
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

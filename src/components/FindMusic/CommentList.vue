<template>
<div>
  <div class="comment" v-for="comment in comments" :key="comment.commentId">
    <router-link :to="'/user/'+comment.user.userId" class="user__avatar">
      <img :src="comment.user.avatarUrl | convert2Https | clipImage(100, 100)" alt="">
    </router-link>
    <div class="comment__content">
      <router-link :to="'/user/'+comment.user.userId" class="user__name">
        {{comment.user.nickname}}
      </router-link>
      <p class="content">{{comment.content}}</p>
      <div class="replied">
        <div class="comment" v-for="(repley, i) in comment.beReplied" :key="i">
          <router-link :to="'/user/'+comment.user.userId" class="user__avatar">
            <img :src="comment.user.avatarUrl | convert2Https | clipImage(100, 100)" alt="comment">
          </router-link>
          <div class="comment__content">
            <router-link :to="'/user/'+comment.user.userId" class="user__name">
              {{comment.user.nickname}}
            </router-link>
            <p class="content" v-if="repley.content">{{repley.content}}</p>
            <p class="content" v-if="!repley.content">评论已删除</p>
          </div>
        </div>
      </div>
      <div class="time__liked-count">
        <span class="comment__time">{{formatDay(comment.time)}}</span>
        <like-svg class="liked__icon"></like-svg>
        <span class="count" v-if="comment.likedCount > 0">{{ comment.likedCount }}</span>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import {formatDay, } from '@/utilitys';
import LikeSvg from "@/components/globals/LikeSvg.vue"

  export default {
    name: "CommentList",
    props: ["comments"],
    components: { LikeSvg },
    data() {
      return {
        formatDay: formatDay,
      }
    }
  }
</script>
<style lang="sass" scoped>
@import "@/components/config.sass";
@import "@/style/colors.sass";

// 歌曲评论样式
a
  text-decoration: none;
  color: inherit;
  &:hover
    text-decoration: underline;
.comment
  display: flex;
  margin-top: 1em;
.user__avatar
  flex: 0 0 50px;
  width: 50px;
  height: 50px;
  margin-right: 1em;
  border-radius: 0.5em;
  overflow: hidden;
  background-color: $secondary;
  img
    width: 100%;
    height: 100%;
.user__name
  font-weight: bolder
.comment__content
  flex: 1 1 auto;
  border-bottom: 1px solid $whitegray2;
  .content
    font-size: 0.875em;
.time__liked-count
  display: flex;
  justify-content: space-between;
  color: $gray;
  font-size: 0.875em;
.comment__liked-count
  white-space: nowrap;
.liked__icon
  margin: 0 0.5em 0 auto;
  height: 1em;
  width: 1em;
  fill: currentColor;

.count
  display: inline-block;
  text-align: right;
.replied
  background-color: $whitegray2;
  border-radius: 0.5em;
  margin-bottom: 1em;
  .comment
    padding: 1em
</style>

<template>
<div class="main-wrapper">
  <div>
    <!-- 歌曲信息 -->
    <div class="song-info">
      <div class="album-img">
        <img :src="album.picUrl" alt="">
      </div>
      <div class="song-desc">
        <div class="song-name">{{name}}</div>
        <div>艺人：
          <router-link
            v-for="artist in artists"
            :key="artist.id"
            :to="'/artist/'+ artist.id">{{artist.name}}</router-link>
        </div>
        <div>专辑：
          <router-link :to="'/album/'+album.id">{{album.name}}</router-link>
        </div>
        <div>
          <button>播放</button>
          <button>收藏</button>
          <button>歌词</button>
          <button>more</button>
        </div>
      </div>
    </div>
    <!-- 歌曲评论和标签-->
    <div class="comment__tag">
      <!-- 歌曲评论 -->
      <div class="comments">
        <h1>热门评论</h1>
        <comment-list :comments="hotComments"></comment-list>
        <h1>最新评论（{{commentsCount}}条）</h1>
        <comment-list :comments="comments"></comment-list>
        <!-- 加载提示 -->
        <div class="loading-tips">
          <p v-if="isAllCommentsLoaded" class="loading-tip">所有评论加载完毕</p><br>
          <p v-if="isLoading" class="loading-tip">正在加载。。。</p>
        </div>
      </div>
      <!-- 标签 -->
      <div class="tags"></div>
    </div>
  </div>
</div>
</template>
<script>
  import { getSongDetail, getSongComment} from '@/service/Service';
  import CommentList from "./CommentList.vue";
  import {convertToHttps} from '@/utilitys';

  const  OFEESETCOUNT = 20
  export default {
    name: "SongDetail",
    data() {
      return {
        songId: null,
        name: "",
        artists: [],
        album: {},
        hotComments: [],
        comments: [],
        commentsOffset: 0,
        commentsCount: 0,
        isLoading: false,
      }
    },
    components : {CommentList, },
    created() {
      this.songId = this.$route.params.id
      console.log("songid", this.songId);
      // 获取歌曲信息
      getSongDetail(this.songId).then(res => {
        res = convertToHttps(res)
        if (res.data.code == 200) {
          ({
            name: this.name,
            ar: this.artists,
            al: this.album,
          } = res.data.songs[0]);
        }
      })
      // 获取歌曲评论
      getSongComment(this.songId, this.commentsOffset).then(res => {
        res = convertToHttps(res)
        if (res.data.code !== 200) {
          console.warn("get song comment failed", res)
          return
        }
        this.hotComments = res.data.hotComments
        this.comments = res.data.comments
        this.commentsCount = res.data.total
      })
    },
    computed: {
      isScrollBottom() {
        return this.$store.state.isScrollBottom
      },
      isAllCommentsLoaded() {
        return this.commentsOffset >= this.commentsCount
      }
    },
    watch: {
      isScrollBottom(val) {
        if(val === true) {
          console.log("loading more comments !")
          this.loadingMoreComments()
        }
      }
    },
    methods: {
      loadingMoreComments() {
        if (this.isAllCommentsLoaded) {
          console.log("already load all comments")
          return
        }
        if (this.isLoading) {
          console.log("is loading comments, please wait seconds")
          return
        }
        this.commentsOffset += OFEESETCOUNT
        this.isLoading = true
        getSongComment(this.songId, this.commentsOffset).then(res => {
          this.comments = this.comments.concat(res.data.comments)
          this.isLoading = false
        })
      }
    }
  }
</script>
<style lang="sass" scoped>
@import "@/components/config.sass";

.song-info
  display: flex;
.album-img
  height: 200px;
  flex: 0 0 200px;
  font-size: 0;
  margin-right: 20px;
  img
    width: 100%;
    height: 100%;
    border-radius: 15px;
.song-desc
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
.song-name
  font-size: 2em;
  margin: 1em 0;

.comment__tag
  display: flex;

.comments
  flex: 1 1 auto;
  margin-right: 20px;
.tags
  flex: 1 1 300px;
  // 歌曲评论样式
.comment
  display: flex;
  margin-top: 20px;
.user__avatar
  flex: 0 0 50px;
  width: 50px;
  height: 50px;
  margin-right: 20px;
  border-radius: 8px;
.user__name
  font-weight: bolder
.comment__content
  flex: 1 1 auto;
.time__liked-count
  display: flex;
  justify-content: space-between;
  color: $gray;
.comment__liked-count
  white-space: nowrap;
.liked__icon
  height: 24px;
  width: 24px;
  fill: currentColor;

.count
  display: inline-block;
  width: 3em;
  text-align: right;
.replied
  background-color: $whitegray3
// 加载提示样式
.loading-tips
  text-align: center;
.loading-tip
  display: inline-block;
  padding: 0 1em;
  border-radius: 1em;
  text-align: center;
  border: 1px solid $orange;
  color: $orange;
  font-size: 14px;
  font-weight: bolder;
  margin: 1em auto;
</style>

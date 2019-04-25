<template>
<div class="main-wrapper">
    <!-- 歌曲信息 -->
    <div class="song-info">
      <div class="album-img">
        <img :src="album.picUrl | convert2Https | clipImage(400, 400)" :alt="name">
      </div>
      <div class="song-desc">
        <div class="song-name">{{name}}</div>
        <div>艺人：
          <a
            v-for="artist in artists.filter(ar => ar.id !== 0)"
            :key="artist.id"
            :href="'/artist/'+ artist.id">{{artist.name}}</a>
        </div>
        <div>专辑：
          <a :href="'/album/'+album.id">{{album.name}}</a>
        </div>
        <div class="controls">
          <ripple-button @click="play">播放</ripple-button>
          <ripple-button class="button-secondary">收藏</ripple-button>
          <ripple-button class="button-secondary">歌词</ripple-button>
          <ripple-button class="button-secondary">more</ripple-button>
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
      <div class="tags">
        <h1>相似歌曲</h1>
        <ul v-if="simiSongs">
          <li v-for="song in simiSongs" :key="song.id" class="simi-item">
            <div class="img-container">
              <img :src="song.album.picUrl | convert2Https | clipImage(100, 100)" :alt="song.album.name">
              <div class="mask-container">
                <div class="mask">
                </div>
                <div class="play" @click="play(song.id)"><play-svg></play-svg></div>
              </div>
            </div>
            <div class="info-container">
              <a class="name" :href="'/song/' + song.id ">{{ song.name }}</a>
              <a
                class="artists"
                :href="'/artist/' + song.id "
                v-for="ar in song.artists"
                :key="ar.id"
              >{{ ar.name }}</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
</div>
</template>
<script>
  import { getSongDetail, getSongComment, getSimiSongs} from '@/service';
  import CommentList from "./CommentList.vue";
  import RippleButton from '@/components/globals/RippleButton.vue';
  import PlaySvg from "@/components/globals/PlaySvg.vue";
  const  OFEESETCOUNT = 20
  export default {
    name: "SongDetail",
    components : {CommentList, RippleButton, PlaySvg },
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
        simiSongs: [],
        isMoreComments: false,
      }
    },
    created() {
      this.songId = this.$route.params.id
      console.log("songid", this.songId);
      // 获取歌曲信息
      getSongDetail(this.songId).then(res => {
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
        if (res.data.code !== 200) {
          console.warn("get song comment failed", res)
          return
        }
        console.log("comments ", res.data)
        this.hotComments = res.data.hotComments
        this.comments = res.data.comments
        this.commentsCount = res.data.total
        this.isMoreComments = res.data.more
      })
      // 获取相似歌曲
      getSimiSongs(this.songId).then(res => {
        this.simiSongs = res.data.songs
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
      },
      play(songId) {
        if (songId) {
          this.$store.dispatch("newSingleSong", songId)
        } else {
          if (this.$store.state.playList && this.$store.state.playList.currentSongId == this.songId && this.$store.state.playList.getCurrentSong().isPlaying) return
          console.log("play: ", this.songId)
          this.$store.dispatch("newSingleSong", this.songId)
        }
      }
    }
  }
</script>
<style lang="sass" scoped>
@import "@/components/config.sass";
@import "@/style/colors.sass";

.song-info
  display: flex;
.album-img
  height: 200px;
  flex: 0 0 200px;
  font-size: 0;
  margin-right: 20px;
  background: $secondary;
  border-radius: 15px;
  overflow: hidden;
  img
    width: 100%;
    height: 100%;
    
.song-desc
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
.song-name
  font-size: 2em;
  margin: 1em 0;

.button-secondary
  color: $secondary;
  border-color: $secondary;

.comment__tag
  display: flex;
.comments
  flex: 1 1 auto;
  margin-right: 20px;
.tags
  flex: 0 0 234px;
  min-width: 0;
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

.controls > *:not(:last-child)
  margin-right: 2em;
// 相似歌曲
.simi-item
  box-sizing: border-box;
  padding: 0.5em;
  display: flex;
  border-radius: 2px;
  min-width: 0;
  &:hover
    background-color: $Alabaster;
    & .mask-container
      display: block;
  .img-container
    font-size: 0;
    flex: 0 0 40px;
    height: 40px;
    background-color: $secondary;
    position: relative;
    margin-right: 8px;
    border-radius: 2px;
    overflow: hidden;
    img
      width: 100%;
      height: 100%;
      
  .mask-container
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  .mask
    width: 100%;
    height: 100%;
    background-color: $black;
    opacity: $mask-opacity;
  .play
    position: absolute;
    top: 0;
    left: 0;
    width: 55%;
    height: 55%;
    padding: 7px;
    box-sizing: border-box;
    background-color: $primary;
    border-radius: 50%;
    opacity: 1;
    margin: 22.5% 0 0 22.5%;

  .info-container
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &, & .name, & .artists
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    .name
      font-size: 100%;
      font-weight: bolder;
    .artists
      font-size: 80%;
      color: $secondary;

</style>

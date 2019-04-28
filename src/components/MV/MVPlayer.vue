<template>
<div class="main-wrapper">
  <div class="mvplay-container" :class="{'theater-mode': isTheaterMode}">
      <div class="video-contaner">
        <video-player :brs="brs" @toggle-theater-mode="isTheaterMode = !isTheaterMode"></video-player>
        <p class="name">
          <span>
            <ArtistsWithComma :artists="artists" />
          </span>
          <span>
            - {{name}}
          </span>
        </p>
        <p class="space-between">
          <span>{{ formatCount(playCount) }}次播放</span>
          <span>{{ formatCount(likeCount) }}喜欢 {{ formatCount(shareCount) }}分享</span>
        </p>
      </div>
      <!-- comments -->
      <comment-list class="comments-wrapper" type="0" :id="this.id" />
      <!-- similar mvs -->
      <div class="similar-mv">
        <h3>相似MV</h3>
        <router-link
          :to="'/mvplay/'+simiMV.id"
          class="similar-mv__item"
          v-for="simiMV in similarMVs"
          :key="simiMV.id"
        >
          <img class="left__item" :src="simiMV.cover | convert2Https | clipImage(336, 188)" :alt="simiMV.name">
          <div class="right__item">
            <div class="txt_main">{{simiMV.name}}</div>
            <div class="txt_sub">{{simiMV.artistName}}</div>
          </div>
        </router-link>
      </div>
  </div>
</div>
</template>
<script>
import { getMvData, getSimilarMV } from '@/service';
import CommentList from '@/components/FindMusic/CommentList';
import VideoPlayer from '@/components/MV/VideoPlayer';
import { formatCount, arrayJoin } from '@/utilitys';
import ArtistsWithComma from '@/components/globals/ArtistsWithComma';

export default {
  name: "MVPlayer",
  components: { CommentList, VideoPlayer, ArtistsWithComma },
  data() {
    return {
      id: "",
      videoUrl: "",
      name: "",
      artists: [],
      playCount: 0,
      likeCount: 0,
      shareCount: 0,
      brs: null,
      similarMVs: [],
      isTheaterMode: false,
    }
  },
  created() {
    this.updateView()
  },
  methods: {
    formatCount,
    arrayJoin,
    updateView() {
      this.id = this.$route.params.id
      getMvData(this.id).then(
        res => {
          res =  JSON.parse(JSON.stringify(res).replace(/http:\/\//g, "https://"))
          const brsKeys = Object.keys(res.data.data.brs)
          this.videoUrl = res.data.data.brs[brsKeys[brsKeys.length - 1]]
          this.videoUrl = this.videoUrl.replace(/http:\/\//g, "https://")
          this.name = res.data.data.name
          this.artists = res.data.data.artists
          this.playCount = res.data.data.playCount
          this.likeCount = res.data.data.likeCount
          this.shareCount = res.data.data.shareCount
          this.brs = res.data.data.brs
        },
        error => alert('getMvData error ' + error)
      );
      getSimilarMV(this.id).then(res => {
        res =  JSON.parse(JSON.stringify(res).replace(/http:\/\//g, "https://"))
        this.similarMVs = res.data.mvs
      });
    },
  },
  watch: {
    $route(val) {
      this.updateView()
    }
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"

.mvplay-container
  display: grid;
  grid-template-areas: "video   simiMVs" "comments simiMVs";
  grid-template-columns: 1fr 300px;
  grid-gap: 20px;
  &.theater-mode
    grid-template-areas: "video   video" "comments simiMVs";
  @media screen and (max-width: 1200px)
    grid-template-areas: "video video"  "comments simiMVs";

.comments-wrapper
  grid-area: comments;

.video-contaner
  grid-area: video;
  min-width: 0;
.name
  font-weight: bolder;
.space-between
  display: flex;
  justify-content: space-between;
  color: $gray3
.similar-mv
  grid-area: simiMVs;
.similar-mv__item
  text-decoration: none;
  color: inherit;
  display: flex;
  margin-bottom: 20px;
  .left__item
    height: 94px;
    // width: 168px;
    flex-basis: 168px;
    margin-right: 8px;
  .right__item
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
.txt_main
  font-size: 14px;
  font-weight: bolder;
.txt_sub
  font-size: 14px;
  color: $gray3;
</style>


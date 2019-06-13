<template>
  <div class="mv-player" :class="{ 'mv-player--theater': isTheaterMode }">
    <div class="mv-player__video">
      <video-player
        :brs="brs"
        @toggle-theater-mode="isTheaterMode = !isTheaterMode"
      ></video-player>
      <p class="mv-player__name">
        <span>
          <ArtistsWithComma :artists="artists" />
        </span>
        <span>- {{ name }}</span>
      </p>
      <p class="mv-player__count">
        <span>{{ formatCount(playCount) }}次播放</span>
        <span
          >{{ formatCount(likeCount) }}喜欢
          {{ formatCount(shareCount) }}分享</span
        >
      </p>
    </div>
    <!-- comments -->
    <comment-list class="mv-player__commennts" type="0" :id="this.id" />
    <!-- similar mvs -->
    <div class="mv-player__similars">
      <h3>相似MV</h3>
      <router-link
        :to="'/mvplay/' + simiMV.id"
        class="mv-player__similars__item"
        v-for="simiMV in similarMVs"
        :key="simiMV.id"
      >
        <img
          class="mv-player__similars__item__left"
          :src="simiMV.cover | convert2Https | clipImage(336, 188)"
          :alt="simiMV.name"
        />
        <div class="mv-player__similars__item__right">
          <div class="mv-player__similars__item__title">{{ simiMV.name }}</div>
          <div class="mv-player__similars__item__sub-title">
            {{ simiMV.artistName }}
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { getMvData, getSimilarMV } from "@/service";
import CommentList from "@/components/FindMusic/CommentList.vue";
import VideoPlayer from "@/components/MV/VideoPlayer.vue";
import { formatCount, arrayJoin } from "@/utilitys";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Mutation, namespace } from "vuex-class";
import { Artist, Mv, MvType } from "@/types";

const notification = namespace("notification");

@Component({
  components: { CommentList, VideoPlayer, ArtistsWithComma }
})
export default class MVPlayer extends Vue {
  id: number | null = null;
  videoUrl: string = "";
  name: string = "";
  artists: Artist[] = [];
  playCount: number = 0;
  likeCount: number = 0;
  shareCount: number = 0;
  brs: { [index: number]: string }[] = [];
  similarMVs: MvType[] = [];
  isTheaterMode: boolean = false;

  @notification.Mutation setMsg!: (msg: string) => void;

  created() {
    this.updateView();
  }

  formatCount = formatCount;
  arrayJoin = arrayJoin;
  updateView() {
    this.id = Number(this.$route.params.id);
    getMvData(this.id).then(
      res => {
        const brsKeys = Object.keys(res.data.data.brs);
        this.videoUrl = res.data.data.brs[brsKeys[brsKeys.length - 1]];
        this.videoUrl = this.videoUrl.replace(/http:\/\//g, "https://");
        this.name = res.data.data.name;
        this.artists = res.data.data.artists;
        this.playCount = res.data.data.playCount;
        this.likeCount = res.data.data.likeCount;
        this.shareCount = res.data.data.shareCount;
        this.brs = res.data.data.brs;
      },
      error => {
        this.setMsg(`获取视频数据错误${error && error.msg ? error.msg : ""}！`);
      }
    );
    getSimilarMV(this.id).then(res => {
      this.similarMVs = res.data.mvs;
    });
  }
  @Watch("$route")
  onRouteChange() {
    this.updateView();
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"

.mv-player
  display: grid
  grid-template-areas: "video   simiMVs" "comments simiMVs"
  grid-template-columns: 1fr 300px
  grid-gap: 1em
  padding: 1em
  &--theater
    grid-template-areas: "video   video" "comments simiMVs"
  @media screen and (max-width: 1200px)
    grid-template-areas: "video video"  "comments simiMVs"
  &__video
    grid-area: video
    min-width: 0
  &__name
    font-weight: bolder
  &__count
    display: flex
    justify-content: space-between
    color: $gray3
  &__comments
    grid-area: comments
  &__similars
    grid-area: simiMVs
    &__item
      text-decoration: none
      color: inherit
      display: flex
      margin-bottom: 20px
      &__left
        height: 94px
        flex-basis: 168px
        margin-right: 8px
      &__right
        flex: 1 1 auto
        display: flex
        flex-direction: column
        justify-content: space-around
      &__title
        font-size: 14px
        font-weight: bolder
      &__sub-title
        font-size: 14px
        color: $gray3
</style>

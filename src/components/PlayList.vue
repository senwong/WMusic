<template>
  <div class="list-wrapper right-menu">
    <!-- 顶部标题 -->
    <div class="list__title">
      <span class="title__txt">播放列表</span>
      <BtnWithPopupMenu>
        <template slot="btn">
          <SvgBtnWrapper large>
            <MoreIcon/>
          </SvgBtnWrapper>
        </template>
        <template slot="menu">
          <more-list>
            <more-item>
              <DownloadIcon slot="icon"/>
              <span slot="txt" class="txt">清空列表</span>
            </more-item>
            <more-item>
              <DownloadIcon slot="icon"/>
              <span slot="txt" class="txt">下载全部</span>
            </more-item>
          </more-list>
        </template>
      </BtnWithPopupMenu>
    </div>
    <!-- 统计歌曲数量 -->
    <p class="list__count">共{{ tracks ? tracks.length : 0 }}首歌</p>
    <ul class="play-list scrollbar-invisible">
      <!-- 单个歌曲信息 -->
      <PlaylistItem v-for="track in tracks" :key="track.id" :track="track"/>
    </ul>
    <!-- 加载中。。。动画 -->
    <loading v-if="isLoading"></loading>
  </div>
</template>
<script lang="ts">
import PopupMenu from "./PopupMenu.vue";
import MoreItem from "./more-list/MoreItem.vue";
import MoreList from "./more-list/MoreList.vue";
import Loading from "@/components/Loading.vue";
import { mapState, mapMutations } from "vuex";
import PlaylistItem from "./PlaylistItem.vue";
import MoreIcon from "./SVGIcons/MoreIcon.vue";
import DownloadIcon from "./SVGIcons/DownloadIcon.vue";
import { Vue, Component } from "vue-property-decorator";
import { Mutation, namespace } from "vuex-class";
import { Track } from "@/types";
import BtnWithPopupMenu from "@/components/globals/BtnWithPopupMenu.vue";
import SvgBtnWrapper from "@/components/globals/SvgBtnWrapper.vue";

const playlist = namespace("playlist");
const notification = namespace("notification");
@Component({
  components: {
    PopupMenu,
    MoreList,
    MoreItem,
    Loading,
    PlaylistItem,
    MoreIcon,
    DownloadIcon,
    BtnWithPopupMenu,
    SvgBtnWrapper
  }
})
export default class PlayList extends Vue {
  listControlButton: EventTarget | null = null;

  isLoading: boolean = false;

  popMenuSongId: number | null = null;

  @notification.Mutation setMsg!: (msg: string) => void;

  @playlist.State tracks!: Track[];
}
</script>
<style lang="sass" scoped>
@import "config.sass"
.right-menu
  position: fixed
  top: 0
  height: calc(100% - 6em)
  overflow: hidden
  width: 300px
  right: 0
  z-index: 3
  box-shadow: 0 0 42px 3px rgba(0, 0, 0, .2)
.list-wrapper
  height: 100%
  background-color: white
  display: flex
  flex-direction: column
.play-list
  overflow-y: scroll
  overflow-x: hidden
  padding: 15px 0px
  margin-bottom: 0
  // margin-right: -15px
  overscroll-behavior: contain
// 顶部标题样式
.list__title
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 10px
  height: 1.3em
  margin-top: 1em
  .title__txt
    font-size: 16px
    color: $orange
  .title__more
    color: $gray
// 歌曲总数样式
.list__count
  padding: 0 10px
  font-size: 12px
  color: $gray
  // 单个歌曲样式
.song-item
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 10px
  &.active
    color: $orange
  &.not-play
    color: $gray
.song-item:nth-of-type(2n+1)
  background-color: $whitegray
.song-item:not(.not-play):hover
  background-color: $whitegray3
// 专辑封面
.album-img
  flex: 0 0 40px
  height: 40px
  img
    width: 100%
    height: 100%
    border-radius: 4px
.name-songer
  flex: 1 1 auto
  display: flex
  flex-direction: column
  justify-content: center
  padding: 10px
  max-width: 100%
  overflow: hidden
  .name
    font-size: 14px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
  .songer
    font-size: 12px
    color: $gray
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
.song-item:not(.not-play)
  .songer:hover,
    color: $orange
.length
  color: $gray
  font-size: 12px
  flex: 0 0 50px
// hover时显示更多和收藏
.fav-more
  display: none
  color: $gray
  flex: 0 0 50px
  .fav
    margin-right: 10px
  .is-fav
    color: $orange
  &.is-fav svg
    fill: $orange
.song-item:not(.not-play):hover
  .length
    display: none
  .fav-more
    display: flex

.txt
  font-size: 14px
  line-height: 16px
  height: 16px
  // min-width: 150px
  margin-left: 10px

</style>

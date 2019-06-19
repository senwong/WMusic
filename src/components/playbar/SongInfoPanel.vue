<template>
  <div class="song-info-panel">
    <div class="album-img" @click="$emit('toggle-song-player')">
      <ImageWithPlaceholder
        class="album-img__cover"
        :class="{ 'album-img__cover--rotate': !paused }"
        :src="albumImg | convert2Https | clipImage(192, 192)"
        :alt="name"
        ratio="1:1"
        row
      />
      <div class="img-mask">
        <SvgBtn
          xlarge
          class="button_center-center"
          :class="{ invert: !isShowSongPlayer }"
        >
          <SlideUpIcon />
        </SvgBtn>
      </div>
      <div v-if="isLoading" class="loading-spinner">
        <Spinner />
      </div>
    </div>
    <div class="name-songer">
      <div v-if="name" class="name">{{ name }}</div>
      <div v-else class="name">听见不同</div>
      <ArtistsWithComma v-if="artists.length > 0" :artists="artists" />
    </div>
    <!-- 选择音质 -->
    <Select class="quality" :options="qualitys" v-model="currentQuality" top />
    <!-- 收藏 -->
    <SvgBtn
      xlarge
      class="faver"
      @click.native="toggleFaver"
      :class="{ 'is-faver': isFaver }"
      :disabled="disabled"
    >
      <FavIcon />
    </SvgBtn>
    <!-- 三点 更多选项 -->
    <btn-with-popup-menu class="more" :disabled="disabled">
      <template slot="btn">
        <SvgBtn xlarge :disabled="disabled">
          <MoreIcon />
        </SvgBtn>
      </template>
      <template slot="menu">
        <more-list>
          <more-item>
            <DownloadIcon slot="icon" />
            <span slot="txt" class="txt">漫游相似歌曲</span>
          </more-item>
          <!-- 下载 -->
          <DownloadTrack />
          <!-- 添加到歌单 hover时右侧扩展 -->
          <AddToUserPlaylist />
          <!-- 评论分享 -->
          <CommentTrack />
        </more-list>
      </template>
    </btn-with-popup-menu>
    <!-- 点击更多，弹出菜单 -->
  </div>
</template>
<script lang="ts">
import PopupMenu from "@/components/PopupMenu.vue";
import MoreItem from "@/components/more-list/MoreItem.vue";
import MoreList from "@/components/more-list/MoreList.vue";
import MoreIcon from "@/components/SVGIcons/MoreIcon.vue";
import FavIcon from "@/components/SVGIcons/FavIcon.vue";
import SlideUpIcon from "@/components/SVGIcons/SlideUpIcon.vue";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import Spinner from "@/components/globals/Spinner.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.vue";
import BtnWithPopupMenu from "@/components/globals/BtnWithPopupMenu.vue";
import { getUserPlaylist } from "@/service";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Artist, Option } from "@/types";
import CommentTrack from "@/components/more-list/CommentTrack.vue";
import AddToUserPlaylist from "@/components/more-list/AddToUserPlaylist.vue";
import DownloadTrack from "@/components/more-list/DownloadTrack.vue";
import Select from "@/components/globals/Select.vue";
import ImgPlaceHolder from "@/src/assets/Transparency1-1.png";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";

interface Quality {
  id: number;
  title: string;
  isSelected: boolean;
}

@Component({
  components: {
    PopupMenu,
    MoreItem,
    MoreList,
    MoreIcon,
    FavIcon,
    SlideUpIcon,
    DownloadIcon,
    SvgBtn,
    Spinner,
    ArtistsWithComma,
    BtnWithPopupMenu,
    CommentTrack,
    AddToUserPlaylist,
    DownloadTrack,
    Select,
    ImageWithPlaceholder
  }
})
export default class SongInfoPanel extends Vue {
  @Prop() name!: string;
  @Prop() artists!: Artist[];
  @Prop() albumImg!: string;
  @Prop() isShowSongPlayer!: boolean;
  @Prop() isLoading!: boolean;
  @Prop() disabled!: boolean;
  @Prop(Boolean) paused!: boolean;
  isFaver: boolean = false;
  currentQuality: string = "标准品质";
  qualitys: Option[] = [
    { key: 1, value: "标准品质", title: "标准品质" },
    { key: 2, value: "高品质", title: "高品质" },
    { key: 3, value: "无损品质", title: "无损品质" }
  ];
  toggleFaver() {
    this.isFaver = !this.isFaver;
  }
}
</script>
<style lang="sass" scoped>
@import "../config.sass"
@import "@/style/media-query.sass"

.song-info-panel
  display: flex
  align-items: center
  justify-content: flex-start
  position: relative
  height: 100%
.loading-spinner
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  padding: 1.5em
  box-sizing: border-box
  z-index: 1
.album-img
  flex: 0 0 4em
  height: 4em
  margin-left: 1em
  position: relative
  border-radius: 9999px
  overflow: hidden
  &__cover
    animation: rotate 10s linear infinite
    animation-play-state: paused
    &--rotate
      animation-play-state: running
  .img-mask
    display: none
    align-items: center
    justify-content: center
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: $whitegray-2
  // &:hover .img-mask
  //   display: flex
@media (hover: hover)
  .album-img:hover .img-mask
    display: flex
.name-songer
  flex: 0 1 auto
  display: flex
  flex-direction: column
  justify-content: center
  margin-left: 1em
  align-items: flex-start
  .name
    cursor: pointer
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
.quality
  margin-left: 1em

.faver, .more
  flex-shrink: 0
  flex-grow: 0
  margin-left: 1em

.faver.is-faver
  color: $orange
  & svg
    fill: $orange

.button_center-center
  transform-origin: center
  &.invert
    transform: rotate(180deg)

@media (max-width: $middle-width)
  .quality, .faver, .more
    display: none

@keyframes rotate
  from
    transform: rotateZ(0deg)
  to
    transform: rotateZ(360deg)
</style>

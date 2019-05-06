<template>
<div v-if="tracks">
  <ul class="tracks" @scroll="handleScroll">
    <li class="track"
      v-for="track in tracks"
      :key="track.id"
      :class="{
        'active': track.id == currentSongId,
        'disabled': track.status < 0,
      }"
    >
      <div class="track-icon" @click="handlePlay(track.id)">
        <MusicIcon class="music-icon" />
        <PausedIcon class="play-icon" />
      </div>
      <div class="track-names">
        <div class="track-name-mvlink">
          <router-link :to="`/song/${track.id}`" class="track-name">
            {{track.name}}
          </router-link>
          <router-link v-if="track.mv" :to="'/mvplay/' + track.mv" class="track-mvlink">
            <MvIcon />
          </router-link>
        </div>
        <div class="track-ar-al">
          <ArtistsWithComma :artists="track.artists" aTagClass="track-artist" commaClass="track-dot" />
          <span class="track-dot"> • </span>
          <router-link :to="'/album/'+track.album.id" class="track-album">
            {{track.album.name}}
          </router-link>
        </div>
      </div>
      <div class="track-more" @mousedown="handleMoreMousedown(track.id, $event)">
        <MoreIcon />
      </div>
      <div class="track-duration">
        {{formatTime(track.duration)}}
      </div>
    </li>
  </ul>
  <popup-menu :target="moreButton">
    <more-list>
      <more-item @click.native="handleAddToNext">
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">下一首播放</span>
      </more-item>
      <more-item >
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">添加到播放列表</span>
      </more-item>
      <hr class="fixed-hr">
      <more-item>
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">收藏</span>
      </more-item>
      <more-item>
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">下载</span>
      </more-item>
      <more-item>
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">加入歌单</span>
      </more-item>
      <hr class="fixed-hr">
      <more-item>
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">评论</span>
      </more-item>
      <more-item>
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">分享</span>
      </more-item>
    </more-list>
  </popup-menu>
</div>
</template>
<script lang='ts'>
import PopupMenu from '@/components/PopupMenu.vue';
import MoreItem from '@/components/more-list/MoreItem.vue';
import MoreList from '@/components/more-list/MoreList.vue';
import { formatTime } from '@/utilitys';
import { mapState, mapGetters, mapMutations, } from 'vuex';
import PlayIcon from '@/components/SVGIcons/PlayIcon.vue';
import PausedIcon from '@/components/SVGIcons/PausedIcon.vue'; 
import FavIcon from '@/components/SVGIcons/FavIcon.vue';
import MoreIcon from '@/components/SVGIcons/MoreIcon.vue';
import DownloadIcon from '@/components/SVGIcons/DownloadIcon.vue';
import MusicIcon from '@/components/SVGIcons/MusicIcon.vue';
import MvIcon from '@/components/SVGIcons/MvIcon.vue';
import ArtistsWithComma from '@/components/globals/ArtistsWithComma.vue';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Track } from '@/types';
import { Mutation, namespace, State, Getter } from 'vuex-class';

const playlist = namespace('playlist');

@Component({
  components: {
    PopupMenu,
    MoreItem,
    MoreList,
    PausedIcon,
    FavIcon,
    MoreIcon,
    DownloadIcon,
    MusicIcon,
    MvIcon,
    ArtistsWithComma,
  }
})
export default class SongList extends Vue {
  @Prop() tracks!: Track[];
  moreButton: EventTarget | null =  null;
  selectedTrackId: number | null = null;
  
  formatTime = formatTime;

  @playlist.State currentSongId!: number
  @playlist.Getter trackIds!: number[]
  @playlist.Mutation setCurrentSongId!: (id: number) => void;
  @playlist.Mutation setTracks!: (tracks: Track[]) => void;
  @playlist.Mutation addToNext!: (track: Track) => void;
    // play specify song
  handlePlay(trackId: number) {
    if (this.tracks.every(t => t.status < 0)) {
      // TODO 资源展示下架
      return;
    }
    if (this.tracks.every((track, idx) => track.id == this.trackIds[idx])) {
      if (trackId != this.currentSongId) {
        this.setCurrentSongId(trackId);
      }
    } else {
      this.setTracks(this.tracks);
      this.setCurrentSongId(trackId);
    }
  }
  handleAddToNext() {
    if (this.selectedTrackId == null) return;
    const track = this.tracks.find(t => t.id == this.selectedTrackId);
    track && this.addToNext(track);
  }
  handleMoreMousedown(trackId: number, { target }: Event) {
    this.moreButton = target;
    this.selectedTrackId = trackId;
  }
  handleScroll() {
    this.moreButton = null;
  }
}
</script>
<style lang="sass" scoped>
@import '../config.sass'
@import '../../style/colors.sass'
.tracks
  padding: 20px 0 0
.head
  color: $gray
  display: grid
  grid-template-columns: 1fr minmax(120px, 0.5fr) 1fr 1fr minmax(auto, 0.5fr)
  grid-column-gap: 10px
  font-size: 14px
.track
  display: flex
  flex-direction: row
  height: 4.5em
  padding-top: 0.7em
  transition-property: background
  transition-duration: 250ms
  &.active
    color: $primary
    .play-icon
      display: block
    .music-icon
      display: none
  &.disabled
    color: #999
  &:hover
    background-color: rgba(0,0,0,.2)
    .track-more
      opacity: 1
    .music-icon
      display: none
    .play-icon
      display: block

.track-icon
  width: 3em
  height: 1em
  flex: 0 0 auto
  cursor: pointer
  .play-icon
    display: none
.track-names
  flex: 1 1 auto
.track-name-mvlink
  display: flex
  flex-direction: row
  align-items: center
.track-name
  line-height: 22px
.track-mvlink
  margin-left: 0.5em
  width: 1.2em
  height: 1.2em
  color: #666
  transition-property: color
  transition-duration: 250ms
  &:hover
    color: $primary

.track-artist
  opacity: 0.6
  transition-property: opacity border
  transition-duration: 250ms
  line-height: 20px
  border-bottom: 1px solid rgba(0,0,0,0)
  &:hover
    opacity: 1
    border-color: rgba(0,0,0,0.8)

.track-dot
  opacity: 0.6
.track-album
  opacity: 0.6
  transition-property: opacity border
  transition-duration: 250ms
  line-height: 20px
  border-bottom: 1px solid rgba(0,0,0,0)
  &:hover
    opacity: 1
    border-color: rgba(0,0,0,0.8)

.track-more
  flex: 0 0 0
  min-width: 50px
  height: 1em
  opacity: 0
  cursor: pointer
.track-duration
  flex: 0 0 0
  width: 4em
  padding-right: 1em

a
  text-decoration: none
  color: inherit

.track__name, .track__controll, .track__creators, .track__al__name, .track_dt
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  text-decoration: none
  color: inherit
  display: flex
  flex-direction: row
  align-items: center

.track__controll
  visibility: hidden
  color: $gray
  display: flex
  align-items: center
  svg
    height: 100%
    width: auto
.control__play
  font-size: 0
  display: inline-block
.controll__item
  margin-right: 10px
  cursor: pointer

.txt
  font-size: 14px
  line-height: 16px
  height: 16px
  // min-width: 150px
  margin-left: 10px
.fixed-hr
  margin-left: 0
  margin-right: 0
  border: 1px solid $gray
  opacity: 0.7
</style>

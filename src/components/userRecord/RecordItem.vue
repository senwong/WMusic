<template>
  <li class="record-item__container">
    <!-- music icon and play icon -->
    <span class="record-item__icon" @click="handlePlay">
      <MusicIcon class="record-item__music-icon" />
      <PausedIcon class="record-item__paused-icon" />
    </span>
    <!-- track name, artists and album -->
    <div class="record-item__track-info" v-if="song">
      <router-link class="track-info__track-name" :to="`/song/${song.id}`">{{song.name}}</router-link>
      <div class="track-info__artist-album">
        <ArtistsWithComma :artists="song.ar" commaClass="artist-album__comma" aTagClass="artist-album__artist" />
        <span class="artist-album__dot"> . </span>
        <router-link
          class="artist-album__album"
          v-if="song.al && song.al.id && song.al.name"
          :to="`/album/${song.al.id}`"
        >{{song.al.name}}</router-link>
      </div>
    </div>
    <!-- play count score  -->
    <div class="play-core__wrapper">
      <div class="play-core__score" :style="{width: score + '%'}"></div>
    </div>
    <div class="play-count__count">
      {{playCount}}次
    </div>
  </li>
</template>

<script>
import MusicIcon from '@/components/SVGIcons/MusicIcon';
import PausedIcon from '@/components/SVGIcons/PausedIcon';
import ArtistsWithComma from '@/components/globals/ArtistsWithComma';
import { mapMutations } from 'vuex';

export default {
  name: 'RecordItem',
  props: {
    playCount: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    song: {
      type: Object,
      required: true,
    },
  },
  components: { MusicIcon, PausedIcon, ArtistsWithComma },
  methods: {
    ...mapMutations('playlist', [
      'setCurrentSongId',
    ]),
    handlePlay() {
      this.setCurrentSongId(this.song.id);
      this.$emit('play');
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../style/colors.sass'
$primary-color: #080808
$secondary-color: #777

.record-item__container
  font-size: 16px
  display: flex
  flex-directon: row
  align-items: center
  justify-content: flex-start
  transition: all 250ms
  padding: 0.5em
  &:hover
    background-color: #eee
    .record-item__icon
      color: $primary-color
    .record-item__music-icon
      display: none
    .record-item__paused-icon
      display: block
    .play-count__count
      color: $primary-color

.record-item__icon
  display: block
  width: 1.5em
  height: 1.5em
  margin-right: 0.8em
  align-self: flex-start
  color: $secondary-color;
  cursor: pointer;
.record-item__paused-icon
  display: none
.record-item__track-info
  flex: 1 1 auto

.artist-album__comma, .artist-album__dot
  color: $secondary-color

.track-info__track-name,
.artist-album__artist,
.artist-album__album
  display: inline-block
  color: $secondary-color
  padding: 0.3em
  transition: all 250ms
  &:hover
    color: $primary-color

.play-core__wrapper
  flex: 0 0 250px
  height: 1.25em
  background-color: #e0e0e0
  position: relative
  margin-left: 1em
.play-core__score
  height: 100%
  background-color: $primary
.play-count__count
  margin-left: 1.5em
  color: $secondary-color
</style>

<template>
  <li class="record-item">
    <!-- music icon and play icon -->
    <span class="record-item__icon" @click="handlePlay">
      <MusicIcon class="record-item__music-icon" />
      <PlayArrow class="record-item__paused-icon" />
    </span>
    <!-- track name, artists and album -->
    <div class="record-item__track-info" v-if="song">
      <router-link class="track-info__track-name" :to="`/song/${song.id}`">
        {{ song.name }}
      </router-link>
      <div class="track-info__artist-album">
        <ArtistsWithComma :artists="song.artists" />
        <span class="artist-album__dot">.</span>
        <router-link
          class="artist-album__album"
          :to="`/album/${song.album.id}`"
        >
          {{ song.album.name }}
        </router-link>
      </div>
    </div>
    <!-- play count score  -->
    <div class="play-core__wrapper">
      <div
        class="play-core__score"
        :style="{ width: record.score + '%' }"
      ></div>
    </div>
    <div class="play-count__count">{{ record.playCount }}次</div>
  </li>
</template>

<script lang="ts">
import MusicIcon from "@/components/SVGIcons/MusicIcon.vue";
import PlayArrow from "@/components/SVGIcons/PlayArrow.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.vue";
import { mapMutations } from "vuex";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Record } from "@/types";
import { Mutation, namespace } from "vuex-class";

const playlist = namespace("playlist");
@Component({
  components: { MusicIcon, PlayArrow, ArtistsWithComma }
})
export default class RecordItem extends Vue {
  @Prop() record!: Record;

  get song() {
    return this.record.song;
  }

  @playlist.Mutation setCurrentSongId!: (id: number) => void;

  handlePlay() {
    this.setCurrentSongId(this.record.song.id);
    this.$emit("play");
  }
}
</script>

<style lang="sass" scoped>
@import '@/style/colors.sass'
@import "@/style/theme.sass"

$secondary-color: #777

.record-item
  font-size: 16px
  display: flex
  flex-direction: row
  align-items: center
  justify-content: flex-start
  transition: all 250ms
  padding: 0.5em
  border-radius: 1em
  &__icon
    flex: 0 0 1.5em
    display: block
    height: 1.5em
    margin-right: 0.8em
    align-self: flex-start
    color: $secondary-color
    cursor: pointer
  &:hover
    @include themify($themes)
      background-color: themed("background-color-hover")
    .record-item__icon
      color: $primary-color
    .record-item__music-icon
      display: none
    .record-item__paused-icon
      display: block
    .play-count__count
      color: $primary-color


.record-item__paused-icon
  display: none
.record-item__track-info
  flex: 1 1 auto

.artist-album__dot
  color: $secondary-color

.track-info__track-name,
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
  background-color: $primary-color
.play-count__count
  margin-left: 1.5em
  color: $secondary-color
</style>

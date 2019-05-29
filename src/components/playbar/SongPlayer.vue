<template>
  <div class="contaienr">
    <div class="img-wrapper">
      <ImageWithPlaceholder :alt="name" :src="album && album.picUrl | convert2Https" ratio="1:1" />
    </div>
    <div class="info">
      <div class="name">{{ name }}</div>
      <div class="artist-album">
        <ArtistsWithComma :artists="artists" />
        <span v-if="album"
          >专辑：<router-link :to="`/album/:${album.id}`">{{ album.name }}</router-link></span
        >
      </div>
      <div class="lyrics">
        <p
          class="lyric-line"
          v-for="(lyricline, index) in timeFormatedLyrics"
          :key="lyricline.time"
          :class="{
            select:
              index + 1 < timeFormatedLyrics.length
                ? currentTime >= lyricline.time && currentTime < timeFormatedLyrics[index + 1].time
                : currentTime >= lyricline.time
          }"
        >
          {{ lyricline.lyric }}
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { namespace, State } from "vuex-class";
import { getLyrics } from "@/service";
import { Album, Artist } from "@/types";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";

const lineRE = /\[(\d+):(\d+)\.(\d+)\](.+)/;
const playlist = namespace("playlist");

@Component({
  components: { ArtistsWithComma, ImageWithPlaceholder }
})
export default class SongPlayer extends Vue {
  msg: string = "hello world";
  lyrics: any = {};
  timeFormatedLyrics: any = [];
  currentLyricIndex: number = 0;

  @playlist.State currentSongId!: number;
  @Prop(Number) readonly currentTime!: number;
  @Prop(String) readonly name!: string;
  @Prop() readonly album!: Album;
  @Prop() readonly artists!: Artist[];

  updateLyrics() {
    if (!this.currentSongId) {
      return;
    }
    getLyrics(this.currentSongId).then(res => {
      console.log("res: ", res);
      const lyrics = res.data.lrc.lyric.split("\n");
      lyrics.forEach((line: string, i: number) => {
        const lineData = line.match(lineRE);
        if (lineData) {
          const minutes = parseInt(lineData[1]);
          const seconds = parseInt(lineData[2]);
          const milliseconds = parseInt(lineData[3]);
          const text = lineData[4];
          const lyricObj = {};
          this.$set(lyricObj, "time", minutes * 60 + seconds + milliseconds / 1000);
          this.$set(lyricObj, "lyric", text);
          this.$set(lyricObj, "selected", false);
          this.timeFormatedLyrics.push(lyricObj);
        }
      });
    });
  }
  created() {
    this.updateLyrics();
  }
  @Watch("currentTime")
  onCurrentTimeChange(val: number) {
    if (this.currentLyricIndex < this.timeFormatedLyrics.length - 1) {
      if (this.currentTime >= this.timeFormatedLyrics[this.currentLyricIndex + 1].time) {
        this.currentLyricIndex++;
      }
    }
  }
  @Watch("currentLyricIndex")
  onCurrentLyricIndexChange(val: number) {
    if (this.$el) {
      const lyricLineEle = this.$el.querySelector(`.lyric-line:nth-of-type(${val + 1})`);
      if (lyricLineEle) {
        lyricLineEle.scrollIntoView({ block: "center" });
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"

.contaienr
  position: fixed
  top: 0
  left: 0
  right: 0
  height: calc(100% - #{$footerHeight})
  background-color: $whitegray
  display: flex
  justify-content: center
  align-items: center
.img-wrapper
  width: 30em
  height: 30em
  margin-right: 2em
  img
    width: 100%
    height: 100%
.info
  display: flex
  flex-direction: column
  height: 30em
  flex: 0 0 30em
  overflow: hidden
.name
  font-size: 200%
  font-weight: bolder
  margin-bottom: 0.6em
.artist-album
  margin-bottom: 0.6em
.lyrics
  overflow-y: scroll
  margin-right: -1em
.lyric-line
  font-size: 100%
  height: 1em
  &.select
    color: $orange
</style>

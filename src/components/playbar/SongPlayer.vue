<template>
  <div class="contaienr">
    <div class="img-wrapper">
      <img :src="currentSong.imgUrl | convert2Https" :alt="currentSong.name">
    </div>
    <div class="info">
      <div class="name">{{currentSong.name}}</div>
      <div class="artist-album">
        <span>歌手：
          <router-link v-for="ar in currentSong.artists" :key="ar.id" :to="'/artist/'+ar.id">
            {{ar.name}}
          </router-link>
        </span>
        <span>专辑：<a href="#">{{msg}}</a></span>
      </div>
      <div class="lyrics">
        <p class="lyric-line"
          v-for="(lyricline, index) in timeFormatedLyrics"
          :key="lyricline.time"
          :class="{'select':
            index + 1 < timeFormatedLyrics.length
            ? currentSong.currentTime >= lyricline.time  && currentSong.currentTime < timeFormatedLyrics[index + 1].time
            : currentSong.currentTime >= lyricline.time }">
          {{lyricline.lyric}}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  import { getLyrics } from "@/service"
  export default {
    name: "SongPlayer",
    data() {
      return {
        msg: 'hello world',
        lyrics: {},
        timeFormatedLyrics: [],
        currentLyricIndex: 0
      }
    },
    computed: {
      currentSong() {
        return this.$store.state.playList.getCurrentSong()
      },
    },
    created() {
      console.log("cur ", this.currentSong.id)
      getLyrics(this.currentSong.id).then(res => {
        console.log('res: ', res)
        let lyrics = res.data.lrc.lyric.split("\n")
        lyrics.forEach((line, i) => {
          let key = line.match(/\[.+\]/g)
          if(key && key.length > 0) {
            key = key[0]
            const timeReg =  /\[([0-9]+):([0-9]+)\.([0-9]+)\]/g
            const res = timeReg.exec(key)
            if(res) {
              const minutes = parseInt(res[1]),
                    seconds = parseInt(res[2]),
                    milliseconds = parseInt(res[3])
              const lyricObj = {}
              this.$set(lyricObj, 'time', minutes * 60 + seconds + milliseconds / 1000)
              this.$set(lyricObj, 'lyric', line.replace(key, ""))
              this.$set(lyricObj, 'selected', false)
              this.timeFormatedLyrics.push(lyricObj)
            }
          }
        })
      })
    },
    watch: {
      'currentSong.currentTime': {
        handler: function(val) {
          if(this.currentLyricIndex < this.timeFormatedLyrics.length - 1) {
            if(this.currentSong.currentTime >= this.timeFormatedLyrics[this.currentLyricIndex + 1].time) {
              this.currentLyricIndex++
            }
          }
        },
        deep: true
      },
      currentLyricIndex(val) {
        this.$el.querySelector(".lyric-line:nth-of-type("+ (val + 1) +")").scrollIntoView({block: "center"})
      }
    }
  }
</script>
<style lang="sass" scoped>
@import "@/components/config.sass";

.contaienr
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: calc(100% - #{$footerHeight});
  background-color: $whitegray;
  display: flex;
  justify-content: center;
  align-items: center;
.img-wrapper
  width: 30em;
  height: 30em;
  margin-right: 2em;
  img
    width: 100%;
    height: 100%;
.info
  display: flex;
  flex-direction: column;
  height: 30em;
  flex: 0 0 30em;
  overflow: hidden;
.name
  font-size: 200%;
  font-weight: bolder;
  margin-bottom: 0.6em;
.artist-album
  margin-bottom: 0.6em;
.lyrics
  overflow-y: scroll;
  margin-right: -1em;
.lyric-line
  font-size: 100%;
  height: 1em;
  &.select
    color: $orange;
</style>

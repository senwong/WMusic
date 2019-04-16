<template>
  <div class="container" ref="container">
    <template>
      <div class="progress__past" ref="past" :style="{ transform: `scaleX(${timeTranslateX / pastWidth})`, width: `${pastWidth}px` }"></div>
      <div class="progress__state" ref="time" :style="{ transform: `translateX(${timeTranslateX}px)`}">{{formatTime((currentTime || 0 ) * 1000) + '/' +formatTime(duration)}}</div>
    </template>
  </div>
</template>
<script>
/*
transition-duration: this.duration - this.currentTime * 1000
translateX = this.$ref.container.clientWidth - this.$refs.time.clientWidth;
transform: translateX(${translateX}px)
*/
import { formatTime } from '@/utilitys';
export default {
  data() {
    return {
      pastWidth: 0,
    };
  },
  props: [ 'song' ],
  methods: {
    handleResize() {
      this.updatePastWidth();
    },
    formatTime,
    updatePastWidth() {
      if (!this.$refs.container || !this.$refs.time) {
        this.pastWidth = 0;
      }
      console.log('this.$refs.container.clientWidth ', this.$refs.container.clientWidth);
      console.log('this.$refs.time.clientWidth ', this.$refs.time.clientWidth);
      this.pastWidth = this.$refs.container.clientWidth - this.$refs.time.clientWidth;
    },
    // updateTimeTranslateX() {
    //   if (!this.duration) {
    //     this.timeTranslateX = 0;
    //   }
    //   this.timeTranslateX = this.pastWidth * (this.currentTime / this.duration);
    //   if (this.isPlaying) {
    //     window.requestAnimationFrame(this.updateTimeTranslateX);
    //   }
    // },
    // reset() {
    //   this.timeTranslateX = 0;
    // }
  },
  watch: {
    isPlaying: function(val) {
      console.log('watch song.isPlaying');
      // val && this.updateTimeTranslateX();
    },
    song: function(val, oldVal) {
      // if (val != oldVal) {
      //   this.reset();
      // }
    }
  },
  computed: {
    currentTime: function() {
      return this.song.currentTime;
    },
    duration: function() {
      return this.song.duration;
    },
    isPlaying: function() {
      return this.song.isPlaying;
    },
    speed: function() {
      return (this.pastWidth / this.duration) * (1000 / 60);
    },
    timeTranslateX: function() {
      if (!this.duration) {
        return 0;
      }
      return this.pastWidth * (this.currentTime * 1000 / this.duration);
    }
  },
  mounted: function() {
    window.addEventListener('resize', this.handleResize);
    this.watch
    this.updatePastWidth();
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.handleResize);
  },
}
</script>
<style lang="sass" scoped>
@import "../config.sass";

.container
  display: block;
  width: 100%;
  height: 4px;
  background-color: $whitegray3;

.progress__past
  height: 100%;
  width: 100%;
  background-color: $orange;
  transform-origin: left;
  transition-duration: 16.6ms;
  transition-timing-function: linear;
  transition-property: transform;
.progress__state
  position: absolute;
  visibility: visible;
  height: 1em;
  line-height: 1em;
  font-size: 1em;
  position: absolute;
  top: -0.5em;
  background: $mask;
  border-radius: 1em;
  display: inline-block;
  padding: 0.2em 0.5em;
  min-width: 5.5em;
  transition-duration: 16.6ms;
  transition-timing-function: linear;
  transition-property: transform;
</style>


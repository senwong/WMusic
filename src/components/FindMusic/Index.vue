<template>
  <div class="find-music">
    <carousel-panel />
    <div class="find-music__recommend">
      <div class="find-music__recommend__item">
        <MusicIcon />
        <div>
          每日30首
        </div>
      </div>
      <div class="find-music__recommend__item">
        <MusicIcon />
        <div>
          猜你喜欢
        </div>
      </div>
      <div class="find-music__recommend__item">
        <MusicIcon />
        <div>
          听见不同
        </div>
      </div>
      <div class="find-music__recommend__item">
        <MusicIcon />
        <div>
          私人电台
        </div>
      </div>
    </div>

    <!-- 推荐歌单 -->
    <RecommendSongList />
  </div>
</template>
<script>
import CarouselPanel from "./CarouselPanel.vue";
import RecommendSongList from "./RecommendSongList.vue";
import MusicIcon from "../SVGIcons/MusicIcon";

export default {
  name: "FindMusic",
  components: {
    CarouselPanel,
    RecommendSongList,
    MusicIcon
  }
};
</script>
<style lang="sass" scoped>
@import "@/style/colors.sass"
.find-music
  padding: 1em
  &__recommend
    display: flex
    justify-content: space-around
    &__item
      display: flex
      flex-direction: column
      justify-content: center
      width: 12.5%
      svg
        color: $primary-color
</style>

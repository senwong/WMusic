<template>
  <div class="main-wrapper">
    <div class="container">
      <carousel-panel></carousel-panel>
      <div class="recommend">
        <div class="recommend__item">
          <MusicIcon />
          <div>
            每日30首
          </div>
        </div>
        <div class="recommend__item">
          <MusicIcon />
          <div>
            猜你喜欢
          </div>
        </div>
        <div class="recommend__item">
          <MusicIcon />
          <div>
            听见不同
          </div>
        </div>
        <div class="recommend__item">
          <MusicIcon />
          <div>
            私人电台
          </div>
        </div>
      </div>
      
      <!-- 推荐歌单 -->
      <RecommendSongList />
    </div>
  </div>
</template>
<script>
import CarouselPanel from './CarouselPanel.vue'
import RecommendSongList from './RecommendSongList.vue'
import MusicIcon from '../SVGIcons/MusicIcon';

export default {
  name: "FindMusic",
  components: {
    CarouselPanel, RecommendSongList, MusicIcon,
  },
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass";

.recommend
  display: flex;
  justify-content: space-around;
  padding: 1.5em 1em;

.recommend__item
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 6em;
  svg
    color: $orange;
    margin-bottom: 1em;
</style>


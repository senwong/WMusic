<template>
  <div class="main-wrapper">
    <div class="container">
      <carousel-panel></carousel-panel>
      <div class="recommend">
        <div class="recommend__item">
          <svg class="i-music" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
          <div>
            每日30首
          </div>
        </div>
        <div class="recommend__item">
          <svg class="i-music" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
          <div>
            猜你喜欢
          </div>
        </div>
        <div class="recommend__item">
          <svg class="i-music" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
          <div>
            听见不同
          </div>
        </div>
        <div class="recommend__item">
          <svg class="i-music" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
          <div>
            私人电台
          </div>
        </div>
      </div>

      <!-- 推荐歌单 -->
      <recommend-song-list></recommend-song-list>
    </div>
  </div>
</template>
<script>
  import CarouselPanel from './CarouselPanel.vue'
  import RecommendSongList from './RecommendSongList.vue'
  export default {
    name: "FindMusic",
    components: {
      CarouselPanel,RecommendSongList
    },
    beforeRouteUpdate (to, from, next) {
      console.log("route to " + to + " from " + from)
      // called when the route that renders this component has changed,
      // but this component is reused in the new route.
      // For example, for a route with dynamic params `/foo/:id`, when we
      // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
      // will be reused, and this hook will be called when that happens.
      // has access to `this` component instance.
    },
    watch: {
      "$route" (to, from) {
        console.log("route change")
      }
    },
    mounted() {
      console.log("mounted ")
    }
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
  svg
    color: $orange;
    margin-bottom: 1em;
</style>


<template>
<div>
  <h1>推荐歌单</h1>
  <song-cards v-if="songList && songList.length > 0" :cardLists="songList" cardType="playlist"></song-cards>
</div>
</template>
<script>
import { getRecommendSongList } from '@/service';
import SongCards from '@/components/globals/SongCards';

export default {
  name: "RecommendSongList",
  data() {
    return {
      songList: null,
    };
  },
  components: { SongCards },
  created() {
    getRecommendSongList().then(
      res => {
        this.songList = res.data.result;
      },
      error => alert('get recommend song list error: ' + error)
    );
  }
}
</script>
<style lang="sass" scoped>
</style>


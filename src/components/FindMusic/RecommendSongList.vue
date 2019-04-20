<template>
<div>
  <h1>推荐歌单</h1>
  <song-cards :cardLists="songList" :cardType="'playlist'"></song-cards>
</div>
</template>
<script>
import { getRecommendSongList } from '@/service';
import SongCards from '@/components/globals/SongCards';
import {convertToHttps} from '@/utilitys';
export default {
  name: "RecommendSongList",
  data() {
    return {
      songList: [{id: '', name: "", picUrl: ""}]
    }
  },
  components: {SongCards },
  created() {
    getRecommendSongList().then(res => {
      res = convertToHttps(res)
      this.songList = res.data.result;
    })
  }
}
</script>
<style lang="sass" scoped>
</style>


<template>
<div>
  <h1>推荐歌单</h1>
  <SongCards v-if="songList && songList.length > 0" :cardLists="songList" cardType="playlist" />
</div>
</template>
<script lang='ts'>
import { getRecommendSongList } from '@/service';
import SongCards from '@/components/globals/SongCards.vue';
import { Playlist } from '@/types';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: { SongCards }
})
export default class  RecommendSongList extends Vue {
  songList: Playlist[] =  [];
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



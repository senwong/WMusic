<template>
<div>
  <h1>推荐歌单</h1>
  <SongCards v-if="!isLoading" :cardLists="songList" cardType="playlist" />
  <div v-else class="loading-spinner">
    <LoadingSpinner />
  </div>
  <ErrorLabel :show='showError'>{{errorMsg}}</ErrorLabel>
</div>
</template>
<script lang='ts'>
import { getRecommendSongList } from '@/service';
import SongCards from '@/components/globals/SongCards.vue';
import { Playlist } from '@/types';
import { Vue, Component } from 'vue-property-decorator';
import ErrorLabel from '@/components/globals/ErrorLabel.vue';
import LoadingSpinner from '@/components/globals/Spinner.vue';

@Component({
  components: { SongCards, ErrorLabel, LoadingSpinner }
})
export default class  RecommendSongList extends Vue {
  errorMsg: string = '获取推荐歌单错误';
  showError: boolean = false;
  songList: Playlist[] =  [];
  isLoading: boolean  = false;
  created() {
    this.isLoading = true;
    getRecommendSongList().then(
      res => {
        this.songList = res.data.result;
        this.isLoading = false;
      },
      error => {
        if (error && error.msg) {
          this.errorMsg = error.msg;
        }
        this.showError = true;
      }
    );
  }
}
</script>
<style lang="sass" scoped>
.loading-spinner
  width: 3em
  height: 3em
  margin: 3em auto
</style>



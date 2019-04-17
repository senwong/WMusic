<template>
<div class="main-wrapper">
  <div>
    <div class="media">
      <div class="media__left">
        <img :src="album.picUrl" alt="">
      </div>
      <div class="media__right">
        <div class="media__heading">{{album.name}}</div>
        <div>
          <button @click="playAll">播放</button>
          <button>收藏</button>
          <button>歌词</button>
          <button>more</button>
        </div>
      </div>
    </div>
    <song-list :tracks="songs"></song-list>
  </div>
</div>
</template>
<script>
  import {getAlbumDetail} from '../../service/Service';
  import SongList from './SongList';
  import { mapMutations } from 'vuex';

  export default {
    name: "AlbumDetail",
    data() {
      return {
        album: {},
        songs: [],
      }
    },
    methods: {
      playAll() {
        if (!this.songs) return;
        this.setTracks(this.songs);
        this.setCurrentSongId(this.songs[0].id);
      },
      ...mapMutations('playlist', [
        'setTracks',
        'setCurrentSongId',
      ]),
    },
    created() {
      const albumId = this.$route.params.id;
      getAlbumDetail(albumId).then(
        res => {
          this.album = res.data.album;
          this.songs = res.data.songs;
        },
        error => alert('getAlbumDetail' + error)
      );
    },
    components: { SongList }
  }
</script>
<style lang="sass" scoped>
@import '../config.sass';

.media
  display: flex;
  height: 200px;
.media__left
  flex: 0 0 200px;
  font-size: 0;
  margin-right: 20px;
  img
    width: 100%;
    height: 100%;
    border-radius: 15px;
.media__right
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
.media__heading
  font-size: 2em;
</style>


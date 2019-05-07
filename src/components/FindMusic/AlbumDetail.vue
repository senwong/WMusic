<template>
  <div class="main-wrapper">
    <div>
      <div class="media" v-if="album">
        <div class="media__left" v-if="album">
          <img :src="album.picUrl | convert2Https" :alt="album.name" />
        </div>
        <div class="media__right">
          <div class="media__heading">{{ album.name }}</div>
          <div>
            <Button rounded primary @click.native="playAll" class="button-controll">播放</Button>
            <Button rounded class="button-controll">收藏</Button>
            <Button rounded class="button-controll">歌词</Button>
            <Button rounded class="button-controll">more</Button>
          </div>
        </div>
      </div>
      <SongList :tracks="songs" />
    </div>
  </div>
</template>
<script lang="ts">
import { getAlbumDetail } from "@/service";
import SongList from "./SongList.vue";
import { mapMutations } from "vuex";
import { Vue, Component } from "vue-property-decorator";
import { Track, Album, convertTrack } from "@/types";
import { Mutation, namespace } from "vuex-class";
import Button from "@/components/globals/Button.vue";

const playlist = namespace("playlist");
@Component({
  components: { SongList, Button }
})
export default class AlbumDetail extends Vue {
  album: Album | null = null;

  songs: Track[] = [];

  playAll() {
    if (!this.songs) return;
    if (this.songs.every(t => t.status < 0)) {
      // TODO
      return;
    }
    this.setTracks(this.songs);
    this.setCurrentSongId(this.songs[0].id);
  }

  @playlist.Mutation setTracks!: (tracks: Track[]) => void;

  @playlist.Mutation setCurrentSongId!: (id: number) => void;

  created() {
    const albumId = Number(this.$route.params.id);
    getAlbumDetail(albumId).then(
      res => {
        this.album = res.data.album;
        const tracks: Track[] = res.data.songs.map(convertTrack);
        this.songs = tracks;
      },
      error => alert(`getAlbumDetail${error}`)
    );
  }
}
</script>
<style lang="sass" scoped>
@import '../config.sass'

.media
  display: flex
  height: 200px
.media__left
  flex: 0 0 200px
  font-size: 0
  margin-right: 20px
  img
    width: 100%
    height: 100%
    border-radius: 15px
.media__right
  flex: 1 1 auto
  display: flex
  flex-direction: column
  justify-content: space-between
.media__heading
  font-size: 2em
.button-controll
  margin-right: 0.5em
</style>

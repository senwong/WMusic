<template>
<div class="main-wrapper">
  <div>
    <div class="media">
      <div class="media__left">
        <img :src="img | convert2Https" :alt="name">
      </div>
      <div class="media__right">
        <div class="media__heading">{{name}}</div>
        <div>
          <Button rounded primary class="button-controll" @click="handlePlayAll">播放</Button>
          <Button rounded class="button-controll">收藏</Button>
          <Button rounded class="button-controll">歌词</Button>
          <Button rounded class="button-controll">more</Button>
        </div>
      </div>
    </div>
    <p class="brief-desc">{{briefDesc}}</p>
    <TabMenu align-left :list="tabs"/>
    <song-list :tracks="tracks" class="tab__content tab__1" v-if="showSongs"/>
    <SongCards class="artist-detail__albums" :cardLists="hotAlbums" cardType='album' v-if="showAlbums"/>
  </div>
</div>
</template>
<script lang='ts'>
import { getArtistInfo, getArtistAlbums, } from '@/service';
import { formatDate } from '@/utilitys';
import SongList from './SongList.vue';
import SongCards from '@/components/globals/SongCards.vue';
import { mapMutations } from 'vuex';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Playlist, Track } from '@/types'
import { Mutation, namespace } from 'vuex-class'
import TabMenu from '@/components/globals/TabMenu.vue';
import Button from '@/components/globals/Button.vue';

const playlist =  namespace('playlist');
enum ContentType { Songs, Albums }

@Component({
  components: { SongList, SongCards, TabMenu, Button }
})
export default class ArtistDetail extends Vue {
  name: string = "";
  img: string =  "";
  briefDesc: string = "";
  tracks: Track[] = [];
  hotAlbums: Playlist[] = []
  currentContent: ContentType = ContentType.Songs
  formatDate = formatDate

  @playlist.Mutation setTracks!: (tracks: Track[]) => void
  @playlist.Mutation setCurrentSongId!: (id: number) => void

  get tabs() {
    return [
      {
        key: 0,
        isActive: this.currentContent == ContentType.Songs,
        onClick: () => this.currentContent = ContentType.Songs,
        title: '热门歌曲'
      },
      {
        key: 1,
        isActive: this.currentContent == ContentType.Albums,
        onClick: () => this.currentContent = ContentType.Albums,
        title: '专辑'
      },
    ];
  }
  get showSongs() {
    return this.currentContent == ContentType.Songs;
  }
  get showAlbums() {
    return this.currentContent == ContentType.Albums;
  }
  initData(artistId: number) {
    getArtistInfo(artistId).then(
      res => {
      const {name, img1v1Url, briefDesc} = res.data.artist;
      console.log(res.data);
      this.name = name;
      this.img = img1v1Url;
      this.briefDesc = briefDesc;
      this.tracks = res.data.hotSongs;
    })
    getArtistAlbums(artistId).then(res => {
      this.hotAlbums = res.data.hotAlbums;
    })
  }
  handlePlayAll() {
    this.setTracks(this.tracks);
    this.setCurrentSongId(this.tracks[0].id);
  }
  created() {
    const songId = Number(this.$route.params.id);
    this.initData(songId);
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
.brief-desc
  text-overflow: ellipsis
  overflow: hidden

.artist-detail__albums
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
  gap: 2em
  flex-wrap: wrap
  justify-content: space-between
  padding: 1em 0

.button-controll
  margin-right: 1em
</style>

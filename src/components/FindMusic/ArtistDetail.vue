<template>
<div class="main-wrapper">
  <div>
    <div class="media">
      <div class="media__left">
        <img :src="img" alt="">
      </div>
      <div class="media__right">
        <div class="media__heading">{{name}}</div>
        <div>
          <button>播放</button>
          <button>收藏</button>
          <button>歌词</button>
          <button>more</button>
        </div>
      </div>
    </div>
    <p class="brief-desc">{{briefDesc}}</p>
    <div class="tabs">
      <span class="tab__title tab__1 active">热门歌曲</span>
      <span class="tab__title tab__2">专辑</span>
      <hr class="hr">
      <song-list :tracks="tracks" class="tab__content tab__1"></song-list>
      <song-cards class="tab__content tab__2" :cardLists="hotAlbums" :cardType="'album'"></song-cards>
    </div>
  </div>
</div>
</template>
<script>
  import { getArtistInfo, getArtistAlbums, } from '../../service/Service';
  import {formatDate} from '@/utilitys';
  import SongList from './SongList';
  import SongCards from '@/components/globals/SongCards';

  export default {
    name: "SongDetail",
    data() {
      return {
        name: "",
        img: "",
        briefDesc: "",
        tracks: [],
        hotAlbums: [{id: "", publishTime: "", name: "", picUrl: "",}],
        formatDate: formatDate,
      }
    },
    methods: {
      initData(artistId) {
        getArtistInfo(artistId).then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            ({
              name: this.name,
              img1v1Url: this.img,
              briefDesc: this.briefDesc,
            } = res.data.artist);
            this.tracks = res.data.hotSongs;
          }
        })
        getArtistAlbums(artistId).then(res => {
          this.hotAlbums = res.data.hotAlbums;
        })
      },
      handleTabClick(e) {
        if (e.target.classList.contains("active")) return;
        this.$el.querySelector(".tab__title.active").classList.remove("active");
        e.target.classList.add("active");
      }
    },
    components: { SongList, SongCards, },
    created() {
      const songId = this.$route.params.id;
      this.initData(songId);
    },
    watch: {
      '$route' (to, from) {
        this.initData(to.params.id);
      }
    },
    mounted() {
      const tabs = this.$el.querySelectorAll(".tab__title");
      tabs.forEach(t => t.addEventListener("click", this.handleTabClick));
    },
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
.brief-desc
  text-overflow: ellipsis;
  overflow: hidden;

.tab__title
  display: inline-block;
  margin-right: 20px;
  border-bottom: 2px solid transparent;
.tab__title.active
  border-bottom: 2px solid $orange;
.hr
  margin-top: -1px;
.tab__content
  display: none;
.tab__title.tab__1.active ~ .tab__content.tab__1
  display: block;
.tab__title.tab__2.active ~ .tab__content.tab__2
  display: grid;
.tab__content.tab__2
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2em;
  flex-wrap: wrap
  justify-content: space-between;
  .img
    width: 100%;
    heihgt: auto;
    border-radius: 15px;
</style>

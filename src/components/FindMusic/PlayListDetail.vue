<template>
  <div class="main-wrapper">
    <div>
      <div class="info">
        <img :src="coverImgUrl" class="cover-img" :alt="name">
        <div class="desc">
          <div>{{creator.nickname}} <span class="update-time">{{updateTimeFormated}}更新</span></div>
          <h2 class="name">{{name}}</h2>
          <ul class="tags">
            <li class="tag">#{{tags.join("  #")}}</li>
          </ul>
          <div>
            <button @click="handlePlayAll">全部播放</button>
            <button>收藏</button>
            <button>全部下载</button>
            <button>more</button>
          </div>
        </div>
      </div>
      <song-list :tracks="tracks" :id="playlistId"></song-list>
    </div>
  </div> 
</template>
<script>
  import { getPlaylistDetail } from '../../service/Service';
  import { formatTime, convertToHttps } from '@/utilitys';
  import SongList from './SongList';
  import { mapMutations } from 'vuex'
  export default {
    data() {
      return {
        name: "",
        coverImgUrl: '',
        creator:'',
        updateTime: '',
        tags: [],
        tracks: [],
        formatTime: formatTime,
        playlistId: null,
      }
    },
    computed: {
      updateTimeFormated() {
        if (!this.updateTime) return "";
        const date = new  Date(this.updateTime)
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
      }
    },
    created() {
      this.playlistId = this.$route.params.id;
      getPlaylistDetail(this.playlistId).then(
        res => {
          ({ name:this.name,
            coverImgUrl: this.coverImgUrl,
            creator: this.creator,
            updateTime: this.updateTime,
            tags: this.tags,
            } = res.data.playlist);
          this.tracks = res.data.playlist.tracks.filter(t => t.ar.every(ar => ar.id != 0));
        },
        error => alert('getPlaylistDetail error: ' + error)
      );
    },
    components: {SongList,},
    methods: {
      handlePlayAll() {
        if (this.tracks) {
          this.setTracks(this.tracks);
          if (this.tracks && this.tracks[0] && this.tracks[0].id) {
            this.setCurrentSongId(this.tracks[0].id);
          }
        }
      },
      ...mapMutations('playlist', [
        'setTracks',
        'setCurrentSongId',
      ])
    }
  }
</script>
<style lang="sass" scoped>
@import '../config.sass';

.info
  display: flex;
  height: 200px;
.cover-img
  height: 100%;
  width: 200px;
  border-radius: 15px;
  margin-right: 20px;
.desc
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
.update-time
  font-weight: 400;
  color: $gray;
.tags
  .tag
    display: inline-block;
    margin-right: 15px;
</style>


<template>
  <div class="main-wrapper">
    <div>
      <div class="info">
        <div class="cover-img">
          <ImageWithPlaceholder
            v-if="coverImgUrl"
            :src="coverImgUrl | convert2Https | clipImage(400, 400)"
            :alt="name"
            ratio="1:1"
          />
        </div>
        <div class="desc">
          <div class="creator">
            <router-link class="creator-avatar" :to="'/user/' + creator.userId">
              <img :src="creator.avatarUrl | convert2Https" :alt="creator.nickname" />
            </router-link>
            <router-link class="creator-name" :to="'/user/' + creator.userId">
              {{creator.nickname}}
            </router-link>
            <span class="update-time">{{updateTimeFormated}}更新</span>
          </div>
          <h2 class="name">{{name}}</h2>
          <ul class="tags">
            <li class="tag">#{{tags.join("  #")}}</li>
          </ul>
          <div>
            <Button class="btn-control" rounded primary @click.native="handlePlayAll">全部播放</Button>
            <Button class="btn-control" rounded>收藏</Button>
            <Button class="btn-control" rounded>全部下载</Button>
            <Button class="btn-control" rounded>more</Button>
          </div>
        </div>
      </div>
      <song-list :tracks="tracks" :id="playlistId"></song-list>
    </div>
  </div> 
</template>
<script>
import { getPlaylistDetail } from '../../service';
import { formatTime } from '@/utilitys';
import SongList from './SongList';
import { mapMutations } from 'vuex'
import ImageWithPlaceholder from '@/components/globals/ImageWithPlaceholder';
import Button from '@/components/globals/Button';

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
  components: { SongList, ImageWithPlaceholder, Button },
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
  flex: 0 0 200px;
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
.creator
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .creator-avatar
    width: 2.5em;
    height: 2.5em;
    border-radius: 9999px;
    overflow: hidden;
    margin-right: 0.6em;
    img
      width: 100%;
  .creator-name
    margin-right: 0.6em;
.tags
  .tag
    display: inline-block;
    margin-right: 15px;


.btn-control
  margin-right: 0.5em;

</style>


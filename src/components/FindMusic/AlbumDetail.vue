<template>
  <div class="main-wrapper">
    <div>
      <div class="media" v-if="album">
        <div class="media__left" v-if="album">
          <img :src="album.picUrl | convert2Https" :alt="album.name" />
        </div>
        <div class="media__right">
          <div class="media__heading">{{ album.name }}</div>
          <div class="album__actions">
            <Button rounded primary @click.native="playAll" class="button-controll">播放</Button>
            <Button rounded class="button-controll">收藏</Button>
            <Button rounded class="button-controll">歌词</Button>
            <Button rounded class="button-controll">more</Button>
          </div>
          <div class="album__artists">
            歌手：
            <ArtistsWithComma :artists="artists" aTagClass="album_artist" />
          </div>
          <div class="album__date">
            时间：
            <span>{{ formatDate(publishTime) }}</span>
          </div>
        </div>
      </div>
      <TabMenu :list="tabList" align-left />
      <SongList v-if="contentType == ContentType.Songs" :tracks="songs" />
      <CommentList
        v-if="contentType == ContentType.Comments"
        :type="CommentType.AlbumComment"
        :id="album.id"
      />
      <div class="desc__wrapper" v-if="contentType == ContentType.Desc">
        <h4>专辑介绍</h4>
        <div class="desc__content" v-text="description"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { getAlbumDetail } from "@/service";
import SongList from "@/components/globals/SongList.vue";
import { mapMutations } from "vuex";
import { Vue, Component } from "vue-property-decorator";
import { Track, Album, convertTrack, TabMenuItem, CommentType, Artist } from "@/types";
import { Mutation, namespace } from "vuex-class";
import Button from "@/components/globals/Button.vue";
import TabMenu from "@/components/globals/TabMenu.vue";
import CommentList from "@/components/FindMusic/CommentList.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.vue";
import { formatDate, formatCount } from "@/utilitys";

enum ContentType {
  Songs,
  Comments,
  Desc
}
const playlist = namespace("playlist");
const notification = namespace("notification");
@Component({
  components: { SongList, Button, TabMenu, CommentList, ArtistsWithComma }
})
export default class AlbumDetail extends Vue {
  formatDate = formatDate;
  album: Album | null = null;
  artists: Artist[] = [];
  publishTime: number = 0;
  commentCount: number = 0;
  description: string = "";
  songs: Track[] = [];
  CommentType = CommentType;
  ContentType = ContentType;
  contentType: ContentType = ContentType.Songs;

  @playlist.Mutation setTracks!: (tracks: Track[]) => void;

  @playlist.Mutation setCurrentSongId!: (id: number) => void;
  @notification.Mutation setMsg!: (msg: string) => void;
  get tabList(): TabMenuItem[] {
    return [
      {
        key: 0,
        isActive: this.contentType == ContentType.Songs,
        onClick: () => (this.contentType = ContentType.Songs),
        title: "歌曲列表"
      },
      {
        key: 1,
        isActive: this.contentType == ContentType.Comments,
        onClick: () => (this.contentType = ContentType.Comments),
        title: `评论(${formatCount(this.commentCount)})`
      },
      {
        key: 2,
        isActive: this.contentType == ContentType.Desc,
        onClick: () => (this.contentType = ContentType.Desc),
        title: `专辑详情`
      }
    ];
  }

  playAll() {
    if (!this.songs) return;
    if (this.songs.every(t => t.status < 0)) {
      // TODO
      return;
    }
    this.setTracks(this.songs);
    this.setCurrentSongId(this.songs[0].id);
  }
  created() {
    const albumId = Number(this.$route.params.id);
    getAlbumDetail(albumId).then(
      res => {
        this.album = res.data.album;
        const tracks: Track[] = res.data.songs.map(convertTrack);
        this.songs = tracks;
        this.commentCount = res.data.album.info.commentCount;
        this.artists = res.data.album.artists;
        this.publishTime = res.data.album.publishTime;
        this.description = res.data.album.description;
      },
      error => {
        this.setMsg(`获取专辑信息错误${error && error.msg ? error.msg : ""}！`);
      }
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
  justify-content: flex-start
.media__heading
  font-size: 1.5em
.button-controll
  margin-right: 0.5em
.album__actions
  margin-top: 1em
.album__artists, .album__date
  font-size: 0.875em

.album__artists
  margin-top: 1em
.album_artist

.album__date
  margin-top: 0.6em
.desc__content
  font-size: 0.875em
  color: #777
  white-space: pre-line
</style>

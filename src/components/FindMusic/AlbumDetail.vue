<template>
  <div class="album-detail">
    <div class="album-detail__media" v-if="album">
      <div class="album-detail__media__left" v-if="album">
        <ImageWithPlaceholder
          :src="album.picUrl | convert2Https"
          :alt="album.name"
          ratio="1:1"
        />
      </div>
      <div class="album-detail__media__right">
        <div class="album-detail__media__right__heading">{{ album.name }}</div>
        <div class="album-detail__media__right__actions">
          <Button
            rounded
            primary
            @click.native="playAll"
            class="album-detail__media__right__actions__btn"
            >播放</Button
          >
          <Button rounded class="album-detail__media__right__actions__btn"
            >收藏</Button
          >
          <Button rounded class="album-detail__media__right__actions__btn"
            >歌词</Button
          >
          <Button rounded class="album-detail__media__right__actions__btn"
            >more</Button
          >
        </div>
        <div class="album-detail__media__right__artists">
          歌手：
          <ArtistsWithComma :artists="artists" aTagClass="album_artist" />
        </div>
        <div class="album-detail__media__right__date">
          时间：
          <span>{{ publishTime }}</span>
        </div>
      </div>
    </div>
    <TabMenu :list="tabList" align-left />
    <SongList v-if="showSongs" :tracks="songs" />
    <CommentList v-if="showComments" :type="commentType" :id="album.id" />
    <div v-if="showDesc">
      <h4>专辑介绍</h4>
      <div class="album-detail__desc__content" v-text="description"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { getAlbumDetail } from "@/service";
import SongList from "@/components/globals/SongList.vue";
import { mapMutations } from "vuex";
import { Vue, Component } from "vue-property-decorator";
import {
  Track,
  Album,
  convertTrack,
  TabMenuItem,
  CommentType,
  Artist
} from "@/types";
import { Mutation, namespace } from "vuex-class";
import Button from "@/components/globals/Button.vue";
import TabMenu from "@/components/globals/TabMenu.vue";
import CommentList from "@/components/FindMusic/CommentList.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.tsx";
import { formatDate, formatCount } from "@/utilitys";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";

enum ContentType {
  Songs,
  Comments,
  Desc
}
const playlist = namespace("playlist");
const notification = namespace("notification");
@Component({
  components: {
    SongList,
    Button,
    TabMenu,
    CommentList,
    ArtistsWithComma,
    ImageWithPlaceholder
  }
})
export default class AlbumDetail extends Vue {
  album: Album | null = null;
  artists: Artist[] = [];
  publishTime: string | null = null;
  commentCount: number = 0;
  description: string = "";
  songs: Track[] = [];
  commentType: CommentType = CommentType.AlbumComment;
  contentType: ContentType = ContentType.Songs;

  get showSongs(): boolean {
    return this.contentType === ContentType.Songs;
  }
  get showComments(): boolean {
    return this.contentType === ContentType.Comments;
  }
  get showDesc(): boolean {
    return this.contentType === ContentType.Desc;
  }

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
        this.publishTime = formatDate(res.data.album.publishTime);
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

.album-detail
  padding: 1em
  &__media
    display: flex
    height: 12.5em
    &__left
      flex: 0 0 12.5em
      margin-right: 1em
      border-radius: 1em
      overflow: hidden
    &__right
      flex: 1 1 auto
      display: flex
      flex-direction: column
      justify-content: flex-start
      &__heading
        font-size: 1.5em
      &__actions
        margin-top: 1em
        &__btn
          margin-right: 0.5em
      &__artists, &__date
        font-size: 0.875em
      &__artists
        margin-top: 1em
      &__date
        margin-top: 0.6em
  &__desc__content
    font-size: 0.875em
    color: #777
    white-space: pre-line
</style>

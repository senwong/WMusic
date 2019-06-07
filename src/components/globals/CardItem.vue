<template>
  <div class="card-item" :class="{ 'card-item--row': row }">
    <CardImage
      :fav="{ onClick: () => addFav(card.type, card.id) }"
      :play="{ onClick: () => handlePlay() }"
      :more="{ onClick: () => {} }"
      :href="titleLink"
      :src="card.picUrl | convert2Https | clipImage(400, 400)"
      :alt="card.title"
      :ratio="card.ratio ? card.ratio : '1:1'"
      radius
      :row="row"
    />
    <div class="card-item__info">
      <router-link :to="titleLink" class="card-item__title">{{
        card.title
      }}</router-link>
      <router-link
        v-if="card.subTitle && card.subLink"
        class="card-item__subtitle"
        :to="card.subLink"
      >
        {{ card.subTitle }}
      </router-link>
    </div>
    <div v-if="card.playCount" class="card-item__play-count">
      <span class="card-item__play-count__icon">
        <PlayWithoutCircleIcon />
      </span>
      <span>{{ formatCount(card.playCount) }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import MoreItem from "../more-list/MoreItem.vue";
import MoreList from "../more-list/MoreList.vue";
import { mapMutations } from "vuex";
import { getPlaylistDetail, getAlbumDetail, subPlaylist } from "@/service";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import PlayWithoutCircleIcon from "@/components/SVGIcons/PlayWithoutCircleIcon.vue";
import CardImage from "./CardImage.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Mutation, namespace } from "vuex-class";
import {
  Track,
  convertTrack,
  Playlist,
  PlaylistType,
  MediaCardItem
} from "@/types";
import { formatCount } from "@/utilitys";

const playlist = namespace("playlist");
const notification = namespace("notification");
@Component({
  components: {
    MoreItem,
    MoreList,
    DownloadIcon,
    PlayWithoutCircleIcon,
    CardImage
  }
})
export default class CardItem extends Vue {
  @Prop() readonly card!: MediaCardItem;

  @Prop({ type: Boolean, default: false }) readonly row!: boolean;

  @playlist.Mutation setTracks!: (tracks: Track[]) => void;

  @playlist.Mutation setCurrentSongId!: (id: number) => void;
  @notification.Mutation setMsg!: (msg: string) => void;

  get titleLink(): string {
    return this.card.id && this.card.type
      ? `/${this.card.type}/${this.card.id}`
      : "#";
  }

  formatCount = formatCount;

  addFav(type: PlaylistType, id: number): void {
    // TODO
    if (type == "playlist") {
      subPlaylist(id, 1).then(
        res => {
          console.log("subscribe scuccess ", res);
        },
        error => {
          console.log("subscrible failed ", error);
        }
      );
    }
  }

  updatePlaylist() {
    return new Promise((resolve: (value: Track[]) => void, reject) => {
      getPlaylistDetail(this.card.id).then(
        res => {
          const tracks: Track[] = res.data.playlist.tracks.map(convertTrack);
          resolve(tracks as Track[]);
        },
        error => reject(error)
      );
    });
  }

  updateAlbum() {
    return new Promise((resolve: (value: Track[]) => void, reject) => {
      getAlbumDetail(this.card.id).then(
        res => {
          const tracks: Track[] = res.data.songs.map(convertTrack);
          resolve(tracks as Track[]);
        },
        error => reject(error)
      );
    });
  }

  handlePlay(): void {
    if (!this.card.id) return;
    let tracksPromise;
    switch (this.card.type) {
      case "playlist": {
        tracksPromise = this.updatePlaylist();
        break;
      }
      case "album": {
        tracksPromise = this.updateAlbum();
        break;
      }
      default:
        return;
    }
    if (!tracksPromise) {
      return;
    }
    tracksPromise.then(
      (tracks: Track[]): void => {
        if (tracks.every(track => track.status < 0)) {
          // 资源下架
          this.setMsg(`暂无可播放资源！`);
          return;
        }
        this.setTracks(tracks);
        this.setCurrentSongId(tracks[0].id);
      },
      error => {
        this.setMsg(`获取歌曲列表错误${error && error.msg ? error.msg : ""}！`);
      }
    );
  }
}
</script>
<style lang="sass" scoped>
@import "@/style/theme.sass"

.card-item
  display: flex
  flex-direction: column
  position: relative
  user-select: none
  &--row
    flex-direction: row
    height: 100%
    wdith: auto
  &__info
    margin-top: 0.5em
  &__title
    display: block
    text-decoration: none
    color: inherit
    font-weight: bolder
    font-size: 14px
    &:hover
      text-decoration: underline
  &__subtitle
    display: block
    margin-top: 0.5em
    font-size: 0.75em
    transition-property: color
    transition-duration: 250ms
    @include themify($themes)
      color: themed('secondary-text-color')
      &:hover
        color: themed('secondary-text-color-color')
  &__play-count
    position: absolute
    top: 0
    right: 0
    display: flex
    align-items: center
    margin: 0.5em
    padding: 0 0.2em
    border-radius: 0.2em
    font-size: 0.75em
    @include themify($themes)
      color: themed('secondary-text-color')
      background-color: themed("secondary-background-color")
    &__icon
      width: 1em
      height: 1em
.card-item--row
  .card-item__info
    margin-top: 0
    margin-left: 0.5em
  .card-item__play-count
    left: 0
    right: auto
</style>

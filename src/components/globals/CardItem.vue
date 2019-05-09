<template>
  <div class="list-item">
    <CardImage
      :fav="{ onClick: () => addFav(cardType, card.id) }"
      :play="{ onClick: () => handlePlay() }"
      :more="{ onClick: () => {} }"
      :href="`/${cardType}/${card.id}`"
      :src="card.picUrl | convert2Https | clipImage(400, 400)"
      :alt="card.name"
      ratio="1:1"
      radius
    >
      <div v-if="card.playCount" class="play-count" slot="rightTop">
        <span class="play-count__icon">
          <PlayWithoutCircleIcon />
        </span>
        <span>{{ formatPlayCount(card.playCount) }}</span>
      </div>
    </CardImage>
    <router-link :to="`/${cardType}/${card.id}`" class="list__name">{{ card.name }}</router-link>
    <!-- creator -->
    <router-link v-if="card.creator" class="creator-name" :to="`/user/${card.creator.userId}`">{{
      card.creator.nickname
    }}</router-link>
    <!-- 点击更多，弹出菜单 -->
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
import { Track, convertTrack, Playlist, PlaylistType } from "@/types";

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
  morePopupButton: HTMLElement | null = null;

  @Prop() readonly card!: Playlist;

  @Prop() readonly cardType!: PlaylistType;

  $refs!: {
    more: HTMLElement;
  };

  @playlist.Mutation setTracks!: (tracks: Track[]) => void;

  @playlist.Mutation setCurrentSongId!: (id: number) => void;
  @notification.Mutation setMsg!: (msg: string) => void;
  mounted() {
    this.morePopupButton = this.$refs.more;
  }

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

  formatPlayCount(playCount: number): string {
    if (playCount < 10000) return playCount.toString();
    return `${(playCount / 10000).toFixed(1)}万`;
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
    switch (this.cardType) {
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
@import '../config.sass'
.list-item
  display: flex
  flex-direction: column
  position: relative
  user-select: none

.list__name
  margin: 8px 0
  text-decoration: none
  color: inherit
  font-weight: bolder
  font-size: 14px
  &:hover
    text-decoration: underline
.play-count
  display: flex
  align-items: center
  margin: 0.5em
  padding: 0 0.2em
  color: white
  background-color: rgba(0, 0, 0, 0.5)
  border-radius: 0.2em
  font-size: 12px
.play-count__icon
  width: 1em
  height: 1em

.creator-name
  color: $gray
  font-size: 12px
  transition-property: color
  transition-duration: 250ms
  &:hover
    color: black
</style>

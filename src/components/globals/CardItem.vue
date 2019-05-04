<template>
  <div class="list-item">
    <CardImage
      :fav="{onClick: () => addFav(cardType, card.id)}"
      :play="{onClick: () => setPlaylist()}"
      :more="{onClick: () => {}}"
      :href="`/${cardType}/${card.id}`"
      :src="card.picUrl | convert2Https | clipImage(400, 400)"
      :alt="card.name"
      ratio="1:1"
      radius
    >
      <div class="play-count" slot="rightTop">
        <span class="play-count__icon">
          <PlayWithoutCircleIcon />
        </span>
        <span>{{ formatPlayCount(card.playCount) }}</span>
      </div>     
    </CardImage>
    <router-link :to="`/${cardType}/${card.id}`" class="list__name">
      {{card.name}}
    </router-link>
    <!-- creator -->
    <router-link v-if="card.creator" class="creator-name" :to="`/user/${card.creator.userId}`">
      {{card.creator.nickname}}
    </router-link>
    <!-- 点击更多，弹出菜单 -->
    <popup-menu :target="morePopupButton">
      <more-list>
        <more-item @click.native="$store.dispatch('addListToList', {type: 'PLAYLIST', id: card.id})">
          <DownloadIcon slot="icon"/>
          <span slot="txt" class="txt">添加到播放列表</span>
        </more-item>
        <more-item>
          <DownloadIcon slot="icon"/>
          <span slot="txt" class="txt">收藏</span>
        </more-item>
        <!-- 下载-->
        <more-item>
          <DownloadIcon slot="icon"/>
          <span slot="txt" class="txt">下载</span>
        </more-item>
        <!-- 加入歌单 -->
        <more-item spread="'right'">
          <DownloadIcon slot="icon"/>
          <span slot="txt" class="txt">加入歌单</span>
          <!-- hover时右侧扩展内容 -->
          <more-list slot="spread-list">
            <more-item>
              <DownloadIcon slot="icon"/>
              <span slot="txt" class="txt">喜欢的音乐</span>
            </more-item>
          </more-list>
        </more-item>
      </more-list>
    </popup-menu>
  </div>
</template>
<script lang="ts">
import PopupMenu from '../PopupMenu.vue';
import MoreItem from '../more-list/MoreItem.vue';
import MoreList from '../more-list/MoreList.vue';
import { mapMutations } from 'vuex';
import { getPlaylistDetail, getAlbumDetail } from "@/service";
import DownloadIcon from '@/components/SVGIcons/DownloadIcon.vue';
import PlayWithoutCircleIcon from '@/components/SVGIcons/PlayWithoutCircleIcon.vue';
import CardImage from './CardImage.vue';
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Mutation, namespace } from 'vuex-class'
import { Track, Playlist, PlaylistType } from '@/types';

const playlist = namespace('playlist');

@Component({
  components: {
    PopupMenu,
    MoreItem,
    MoreList,
    DownloadIcon,
    PlayWithoutCircleIcon,
    CardImage,
  }
})
export default class CardItem extends Vue {
  morePopupButton: HTMLElement | null  = null
  @Prop() readonly card!: Playlist
  @Prop() readonly cardType!: PlaylistType
  $refs!: {
    more: HTMLElement
  }
  @playlist.Mutation setTracks!: (tracks: Track[]) => void
  @playlist.Mutation setCurrentSongId!: (id: number) => void

  mounted() {
    this.morePopupButton = this.$refs.more;
  }
  
  addFav(type: PlaylistType, id: number): void {
    if(!this.$store.state.isLogin) {
      console.log("not login , cannot add fav "+ type + id);
    } else {
      console.log("add fav "+ type + id);
    }
  }
  formatPlayCount(playCount: number): string {
    if (playCount < 10000) return playCount.toString();
    return (playCount / 10000).toFixed(1) + "万";
  }
  setPlaylist(): void {
    if (!this.card.id) return;
    getPlaylistDetail(this.card.id).then(
      res => {
        this.setTracks(res.data.playlist.tracks as Track[]);
        this.setCurrentSongId(res.data.playlist.trackIds[0].id);
      },
      error => alert('getPlaylistDetail error ' + error)
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


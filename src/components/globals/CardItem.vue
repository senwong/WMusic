<template>
  <div class="list-item">
    <div class="list__cover">
      <!-- hover时显示播放 收藏 更多 -->
      <div class="list__control">
        <!-- 收藏 -->
        <button class="button_icon large control__item" @click="addFav(cardType, card.id)">
          <FavIcon />
        </button>
        <!-- 播放 -->
        <button class="button_icon large control__play control__item" @click="setPlaylist">
          <PlayingIcon />
        </button>
        <!-- 更多 -->
        <button class="button_icon large" ref="more">
          <MoreIcon />
        </button>
      </div>
      <router-link :to= "'/'+cardType.toLowerCase() +'/'+ card.id" class="item__link">
        <img :src="card.picUrl | clipImage(400, 400)" alt="">
      </router-link>
    </div>
    <router-link :to= "'/'+ cardType.toLowerCase() +'/' + card.id" class="list__name">
      {{card.name}}
    </router-link>
    <div class="creator-name">
      {{card.creatorName}}
    </div>
    <div class="play-count">
      <span class="play-count__icon">
        <PlayWithoutCircleIcon />
      </span>
      <span>{{ formatPlayCount(card.playCount) }}</span>
    </div>
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
<script>
import PopupMenu from '../PopupMenu.vue';
import MoreItem from '../more-list/MoreItem.vue';
import MoreList from '../more-list/MoreList.vue';
import {formatDate} from '@/utilitys';
import { mapMutations } from 'vuex';
import { getPlaylistDetail, getAlbumDetail } from "@/service/Service"
import FavIcon from '../SVGIcons/FavIcon';
import PlayingIcon from '../SVGIcons/PlayingIcon';
import MoreIcon from '../SVGIcons/MoreIcon';
import DownloadIcon from '../SVGIcons/DownloadIcon';
import PlayWithoutCircleIcon from '../SVGIcons/PlayWithoutCircleIcon';

export default {
  name: "CardItem",
  props: ['card', 'cardType'],
  components: { PopupMenu, MoreItem, MoreList, FavIcon, PlayingIcon, MoreIcon, DownloadIcon, PlayWithoutCircleIcon, },
  data() {
    return {
      morePopupButton: null,
    }
  },
  mounted() {
    this.morePopupButton = this.$refs.more;
  },
  methods: {
    formatDate,
    addFav(type, id) {
      if(!this.$store.state.isLogin) {
        console.log("not login , cannot add fav "+ type + id);
      } else {
        console.log("add fav "+ type + id);
      }
    },
    formatPlayCount(playCount) {
      if (playCount < 10000) return playCount
      return (playCount / 10000).toFixed(1) + "万"
    },
    setPlaylist() {
      if (!this.card.id) return;
      getPlaylistDetail(this.card.id).then(
        res => {
          this.setTracks(res.data.playlist.tracks);
          this.setCurrentSongId(res.data.playlist.trackIds[0].id);
        },
        error => alert('getPlaylistDetail error ' + error)
      );
    },
    ...mapMutations('playlist', [
      'setCurrentSongId',
      'setTracks',
    ])
  },
}
</script>
<style lang="sass" scoped>
@import '../config.sass';
.list-item
  display: flex;
  flex-direction: column;
  position: relative;
.list__cover
  width: 100%;
  margin-bottom: 1em;
  position: relative;
  &:hover .list__control
    visibility: visible;
 
.item__link
  display: inline-block;
  height: 100%;
  width: 100%;
  user-select: none;
  font-size: 0;
  &::after
    content: "";
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $mask;
    border-radius: 15px;
  &:hover::after
    display: block;
  img
    width: 100%;
    height: auto;
    border-radius: 15px;

.list__control
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  height: auto;
  left: 50%;
  visibility: hidden;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 9;
  &:hover
    visibility: visible;
.list__control:hover ~ .item__link::after
  display: block;
.control__item
  margin: 5px;
.control__play
  padding: 5px;
  border-radius: 50%;
  background: $orange;
.list__name
  margin: 8px 0;
  text-decoration: none;
  color: inherit;
  font-weight: bolder;
  font-size: 14px;
  &:hover
    text-decoration: underline;
.play-count
  display: flex;
  align-items: center;
  position: absolute;
  right: 0.7em;
  top: 0.5em;
  padding: 0 0.2em;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  display: inline-block;
  border-radius: 0.2em;
  font-size: 12px;
.play-count__icon
  width: 1em;
  height: 1em;
  display: inline-block;
.creator-name
  color: $gray;
  font-size: 12px;
</style>


<template>
  <div class="main-wrapper">
    <!-- playlist creator information -->
    <div class="info" v-if="!isError">
      <div class="cover-img">
        <ImageWithPlaceholder
          v-if="coverImgUrl"
          :src="coverImgUrl | convert2Https | clipImage(400, 400)"
          :alt="name"
          ratio="1:1"
        />
      </div>
      <div class="desc">
        <div class="creator" v-if="creator">
          <router-link class="creator-avatar" :to="'/user/' + creator.userId">
            <img :src="creator.avatarUrl | convert2Https" :alt="creator.nickname" />
          </router-link>
          <router-link class="creator-name" :to="'/user/' + creator.userId">{{
            creator.nickname
          }}</router-link>
          <span class="update-time">{{ updateTimeFormated }}创建</span>
        </div>
        <h3 class="name">{{ name }}</h3>
        <div>
          <Button class="btn-control" rounded primary @click.native="handlePlayAll"
            >全部播放</Button
          >
          <Button class="btn-control" rounded>收藏</Button>
          <Button class="btn-control" rounded>全部下载</Button>
          <Button class="btn-control" rounded>more</Button>
        </div>
        <div class="tags__wrapper" v-if="tags.length > 0">
          标签：
          <span>{{ tags.join(" / ") }}</span>
        </div>
        <div
          class="count__wrapper"
          v-if="typeof trackCount !== 'undefined' && typeof playCount !== 'undefined'"
        >
          歌曲数：
          <span>{{ formatCount(trackCount) }}</span>
          <span class="playcount">
            播放数：
            <span>{{ formatCount(playCount) }}</span>
          </span>
        </div>
        <div class="desc__wrapper" v-if="description.length > 0">
          <span class="desc__label">简介：</span>
          <span
            class="desc__content"
            v-text="description"
            :class="{ spread: descSpread }"
            ref="descContent"
          ></span>
          <SvgBtnWrapper
            middle
            class="desc__btn"
            @click.native="handleDescSpread"
            :class="{ down: descSpread }"
          >
            <ChevronBottomIcon />
          </SvgBtnWrapper>
        </div>
      </div>
    </div>
    <TabMenu align-left :list="tabList" />
    <!-- playlist tracks -->
    <SongList v-if="contentType == ContentType.Tracks" :tracks="tracks" :id="playlistId" />
    <CommentList
      v-if="contentType == ContentType.Comments"
      :type="CommentType.PlaylistComment"
      :id="id"
    />
    <Subscribers v-if="contentType == ContentType.Subers" :id="id" />
    <!-- error label -->
    <ErrorLabel :show="isError">{{ errorMsg }}</ErrorLabel>
  </div>
</template>
<script lang="ts">
import { getPlaylistDetail } from "../../service";
import { formatTime } from "@/utilitys";
import SongList from "@/components/globals/SongList.vue";
import { mapMutations } from "vuex";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";
import Button from "@/components/globals/Button.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Mutation, namespace } from "vuex-class";
import {
  User,
  Track,
  Playlist,
  PlaylistType,
  convertTrack,
  TabMenuItem,
  CommentType
} from "@/types";
import ErrorLabel from "@/components/globals/ErrorLabel.vue";
import ChevronBottomIcon from "@/components/SVGIcons/ChevronBottomIcon.vue";
import SvgBtnWrapper from "@/components/globals/SvgBtnWrapper.vue";
import TabMenu from "@/components/globals/TabMenu.vue";
import CommentList from "@/components/FindMusic/CommentList.vue";
import Subscribers from "./Subscribers.vue";
import { formatCount } from "@/utilitys";

enum ContentType {
  Tracks,
  Comments,
  Subers
}
const playlist = namespace("playlist");
@Component({
  components: {
    SongList,
    ImageWithPlaceholder,
    Button,
    ErrorLabel,
    ChevronBottomIcon,
    SvgBtnWrapper,
    TabMenu,
    CommentList,
    Subscribers
  }
})
export default class PlaylistDetail extends Vue {
  ContentType = ContentType;
  CommentType = CommentType;
  formatCount = formatCount;
  id: number | null = null;
  name: string = "";

  coverImgUrl: string = "";

  creator: User | null = null;

  updateTime: number = 0;

  tags: string[] = [];

  tracks: Track[] = [];

  trackCount: number = 0;

  playCount: number = 0;

  commentCount: number = 0;
  subscribedCount: number = 0;
  description: string = "";

  formatTime = formatTime;

  playlistId: number | null = null;

  // error handle
  isError: boolean = false;

  errorMsg: string = "获取用户详情错误";

  contentType: ContentType = ContentType.Tracks;
  get tabList(): TabMenuItem[] {
    return [
      {
        key: 0,
        isActive: this.contentType == ContentType.Tracks,
        onClick: () => (this.contentType = ContentType.Tracks),
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
        isActive: this.contentType == ContentType.Subers,
        onClick: () => (this.contentType = ContentType.Subers),
        title: `收藏者(${formatCount(this.subscribedCount)})`
      }
    ];
  }

  $refs!: {
    descContent: HTMLElement;
  };

  get updateTimeFormated(): string {
    if (!this.updateTime) return "";
    const date = new Date(this.updateTime);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
  // handle description spread
  descSpread: boolean = false;
  notSpreadHeight: number = 0;
  spreadHeight: number = 0;
  handleDescSpread() {
    // TODO
    this.descSpread = !this.descSpread;
    return;
    // this.$refs.descContent.style.height = "";

    // Vue.nextTick(() => {
    //   if (this.descSpread) {
    //     this.spreadHeight = this.$refs.descContent.clientHeight;
    //   } else {
    //     this.notSpreadHeight = this.$refs.descContent.clientHeight;
    //   }
    //   this.$refs.descContent.style.height =
    //     (this.descSpread ? this.notSpreadHeight : this.spreadHeight) + "px";
    //   Vue.nextTick(() => {
    //     console.log("next h ", this.$refs.descContent.style.height);
    //     this.$refs.descContent.style.height =
    //       (this.descSpread ? this.spreadHeight : this.notSpreadHeight) + "px";
    //     console.log("next h ", this.$refs.descContent.style.height);
    //   });
    // });
  }

  created() {
    this.playlistId = Number(this.$route.params.id);
    getPlaylistDetail(this.playlistId).then(
      res => {
        const {
          id,
          name,
          coverImgUrl,
          creator,
          tags,
          updateTime,
          trackCount,
          playCount,
          description,
          commentCount,
          subscribedCount
        } = res.data.playlist;
        this.id = id;
        this.name = name;
        this.coverImgUrl = coverImgUrl;
        this.creator = creator;
        this.tags = tags;
        this.updateTime = updateTime;
        this.trackCount = trackCount;
        this.playCount = playCount;
        this.commentCount = commentCount;
        this.description = description;
        this.subscribedCount = subscribedCount;
        this.tracks = res.data.playlist.tracks.map(convertTrack);
      },
      error => {
        if (error && error.msg) {
          this.errorMsg = error.msg;
        }
        this.isError = true;
      }
    );
  }

  @playlist.Mutation setTracks!: (tracks: Track[]) => void;

  @playlist.Mutation setCurrentSongId!: (od: number) => void;

  handlePlayAll() {
    if (this.tracks) {
      if (this.tracks.every(t => t.status < 0)) {
        // TODO 资源暂时下架
        return;
      }
      this.setTracks(this.tracks);
      if (this.tracks && this.tracks[0] && this.tracks[0].id) {
        this.setCurrentSongId(this.tracks[0].id);
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../config.sass'

.info
  display: flex
.cover-img
  flex: 0 0 200px
  border-radius: 15px
  margin-right: 20px
.desc
  min-width: 0
  flex: 1 1 auto
  display: flex
  flex-direction: column
  justify-content: space-between
  align-items: flex-start
.update-time
  font-weight: 400
  color: $gray
.creator
  font-size: 0.875em
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
  .creator-avatar
    width: 2.5em
    height: 2.5em
    border-radius: 9999px
    overflow: hidden
    margin-right: 0.6em
    img
      width: 100%
  .creator-name
    margin-right: 0.6em

.btn-control
  margin-right: 0.5em

.tags__wrapper, .count__wrapper, .desc__wrapper
  font-size: 0.875em
  margin-top: 0.715em
  width: 100%
.desc__wrapper
  display: flex
.desc__label
  flex: 0 0 auto
.desc__btn
  flex: 0 0 auto
  transition: all 250ms
  transform: rotateZ(-90deg)
  &.down
    transform: rotateZ(0)
.desc__content
  display: inline-block
  width: 100%
  opacity: 0.6
  white-space: nowrap // pre-line
  overflow: hidden
  text-overflow: ellipsis
  transition: all 250ms
  &.spread
    white-space: pre-line
.playcount
  margin-left: 1.43em
</style>

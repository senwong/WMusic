<template>
  <div class="playlist-detail main-wrapper">
    <!-- playlist creator information -->
    <div class="playlist-detail__info" v-if="!isError">
      <div class="playlist-detail__info__cover">
        <ImageWithPlaceholder
          :src="coverImgUrl | convert2Https | clipImage(400, 400)"
          :alt="name"
          ratio="1:1"
        />
      </div>
      <div class="playlist-detail__info__desc">
        <div class="user-bar" v-if="creator">
          <Avatar
            class="user-bar__avatar"
            user
            large
            :name="name"
            :imgSrc="creator.avatarUrl | convert2Https | clipImage(400, 400)"
            :id="creator.userId"
          />
          <router-link class="user-bar__title" :to="'/user/' + creator.userId">
            {{ creator.nickname }}
          </router-link>
          <span class="user-bar__subtitle">{{ updateTimeFormated }}创建</span>
        </div>
        <h3>{{ name }}</h3>
        <div>
          <Button
            class="btn-control"
            rounded
            primary
            @click.native="handlePlayAll"
            >全部播放</Button
          >
          <Button class="btn-control" rounded>收藏</Button>
          <Button class="btn-control" rounded>全部下载</Button>
          <Button class="btn-control" rounded>more</Button>
        </div>
        <div class="tags__wrapper" v-if="tags && tags.length > 0">
          标签：
          <span>{{ tags.join(" / ") }}</span>
        </div>
        <div
          class="count__wrapper"
          v-if="!isUndef(trackCount) && !isUndef(playCount)"
        >
          歌曲数：
          <span>{{ formatCount(trackCount) }}</span>
          <span class="playcount">
            播放数：
            <span>{{ formatCount(playCount) }}</span>
          </span>
        </div>
        <div class="desc__wrapper" v-if="description && description.length > 0">
          <span class="desc__label">简介：</span>
          <span
            class="desc__content"
            v-text="description"
            :class="{ spread: descSpread }"
            ref="descContent"
          ></span>
          <SvgBtn
            middle
            class="desc__btn"
            @click.native="handleDescSpread"
            :class="{ down: descSpread }"
          >
            <ChevronBottomIcon />
          </SvgBtn>
        </div>
      </div>
    </div>
    <TabMenu align-left :list="tabList" />
    <!-- playlist tracks -->
    <SongList
      v-if="showSongs && !isLoading"
      :tracks="tracks"
      :id="playlistId"
    />
    <SongListPlaceholder :count="20" v-if="showSongs && isLoading" />
    <CommentList v-if="showComments" :type="commentType" :id="id" />
    <Subscribers v-if="showSubs" :id="id" />
    <!-- error label -->
    <ErrorLabel :show="isError">{{ errorMsg }}</ErrorLabel>
  </div>
</template>
<script lang="ts">
import { getPlaylistDetail } from "../../service";
import { formatTime, isUndef } from "@/utilitys";
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
import SvgBtn from "@/components/globals/SvgBtn.vue";
import TabMenu from "@/components/globals/TabMenu.vue";
import CommentList from "@/components/FindMusic/CommentList.vue";
import Subscribers from "./Subscribers.vue";
import { formatCount } from "@/utilitys";
import SongListPlaceholder from "@/components/globals/SongListPlaceholder.vue";
import Avatar from "@/components/globals/Avatar.vue";

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
    SvgBtn,
    TabMenu,
    CommentList,
    Subscribers,
    SongListPlaceholder,
    Avatar
  }
})
export default class PlaylistDetail extends Vue {
  commentType: CommentType = CommentType.PlaylistComment;
  formatCount = formatCount;
  isUndef = isUndef;
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

  isLoading: boolean = false;

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
  get showSongs(): boolean {
    return this.contentType === ContentType.Tracks;
  }
  get showComments(): boolean {
    return this.contentType === ContentType.Comments;
  }
  get showSubs(): boolean {
    return this.contentType === ContentType.Subers;
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

  udpateData() {
    this.isLoading = true;
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
        this.isLoading = false;
      },
      error => {
        if (error && error.msg) {
          this.errorMsg = error.msg;
        }
        this.isError = true;
        this.isLoading = false;
      }
    );
  }

  created() {
    this.udpateData();
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
@import "@/style/theme.sass"

.playlist-detail
  padding: 1em
  &__info
    display: flex
    flex-direction: row
    align-items: flex-start
    &__cover
      flex: 0 0 auto
      margin-right: 1em
      border-radius: 1em
      overflow: hidden
      width: 30vw
      max-width: 12.5em
    &__desc
      min-width: 0
      flex: 1 1 auto
      display: flex
      flex-direction: column
      justify-content: flex-start
      align-items: flex-start
.conver-img__skeleton
  width: 100%
  padding-bottom: 100%



.user-bar
  font-size: 0.875em
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
  &__avatar
    margin-right: 0.6em
    flex: 0 0 auto
  &__title
    margin-right: 0.6em
  &__subtitle
    font-weight: 400
    @include themify($themes)
      color: themed("secondary-text-color")

.btn-control:not(:last-child)
  margin-right: 0.5em
.btn-control
  margin-top: 0.5em

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

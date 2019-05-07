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
          <router-link class="creator-name" :to="'/user/' + creator.userId">
            {{ creator.nickname }}
          </router-link>
          <span class="update-time">{{ updateTimeFormated }}更新</span>
        </div>
        <h2 class="name">{{ name }}</h2>
        <ul class="tags">
          <li class="tag">#{{ tags.join("  #") }}</li>
        </ul>
        <div>
          <Button class="btn-control" rounded primary @click.native="handlePlayAll"
            >全部播放</Button
          >
          <Button class="btn-control" rounded>收藏</Button>
          <Button class="btn-control" rounded>全部下载</Button>
          <Button class="btn-control" rounded>more</Button>
        </div>
      </div>
    </div>
    <!-- playlist tracks -->
    <SongList v-if="tracks" :tracks="tracks" :id="playlistId" />
    <!-- error label -->
    <ErrorLabel :show="isError">{{ errorMsg }}</ErrorLabel>
  </div>
</template>
<script lang="ts">
import { getPlaylistDetail } from "../../service";
import { formatTime } from "@/utilitys";
import SongList from "./SongList.vue";
import { mapMutations } from "vuex";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";
import Button from "@/components/globals/Button.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Mutation, namespace } from "vuex-class";
import { User, Track, Playlist, PlaylistType, convertTrack } from "@/types";
import ErrorLabel from "@/components/globals/ErrorLabel.vue";

const playlist = namespace("playlist");
@Component({
  components: {
    SongList,
    ImageWithPlaceholder,
    Button,
    ErrorLabel
  }
})
export default class PlaylistDetail extends Vue {
  name: string = "";

  coverImgUrl: string = "";

  creator: User | null = null;

  updateTime: number = 0;

  tags: string[] = [];

  tracks: Track[] = [];

  formatTime = formatTime;

  playlistId: number | null = null;

  // error handle
  isError: boolean = false;

  errorMsg: string = "获取用户详情错误";

  get updateTimeFormated(): string {
    if (!this.updateTime) return "";
    const date = new Date(this.updateTime);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  created() {
    this.playlistId = Number(this.$route.params.id);
    getPlaylistDetail(this.playlistId).then(
      res => {
        const { name, coverImgUrl, creator, tags, updateTime } = res.data.playlist;
        this.name = name;
        this.coverImgUrl = coverImgUrl;
        this.creator = creator;
        this.tags = tags;
        this.updateTime = updateTime;

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
